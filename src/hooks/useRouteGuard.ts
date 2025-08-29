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

  useEffect(() => {
    if (loading) return;

    const checkSubscriptionStatus = async () => {
    // Allow certain pages without authentication
    const publicPages = ['/login', '/signup', '/forgot-password', '/reset-password', '/pricing', '/'];
    const isPublicPage = publicPages.includes(location.pathname);

    if (!APP_CONFIG.ENABLE_REAL_AUTH) {
      // Mock mode - allow access to get-started for testing
      if (location.pathname === '/get-started') {
        return;
      }
      // In mock mode, treat as not signed in for public pages
      if (!isPublicPage && location.pathname !== '/get-started') {
        navigate('/get-started');
      }
      return;
    }

    // Real auth mode route logic
    if (!user) {
      // Not signed in → send to /signup (unless on public page)
      if (!isPublicPage) {
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
        const { data: subscriptionData, error } = await supabase
          .from('stripe_user_subscriptions')
          .select('*')
          .single();

        let subscription: UserSubscription;
        
        if (error || !subscriptionData) {
          // No subscription found
          subscription = { status: 'not_started' };
          case 'past_due':
            // Check if in 30-day grace period
            if (isInGracePeriod(payment_issue_since)) {
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
            if (location.pathname === '/get-started') {
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

    checkSubscriptionStatus();

      case 'canceled':
      case 'not_started':
      default:
        // No active subscription → send to get-started
        if (location.pathname !== '/get-started' && !isPublicPage) {
          navigate('/get-started');
        }
        break;
    }
  }, [user, loading, location.pathname, navigate]);

  return { user, loading };
};