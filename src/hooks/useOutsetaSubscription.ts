import { useState, useEffect } from 'react';
import { useOutsetaAuth } from '../contexts/OutsetaAuthContext';
import { OUTSETA_PLANS } from '../lib/outseta';

export interface OutsetaSubscriptionLimits {
  maxTestimonials: number;
  maxForms: number;
  canUseCustomFields: boolean;
  canUseBranding: boolean;
  canUseVideoUploads: boolean;
  canUseAdvancedExports: boolean;
  canUseTags: boolean;
}

export interface OutsetaSubscriptionState {
  loading: boolean;
  hasActiveSubscription: boolean;
  isTrialing: boolean;
  plan: 'standard' | 'premium';
  currentUsage: {
    testimonialCount: number;
    formCount: number;
  };
  limits: OutsetaSubscriptionLimits;
}

export const useOutsetaSubscription = (): OutsetaSubscriptionState => {
  const { user, hasSubscription, plan, loading: authLoading } = useOutsetaAuth();
  const [currentUsage, setCurrentUsage] = useState({
    testimonialCount: 0,
    formCount: 0,
  });
  const [usageLoading, setUsageLoading] = useState(true);

  useEffect(() => {
    const fetchUsage = async () => {
      if (!user) {
        setUsageLoading(false);
        return;
      }

      try {
        // We'll implement usage fetching from Supabase using Outseta user ID
        // For now, set to 0
        setCurrentUsage({
          testimonialCount: 0,
          formCount: 0,
        });
      } catch (error) {
        console.error('Error fetching usage:', error);
      } finally {
        setUsageLoading(false);
      }
    };

    fetchUsage();
  }, [user]);

  const planConfig = OUTSETA_PLANS[plan];
  
  return {
    loading: authLoading || usageLoading,
    hasActiveSubscription: hasSubscription,
    isTrialing: user?.account_stage === 1, // 1 = Trial, 2 = Active
    plan,
    currentUsage,
    limits: {
      maxTestimonials: planConfig.maxTestimonials,
      maxForms: planConfig.maxForms,
      canUseCustomFields: planConfig.features.customFields,
      canUseBranding: planConfig.features.branding,
      canUseVideoUploads: planConfig.features.videoUploads,
      canUseAdvancedExports: planConfig.features.advancedExports,
      canUseTags: planConfig.features.tags,
    },
  };
};