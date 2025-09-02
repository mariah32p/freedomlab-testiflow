import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'npm:stripe@17.7.0';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY');

let stripe: Stripe | null = null;
if (stripeSecret) {
  stripe = new Stripe(stripeSecret, {
    appInfo: {
      name: 'Bolt Integration',
      version: '1.0.0',
    },
  });
}

// Helper function to create responses with CORS headers
function corsResponse(body: string | object | null, status = 200) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': '*',
  };

  // For 204 No Content, don't include Content-Type or body
  if (status === 204) {
    return new Response(null, { status, headers });
  }

  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
  });
}

Deno.serve(async (req) => {
  try {
    if (req.method === 'OPTIONS') {
      return corsResponse({}, 204);
    }

    if (req.method !== 'POST') {
      return corsResponse({ error: 'Method not allowed' }, 405);
    }

    // Check if Stripe is properly configured
    if (!stripe || !stripeSecret) {
      return corsResponse({ error: 'Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.' }, 500);
    }

    const { price_id, success_url, cancel_url, mode, customer_email, client_reference_id, is_plan_change } = await req.json();

    const error = validateParameters(
      { price_id, success_url, cancel_url, mode, customer_email },
      {
        cancel_url: 'string',
        price_id: 'string',
        success_url: 'string',
        customer_email: 'string',
        mode: { values: ['payment', 'subscription'] },
      },
    );

    if (error) {
      return corsResponse({ error }, 400);
    }

    // Create customer directly with email for checkout
    const newCustomer = await stripe.customers.create({
      email: customer_email,
    });

    console.log(`Created new Stripe customer ${newCustomer.id} for email ${customer_email}`);

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: newCustomer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price: price_id,
          quantity: 1,
        },
      ],
      mode,
      subscription_data: mode === 'subscription' && !is_plan_change ? {
        trial_period_days: 7,
      } : mode === 'subscription' ? {} : undefined,
      client_reference_id,
      success_url,
      cancel_url,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      payment_method_collection: 'if_required',
    });

    console.log(`Created checkout session ${session.id} for customer ${newCustomer.id}`);

    return corsResponse({ 
      sessionId: session.id, 
      url: session.url,
      success: true 
    });
  } catch (error: any) {
    console.error(`Checkout error: ${error.message}`);
    return corsResponse({ error: error.message }, 500);
  }
});

type ExpectedType = 'string' | { values: string[] };
type Expectations<T> = { [K in keyof T]: ExpectedType };

function validateParameters<T extends Record<string, any>>(values: T, expected: Expectations<T>): string | undefined {
  for (const parameter in values) {
    const expectation = expected[parameter];
    const value = values[parameter];

    if (expectation === 'string') {
      if (value == null) {
        return `Missing required parameter ${parameter}`;
      }
      if (typeof value !== 'string') {
        return `Expected parameter ${parameter} to be a string got ${JSON.stringify(value)}`;
      }
    } else {
      if (!expectation.values.includes(value)) {
        return `Expected parameter ${parameter} to be one of ${expectation.values.join(', ')}`;
      }
    }
  }

  return undefined;
}