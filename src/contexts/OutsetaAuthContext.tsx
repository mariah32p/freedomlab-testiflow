import React, { createContext, useContext, useEffect, useState } from 'react';
import { getOutsetaUser, getOutsetaJWT, requireEntitlement, syncUserToSupabase, triggerLogout, initializeOutseta, TESTIFLOW_PLAN, OUTSETA_CONFIG } from '../lib/outseta';

interface OutsetaUser {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
}

interface OutsetaAccount {
  uid: string;
  billingStageName: string;
  currentSubscription?: {
    plan: {
      uid: string;
      slug: string;
      name: string;
    };
  };
}

interface OutsetaAuthContextType {
  user: OutsetaUser | null;
  account: OutsetaAccount | null;
  loading: boolean;
  isAuthenticated: boolean;
  hasSubscription: boolean;
  entitlementStatus: 'UNAUTHENTICATED' | 'OK' | 'PAST_DUE' | 'BLOCKED' | 'NO_ENTITLEMENT';
  signOut: () => void;
  refreshAuth: () => Promise<void>;
}

const OutsetaAuthContext = createContext<OutsetaAuthContextType | undefined>(undefined);

export const useOutsetaAuth = () => {
  const context = useContext(OutsetaAuthContext);
  if (context === undefined) {
    throw new Error('useOutsetaAuth must be used within an OutsetaAuthProvider');
  }
  return context;
};

export const OutsetaAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<OutsetaUser | null>(null);
  const [account, setAccount] = useState<OutsetaAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [entitlementStatus, setEntitlementStatus] = useState<'UNAUTHENTICATED' | 'OK' | 'PAST_DUE' | 'BLOCKED' | 'NO_ENTITLEMENT'>('UNAUTHENTICATED');

  useEffect(() => {
    console.log('OutsetaAuth: Initializing...');
    
    const initialize = async () => {
      await initializeOutseta();
      await checkAuthState();
      
      // Listen for auth state changes from Outseta embeds
      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== OUTSETA_CONFIG.origin) return;
        
        if (event.data.type === 'outseta.auth.login' || event.data.type === 'outseta.auth.register') {
          console.log('OutsetaAuth: Auth event received, refreshing state');
          setTimeout(checkAuthState, 1000); // Small delay to let Outseta update
        } else if (event.data.type === 'outseta.auth.logout') {
          console.log('OutsetaAuth: Logout event received');
          handleSignOut();
        }
      };

      window.addEventListener('message', handleMessage);
      
      return () => {
        window.removeEventListener('message', handleMessage);
      };
    };
    
    initialize();
  }, []);

  const checkAuthState = async () => {
    try {
      console.log('OutsetaAuth: Checking auth state...');
      
      const userData = await getOutsetaUser();
      
      if (userData) {
        console.log('OutsetaAuth: User authenticated:', userData.user.email);
        console.log('OutsetaAuth: Account stage:', userData.account.billingStageName);
        console.log('OutsetaAuth: Current plan:', userData.account.currentSubscription?.plan?.uid);
        
        setUser(userData.user);
        setAccount(userData.account);
        
        // Check entitlement
        const status = await requireEntitlement(TESTIFLOW_PLAN.uid);
        setEntitlementStatus(status);
        console.log('OutsetaAuth: Entitlement status:', status);
        
        // Sync to Supabase
        await syncUserToSupabase(userData.user, userData.account);
      } else {
        console.log('OutsetaAuth: No authenticated user');
        setUser(null);
        setAccount(null);
        setEntitlementStatus('UNAUTHENTICATED');
      }
    } catch (error) {
      console.error('OutsetaAuth: Error checking auth state:', error);
      setUser(null);
      setAccount(null);
      setEntitlementStatus('UNAUTHENTICATED');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    console.log('OutsetaAuth: Signing out user');
    setUser(null);
    setAccount(null);
    setEntitlementStatus('UNAUTHENTICATED');
  };

  const signOut = async () => {
    await triggerLogout();
    handleSignOut();
    // Redirect to home page
    window.location.href = '/';
  };

  const refreshAuth = async () => {
    setLoading(true);
    await checkAuthState();
  };

  const value = {
    user,
    account,
    loading,
    isAuthenticated: !!user,
    hasSubscription: entitlementStatus === 'OK' || entitlementStatus === 'PAST_DUE',
    entitlementStatus,
    signOut,
    refreshAuth,
  };

  return (
    <OutsetaAuthContext.Provider value={value}>
      {children}
    </OutsetaAuthContext.Provider>
  );
};