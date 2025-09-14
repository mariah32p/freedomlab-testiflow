import React, { createContext, useContext, useEffect, useState } from 'react';
import { OutsetaJWT, verifyOutsetaToken, getUserPlan, hasActiveSubscription, initializeOutseta, storeToken, getStoredToken, removeStoredToken, refreshToken } from '../lib/outseta';
import { supabase } from '../lib/supabase';

interface OutsetaAuthContextType {
  user: OutsetaJWT | null;
  loading: boolean;
  isAuthenticated: boolean;
  hasSubscription: boolean;
  plan: 'standard' | 'premium';
  signOut: () => void;
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
  const [user, setUser] = useState<OutsetaJWT | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('OutsetaAuth: Initializing...');
    
    const initialize = async () => {
      // Initialize Outseta script and wait for it to be ready
      await initializeOutseta();
      
      // Check for existing token in localStorage or URL
      checkAuthState();
    };
    
    initialize();

    // Listen for auth state changes from Outseta embeds
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== `https://${import.meta.env.VITE_OUTSETA_DOMAIN}`) return;
      
      if (event.data.type === 'outseta.auth.login') {
        console.log('OutsetaAuth: Login event received');
        handleAuthToken(event.data.accessToken);
      } else if (event.data.type === 'outseta.auth.logout') {
        console.log('OutsetaAuth: Logout event received');
        handleSignOut();
      }
    };

    window.addEventListener('message', handleMessage);
    
    // Check URL for access_token (from Outseta redirect)
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('access_token');
    
    if (accessToken) {
      console.log('OutsetaAuth: Found access token in URL');
      handleAuthToken(accessToken);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  // Token refresh mechanism
  useEffect(() => {
    if (!user) return;

    const checkTokenExpiry = async () => {
      const token = getStoredToken();
      if (!token) return;

      const jwt = await verifyOutsetaToken(token);
      if (!jwt) {
        // Token expired or invalid, try to refresh
        const newToken = await refreshToken();
        if (newToken) {
          handleAuthToken(newToken);
        } else {
          // Refresh failed, sign out
          handleSignOut();
        }
      }
    };

    // Check token every 5 minutes
    const interval = setInterval(checkTokenExpiry, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [user]);

  const checkAuthState = async () => {
    const token = getStoredToken();
    
    if (token) {
      console.log('OutsetaAuth: Found stored token, verifying...');
      const jwt = await verifyOutsetaToken(token);
      
      if (jwt) {
        console.log('OutsetaAuth: Token valid, user authenticated:', jwt.email);
        setUser(jwt);
      } else {
        console.log('OutsetaAuth: Token invalid, clearing storage');
        removeStoredToken();
      }
    } else {
      console.log('OutsetaAuth: No stored token found');
    }
    
    setLoading(false);
  };

  const handleAuthToken = async (token: string) => {
    console.log('OutsetaAuth: Processing auth token...');
    
    const jwt = await verifyOutsetaToken(token);
    
    if (jwt) {
      console.log('OutsetaAuth: Token verified, storing user:', jwt.email);
      storeToken(token);
      setUser(jwt);
      
      // Sync user data to Supabase for testimonial management
      await syncUserToSupabase(jwt);
    } else {
      console.log('OutsetaAuth: Invalid token received');
    }
  };

  const syncUserToSupabase = async (jwt: OutsetaJWT) => {
    try {
      console.log('OutsetaAuth: Syncing user to Supabase:', jwt.sub);
      
      // Upsert user data to outseta_users table
      const { error } = await supabase
        .from('outseta_users')
        .upsert({
          outseta_uid: jwt.sub,
          email: jwt.email,
          first_name: jwt.name?.split(' ')[0] || '',
          last_name: jwt.name?.split(' ').slice(1).join(' ') || '',
          full_name: jwt.name || '',
          account_uid: jwt.account_uid,
          plan_uid: jwt.plan_uid || null,
          account_stage: jwt.account_stage,
          last_sync_at: new Date().toISOString()
        }, {
          onConflict: 'outseta_uid'
        });

      if (error) {
        console.error('OutsetaAuth: Error syncing to Supabase:', error);
      } else {
        console.log('OutsetaAuth: User synced successfully');
      }
    } catch (error) {
      console.error('OutsetaAuth: Error syncing user to Supabase:', error);
    }
  };

  const handleSignOut = () => {
    console.log('OutsetaAuth: Signing out user');
    removeStoredToken();
    setUser(null);
  };

  const signOut = () => {
    handleSignOut();
    // Redirect to home page
    window.location.href = '/';
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    hasSubscription: user ? hasActiveSubscription(user) : false,
    plan: user ? getUserPlan(user) : 'standard' as const,
    signOut,
  };

  return (
    <OutsetaAuthContext.Provider value={value}>
      {children}
    </OutsetaAuthContext.Provider>
  );
};