import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useOutsetaAuth } from '../contexts/OutsetaAuthContext';

export const useOutsetaRouteGuard = () => {
  const { user, loading, isAuthenticated, hasSubscription } = useOutsetaAuth();
  const [routeLoading, setRouteLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  console.log('🔍 Outseta Route guard - User:', user?.email, 'Loading:', loading, 'Path:', location.pathname);

  useEffect(() => {
    if (loading) {
      setRouteLoading(true);
      return;
    }

    const checkAccess = () => {
      console.log('🔍 Outseta: Checking route access');
      
      // Allow certain pages without authentication
      const publicPages = ['/login', '/signup', '/forgot-password', '/reset-password', '/pricing', '/', '/demo'];
      const isPublicPage = publicPages.includes(location.pathname);
      const isPublicFormSubmission = location.pathname.startsWith('/submit/');

      if (!isAuthenticated) {
        // Not signed in → allow public pages, redirect others to home
        console.log('🔍 Outseta: No user, current path:', location.pathname, 'Is public:', isPublicPage);
        if (!isPublicPage && !isPublicFormSubmission) {
          console.log('🔍 Outseta: Redirecting to home');
          navigate('/');
        }
        setRouteLoading(false);
        return;
      }

      console.log('🔍 Outseta: User authenticated:', user?.email, 'Has subscription:', hasSubscription);

      if (!hasSubscription) {
        // Authenticated but no subscription → redirect to pricing
        console.log('🔍 Outseta: No subscription, redirecting to pricing');
        if (location.pathname !== '/pricing' && !isPublicPage && !isPublicFormSubmission) {
          navigate('/pricing');
        }
        setRouteLoading(false);
        return;
      }

      // Has subscription → allow dashboard access
      console.log('🔍 Outseta: Has subscription, allowing dashboard access');
      if (location.pathname === '/pricing' || location.pathname === '/') {
        console.log('🔍 Outseta: Redirecting to dashboard');
        navigate('/dashboard');
      }
      
      setRouteLoading(false);
    };

    checkAccess();
  }, [user, loading, isAuthenticated, hasSubscription, location.pathname, navigate]);

  return { user, loading: loading || routeLoading };
};