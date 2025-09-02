import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, AlertCircle, ExternalLink, CreditCard, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useStripe } from '../hooks/useStripe';
import { products } from '../stripe-config';
import { Alert } from '../components/Alert';

export const Settings: React.FC = () => {
  const { user } = useAuth();
  const { createPortalSession, changePlan, loading: stripeLoading, error: stripeError } = useStripe();
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      if (!user) return;
      
      try {
        setError(null);
        // Get customer data
        const { data: customerData } = await supabase
          .from('stripe_customers')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (customerData) {
          // Get subscription data
          const { data: subscriptionData } = await supabase
            .from('stripe_subscriptions')
            .select('*')
            .eq('customer_id', customerData.customer_id)
            .maybeSingle();

          setSubscription(subscriptionData);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching subscription data:', error);
        setError('Failed to load subscription data');
        setLoading(false);
      }
    };

    fetchSubscriptionData();
  }, [user]);

  // Check for plan change success
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('plan_changed') === 'true') {
      setSuccess('Your plan has been updated successfully!');
      // Clean up URL
      window.history.replaceState({}, '', '/settings');
    }
  }, []);

  const getCurrentPlan = () => {
    if (!subscription?.price_id) return null;
    return products.find(p => p.priceId === subscription.price_id);
  };

  const getOtherPlan = () => {
    const currentPlan = getCurrentPlan();
    if (!currentPlan) return null;
    return products.find(p => p.id !== currentPlan.id);
  };

  const handleManageSubscription = async () => {
    await createPortalSession();
  };

  const handlePlanChange = async (newPriceId: string) => {
    await changePlan(newPriceId);
  };

  const isInGracePeriod = () => {
    // Simple grace period check - in production you'd want more sophisticated tracking
    return subscription?.status === 'past_due';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
              <p className="text-gray-600">Manage your account and subscription</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                  <p className="text-red-800">{error}</p>
                </div>
              </div>
            )}
            
            {success && (
              <div className="mb-6">
                <Alert
                  type="success"
                  message={success}
                  onClose={() => setSuccess(null)}
                />
              </div>
            )}

            {stripeError && (
              <div className="mb-6">
                <Alert
                  type="error"
                  message={stripeError}
                  onClose={() => {}}
                />
              </div>
            )}

            <div className="space-y-6">
              {/* Account Information */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <User className="h-6 w-6 text-gray-400 mr-2" />
                  <h2 className="text-lg font-medium text-gray-900">Account Information</h2>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-700">
                      {user?.email || 'Loading...'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Account created: {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
              </div>

              {/* Subscription Management */}
              <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Subscription</h2>
                {subscription ? (
                  <div className="space-y-4">
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Plan:</span>
                      <div className="flex items-center space-x-2">
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-950">
                          {getCurrentPlan()?.name || 'Unknown Plan'}
                        </span>
                        <span className="text-sm text-gray-500">
                          ${subscription.price_id === 'price_1Rznb5Dn6VTzl81bjqFfCagv' ? '29' : '49'}/mo
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        subscription.status === 'active' ? 'bg-green-100 text-green-800' :
                        subscription.status === 'trialing' ? 'bg-blue-100 text-blue-800' :
                        subscription.status === 'past_due' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {subscription.status}
                      </span>
                    </div>
                    {subscription.current_period_end && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">
                          {subscription.status === 'trialing' ? 'Trial ends:' : 'Next billing:'}
                        </span>
                        <span className="text-gray-900">
                          {new Date(subscription.current_period_end * 1000).toLocaleDateString()}
                        </span>
                      </div>
                    )}

                    {/* Grace Period Warning */}
                    {isInGracePeriod() && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <div className="flex items-center">
                          <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                          <div className="text-sm">
                            <p className="text-red-800 font-medium">Payment Issue</p>
                            <p className="text-red-600">Please update your payment method to avoid service interruption</p>
                          </div>
                        </div>
                      </div>
                    )}

                                 <div className="text-xs text-blue-600 mt-2 space-y-1">
                                   <p className="font-medium">
                                     {getCurrentPlan()?.id === 'standard' 
                                       ? '💳 You\'ll be charged the prorated difference immediately'
                                       : '💰 You\'ll receive a prorated credit on your next bill'
                                     }
                                   </p>
                                   <p>
                                     {getCurrentPlan()?.id === 'standard' 
                                       ? 'Example: If 15 days left in cycle, you pay ~$10 extra now'
                                       : 'Example: If 15 days left in cycle, you get ~$10 credit'
                                     }
                                   </p>
                                 </div>
                        {getOtherPlan() && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium text-blue-900">
                                  {getCurrentPlan()?.id === 'standard' ? 'Upgrade to Premium' : 'Downgrade to Standard'}
                                </h4>
                                <p className="text-sm text-blue-700">
                                  {getCurrentPlan()?.id === 'standard' 
                                    ? 'Get unlimited forms, custom branding, and advanced exports'
                                    : 'Switch to our basic plan with essential features'
                                  }
                                </p>
                                <p className="text-xs text-blue-600 mt-1">
                                  Changes take effect immediately with prorated billing
                                </p>
                              </div>
                              <button
                                onClick={() => handlePlanChange(getOtherPlan()!.priceId)}
                                disabled={stripeLoading}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                              >
                                {getCurrentPlan()?.id === 'standard' ? (
                                  <ArrowUpCircle className="h-4 w-4" />
                                ) : (
                                  <ArrowDownCircle className="h-4 w-4" />
                                )}
                                <span>
                                  {stripeLoading ? 'Processing...' : 
                                   getCurrentPlan()?.id === 'standard' ? 'Upgrade' : 'Downgrade'}
                                </span>
                              </button>
                            </div>
                          </div>
                        )}

                        <div className="flex space-x-3">
                          <button 
                            onClick={handleManageSubscription}
                            disabled={stripeLoading}
                            className="bg-primary-950 text-white px-4 py-2 rounded-lg hover:bg-primary-900 transition-all duration-200 font-medium shadow-md hover:shadow-lg flex items-center space-x-2 disabled:opacity-50"
                          >
                            <ExternalLink className="h-4 w-4" />
                            <span>{stripeLoading ? 'Loading...' : 'Manage Billing'}</span>
                          </button>
                          
                          {isInGracePeriod() && (
                            <button 
                              onClick={handleManageSubscription}
                              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                            >
                              <CreditCard className="h-4 w-4" />
                              <span>Update Payment</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="pt-4 border-t border-gray-200">
                        <button 
                          onClick={handleManageSubscription}
                          disabled={stripeLoading}
                          className="bg-primary-950 text-white px-4 py-2 rounded-lg hover:bg-primary-900 transition-all duration-200 font-medium shadow-md hover:shadow-lg flex items-center space-x-2 disabled:opacity-50"
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span>{stripeLoading ? 'Loading...' : 'Manage Subscription'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                  </>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-500 mb-4">No active subscription</p>
                    <button
                      onClick={() => window.location.href = '/get-started'}
                      className="bg-primary-950 text-white px-6 py-3 rounded-lg hover:bg-primary-900 transition-colors font-medium"
                    >
                      Choose a Plan
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};