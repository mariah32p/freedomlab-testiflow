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
    console.log('🎯 WEBHOOK: Received request');
    console.log('🎯 WEBHOOK: Method:', req.method);
    console.log('🎯 WEBHOOK: Headers:', Object.fromEntries(req.headers.entries()));

    // Handle OPTIONS request for CORS preflight
    if (req.method === 'OPTIONS') {
      console.log('🎯 WEBHOOK: Handling OPTIONS request');
      return new Response(null, { 
        status: 204,
        headers: corsHeaders
      });
    }

    if (req.method !== 'POST') {
      console.log('🎯 WEBHOOK: Invalid method:', req.method);
      return new Response('Method not allowed', { 
        status: 405,
        headers: corsHeaders
      });
    }

    // Check if Stripe is properly configured
    if (!stripe || !stripeSecret || !stripeWebhookSecret) {
      console.log('🎯 WEBHOOK: Stripe not configured properly');
      console.log('🎯 WEBHOOK: Has stripe:', !!stripe);
      console.log('🎯 WEBHOOK: Has stripeSecret:', !!stripeSecret);
      console.log('🎯 WEBHOOK: Has stripeWebhookSecret:', !!stripeWebhookSecret);
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
    console.log('🎯 WEBHOOK: Stripe signature present:', !!signature);
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
    console.log('🎯 WEBHOOK: Body length:', body.length);

    // Verify the webhook signature
    let event: Stripe.Event;
    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, stripeWebhookSecret);
      console.log('🎯 WEBHOOK: Event verified successfully');
      console.log('🎯 WEBHOOK: Event type:', event.type);
      console.log('🎯 WEBHOOK: Event ID:', event.id);
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
    console.log('🎯 WEBHOOK: Starting event processing...');
    processEvent(event);

    console.log('🎯 WEBHOOK: Returning success response');
    return new Response(
      JSON.stringify({ received: true }), 
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error: any) {
    console.error('🎯 WEBHOOK: Top-level error:', error);
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
    console.log(`🎯 PROCESS_EVENT: Starting - Type: ${event.type}, ID: ${event.id}`);
    console.log(`🎯 PROCESS_EVENT: Event data object:`, JSON.stringify(event.data.object, null, 2));
    
    const stripeData = event?.data?.object ?? {};

    if (!stripeData || !('customer' in stripeData)) {
      console.log('🎯 PROCESS_EVENT: No customer field in event data, skipping');
      console.log('🎯 PROCESS_EVENT: Available fields:', Object.keys(stripeData));
      return;
    }

    const { customer: customerId } = stripeData;
    if (!customerId || typeof customerId !== 'string') {
      console.error(`🎯 PROCESS_EVENT: Invalid customer ID - Type: ${typeof customerId}, Value: ${customerId}`);
      return;
    }

    console.log(`🎯 PROCESS_EVENT: Valid customer ID found: ${customerId}`);
    
    // CRITICAL: Check if this customer belongs to TestiFlow
    console.log(`🎯 PROCESS_EVENT: Checking if customer ${customerId} exists in TestiFlow database...`);
    const { data: existingCustomer, error: customerCheckError } = await supabase
      .from('stripe_customers')
      .select('user_id')
      .eq('customer_id', customerId)
      .maybeSingle();
    
    if (customerCheckError) {
      console.error(`🎯 PROCESS_EVENT: Database error checking customer: ${customerCheckError.message}`);
      return;
    }
    
    // For checkout.session.completed, we might not have the customer record yet
    if (event.type !== 'checkout.session.completed' && !existingCustomer) {
      console.log(`🎯 PROCESS_EVENT: Customer ${customerId} not found in TestiFlow database, skipping ${event.type} event`);
      return;
    }
    
    if (existingCustomer) {
      console.log(`🎯 PROCESS_EVENT: Customer ${customerId} belongs to TestiFlow user: ${existingCustomer.user_id}`);
    } else {
      console.log(`🎯 PROCESS_EVENT: New customer for checkout.session.completed event`);
    }

    // Handle different event types
    console.log(`🎯 PROCESS_EVENT: Routing to handler for event type: ${event.type}`);
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
        console.log(`🎯 PROCESS_EVENT: Unhandled event type: ${event.type}`);
    }
    
    console.log(`🎯 PROCESS_EVENT: Completed processing for event: ${event.type}`);
  } catch (error) {
    console.error('🎯 PROCESS_EVENT: Error processing event:', error);
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session, customerId: string) {
  console.log(`🎯 CHECKOUT_COMPLETED: Starting handler`);
  console.log(`🎯 CHECKOUT_COMPLETED: Session ID: ${session.id}`);
  console.log(`🎯 CHECKOUT_COMPLETED: Customer ID: ${customerId}`);
  console.log(`🎯 CHECKOUT_COMPLETED: Mode: ${session.mode}`);
  console.log(`🎯 CHECKOUT_COMPLETED: Payment Status: ${session.payment_status}`);
  console.log(`🎯 CHECKOUT_COMPLETED: Client Reference ID: ${session.client_reference_id}`);
  console.log(`🎯 CHECKOUT_COMPLETED: Subscription ID: ${session.subscription}`);

  const { mode, payment_status, client_reference_id } = session;
  const isSubscription = mode === 'subscription';

  console.log(`🎯 CHECKOUT_COMPLETED: Processing ${isSubscription ? 'subscription' : 'one-time payment'} checkout`);
  
  // CRITICAL: Only process if we have a client_reference_id (TestiFlow user ID)
  if (!client_reference_id) {
    console.log(`🎯 CHECKOUT_COMPLETED: No client_reference_id - this is from another product. Skipping.`);
    return;
  }
  
  console.log(`🎯 CHECKOUT_COMPLETED: Valid TestiFlow checkout - User ID: ${client_reference_id}`);

  if (isSubscription) {
    console.log(`🎯 CHECKOUT_COMPLETED: Processing subscription checkout`);
    // Store customer relationship
    console.log(`🎯 CHECKOUT_COMPLETED: Storing customer relationship...`);
    const { error: customerError } = await supabase.from('stripe_customers').upsert({
      customer_id: customerId,
      user_id: client_reference_id,
    }, {
      onConflict: 'customer_id',
    });

    if (customerError) {
      console.error('🎯 CHECKOUT_COMPLETED: Error storing customer relationship:', customerError);
    } else {
      console.log(`🎯 CHECKOUT_COMPLETED: Successfully linked customer ${customerId} to user ${client_reference_id}`);
    }
    
    // For subscription checkouts, get the subscription directly from the session
    if (session.subscription) {
      console.log(`🎯 CHECKOUT_COMPLETED: Found subscription in session: ${session.subscription}`);
      
      try {
        // Fetch the subscription details from Stripe
        const subscription = await stripe!.subscriptions.retrieve(session.subscription as string, {
          expand: ['default_payment_method']
        });
        
        console.log(`🎯 CHECKOUT_COMPLETED: Retrieved subscription details:`, {
          id: subscription.id,
          status: subscription.status,
          price_id: subscription.items.data[0].price.id,
          current_period_start: subscription.current_period_start,
          current_period_end: subscription.current_period_end
        });
        
        // Store subscription directly
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

        console.log(`🎯 CHECKOUT_COMPLETED: Storing subscription data:`, subscriptionData);
        
        const { error: subscriptionError } = await supabase
          .from('stripe_subscriptions')
          .upsert(subscriptionData, {
            onConflict: 'customer_id',
          });

        if (subscriptionError) {
          console.error('🎯 CHECKOUT_COMPLETED: Error storing subscription:', subscriptionError);
        } else {
          console.log(`🎯 CHECKOUT_COMPLETED: Successfully stored subscription ${subscription.id}`);
        }
        
      } catch (subscriptionError) {
        console.error('🎯 CHECKOUT_COMPLETED: Error fetching subscription from Stripe:', subscriptionError);
        // Fallback to the old sync method
        console.log(`🎯 CHECKOUT_COMPLETED: Falling back to syncCustomerFromStripe...`);
        await syncCustomerFromStripe(customerId);
      }
    } else {
      console.log(`🎯 CHECKOUT_COMPLETED: No subscription in session, calling syncCustomerFromStripe...`);
      // Sync subscription data
      await syncCustomerFromStripe(customerId);
    }
    console.log(`🎯 CHECKOUT_COMPLETED: Subscription processing completed`);
  } else if (mode === 'payment' && payment_status === 'paid') {
    console.log(`🎯 CHECKOUT_COMPLETED: Processing one-time payment`);
    // Handle one-time payment
    const {
      id: checkout_session_id,
      payment_intent,
      amount_subtotal,
      amount_total,
      currency,
    } = session;

    console.log(`🎯 CHECKOUT_COMPLETED: Inserting order record...`);
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
      console.error('🎯 CHECKOUT_COMPLETED: Error inserting order:', orderError);
    } else {
      console.log(`🎯 CHECKOUT_COMPLETED: Successfully processed one-time payment for session: ${checkout_session_id}`);
    }
  }

  console.log(`🎯 CHECKOUT_COMPLETED: Handler completed successfully`);
}

async function syncCustomerFromStripe(customerId: string) {
  try {
    console.log(`🎯 SYNC_CUSTOMER: Starting sync for customer ${customerId}`);
    
    if (!stripe) {
      console.error('🎯 SYNC_CUSTOMER: Stripe not initialized');
      throw new Error('Stripe not initialized');
    }

    console.log(`🎯 SYNC_CUSTOMER: Fetching subscriptions from Stripe...`);
    // Fetch latest subscription data from Stripe
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      limit: 1,
      status: 'all',
      expand: ['data.default_payment_method'],
    });

    console.log(`🎯 SYNC_CUSTOMER: Found ${subscriptions.data.length} subscriptions`);
    console.log(`🎯 SYNC_CUSTOMER: Subscription details:`, subscriptions.data.map(sub => ({
      id: sub.id,
      status: sub.status,
      price_id: sub.items.data[0]?.price.id,
      current_period_start: sub.current_period_start,
      current_period_end: sub.current_period_end
    })));

    if (subscriptions.data.length === 0) {
      console.log(`🎯 SYNC_CUSTOMER: No subscriptions found for customer: ${customerId}`);
      return;
    }

    // Get the most recent active subscription (active > trialing > past_due)
    const activeSubscription = subscriptions.data.find(sub => 
      sub.status === 'active' || sub.status === 'trialing' || sub.status === 'past_due'
    );
    
    const subscription = activeSubscription || subscriptions.data[0];

    console.log(`🎯 SYNC_CUSTOMER: Selected subscription ${subscription.id}`);
    console.log(`🎯 SYNC_CUSTOMER: Status: ${subscription.status}`);
    console.log(`🎯 SYNC_CUSTOMER: Price ID: ${subscription.items.data[0].price.id}`);
    console.log(`🎯 SYNC_CUSTOMER: Current period: ${subscription.current_period_start} - ${subscription.current_period_end}`);
    
    // Log the price ID for debugging
    const subscriptionPriceId = subscription.items.data[0].price.id;
    console.log(`🎯 SYNC_CUSTOMER: Processing subscription with price: ${subscriptionPriceId}`);

    // If we're syncing an active subscription and there are multiple subscriptions,
    // cancel the old ones in Stripe to maintain consistency
    if (subscription.status === 'active' && subscriptions.data.length > 1) {
      console.log(`🎯 SYNC_CUSTOMER: Found ${subscriptions.data.length} subscriptions, canceling old ones`);
      
      for (const oldSub of subscriptions.data) {
        if (oldSub.id !== subscription.id && (oldSub.status === 'active' || oldSub.status === 'trialing')) {
          try {
            await stripe.subscriptions.cancel(oldSub.id);
            console.log(`🎯 SYNC_CUSTOMER: Canceled old subscription: ${oldSub.id}`);
          } catch (cancelError) {
            console.error(`🎯 SYNC_CUSTOMER: Failed to cancel old subscription ${oldSub.id}:`, cancelError);
          }
        }
      }
    }
    
    console.log(`🎯 SYNC_CUSTOMER: Preparing subscription data for database...`);
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

    console.log(`🎯 SYNC_CUSTOMER: Subscription data to store:`, subscriptionData);

    // Add payment method info if available
    if (subscription.default_payment_method && typeof subscription.default_payment_method !== 'string') {
      console.log(`🎯 SYNC_CUSTOMER: Adding payment method info`);
      subscriptionData.payment_method_brand = subscription.default_payment_method.card?.brand ?? null;
      subscriptionData.payment_method_last4 = subscription.default_payment_method.card?.last4 ?? null;
    } else {
      console.log(`🎯 SYNC_CUSTOMER: No payment method info available`);
    }

    console.log(`🎯 SYNC_CUSTOMER: Upserting subscription to database...`);
    const { error } = await supabase.from('stripe_subscriptions').upsert(subscriptionData, {
      onConflict: 'customer_id',
    });

    if (error) {
      console.error('🎯 SYNC_CUSTOMER: Error upserting subscription to database:', error);
      console.error('🎯 SYNC_CUSTOMER: Failed subscription data:', subscriptionData);
    } else {
      console.log(`🎯 SYNC_CUSTOMER: Successfully synced subscription for customer: ${customerId}`);
      console.log(`🎯 SYNC_CUSTOMER: Final status: ${subscription.status}, Price: ${subscription.items.data[0].price.id}`);
      
      // Verify the data was actually stored
      console.log(`🎯 SYNC_CUSTOMER: Verifying data was stored...`);
      const { data: verifyData, error: verifyError } = await supabase
        .from('stripe_subscriptions')
        .select('*')
        .eq('customer_id', customerId)
        .maybeSingle();
      
      if (verifyError) {
        console.error('🎯 SYNC_CUSTOMER: Error verifying stored data:', verifyError);
      } else if (verifyData) {
        console.log(`🎯 SYNC_CUSTOMER: Verification successful - stored data:`, verifyData);
      } else {
        console.error('🎯 SYNC_CUSTOMER: Verification failed - no data found after upsert');
      }
    }
  } catch (error) {
    console.error(`🎯 SYNC_CUSTOMER: Failed to sync subscription for customer ${customerId}:`, error);
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
  
  // Get current subscription data first
  const { data: currentSub } = await supabase
    .from('stripe_subscriptions')
    .select('*')
    .eq('customer_id', customerId)
    .maybeSingle();

  const updateData: any = {
    customer_id: customerId,
    status: 'past_due',
  };

  // Set payment issue tracking if not already set
  if (!currentSub?.payment_issue_since) {
    updateData.payment_issue_since = new Date().toISOString();
    // Set grace period end to 30 days from now
    const gracePeriodEnd = new Date();
    gracePeriodEnd.setDate(gracePeriodEnd.getDate() + 30);
    updateData.grace_period_end = gracePeriodEnd.toISOString();
  }

  const { error } = await supabase
    .from('stripe_subscriptions')
    .upsert(updateData, {
      onConflict: 'customer_id',
    });

  if (error) {
    console.error('Error updating past due subscription:', error);
  } else {
    console.log(`Successfully marked subscription as past due for customer: ${customerId}`);
  }
}