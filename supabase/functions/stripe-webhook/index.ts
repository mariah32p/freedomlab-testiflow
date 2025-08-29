import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'npm:stripe@17.7.0';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY');
const stripeWebhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

let stripe: Stripe | null = null;
if (stripeSecret) {
  stripe = new Stripe(stripeSecret, {
    appInfo: {
      name: 'TestiFlow Integration',
      version: '1.0.0',
    },
  });
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
};

Deno.serve(async (req) => {
  try {
    // Handle OPTIONS request for CORS preflight
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

    // Check if Stripe is properly configured
    if (!stripe || !stripeSecret || !stripeWebhookSecret) {
      return new Response(
        JSON.stringify({ error: 'Stripe is not configured properly' }), 
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Get the signature from the header
    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      return new Response(
        JSON.stringify({ error: 'No signature found' }), 
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Get the raw body
    const body = await req.text();

    // Verify the webhook signature
    let event: Stripe.Event;
    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, stripeWebhookSecret);
    } catch (error: any) {
      console.error(`Webhook signature verification failed: ${error.message}`);
      return new Response(
        JSON.stringify({ error: `Webhook signature verification failed: ${error.message}` }), 
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Process the event asynchronously
    processEvent(event);

    return new Response(
      JSON.stringify({ received: true }), 
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

async function processEvent(event: Stripe.Event) {
  try {
    const stripeData = event?.data?.object ?? {};

    if (!stripeData || !('customer' in stripeData)) {
      console.log('No customer data in event');
      return;
    }

    const { customer: customerId } = stripeData;
    if (!customerId || typeof customerId !== 'string') {
      console.error(`No valid customer ID in event: ${event.type}`);
      return;
    }

    console.log(`Processing event: ${event.type} for customer: ${customerId}`);

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session, customerId);
        break;
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await syncCustomerFromStripe(customerId);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(customerId);
        break;
      case 'invoice.payment_failed':
        await handlePaymentFailed(customerId);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error('Error processing event:', error);
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session, customerId: string) {
  const { mode, payment_status, client_reference_id } = session;
  const isSubscription = mode === 'subscription';

  console.log(`Processing ${isSubscription ? 'subscription' : 'one-time payment'} checkout session`);

  if (isSubscription) {
    // Store customer relationship - only if we have a user ID
    if (client_reference_id) {
      const { error: customerError } = await supabase.from('stripe_customers').upsert({
        customer_id: customerId,
        user_id: client_reference_id,
      }, {
        onConflict: 'customer_id',
      });

      if (customerError) {
        console.error('Error storing customer relationship:', customerError);
      } else {
        console.log(`Successfully linked customer ${customerId} to user ${client_reference_id}`);
      }
    }

    // Sync subscription data
    await syncCustomerFromStripe(customerId);
  } else if (mode === 'payment' && payment_status === 'paid') {
    // Handle one-time payment
    const {
      id: checkout_session_id,
      payment_intent,
      amount_subtotal,
      amount_total,
      currency,
    } = session;

    const { error: orderError } = await supabase.from('stripe_orders').insert({
      checkout_session_id,
      payment_intent_id: payment_intent as string,
      customer_id: customerId,
      amount_subtotal: amount_subtotal || 0,
      amount_total: amount_total || 0,
      currency: currency || 'usd',
      payment_status,
      status: 'completed',
    });

    if (orderError) {
      console.error('Error inserting order:', orderError);
    } else {
      console.log(`Successfully processed one-time payment for session: ${checkout_session_id}`);
    }
  }
}

async function syncCustomerFromStripe(customerId: string) {
  try {
    if (!stripe) {
      throw new Error('Stripe not initialized');
    }

    // Fetch latest subscription data from Stripe
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      limit: 1,
      status: 'all',
      expand: ['data.default_payment_method'],
    });

    if (subscriptions.data.length === 0) {
      console.log(`No subscriptions found for customer: ${customerId}`);
      return;
    }

    // Assumes that a customer can only have a single subscription
    const subscription = subscriptions.data[0];

    console.log(`Syncing subscription ${subscription.id} with status: ${subscription.status}`);

    // Store subscription state
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

    const { error } = await supabase.from('stripe_subscriptions').upsert(subscriptionData, {
      onConflict: 'customer_id',
    });

    if (error) {
      console.error('Error syncing subscription:', error);
    } else {
      console.log(`Successfully synced subscription for customer: ${customerId} - Status: ${subscription.status}`);
    }
  } catch (error) {
    console.error(`Failed to sync subscription for customer ${customerId}:`, error);
  }
}

async function handleSubscriptionDeleted(customerId: string) {
  console.log(`Handling subscription deletion for customer: ${customerId}`);
  const { error } = await supabase.from('stripe_subscriptions').upsert({
    customer_id: customerId,
    status: 'canceled',
  }, {
    onConflict: 'customer_id',
  });

  if (error) {
    console.error('Error updating canceled subscription:', error);
  } else {
    console.log(`Successfully marked subscription as canceled for customer: ${customerId}`);
  }
}

async function handlePaymentFailed(customerId: string) {
  console.log(`Handling payment failure for customer: ${customerId}`);
  const { error } = await supabase.from('stripe_subscriptions').upsert({
    customer_id: customerId,
    status: 'past_due',
  }, {
    onConflict: 'customer_id',
  });

  if (error) {
    console.error('Error updating past due subscription:', error);
  } else {
    console.log(`Successfully marked subscription as past due for customer: ${customerId}`);
  }
}