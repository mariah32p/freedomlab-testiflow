export interface Product {
  id: string;
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
  price: number;
}

export const products: Product[] = [
  {
    id: 'prod_SveuRRh7dEbDXz',
    priceId: 'price_1Rznb5Dn6VTzl81bjqFfCagv',
    name: 'TestiFlow',
    description: 'Complete testimonial collection and management platform with legal rights tracking and automatic ad-ready export formats for marketing teams.',
    mode: 'subscription',
    price: 29.00
  }
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductByPriceId = (priceId: string): Product | undefined => {
  return products.find(product => product.priceId === priceId);
};