import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useOutsetaAuth } from '../contexts/OutsetaAuthContext';

export const useOutsetaRouteGuard = () => {
  const { user, account, loading, entitlementStatus } = useOutsetaAuth();
  const [routeLoading, setRouteLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  console.log('🔍 Route guard - User:', user?.email, 'Status:', entitlementStatus, 'Path:', location.pathname);

  useEffect(() => {
    if (loading) {
      setRouteLoading(true);
      return;
    }

    const checkAccess = () => {
      console.log('🔍 Checking route access for status:', entitlementStatus);
      
      // Allow certain pages without authentication
      const publicPages = ['/pricing', '/', '/demo'];
      const isPublicPage = publicPages.includes(location.pathname);
      const isPublicFormSubmission = location.pathname.startsWith('/submit/');
      const isBillingUpdate = location.pathname === '/billing-update';
      const isPaywall = location.pathname === '/paywall';

      // Handle different entitlement statuses
      switch (entitlementStatus) {
        case 'UNAUTHENTICATED':
          if (!isPublicPage && !isPublicFormSubmission) {
            console.log('🔍 Unauthenticated, redirecting to pricing');
            navigate('/pricing');
          }
          break;

        case 'PAST_DUE':
          if (!isBillingUpdate && !isPublicFormSubmission) {
            console.log('🔍 Past due, redirecting to billing update');
            navigate('/billing-update');
          }
          break;

        case 'BLOCKED':
        case 'NO_ENTITLEMENT':
          if (!isPaywall && !isPublicFormSubmission) {
            console.log('🔍 Blocked/No entitlement, redirecting to paywall');
            navigate('/paywall');
          }
          break;

        case 'OK':
          // Full access - redirect away from auth pages
          if (location.pathname === '/pricing' || location.pathname === '/billing-update' || location.pathname === '/paywall') {
            console.log('🔍 Entitled user, redirecting to dashboard');
            navigate('/dashboard');
          }
          break;
      }
      
      setRouteLoading(false);
    };

    checkAccess();
  }, [entitlementStatus, loading, location.pathname, navigate]);

  return { 
    user, 
    account,
    loading: loading || routeLoading,
    entitlementStatus 
  };
};