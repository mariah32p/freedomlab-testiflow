import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { products } from '../stripe-config';
import { useAuth } from '../contexts/AuthContext';

export const useStripe = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCheckoutSession = async (priceId: string) => {
    setLoading(true);
    setError(null);

    try {
      // Get authenticated user
      let userEmail: string;
      let userId: string;
      
      // Get user session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user?.email) {
        // Use authenticated user data
        userEmail = session.user.email;
        userId = session.user.id;
      } else {
        throw new Error('You must be logged in to make a purchase');
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

  const createPortalSession = async () => {
    if (!user) {
      setError('You must be logged in');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No active session');
      }

      const { data, error: functionError } = await supabase.functions.invoke('create-portal-session', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: {
          return_url: `${window.location.origin}/settings`,
        },
      });

      if (functionError) {
        throw new Error(functionError.message);
      }

      // Redirect to Stripe Customer Portal
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const changePlan = async (newPriceId: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user?.email) {
        throw new Error('You must be logged in');
      }

      const product = products.find(p => p.priceId === newPriceId);
      if (!product) {
        throw new Error('Product not found');
      }

      const { data, error: functionError } = await supabase.functions.invoke('stripe-checkout', {
        body: {
          price_id: newPriceId,
          mode: product.mode,
          customer_email: session.user.email,
          client_reference_id: session.user.id,
          success_url: `${window.location.origin}/settings?plan_changed=true`,
          cancel_url: `${window.location.origin}/settings`,
          is_plan_change: true,
        },
      });

      if (functionError) {
        throw new Error(functionError.message);
      }

      // Redirect to Stripe Checkout
      if (data?.url) {
        window.location.href = data.url; // Use same tab for plan changes
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return {
    createCheckoutSession,
    createPortalSession,
    changePlan,
    loading,
    error,
  };
};