import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface UserSubscription {
  status: 'trialing' | 'active' | 'past_due' | 'canceled' | 'not_started';
  payment_issue_since?: string;
}

// Grace helper: Determine if user is in 30-day grace window
export const isInGracePeriod = (paymentIssueSince?: string): boolean => {
  if (!paymentIssueSince) return false;
  
  const issueDate = new Date(paymentIssueSince);
  const now = new Date();
  const daysSinceIssue = Math.floor((now.getTime() - issueDate.getTime()) / (1000 * 60 * 60 * 24));
  
  return daysSinceIssue <= 30;
};

// Helper to get payment issue date from subscription
const getPaymentIssueDate = (subscription: any): string | undefined => {
  if (subscription?.status === 'past_due') {
    return subscription.updated_at;
  }
  return undefined;
};

export const useRouteGuard = () => {
  const { user, loading } = useAuth();
  const [routeLoading, setRouteLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  console.log('🔍 Route guard running - User:', user?.email, 'Loading:', loading, 'Path:', location.pathname);

  useEffect(() => {
    console.log('🔍 Route guard useEffect triggered');
    if (loading) {
      setRouteLoading(true);
      return;
    }

    const checkSubscriptionStatus = async () => {
      console.log('🔍 Starting subscription status check');
      // Allow certain pages without authentication
      const publicPages = ['/login', '/signup', '/forgot-password', '/reset-password', '/pricing', '/', '/demo', '/success'];
      const isPublicPage = publicPages.includes(location.pathname);
      const isPublicFormSubmission = location.pathname.startsWith('/submit/');
      const isLandingPage = location.pathname === '/';
      const isSuccessPage = location.pathname === '/success';

      if (!user) {
        // Not signed in → send to /signup (unless on public page)
        console.log('🔍 No user found, current path:', location.pathname, 'Is public page:', isPublicPage);
        if (!isPublicPage && !isLandingPage && !isPublicFormSubmission) {
          console.log('🔍 Redirecting to signup because not on public page');
          navigate('/signup');
          return;
        }
        setRouteLoading(false);
        return;
      }

      console.log('🔍 User is authenticated:', user.email);
      
      // If on success page, give it a moment before checking subscription
      if (isSuccessPage) {
        console.log('🔍 On success page, waiting 5 seconds before checking subscription...');
        // Add a counter to prevent infinite loops
        const attempts = parseInt(sessionStorage.getItem('successPageAttempts') || '0');
        if (attempts < 3) {
          sessionStorage.setItem('successPageAttempts', (attempts + 1).toString());
          setTimeout(() => {
            console.log('🔍 Success page timeout complete, rechecking subscription... Attempt:', attempts + 1);
            checkSubscriptionStatus();
          }, 5000);
          setRouteLoading(false);
          return;
        } else {
          console.log('🔍 Success page: Max attempts reached, redirecting to get-started');
          sessionStorage.removeItem('successPageAttempts');
          navigate('/get-started');
          setRouteLoading(false);
          return;
        }
      }
      
      // User is signed in - fetch subscription data
      try {
        console.log('🔍 Checking for customer record...');
        // First check if user has a customer record
        const { data: customerData } = await supabase
          .from('stripe_customers')
          .select('customer_id')
          .eq('user_id', user.id)
          .maybeSingle();

        console.log('🔍 Customer data:', customerData);

        if (!customerData) {
          // No customer record = no subscription
          console.log('🔍 No customer record found, user needs to subscribe');
          if (location.pathname !== '/get-started' && !isPublicPage && !isLandingPage && !isPublicFormSubmission) {
            navigate('/get-started');
            return;
          }
          setRouteLoading(false);
          return;
        }

        console.log('🔍 Found customer record, checking subscription...');
        // Get subscription data
        const { data: subscriptionData, error: subscriptionError } = await supabase
          .from('stripe_subscriptions')
          .select('*')
          .eq('customer_id', customerData.customer_id)
          .maybeSingle();

        console.log('🔍 Raw subscription data:', subscriptionData);
        console.log('🔍 Subscription error:', subscriptionError);

        let subscription: UserSubscription;
        
        if (subscriptionError || !subscriptionData) {
          // No subscription found
          console.log('🔍 No subscription found for customer:', subscriptionError);
          subscription = { status: 'not_started' };
        } else {
          console.log('🔍 Found subscription:', {
            id: subscriptionData.subscription_id,
            status: subscriptionData.status,
            price_id: subscriptionData.price_id,
            current_period_end: subscriptionData.current_period_end
          });
          subscription = {
            status: subscriptionData.status,
            payment_issue_since: getPaymentIssueDate(subscriptionData)
          };
        }

        console.log('🔍 Current subscription status:', subscription.status);

        // Simplified routing based on subscription status
        const hasActiveSubscription = subscription.status === 'trialing' || subscription.status === 'active';
        const isInGrace = subscription.status === 'past_due' && isInGracePeriod(subscription.payment_issue_since);
        const canAccessDashboard = hasActiveSubscription || isInGrace;

        console.log('🔍 Access check:', {
          hasActiveSubscription,
          isInGrace,
          canAccessDashboard,
          currentPath: location.pathname
        });

        if (canAccessDashboard) {
          // Has active subscription or in grace period → allow dashboard
          console.log('🔍 User has active subscription or in grace period, allowing dashboard access');
          // Clear success page attempts when successfully accessing dashboard
          localStorage.removeItem('successPageAttempts');
          localStorage.removeItem('successPageStartTime');
          if ((location.pathname === '/get-started' || isLandingPage) && !isPublicFormSubmission) {
            console.log('🔍 Redirecting from get-started/home to dashboard');
            navigate('/dashboard');
          }
        } else {
          // No active subscription → send to get-started
          console.log('🔍 No active subscription, redirecting to get-started');
          // Clear success page attempts when redirecting to get-started
          localStorage.removeItem('successPageAttempts');
          localStorage.removeItem('successPageStartTime');
          if (location.pathname !== '/get-started' && !isPublicPage && !isLandingPage && !isPublicFormSubmission) {
            navigate('/get-started');
          }
        }

        setRouteLoading(false);
      } catch (error) {
        console.error('🔍 Error fetching subscription status:', error);
        // On error, treat as no subscription
        if (location.pathname !== '/get-started' && !isPublicPage) {
          navigate('/get-started');
        }
        setRouteLoading(false);
      }
    };

    console.log('🔍 Checking subscription status...');
    checkSubscriptionStatus();

  }, [user, loading, location.pathname, navigate]);

  return { user, loading: loading || routeLoading };
};