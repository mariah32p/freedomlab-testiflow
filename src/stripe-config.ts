import { VITE_STRIPE_STANDARD_PRICE_ID, VITE_STRIPE_PREMIUM_PRICE_ID } from './config/variables'
export interface Product {
  id: string;
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
}

export const products: Product[] = [
  {
    id: 'standard',
    priceId: VITE_STRIPE_STANDARD_PRICE_ID,
    name: 'Standard Plan',
    description: 'Perfect for small businesses getting started.',
    mode: 'subscription'
  },
  {
    id: 'premium',
    priceId: VITE_STRIPE_PREMIUM_PRICE_ID,
    name: 'Premium Plan',
    description: 'Complete solution for growing businesses.',
    mode: 'subscription'
  }
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductByPriceId = (priceId: string): Product | undefined => {
  return products.find(product => product.priceId === priceId);
};