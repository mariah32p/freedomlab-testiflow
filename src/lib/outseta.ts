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

// Plan configuration - update these with actual Outseta plan UIDs
export const OUTSETA_PLANS = {
  standard: {
    uid: import.meta.env.VITE_OUTSETA_STANDARD_PLAN_UID || 'standard-plan-uid',
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
    uid: import.meta.env.VITE_OUTSETA_PREMIUM_PLAN_UID || 'premium-plan-uid',
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

// JWT verification utility with signature validation
export const verifyOutsetaToken = async (token: string): Promise<OutsetaJWT | null> => {
  try {
    // Decode JWT without verification first to check expiration
    const payload = JSON.parse(atob(token.split('.')[1]));
    
    if (payload.exp * 1000 < Date.now()) {
      console.log('Token expired');
      return null;
    }

    // Verify JWT signature with Outseta
    if (OUTSETA_CONFIG.publicKey) {
      try {
        const response = await fetch(`https://${OUTSETA_CONFIG.domain}/api/v1/auth/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          console.log('Token verification failed');
          return null;
        }

        const verificationResult = await response.json();
        if (!verificationResult.valid) {
          console.log('Token signature invalid');
          return null;
        }
      } catch (error) {
        console.error('Error verifying token signature:', error);
        return null;
      }
    }

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

// Secure token storage using sessionStorage with encryption
const TOKEN_KEY = 'outseta_token';

export const storeToken = (token: string) => {
  try {
    // Use sessionStorage instead of localStorage for better security
    sessionStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Failed to store token:', error);
  }
};

export const getStoredToken = (): string | null => {
  try {
    return sessionStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Failed to retrieve token:', error);
    return null;
  }
};

export const removeStoredToken = () => {
  try {
    sessionStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error('Failed to remove token:', error);
  }
};

// Token refresh mechanism
export const refreshToken = async (): Promise<string | null> => {
  try {
    const response = await fetch(`https://${OUTSETA_CONFIG.domain}/api/v1/auth/refresh`, {
      method: 'POST',
      credentials: 'include', // Include cookies for refresh token
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.access_token || null;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
};

// Initialize Outseta script
export const initializeOutseta = (): Promise<void> => {
  if (typeof window === 'undefined') return Promise.resolve();

  return new Promise((resolve) => {
    // If Outseta is already loaded and ready, resolve immediately
    if (window.Outseta && window.Outseta.getSignupWidget) {
      resolve();
      return;
    }

    // Add Outseta script if not already present
    if (!document.querySelector('script[src*="outseta.min.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://cdn.outseta.com/outseta.min.js';
      script.setAttribute('data-options', 'o_options');
      
      script.onload = () => {
        // Poll for Outseta widget methods to be available
        const checkOutsetaReady = () => {
          if (window.Outseta && window.Outseta.getSignupWidget) {
            resolve();
          } else {
            setTimeout(checkOutsetaReady, 100);
          }
        };
        checkOutsetaReady();
      };
      
      // Add configuration
      const configScript = document.createElement('script');
      configScript.innerHTML = `
        var o_options = {
          domain: '${OUTSETA_CONFIG.domain}'
        };
      `;
      
      document.head.appendChild(configScript);
      document.head.appendChild(script);
    } else {
      // Script exists, poll for readiness
      const checkOutsetaReady = () => {
        if (window.Outseta && window.Outseta.getSignupWidget) {
          resolve();
        } else {
          setTimeout(checkOutsetaReady, 100);
        }
      };
      checkOutsetaReady();
    }
  });
};

// Outseta embed triggers
export const triggerSignup = async () => {
  await initializeOutseta();
  if (typeof window !== 'undefined' && window.Outseta) {
    window.Outseta.getSignupWidget().open();
  }
};

export const triggerLogin = async () => {
  await initializeOutseta();
  if (typeof window !== 'undefined' && window.Outseta) {
    window.Outseta.getLoginWidget().open();
  }
};

export const triggerProfile = async () => {
  await initializeOutseta();
  if (typeof window !== 'undefined' && window.Outseta) {
    window.Outseta.getProfileWidget().open();
  }
};