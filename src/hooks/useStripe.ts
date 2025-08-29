import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { products } from '../stripe-config';
import { APP_CONFIG } from '../config/app';

export const useStripe = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCheckoutSession = async (priceId: string) => {
    setLoading(true);
    setError(null);

    try {
      // Get user email - either from real session or mock user
      let userEmail: string;
      let userId: string;
      
      if (APP_CONFIG.ENABLE_REAL_AUTH) {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user?.email) {
          throw new Error('You must be logged in to make a purchase');
        }
        userEmail = session.user.email;
        userId = session.user.id;
      } else {
        userEmail = APP_CONFIG.MOCK_USER.email;
        userId = APP_CONFIG.MOCK_USER.id;
      }

      const product = products.find(p => p.priceId === priceId);
      if (!product) {
        throw new Error('Product not found');
      }

      const { data, error: functionError } = await supabase.functions.invoke('stripe-checkout', {
        body: {
          price_id: priceId,
          mode: product.mode,
          customer_email: userEmail,
          client_reference_id: userId,
          success_url: `${window.location.origin}/success`,
          cancel_url: `${window.location.origin}/get-started`,
        },
      });

      if (functionError) {
        throw new Error(functionError.message);
      }

      // Redirect to Stripe Checkout
      if (data?.url) {
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