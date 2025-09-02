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
  canUseImageUploads: boolean;
}

export interface SubscriptionInfo {
  plan: 'standard' | 'premium' | null;
  status: string;
  isActive: boolean;
  isTrialing: boolean;
  limits: SubscriptionLimits;
  currentUsage: {
    testimonialCount: number;
    formCount: number;
  };
}

const PLAN_LIMITS: Record<'standard' | 'premium', SubscriptionLimits> = {
  standard: {
    maxTestimonials: 25,
    maxForms: 1,
    canUseCustomFields: false,
    canUseBranding: false,
    canUseVideoUploads: false,
    canUseAdvancedExports: false,
    canUseTags: false,
    canUseImageUploads: true, // Images allowed on Standard
  },
  premium: {
    maxTestimonials: Infinity,
    maxForms: Infinity,
    canUseCustomFields: true,
    canUseBranding: true,
    canUseVideoUploads: true,
    canUseAdvancedExports: true,
    canUseTags: true,
    canUseImageUploads: true,
  },
};

export const useSubscription = (): SubscriptionInfo => {
  const { user } = useAuth();
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo>({
    plan: null,
    status: 'not_started',
    isActive: false,
    isTrialing: false,
    limits: PLAN_LIMITS.standard, // Default to Standard limits
    currentUsage: {
      testimonialCount: 0,
      formCount: 0,
    },
  });

  useEffect(() => {
    const fetchSubscriptionInfo = async () => {
      if (!user) return;

      try {
        console.log('Fetching subscription info for user:', user.id);
        
        // Get customer data
        const { data: customerData } = await supabase
          .from('stripe_customers')
          .select('customer_id')
          .eq('user_id', user.id)
          .maybeSingle();

        console.log('Customer data:', customerData);

        if (!customerData) {
          // No customer = no subscription
          console.log('No customer found - setting Standard limits');
          setSubscriptionInfo(prev => ({
            ...prev,
            plan: null,
            status: 'not_started',
            isActive: false,
            isTrialing: false,
            limits: PLAN_LIMITS.standard,
          }));
          return;
        }

        // Get subscription data
        const { data: subscriptionData } = await supabase
          .from('stripe_subscriptions')
          .select('*')
          .eq('customer_id', customerData.customer_id)
          .maybeSingle();

        console.log('Subscription data:', subscriptionData);

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

        // Determine plan from price_id
        let plan: 'standard' | 'premium' | null = null;
        if (subscriptionData?.price_id) {
          // Standard: price_1Rznb5Dn6VTzl81bjqFfCagv
          // Premium: price_1Rznb5Dn6VTzl81b8Hx5UQt6
          if (subscriptionData.price_id === 'price_1Rznb5Dn6VTzl81bjqFfCagv') {
            plan = 'standard';
            console.log('Detected Standard plan');
          } else if (subscriptionData.price_id === 'price_1Rznb5Dn6VTzl81b8Hx5UQt6') {
            plan = 'premium';
            console.log('Detected Premium plan');
          }
        }

        const isActive = subscriptionData?.status === 'active';
        const isTrialing = subscriptionData?.status === 'trialing';
        const hasActiveSubscription = isActive || isTrialing;

        // CRITICAL: Use actual plan limits - Standard gets Standard limits even during trial
        const effectivePlan = plan || 'standard'; // Default to standard if no plan detected
        console.log('Plan detection:', {
          priceId: subscriptionData?.price_id,
          detectedPlan: plan,
          effectivePlan,
          status: subscriptionData?.status,
          isTrialing,
          isActive
        });
        
        const limits = PLAN_LIMITS[effectivePlan];

        setSubscriptionInfo({
          plan,
          status: subscriptionData?.status || 'not_started',
          isActive: hasActiveSubscription,
          isTrialing,
          limits,
          currentUsage: {
            testimonialCount,
            formCount,
          },
        });

        // Force re-render to update UI immediately after plan change
        console.log('Subscription info updated:', {
          plan,
          effectivePlan,
          limits: limits,
          currentUsage: { testimonialCount, formCount }
        });
      } catch (error) {
        console.error('Error fetching subscription info:', error);
        // On error, default to Standard limits
        setSubscriptionInfo(prev => ({
          ...prev,
          limits: PLAN_LIMITS.standard,
        }));
      }
    };

    fetchSubscriptionInfo();
  }, [user]);

  return subscriptionInfo;
};

// Helper functions for feature gating
export const canCreateForm = (subscription: SubscriptionInfo): boolean => {
  // During trial or active subscription, enforce plan limits
  if (subscription.isActive || subscription.isTrialing) {
    return subscription.currentUsage.formCount < subscription.limits.maxForms;
  }
  // No subscription = no forms allowed
  return false;
};

export const canCreateTestimonial = (subscription: SubscriptionInfo): boolean => {
  return subscription.currentUsage.testimonialCount < subscription.limits.maxTestimonials;
};

export const getUpgradeMessage = (feature: string): string => {
  return `${feature} is available with Premium. Upgrade to unlock this feature.`;
};