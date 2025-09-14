// Outseta configuration and utilities
export interface OutsetaUser {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  created: string;
  updated: string;
}

export interface OutsetaAccount {
  uid: string;
  name: string;
  accountStage: number;
  accountStageLabel: string;
  personAccount: Array<{
    person: OutsetaUser;
    isPrimary: boolean;
  }>;
  subscriptions: Array<{
    uid: string;
    billingRenewalTerm: number;
    quantity: number;
    startDate: string;
    renewalDate: string;
    plan: {
      uid: string;
      name: string;
      planFamily: {
        uid: string;
        name: string;
      };
    };
  }>;
  latestSubscription?: {
    uid: string;
    plan: {
      uid: string;
      name: string;
      planFamily: {
        uid: string;
        name: string;
      };
    };
  };
}

export interface OutsetaJWT {
  sub: string; // User UID
  email: string;
  name: string;
  account_uid: string;
  plan_uid?: string;
  plan_name?: string;
  account_stage: number;
  exp: number;
  iat: number;
}

// Outseta configuration
export const OUTSETA_CONFIG = {
  domain: import.meta.env.VITE_OUTSETA_DOMAIN || 'testiflow.outseta.com',
  publicKey: import.meta.env.VITE_OUTSETA_PUBLIC_KEY || '',
};

// Plan configuration - these will be set up in Outseta
export const OUTSETA_PLANS = {
  standard: {
    uid: 'standard-plan-uid', // Will be replaced with actual Outseta plan UID
    name: 'Standard Plan',
    maxTestimonials: 25,
    maxForms: 1,
    features: {
      customFields: false,
      branding: false,
      videoUploads: false,
      advancedExports: false,
      tags: false,
    }
  },
  premium: {
    uid: 'premium-plan-uid', // Will be replaced with actual Outseta plan UID
    name: 'Premium Plan',
    maxTestimonials: Infinity,
    maxForms: Infinity,
    features: {
      customFields: true,
      branding: true,
      videoUploads: true,
      advancedExports: true,
      tags: true,
    }
  }
};

// JWT verification utility
export const verifyOutsetaToken = async (token: string): Promise<OutsetaJWT | null> => {
  try {
    // Decode JWT without verification first to check expiration
    const payload = JSON.parse(atob(token.split('.')[1]));
    
    if (payload.exp * 1000 < Date.now()) {
      console.log('Token expired');
      return null;
    }

    // In production, you would verify the JWT signature with Outseta's public key
    // For now, we'll trust the token if it's not expired
    return payload as OutsetaJWT;
  } catch (error) {
    console.error('Error verifying Outseta token:', error);
    return null;
  }
};

// Get user plan from JWT
export const getUserPlan = (jwt: OutsetaJWT) => {
  // Map Outseta plan UIDs to our internal plan structure
  if (jwt.plan_uid === OUTSETA_PLANS.premium.uid) {
    return 'premium';
  }
  return 'standard'; // Default to standard
};

// Check if user has active subscription
export const hasActiveSubscription = (jwt: OutsetaJWT): boolean => {
  // Account stage 2 = Active subscription, 1 = Trial, 0 = No subscription
  return jwt.account_stage >= 1;
};

// Initialize Outseta script
export const initializeOutseta = () => {
  if (typeof window === 'undefined') return;

  // Add Outseta script if not already present
  if (!document.querySelector('script[src*="outseta.min.js"]')) {
    const script = document.createElement('script');
    script.src = 'https://cdn.outseta.com/outseta.min.js';
    script.setAttribute('data-options', 'o_options');
    
    // Add configuration
    const configScript = document.createElement('script');
    configScript.innerHTML = `
      var o_options = {
        domain: '${OUTSETA_CONFIG.domain}'
      };
    `;
    
    document.head.appendChild(configScript);
    document.head.appendChild(script);
  }
};

// Outseta embed triggers
export const triggerSignup = () => {
  if (typeof window !== 'undefined' && (window as any).Outseta) {
    (window as any).Outseta.getSignupWidget().open();
  }
};

export const triggerLogin = () => {
  if (typeof window !== 'undefined' && (window as any).Outseta) {
    (window as any).Outseta.getLoginWidget().open();
  }
};

export const triggerProfile = () => {
  if (typeof window !== 'undefined' && (window as any).Outseta) {
    (window as any).Outseta.getProfileWidget().open();
  }
};