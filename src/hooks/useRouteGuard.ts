import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { APP_CONFIG } from '../config/app';

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

export const useRouteGuard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  console.log('Route guard running - User:', user?.email, 'Loading:', loading, 'Path:', location.pathname);

  useEffect(() => {
    console.log('Route guard useEffect triggered');
    if (loading) return;

    const checkSubscriptionStatus = async () => {
      console.log('Starting subscription status check');
    // Allow certain pages without authentication
    const publicPages = ['/login', '/signup', '/forgot-password', '/reset-password', '/pricing', '/'];
    const isPublicPage = publicPages.includes(location.pathname);
        console.log('No user found, redirecting to signup if not on public page');

    // Real auth mode route logic
    if (!user) {
      // Not signed in → send to /signup (unless on public page)
      console.log('No user found, current path:', location.pathname, 'Is public page:', isPublicPage);
      if (!isPublicPage) {
        console.log('Redirecting to signup because not on public page');
        navigate('/signup');
      }
      return;
    }

    // User is signed in - implement subscription-based routing
    // For now, we'll simulate different states for testing
    // In production, this would fetch from Supabase subscription data
    
    const mockSubscription: UserSubscription = {
      status: 'not_started', // Change this to test different states
      // payment_issue_since: '2024-12-01T00:00:00Z', // Uncomment to test grace period
    };

      // User is signed in - fetch real subscription data
      try {
        // First check if user has a customer record
        const { data: customerData } = await supabase
          .from('stripe_customers')
          .select('customer_id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (!customerData) {
          // No customer record = no subscription
          if (location.pathname !== '/get-started' && !isPublicPage) {
        console.log('No user authenticated');
            navigate('/get-started');
          }
          return;
        }

        // Get subscription data
        const { data: subscriptionData, error } = await supabase
          .from('stripe_subscriptions')
          .select('*')
          .eq('customer_id', customerData.customer_id)
          .single();

        let subscription: UserSubscription;
        
        if (error || !subscriptionData) {
          // No subscription found
          subscription = { status: 'not_started' };
        } else {
          console.log('Found subscription:', subscriptionData);
          subscription = {
            status: subscriptionData.status,
            payment_issue_since: subscriptionData.updated_at // Using updated_at as payment issue tracker for now
          };
        }

        console.log('Current subscription status:', subscription.status);

        // Handle routing based on subscription status
        switch (subscription.status) {
          case 'trialing':
          case 'active':
            // Active subscription → allow dashboard
            console.log('User has active/trialing subscription, allowing dashboard access');
            if (location.pathname === '/get-started') {
              navigate('/dashboard');
            }
            break;

          case 'past_due':
            // Check if in 30-day grace period
            if (isInGracePeriod(subscription.payment_issue_since)) {
              // Allow dashboard but will show payment issue banner
              if (location.pathname === '/get-started') {
                navigate('/dashboard');
              }
            } else {
              // Grace period expired → send to get-started
              if (location.pathname !== '/get-started' && !isPublicPage) {
                navigate('/get-started');
              }
            }
            break;

          case 'canceled':
          case 'not_started':
          default:
            // No active subscription → send to get-started
            if (location.pathname !== '/get-started' && !isPublicPage) {
              navigate('/get-started');
            }
            break;
        }
      } catch (error) {
        console.error('Error fetching subscription status:', error);
        // On error, treat as no subscription
        if (location.pathname !== '/get-started' && !isPublicPage) {
          navigate('/get-started');
        }
      }
    };

      console.log('Real auth mode - checking subscription');
    checkSubscriptionStatus();

  }, [user, loading, location.pathname, navigate]);

  return { user, loading };
};