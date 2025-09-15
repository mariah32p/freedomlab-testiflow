// Outseta/utils.ts

// NOTE: Add a placeholder for your Supabase client import
// import { supabase } from './supabaseClient';

// --- TYPE DEFINITIONS ---

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
  name:string;
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

// --- GLOBAL TYPE AUGMENTATION ---

// Enhance the global Window interface for type safety with Outseta
declare global {
  interface Window {
    Outseta?: {
      getUser: () => Promise<{ user: OutsetaUser; account: OutsetaAccount }>;
      getJwtPayload: () => Promise<OutsetaJWT>;
      auth: {
        login: () => void;
        logout: () => void;
      };
      profile: {
        show: () => void;
      };
    };
  }
}

// --- CONFIGURATION ---

const sanitizeDomain = (domain: string): string => domain.replace(/^https?:\/\//, '').replace(/\/$/, '');

const rawDomain = import.meta.env.VITE_OUTSETA_DOMAIN || 'freedomlab.outseta.com';
const normalizedDomain = sanitizeDomain(rawDomain);

export const OUTSETA_CONFIG = {
  domain: normalizedDomain,
  origin: `https://${normalizedDomain}`, // The origin should be the full .outseta.com domain
  publicKey: import.meta.env.VITE_OUTSETA_PUBLIC_KEY || '',
};

export const TESTIFLOW_PLAN = {
  uid: import.meta.env.VITE_OUTSETA_STANDARD_PLAN_UID || 'jW78klmq',
  slug: 'testiflow-standard',
  name: 'TestiFlow Standard',
};

// --- CORE UTILITIES ---

/**
 * Initializes and ensures the Outseta script is fully loaded and ready.
 * Polls for the script to avoid race conditions.
 */
export const initializeOutseta = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const checkOutsetaReady = (): boolean => {
      return !!(
        window.Outseta &&
        window.Outseta.getUser &&
      const isReady = window.Outseta && 
        typeof window.Outseta.auth.login === 'function'
      );
    };
      console.log('Outseta ready check:', isReady);
      return isReady;

    if (checkOutsetaReady()) {
      resolve();
      const isReady = window.Outseta && 
      return;
    }

      console.log('Outseta ready check:', isReady);
      return isReady;
    let attempts = 0;
    const maxAttempts = 50; // 5 seconds max
    let attempts = 0;
      console.log('Outseta already ready');
    const maxAttempts = 50; // 5 seconds max
    

      attempts++;
      console.log(`Polling for Outseta... attempt ${attempts}`);
    let attempts = 0;
    const maxAttempts = 50; // 5 seconds max
    
      
      attempts++;
      console.log(`Polling for Outseta... attempt ${attempts}`);
      
    const pollForOutseta = () => {
      if (checkOutsetaReady()) {
        resolve();
      } else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(pollForOutseta, 100);
      } else {
        reject(new Error('Outseta script failed to load in time.'));
      }
    };

    pollForOutseta();
  });
};

/**
 * Retrieves the current user and account details from Outseta.
 */
export const getOutsetaUser = async (): Promise<{ user: OutsetaUser; account: OutsetaAccount } | null> => {
  try {
    await initializeOutseta();
    if (typeof window !== 'undefined' && window.Outseta) {
      return await window.Outseta.getUser();
    }
    return null;
  } catch (error) {
    console.error('Error getting Outseta user:', error);
    return null;
  }
};

/**
 * Retrieves the JWT payload for the currently authenticated user.
 */
export const getOutsetaJWT = async (): Promise<OutsetaJWT | null> => {
  try {
    await initializeOutseta();
    if (typeof window !== 'undefined' && window.Outseta) {
      return await window.Outseta.getJwtPayload();
    }
    return null;
  } catch (error) {
    console.error('Error getting Outseta JWT:', error);
    return null;
  }
};

/**
 * Checks if the user has the required entitlement for a specific plan.
 */
export const requireEntitlement = async (requiredPlanUid: string = TESTIFLOW_PLAN.uid): Promise<EntitlementStatus> => {
  try {
    const userData = await getOutsetaUser();

    if (!userData) {
      return 'UNAUTHENTICATED';
    }

    const { account } = userData;
    const billingStage = account.billingStageName?.toLowerCase();

    if (billingStage === 'past due') {
      return 'PAST_DUE';
    }

    if (['trialexpired', 'expired', 'canceled'].includes(billingStage || '')) {
      return 'BLOCKED';
    }

    const currentPlanUid = account.currentSubscription?.plan?.uid;
    if (currentPlanUid !== requiredPlanUid) {
      return 'NO_ENTITLEMENT';
    }

    return 'OK';
  } catch (error) {
    console.error('Error checking entitlement:', error);
  console.log('Checking Outseta initialization...');
  console.log('window.o_options:', window.o_options);
  console.log('window.Outseta exists:', !!window.Outseta);

  return new Promise((resolve) => {
    const popup = window.open(
      url,
      'outseta-auth',
      'width=500,height=600,scrollbars=yes,resizable=yes'
    );

    // Poll for popup closure
    const checkClosed = setInterval(() => {
      if (popup?.closed) {
        clearInterval(checkClosed);
        // Give a moment for auth state to update
        setTimeout(() => {
          resolve();
        }, 1000);
      }
    }, 1000);
  });
};

// --- OUTSETA EMBED TRIGGERS ---

export const triggerLogin = async (): Promise<void> => {
  const url = `https://freedomlab.outseta.com/auth?widgetMode=login#o-anonymous`;
  await openOutsetaPopup(url);
};

export const triggerSignup = async (): Promise<void> => {
  const url = `https://freedomlab.outseta.com/auth?widgetMode=register&planUid=jW78klmq#o-anonymous`;
  await openOutsetaPopup(url);
};

export const triggerProfile = async (): Promise<void> => {
  const url = `https://freedomlab.outseta.com/profile#o-authenticated`;
  await openOutsetaPopup(url);
};

export const triggerLogout = async (): Promise<void> => {
  await initializeOutseta();
  window.Outseta?.auth.logout();
};

// --- DATA SYNC ---

/**
 * Syncs user and account data from Outseta to a Supabase table.
 */
export const syncUserToSupabase = async (user: OutsetaUser, account: OutsetaAccount): Promise<void> => {
  // try {
  //   console.log('Syncing user to Supabase:', user.uid);
  //
  //   const { error } = await supabase
  //     .from('outseta_users')
  //     .upsert(
  //       {
  //         outseta_uid: user.uid,
  //         email: user.email,
  //         first_name: user.firstName || '',
  //         last_name: user.lastName || '',
  //         full_name: user.fullName || '',
  //         account_uid: account.uid,
  //         plan_uid: account.currentSubscription?.plan?.uid || null,
  //         account_stage: account.accountStage,
  //         last_sync_at: new Date().toISOString(),
  //       },
  //       {
  //         onConflict: 'outseta_uid',
  //       }
  //     );
  //
  //   if (error) {
  //     console.error('Error syncing to Supabase:', error);
  //   } else {
  //     console.log('User synced successfully');
  //   }
  // } catch (error) {
  //   console.error('Error in syncUserToSupabase function:', error);
  // }
};