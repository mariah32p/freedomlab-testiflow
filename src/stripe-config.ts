export interface Product {
  id: string;
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
}

export const products: Product[] = [
  {
    id: 'basic',
    priceId: 'price_1Rznb5Dn6VTzl81bjqFfCagv',
    name: 'Basic Plan',
    description: 'Perfect for small teams getting started with testimonial management.',
    mode: 'subscription'
  },
  {
    id: 'pro',
    priceId: 'price_1Rznb5Dn6VTzl81b8Hx5UQt6',
    name: 'Pro Plan',
    description: 'Everything you need to scale your testimonial collection and management.',
    mode: 'subscription'
  }
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductByPriceId = (priceId: string): Product | undefined => {
  return products.find(product => product.priceId === priceId);
};