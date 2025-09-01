export interface Product {
  id: string;
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
}

export const products: Product[] = [
  {
    id: 'starter',
    priceId: 'price_1Rznb5Dn6VTzl81bjqFfCagv',
    name: 'Starter Plan',
    description: 'Perfect for small businesses getting started with testimonial collection.',
    mode: 'subscription'
  },
  {
    id: 'professional',
    priceId: 'price_1Rznb5Dn6VTzl81b8Hx5UQt6',
    name: 'Professional Plan',
    description: 'Complete testimonial management with rich media and advanced features.',
    mode: 'subscription'
  }
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductByPriceId = (priceId: string): Product | undefined => {
  return products.find(product => product.priceId === priceId);
};