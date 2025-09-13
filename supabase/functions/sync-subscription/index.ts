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
      name: 'TestiFlow Manual Sync',
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

    console.log(`🔧 MANUAL_SYNC: Starting manual sync for user: ${user.id} (${user.email})`);

    // Get customer record
    const { data: customerData, error: customerError } = await supabase
      .from('stripe_customers')
      .select('customer_id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (customerError || !customerData) {
      console.log(`🔧 MANUAL_SYNC: No customer record found for user ${user.id}`);
      return new Response(
        JSON.stringify({ 
          error: 'No customer record found. Please complete checkout first.',
          debug: { user_id: user.id, customer_error: customerError }
        }), 
        { 
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const customerId = customerData.customer_id;
    console.log(`🔧 MANUAL_SYNC: Found customer: ${customerId}`);

    // Fetch all subscriptions for this customer from Stripe
    console.log(`🔧 MANUAL_SYNC: Fetching subscriptions from Stripe...`);
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      limit: 10,
      status: 'all',
      expand: ['data.default_payment_method'],
    });

    console.log(`🔧 MANUAL_SYNC: Found ${subscriptions.data.length} subscriptions in Stripe`);
    
    if (subscriptions.data.length === 0) {
      return new Response(
        JSON.stringify({ 
          error: 'No subscriptions found in Stripe for this customer',
          debug: { customer_id: customerId, stripe_subscriptions: 0 }
        }), 
        { 
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Log all subscriptions for debugging
    subscriptions.data.forEach((sub, index) => {
      console.log(`🔧 MANUAL_SYNC: Subscription ${index + 1}:`, {
        id: sub.id,
        status: sub.status,
        price_id: sub.items.data[0]?.price.id,
        current_period_start: sub.current_period_start,
        current_period_end: sub.current_period_end,
        created: sub.created
      });
    });

    // Find the most relevant subscription (active > trialing > past_due > others)
    const priorityOrder = ['active', 'trialing', 'past_due', 'incomplete', 'canceled'];
    const sortedSubscriptions = subscriptions.data.sort((a, b) => {
      const aPriority = priorityOrder.indexOf(a.status);
      const bPriority = priorityOrder.indexOf(b.status);
      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }
      // If same priority, prefer newer
      return b.created - a.created;
    });

    const subscription = sortedSubscriptions[0];
    console.log(`🔧 MANUAL_SYNC: Selected subscription: ${subscription.id} (status: ${subscription.status})`);

    // Prepare subscription data for database
    const subscriptionData: any = {
      customer_id: customerId,
      subscription_id: subscription.id,
      price_id: subscription.items.data[0].price.id,
      current_period_start: subscription.current_period_start,
      current_period_end: subscription.current_period_end,
      cancel_at_period_end: subscription.cancel_at_period_end,
      status: subscription.status,
    };

    // Add payment method info if available
    if (subscription.default_payment_method && typeof subscription.default_payment_method !== 'string') {
      subscriptionData.payment_method_brand = subscription.default_payment_method.card?.brand ?? null;
      subscriptionData.payment_method_last4 = subscription.default_payment_method.card?.last4 ?? null;
    }

    console.log(`🔧 MANUAL_SYNC: Upserting subscription data:`, subscriptionData);

    // Store in database
    const { data: upsertedData, error: upsertError } = await supabase
      .from('stripe_subscriptions')
      .upsert(subscriptionData, {
        onConflict: 'customer_id',
      })
      .select()
      .single();

    if (upsertError) {
      console.error('🔧 MANUAL_SYNC: Error upserting subscription:', upsertError);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to store subscription data',
          debug: { 
            customer_id: customerId,
            subscription_data: subscriptionData,
            upsert_error: upsertError
          }
        }), 
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`🔧 MANUAL_SYNC: Successfully stored subscription:`, upsertedData);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Subscription synced successfully',
        data: {
          customer_id: customerId,
          subscription_id: subscription.id,
          status: subscription.status,
          price_id: subscription.items.data[0].price.id,
          synced_at: new Date().toISOString()
        }
      }), 
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error: any) {
    console.error('🔧 MANUAL_SYNC: Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});