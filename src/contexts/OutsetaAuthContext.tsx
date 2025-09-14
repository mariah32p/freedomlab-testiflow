import React, { createContext, useContext, useEffect, useState } from 'react';
import { OutsetaJWT, verifyOutsetaToken, getUserPlan, hasActiveSubscription, initializeOutseta } from '../lib/outseta';

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
    
    // Initialize Outseta script
    initializeOutseta();

    // Check for existing token in localStorage or URL
    checkAuthState();

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

  const checkAuthState = async () => {
    const token = localStorage.getItem('outseta_access_token');
    
    if (token) {
      console.log('OutsetaAuth: Found stored token, verifying...');
      const jwt = await verifyOutsetaToken(token);
      
      if (jwt) {
        console.log('OutsetaAuth: Token valid, user authenticated:', jwt.email);
        setUser(jwt);
      } else {
        console.log('OutsetaAuth: Token invalid, clearing storage');
        localStorage.removeItem('outseta_access_token');
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
      localStorage.setItem('outseta_access_token', token);
      setUser(jwt);
      
      // Sync user data to Supabase for testimonial management
      await syncUserToSupabase(jwt);
    } else {
      console.log('OutsetaAuth: Invalid token received');
    }
  };

  const syncUserToSupabase = async (jwt: OutsetaJWT) => {
    try {
      // We'll keep using Supabase for testimonial data storage
      // but use Outseta user ID as the primary key
      console.log('OutsetaAuth: Syncing user to Supabase:', jwt.sub);
      
      // This will be implemented when we update the database schema
      // For now, just log the user data
      console.log('OutsetaAuth: User data to sync:', {
        outseta_uid: jwt.sub,
        email: jwt.email,
        name: jwt.name,
        account_uid: jwt.account_uid,
        plan: getUserPlan(jwt),
        account_stage: jwt.account_stage
      });
    } catch (error) {
      console.error('OutsetaAuth: Error syncing user to Supabase:', error);
    }
  };

  const handleSignOut = () => {
    console.log('OutsetaAuth: Signing out user');
    localStorage.removeItem('outseta_access_token');
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