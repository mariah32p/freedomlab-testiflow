// config.ts
const VITE_STRIPE_STANDARD_PRICE_ID = import.meta.env.VITE_STRIPE_STANDARD_PRICE_ID;
const VITE_STRIPE_PREMIUM_PRICE_ID = import.meta.env.VITE_STRIPE_PREMIUM_PRICE_ID;

if (!VITE_STRIPE_STANDARD_PRICE_ID) throw new Error('Missing Stripe standard price ID');
if (!VITE_STRIPE_PREMIUM_PRICE_ID) throw new Error('Missing Stripe premium price ID');

export {
  VITE_STRIPE_STANDARD_PRICE_ID,
  VITE_STRIPE_PREMIUM_PRICE_ID
};
