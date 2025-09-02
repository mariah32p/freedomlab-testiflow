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
    priceId: 'price_1Rznb5Dn6VTzl81bjqFfCagv',
    name: 'Standard Plan',
    description: 'Perfect for small businesses getting started.',
    mode: 'subscription'
  },
  {
    id: 'premium',
    priceId: 'price_1Rznb5Dn6VTzl81b8Hx5UQt6',
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