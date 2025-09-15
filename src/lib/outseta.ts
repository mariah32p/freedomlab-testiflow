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
  billingStageName: string;
  personAccount: Array<{
    person: OutsetaUser;
    isPrimary: boolean;
  }>;
  currentSubscription?: {
    uid: string;
    plan: {
      uid: string;
      slug: string;
      name: string;
    };
    billingRenewalTerm: number;
    startDate: string;
    renewalDate: string;
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

export type EntitlementStatus = 
  | 'UNAUTHENTICATED' 
  | 'OK' 
  | 'PAST_DUE' 
  | 'BLOCKED' 
  | 'NO_ENTITLEMENT';

// Outseta configuration
export const OUTSETA_CONFIG = {
  domain: 'freedomlab.outseta.com',
  publicKey: import.meta.env.VITE_OUTSETA_PUBLIC_KEY || '',
};

// TestiFlow plan configuration
export const TESTIFLOW_PLAN = {
  uid: 'jW78klmq',
  slug: 'testiflow-standard',
  name: 'TestiFlow Standard',
};

// Initialize Outseta script with proper configuration
export const initializeOutseta = (): Promise<void> => {
  if (typeof window === 'undefined') return Promise.resolve();

  return new Promise((resolve) => {
    // If Outseta is already loaded and ready, resolve immediately
    if (window.Outseta && window.Outseta.getUser && window.Outseta.auth && typeof window.Outseta.auth.login === 'function') {
      resolve();
      return;
    }

    // Add configuration first
    if (!window.o_options) {
      window.o_options = {
        domain: OUTSETA_CONFIG.domain,
        load: 'auth,customForm,emailList,leadCapture,nocode,profile,support'
      };
    }

    // Add Outseta script if not already present
    if (!document.querySelector('script[src*="outseta.min.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://cdn.outseta.com/outseta.min.js';
      script.setAttribute('data-options', 'o_options');
      
      script.onload = () => {
        // Poll for Outseta methods to be available
        const checkOutsetaReady = () => {
          if (window.Outseta && window.Outseta.getUser && window.Outseta.auth && typeof window.Outseta.auth.login === 'function') {
            resolve();
          } else {
            setTimeout(checkOutsetaReady, 100);
          }
        };
        checkOutsetaReady();
      };
      
      document.head.appendChild(script);
    } else {
      // Script exists, poll for readiness
      const checkOutsetaReady = () => {
        if (window.Outseta && window.Outseta.getUser && window.Outseta.auth && typeof window.Outseta.auth.login === 'function') {
          resolve();
        } else {
          setTimeout(checkOutsetaReady, 100);
        }
      };
      checkOutsetaReady();
    }
  });
};

// Get current user from Outseta
export const getOutsetaUser = async (): Promise<{ user: OutsetaUser; account: OutsetaAccount } | null> => {
  await initializeOutseta();
  
  if (typeof window === 'undefined' || !window.Outseta) {
    return null;
  }

  try {
    const user = await window.Outseta.getUser();
    return user;
  } catch (error) {
    console.error('Error getting Outseta user:', error);
    return null;
  }
};

// Get JWT payload from Outseta
export const getOutsetaJWT = async (): Promise<OutsetaJWT | null> => {
  await initializeOutseta();
  
  if (typeof window === 'undefined' || !window.Outseta) {
    return null;
  }

  try {
    const jwt = await window.Outseta.getJwtPayload();
    return jwt;
  } catch (error) {
    console.error('Error getting Outseta JWT:', error);
    return null;
  }
};

// Core entitlement guard function
export const requireEntitlement = async (requiredPlanUid: string = TESTIFLOW_PLAN.uid): Promise<EntitlementStatus> => {
  try {
    const userData = await getOutsetaUser();
    
    if (!userData) {
      return 'UNAUTHENTICATED';
    }

    const { account } = userData;
    
    // Check billing stage
    const billingStage = account.billingStageName?.toLowerCase();
    
    if (billingStage === 'past due') {
      return 'PAST_DUE';
    }
    
    // Check for blocked states
    if (['trialexpired', 'expired', 'canceled'].includes(billingStage || '')) {
      return 'BLOCKED';
    }
    
    // Check plan entitlement
    const currentPlanUid = account.currentSubscription?.plan?.uid;
    
    if (currentPlanUid !== requiredPlanUid) {
      return 'NO_ENTITLEMENT';
    }
    
    // All checks passed
    return 'OK';
    
  } catch (error) {
    console.error('Error checking entitlement:', error);
    return 'UNAUTHENTICATED';
  }
};

// Outseta embed triggers
export const triggerLogin = async () => {
  await initializeOutseta();
  if (typeof window !== 'undefined' && window.Outseta) {
    window.Outseta.auth.login();
  }
};

export const triggerProfile = async () => {
  await initializeOutseta();
  if (typeof window !== 'undefined' && window.Outseta) {
    window.Outseta.profile.show();
  }
};

export const triggerLogout = async () => {
  await initializeOutseta();
  if (typeof window !== 'undefined' && window.Outseta) {
    window.Outseta.auth.logout();
  }
};

// Sync user data to Supabase
export const syncUserToSupabase = async (user: OutsetaUser, account: OutsetaAccount) => {
  try {
    console.log('Syncing user to Supabase:', user.uid);
    
    const { error } = await supabase
      .from('outseta_users')
      .upsert({
        outseta_uid: user.uid,
        email: user.email,
        first_name: user.firstName || '',
        last_name: user.lastName || '',
        full_name: user.fullName || '',
        account_uid: account.uid,
        plan_uid: account.currentSubscription?.plan?.uid || null,
        account_stage: account.accountStage,
        last_sync_at: new Date().toISOString()
      }, {
        onConflict: 'outseta_uid'
      });

    if (error) {
      console.error('Error syncing to Supabase:', error);
    } else {
      console.log('User synced successfully');
    }
  } catch (error) {
    console.error('Error syncing user to Supabase:', error);
  }
};