import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { products } from '../stripe-config.js';
import { APP_CONFIG } from '../config/app';

export const useStripe = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCheckoutSession = async (priceId: string) => {
    setLoading(true);
    setError(null);

    try {
      // If in mock mode, simulate successful checkout
      if (!APP_CONFIG.ENABLE_REAL_AUTH) {
        // Simulate loading time
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Open success page in new tab
        window.open(`${window.location.origin}/success`, '_blank');
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('You must be logged in to make a purchase');
      }

      const product = products.find(p => p.priceId === priceId);
      if (!product) {
        throw new Error('Product not found');
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          price_id: priceId,
          mode: product.mode,
          customer_email: session?.user?.email,
          success_url: `${window.location.origin}/success`,
          cancel_url: `${window.location.origin}/get-started`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.open(data.url, '_blank');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return {
    createCheckoutSession,
    loading,
    error,
  };
};