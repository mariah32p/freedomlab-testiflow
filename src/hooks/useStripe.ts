import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { products, getFunctionalPlan } from '../stripe-config';
import { useAuth } from '../contexts/AuthContext';

export const useStripe = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if user has already used their trial
  const checkTrialEligibility = async (userId: string): Promise<boolean> => {
    try {
      const { data: customerData } = await supabase
        .from('stripe_customers')
        .select('customer_id')
        .eq('user_id', userId)
        .maybeSingle();

      // If no customer record exists, they're eligible for trial
      if (!customerData) {
        return true;
      }

      // Check if they've ever had a subscription (trial used)
      const { data: subscriptionData } = await supabase
        .from('stripe_subscriptions')
        .select('subscription_id')
        .eq('customer_id', customerData.customer_id)
        .maybeSingle();

      // If no subscription record, they're eligible for trial
      return !subscriptionData;
    } catch (error) {
      console.error('Error checking trial eligibility:', error);
      // Default to no trial if we can't check
      return false;
    }
  };

  const createCheckoutSession = async (priceId: string) => {
    setLoading(true);
    setError(null);

    try {
      // Always use the functional plan (Standard) regardless of what was requested
      const functionalPlan = getFunctionalPlan();
      const actualPriceId = functionalPlan.priceId;
      
      console.log('createCheckoutSession: Requested price:', priceId, 'Using actual price:', actualPriceId);

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

      // Check trial eligibility
      const isTrialEligible = await checkTrialEligibility(userId);
      console.log('createCheckoutSession: Trial eligible:', isTrialEligible);

      const { data, error: functionError } = await supabase.functions.invoke('stripe-checkout', {
        body: {
          price_id: actualPriceId,
          mode: functionalPlan.mode,
          customer_email: userEmail,
          client_reference_id: userId,
          has_trial: isTrialEligible,
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

  const showComingSoonModal = () => {
    alert('Pro Plan is coming soon! For now, enjoy all features with our Standard plan.');
  };

  return {
    createCheckoutSession,
    createPortalSession,
    showComingSoonModal,
    loading,
    error,
  };
};