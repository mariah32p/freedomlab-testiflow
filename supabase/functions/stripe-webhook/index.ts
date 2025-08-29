import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'npm:stripe@17.7.0';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY');
const stripeWebhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

let stripe: Stripe | null = null;
if (stripeSecret) {
  stripe = new Stripe(stripeSecret, {
    appInfo: {
      name: 'Bolt Integration',
      version: '1.0.0',
    },
  });
}

const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

Deno.serve(async (req) => {
  try {
    // Handle OPTIONS request for CORS preflight
    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 204 });
    }

    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    // Check if Stripe is properly configured
    if (!stripe || !stripeSecret || !stripeWebhookSecret) {
      return new Response('Stripe is not configured properly', { status: 500 });
    }

    // get the signature from the header
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return new Response('No signature found', { status: 400 });
    }

    // get the raw body
    const body = await req.text();

    // verify the webhook signature
    let event: Stripe.Event;

    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, stripeWebhookSecret);
    } catch (error: any) {
      console.error(`Webhook signature verification failed: ${error.message}`);
      return new Response(`Webhook signature verification failed: ${error.message}`, { status: 400 });
    }

    EdgeRuntime.waitUntil(handleEvent(event));

    return Response.json({ received: true });
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

async function handleEvent(event: Stripe.Event) {
  const stripeData = event?.data?.object ?? {};

  if (!stripeData) {
    return;
  }

  if (!('customer' in stripeData)) {
    return;
  }

  const { customer: customerId } = stripeData;

  if (!customerId || typeof customerId !== 'string') {
    console.error(`No customer received on event: ${JSON.stringify(event)}`);
    return;
  } else {
    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session, customerId);
        break;
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        console.info(`Processing subscription event: ${event.type} for customer: ${customerId}`);
        await syncCustomerFromStripe(customerId);
        break;
      case 'invoice.payment_failed':
        console.info(`Processing payment failure for customer: ${customerId}`);
        await syncCustomerFromStripe(customerId);
        break;
      default:
        console.info(`Unhandled event type: ${event.type}`);
    }
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session, customerId: string) {
  const { mode, payment_status } = session;
  const isSubscription = mode === 'subscription';

  console.info(`Processing ${isSubscription ? 'subscription' : 'one-time payment'} checkout session`);

  if (isSubscription) {
    // Store customer relationship
    const { error: customerError } = await supabase.from('stripe_customers').upsert({
      customer_id: customerId,
      user_id: session.client_reference_id, // We'll need to pass this from the frontend
    }, {
      onConflict: 'customer_id',
    });

    if (customerError) {
      console.error('Error storing customer relationship:', customerError);
    }

    // Sync subscription data
    await syncCustomerFromStripe(customerId);
  } else if (mode === 'payment' && payment_status === 'paid') {
    try {
      // Extract the necessary information from the session
      const {
        id: checkout_session_id,
        payment_intent,
        amount_subtotal,
        amount_total,
        currency,
      } = session;

      // Insert the order into the stripe_orders table
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
        return;
      }
      console.info(`Successfully processed one-time payment for session: ${checkout_session_id}`);
    } catch (error) {
      console.error('Error processing one-time payment:', error);
    }
  }
}

// based on the excellent https://github.com/t3dotgg/stripe-recommendations
async function syncCustomerFromStripe(customerId: string) {
  try {
    // fetch latest subscription data from Stripe
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      limit: 1,
      status: 'all',
      expand: ['data.default_payment_method'],
    });

    if (subscriptions.data.length === 0) {
      console.info(`No active subscriptions found for customer: ${customerId}`);
      const { error: noSubError } = await supabase.from('stripe_subscriptions').upsert(
        {
          customer_id: customerId,
          status: 'not_started',
        },
        {
          onConflict: 'customer_id',
        },
      );

      if (noSubError) {
        console.error('Error updating subscription status:', noSubError);
        throw new Error('Failed to update subscription status in database');
      }
      return;
    }

    // assumes that a customer can only have a single subscription
    const subscription = subscriptions.data[0];

    // store subscription state
    const { error: subError } = await supabase.from('stripe_subscriptions').upsert(
      {
        customer_id: customerId,
        subscription_id: subscription.id,
        price_id: subscription.items.data[0].price.id,
        current_period_start: subscription.current_period_start,
        current_period_end: subscription.current_period_end,
        cancel_at_period_end: subscription.cancel_at_period_end,
        ...(subscription.default_payment_method && typeof subscription.default_payment_method !== 'string'
          ? {
              payment_method_brand: subscription.default_payment_method.card?.brand ?? null,
              payment_method_last4: subscription.default_payment_method.card?.last4 ?? null,
            }
          : {}),
        status: subscription.status,
      },
      {
        onConflict: 'customer_id',
      },
    );

    if (subError) {
      console.error('Error syncing subscription:', subError);
      throw new Error('Failed to sync subscription in database');
    }
    console.info(`Successfully synced subscription for customer: ${customerId}`);
  } catch (error) {
    console.error(`Failed to sync subscription for customer ${customerId}:`, error);
    throw error;
  }
}