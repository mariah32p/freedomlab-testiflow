import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export interface SubscriptionInfo {
  hasActiveSubscription: boolean;
  status: 'trialing' | 'active' | 'past_due' | 'canceled' | 'not_started';
  isTrialing: boolean;
  currentPeriodEnd: number | null;
  paymentIssueSince: string | null;
  currentUsage: {
    testimonialCount: number;
    formCount: number;
  };
}

export interface SubscriptionState extends SubscriptionInfo {
  loading: boolean;
}

export const useSubscription = (): SubscriptionState => {
  const { user } = useAuth();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo>({
    hasActiveSubscription: false,
    status: 'not_started',
    isTrialing: false,
    currentPeriodEnd: null,
    paymentIssueSince: null,
    currentUsage: {
      testimonialCount: 0,
      formCount: 0,
    },
  });
  const [loading, setLoading] = useState(true);

  // Function to manually refresh subscription data
  const refreshSubscription = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Expose refresh function globally for other components
  useEffect(() => {
    (window as any).refreshSubscription = refreshSubscription;
    return () => {
      delete (window as any).refreshSubscription;
    };
  }, []);

  useEffect(() => {
    const fetchSubscriptionInfo = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      setLoading(true);

      try {
        console.log('useSubscription: Fetching subscription info for user:', user.id);
        
        // Get customer data
        const { data: customerData } = await supabase
          .from('stripe_customers')
          .select('customer_id')
          .eq('user_id', user.id)
          .maybeSingle();

        console.log('useSubscription: Customer data:', customerData);

        if (!customerData) {
          // No customer = no subscription
          console.log('useSubscription: No customer found - no subscription');
          setSubscriptionInfo(prev => ({
            ...prev,
            hasActiveSubscription: false,
            status: 'not_started',
            isTrialing: false,
            currentPeriodEnd: null,
            paymentIssueSince: null,
          }));
          return;
        }

        // Get subscription data
        const { data: subscriptionData } = await supabase
          .from('stripe_subscriptions')
          .select('*')
          .eq('customer_id', customerData.customer_id)
          .maybeSingle();

        console.log('useSubscription: Subscription data:', subscriptionData);

        // Get current usage
        const { data: formsData } = await supabase
          .from('testimonial_forms')
          .select('id')
          .eq('user_id', user.id);

        const formCount = formsData?.length || 0;
        let testimonialCount = 0;

        if (formsData && formsData.length > 0) {
          const formIds = formsData.map(f => f.id);
          const { count } = await supabase
            .from('testimonials')
            .select('*', { count: 'exact', head: true })
            .in('form_id', formIds);
          testimonialCount = count || 0;
        }

        // Determine subscription status
        const status = subscriptionData?.status || 'not_started';
        const isActive = status === 'active';
        const isTrialing = status === 'trialing';
        const hasActiveSubscription = isActive || isTrialing;

        // Get payment issue date for grace period calculation
        const paymentIssueSince = status === 'past_due' ? subscriptionData?.updated_at : null;

        console.log('useSubscription: Final status:', {
          status,
          hasActiveSubscription,
          isTrialing,
          currentUsage: { testimonialCount, formCount }
        });

        setSubscriptionInfo({
          hasActiveSubscription,
          status,
          isTrialing,
          currentPeriodEnd: subscriptionData?.current_period_end || null,
          paymentIssueSince,
          currentUsage: {
            testimonialCount,
            formCount,
          },
        });

      } catch (error) {
        console.error('useSubscription: Error fetching subscription info:', error);
        // On error, default to no subscription
        setSubscriptionInfo(prev => ({
          ...prev,
          hasActiveSubscription: false,
          status: 'not_started',
        }));
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionInfo();
  }, [user, refreshTrigger]);

  return { ...subscriptionInfo, loading };
};

// Simplified helper functions - no more feature gating
export const canAccessDashboard = (subscription: SubscriptionState): boolean => {
  if (subscription.loading) return true;
  return subscription.hasActiveSubscription;
};

export const isInGracePeriod = (subscription: SubscriptionState): boolean => {
  if (!subscription.paymentIssueSince || subscription.status !== 'past_due') return false;
  
  const issueDate = new Date(subscription.paymentIssueSince);
  const now = new Date();
  const daysSinceIssue = Math.floor((now.getTime() - issueDate.getTime()) / (1000 * 60 * 60 * 24));
  
  return daysSinceIssue <= 30;
};

export const shouldAllowDashboardAccess = (subscription: SubscriptionState): boolean => {
  return subscription.hasActiveSubscription || isInGracePeriod(subscription);
};