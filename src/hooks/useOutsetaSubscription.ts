import { useState, useEffect } from 'react';
import { useOutsetaAuth } from '../contexts/OutsetaAuthContext';
import { supabase } from '../lib/supabase';

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

// Standard plan gets ALL features (since Premium is disabled)
const STANDARD_LIMITS: OutsetaSubscriptionLimits = {
  maxTestimonials: Infinity,
  maxForms: Infinity,
  canUseCustomFields: true,
  canUseBranding: true,
  canUseVideoUploads: true,
  canUseAdvancedExports: true,
  canUseTags: true,
};

export const useOutsetaSubscription = (): OutsetaSubscriptionState => {
  const { user, hasSubscription, loading: authLoading } = useOutsetaAuth();
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
        // Get user's forms
        const { data: formsData, error: formsError } = await supabase
          .from('testimonial_forms')
          .select('id')
          .eq('outseta_uid', user.sub);

        if (formsError) {
          console.error('Error fetching forms:', formsError);
          setCurrentUsage({ testimonialCount: 0, formCount: 0 });
          return;
        }

        const formCount = formsData?.length || 0;
        let testimonialCount = 0;

        if (formsData && formsData.length > 0) {
          const formIds = formsData.map(f => f.id);
          
          // Get testimonial count for user's forms
          const { count } = await supabase
            .from('testimonials')
            .select('*', { count: 'exact', head: true })
            .in('form_id', formIds);

          testimonialCount = count || 0;
        }

        setCurrentUsage({
          testimonialCount,
          formCount,
        });
      } catch (error) {
        console.error('Error fetching usage:', error);
        setCurrentUsage({ testimonialCount: 0, formCount: 0 });
      } finally {
        setUsageLoading(false);
      }
    };

    fetchUsage();
  }, [user]);

  return {
    loading: authLoading || usageLoading,
    hasActiveSubscription: hasSubscription,
    isTrialing: user?.account_stage === 1, // 1 = Trial, 2 = Active
    plan: 'standard', // Everyone gets standard plan (Premium is disabled)
    currentUsage,
    limits: STANDARD_LIMITS, // Everyone gets full features
  };
};