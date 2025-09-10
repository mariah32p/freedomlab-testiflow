import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'npm:stripe@17.7.0';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY');

let stripe: Stripe | null = null;
if (stripeSecret) {
  stripe = new Stripe(stripeSecret, {
    appInfo: {
      name: 'TestiFlow Subscription Management',
      version: '1.0.0',
    },
  });
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  try {
    if (req.method === 'OPTIONS') {
      return new Response(null, { 
        status: 204,
        headers: corsHeaders
      });
    }

    if (req.method !== 'POST') {
      return new Response('Method not allowed', { 
        status: 405,
        headers: corsHeaders
      });
    }

    if (!stripe || !stripeSecret) {
      return new Response(
        JSON.stringify({ error: 'Stripe is not configured properly' }), 
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }), 
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }), 
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const { new_price_id } = await req.json();

    if (!new_price_id) {
      return new Response(
        JSON.stringify({ error: 'new_price_id is required' }), 
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`Processing subscription modification for user: ${user.id} to price: ${new_price_id}`);

    // Step 1: Get existing customer ID from database
    const { data: customerData, error: customerError } = await supabase
      .from('stripe_customers')
      .select('customer_id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (customerError || !customerData) {
      return new Response(
        JSON.stringify({ error: 'No existing customer found. Please contact support.' }), 
        { 
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const customerId = customerData.customer_id;
    console.log(`Found existing customer: ${customerId}`);

    // Step 2: Get current subscription from Stripe
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'all',
      limit: 10, // Get more to check for multiples
    });

    console.log(`Found ${subscriptions.data.length} subscriptions for customer ${customerId}`);

    // Find active or trialing subscription
    const activeSubscription = subscriptions.data.find(sub => 
      sub.status === 'active' || sub.status === 'trialing'
    );

    if (!activeSubscription) {
      return new Response(
        JSON.stringify({ error: 'No active subscription found. Please contact support.' }), 
        { 
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`Found active subscription: ${activeSubscription.id} with status: ${activeSubscription.status}`);

    // Step 3: Check if already on the requested plan
    const currentPriceId = activeSubscription.items.data[0].price.id;
    if (currentPriceId === new_price_id) {
      return new Response(
        JSON.stringify({ error: 'Already on the requested plan' }), 
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`Changing from price ${currentPriceId} to ${new_price_id}`);

    // Step 4: Update the subscription with new price
    const updatedSubscription = await stripe.subscriptions.update(activeSubscription.id, {
      items: [{
        id: activeSubscription.items.data[0].id,
        price: new_price_id,
      }],
      proration_behavior: 'always_invoice', // Charge/credit immediately
    });

    console.log(`Successfully updated subscription ${updatedSubscription.id} to price ${new_price_id}`);

    // Step 5: Update our database with new subscription details
    const subscriptionData = {
      customer_id: customerId,
      subscription_id: updatedSubscription.id,
      price_id: new_price_id,
      current_period_start: updatedSubscription.current_period_start,
      current_period_end: updatedSubscription.current_period_end,
      cancel_at_period_end: updatedSubscription.cancel_at_period_end,
      status: updatedSubscription.status,
    };

    // Add payment method info if available
    if (updatedSubscription.default_payment_method && typeof updatedSubscription.default_payment_method !== 'string') {
      subscriptionData.payment_method_brand = updatedSubscription.default_payment_method.card?.brand ?? null;
      subscriptionData.payment_method_last4 = updatedSubscription.default_payment_method.card?.last4 ?? null;
    }

    const { error: dbError } = await supabase
      .from('stripe_subscriptions')
      .upsert(subscriptionData, {
        onConflict: 'customer_id',
      });

    if (dbError) {
      console.error('Error updating subscription in database:', dbError);
      // Don't fail the request since Stripe update succeeded
    }

    console.log(`Successfully updated database for customer ${customerId}`);

    return new Response(
      JSON.stringify({ 
        success: true,
        subscription_id: updatedSubscription.id,
        new_price_id: new_price_id,
        status: updatedSubscription.status
      }), 
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error: any) {
    console.error('Error modifying subscription:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});