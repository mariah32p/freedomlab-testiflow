export interface Product {
  id: string;
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
  isComingSoon?: boolean;
  isActive?: boolean;
}

export const products: Product[] = [
  {
    id: 'standard',
    priceId: 'price_1Rznb5Dn6VTzl81bjqFfCagv', // Standard plan price ID
    name: 'Standard Plan',
    description: 'Perfect for small businesses getting started.',
    mode: 'subscription',
    isActive: true,
    isComingSoon: false
  },
  {
    id: 'premium',
    priceId: 'price_1Rznb5Dn6VTzl81b8Hx5UQt6', // Premium plan price ID  
    name: 'Premium Plan',
    description: 'Complete solution for growing businesses.',
    mode: 'subscription',
    isActive: false,
    isComingSoon: true
  }
];

// Only return active products for actual checkout
export const getActiveProducts = (): Product[] => {
  return products.filter(product => product.isActive);
};

// Get the functional plan (Standard only)
export const getFunctionalPlan = (): Product => {
  return products.find(product => product.isActive) || products[0];
};

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductByPriceId = (priceId: string): Product | undefined => {
  return products.find(product => product.priceId === priceId);
};