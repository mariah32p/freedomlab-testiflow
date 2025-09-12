import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export interface SubscriptionLimits {
  maxTestimonials: number;
  maxForms: number;
  canUseCustomFields: boolean;
  canUseBranding: boolean;
  canUseVideoUploads: boolean;
  canUseAdvancedExports: boolean;
  canUseTags: boolean;
}

export interface SubscriptionState {
  loading: boolean;
  hasActiveSubscription: boolean;
  status: 'trialing' | 'active' | 'past_due' | 'canceled' | 'not_started';
  isTrialing: boolean;
  plan: 'standard' | 'premium';
  currentPeriodEnd: number | null;
  paymentIssueSince: string | null;
  currentUsage: {
    testimonialCount: number;
    formCount: number;
  };
  limits: SubscriptionLimits;
}

// Since we only have one functional plan, everyone gets "premium" limits
const UNIVERSAL_LIMITS: SubscriptionLimits = {
  maxTestimonials: Infinity,
  maxForms: Infinity,
  canUseCustomFields: true,
  canUseBranding: true,
  canUseVideoUploads: true,
  canUseAdvancedExports: true,
  canUseTags: true,
};

export const useSubscription = (): SubscriptionState => {
  const { user } = useAuth();
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionState>({
    loading: true,
    hasActiveSubscription: false,
    status: 'not_started',
    isTrialing: false,
    plan: 'standard',
    currentPeriodEnd: null,
    paymentIssueSince: null,
    currentUsage: {
      testimonialCount: 0,
      formCount: 0,
    },
    limits: UNIVERSAL_LIMITS,
  });

  useEffect(() => {
    const fetchSubscriptionInfo = async () => {
      if (!user) {
        setSubscriptionInfo(prev => ({
          ...prev,
          loading: false,
          hasActiveSubscription: false,
          status: 'not_started',
        }));
        return;
      }

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
            loading: false,
            hasActiveSubscription: false,
            status: 'not_started',
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
          loading: false,
          hasActiveSubscription,
          status,
          isTrialing,
          plan: 'standard', // Everyone is on "standard" plan now
          currentPeriodEnd: subscriptionData?.current_period_end || null,
          paymentIssueSince,
          currentUsage: {
            testimonialCount,
            formCount,
          },
          limits: UNIVERSAL_LIMITS, // Everyone gets full access
        });

      } catch (error) {
        console.error('useSubscription: Error fetching subscription info:', error);
        setSubscriptionInfo(prev => ({
          ...prev,
          loading: false,
          hasActiveSubscription: false,
          status: 'not_started',
        }));
      }
    };

    fetchSubscriptionInfo();
  }, [user]);

  return subscriptionInfo;
};

// Helper functions for route guard
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