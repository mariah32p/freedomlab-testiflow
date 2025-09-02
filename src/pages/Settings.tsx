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
        setLoading(true);
        setError(null);
        
        // Debug: Log what we're looking for
        console.log('Settings: Fetching subscription for user:', user.id);
        
        const { data: customerData } = await supabase
          .from('stripe_customers')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        console.log('Settings: Customer data found:', customerData);

        if (customerData) {
          const { data: subscriptionData } = await supabase
            .from('stripe_subscriptions')
            .select('*')
            .eq('customer_id', customerData.customer_id)
            .maybeSingle();
           
           console.log('Settings: Subscription data found:', {
             subscription_id: subscriptionData?.subscription_id,
             price_id: subscriptionData?.price_id,
             status: subscriptionData?.status,
             customer_id: subscriptionData?.customer_id
           });
           
          setSubscription(subscriptionData);
        }
      } catch (error) {
        console.error('Error fetching subscription data:', error);
        setError('Failed to load subscription data');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionData();
  }, [user]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('plan_changed') === 'true') {
      setSuccess('Your plan has been updated successfully!');
       
       // Force refresh subscription data after plan change
       setTimeout(async () => {
         console.log('Settings: Plan changed, forcing data refresh...');
         
         if (!user) return;
         
         const { data: customerData } = await supabase
           .from('stripe_customers')
           .select('*')
           .eq('user_id', user.id)
           .maybeSingle();

         if (customerData) {
           const { data: subscriptionData } = await supabase
             .from('stripe_subscriptions')
             .select('*')
             .eq('customer_id', customerData.customer_id)
             .maybeSingle();
           
           console.log('Settings: Refreshed subscription data:', {
             subscription_id: subscriptionData?.subscription_id,
             price_id: subscriptionData?.price_id,
             status: subscriptionData?.status
           });
           
           setSubscription(subscriptionData);
         }
         
         // Also refresh the global subscription hook
         if ((window as any).refreshSubscription) {
           (window as any).refreshSubscription();
         }
       }, 2000); // Give webhook more time to process
       
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const getCurrentPlan = () => {
    if (!subscription?.price_id) return null;
     
     console.log('Settings: Getting current plan for price_id:', subscription.price_id);
     const foundProduct = products.find(p => p.priceId === subscription.price_id);
     console.log('Settings: Found product:', foundProduct);
     
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
    if (!newPriceId) return;
    await changePlan(newPriceId);
  };

  const isInGracePeriod = () => {
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

            {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
            {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}
            {stripeError && <Alert type="error" message={stripeError} onClose={() => {}} />}

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
                    <span className="text-gray-700">{user?.email || 'Loading...'}</span>
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
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Plan:</span>
                      <div className="flex items-center space-x-2">
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                          {getCurrentPlan()?.name || 'Unknown Plan'}
                        </span>
                        {/* Price information is not available in product data */}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                        subscription.status === 'active' ? 'bg-green-100 text-green-800' :
                        subscription.status === 'trialing' ? 'bg-blue-100 text-blue-800' :
                        subscription.status === 'past_due' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {subscription.status.replace('_', ' ')}
                      </span>
                    </div>
                    {subscription.current_period_end && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">
                          {subscription.status === 'trialing' ? 'Trial ends:' : 'Renews on:'}
                        </span>
                        <span className="text-gray-900">
                          {new Date(subscription.current_period_end * 1000).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    {isInGracePeriod() && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <div className="flex items-center">
                          <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                          <div className="text-sm">
                            <p className="text-red-800 font-medium">Payment Issue</p>
                            <p className="text-red-600">Please update your payment method.</p>
                          </div>
                        </div>
                      </div>
                    )}
                    {getOtherPlan() && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-blue-900">
                              {getCurrentPlan()?.id === 'standard' ? 'Upgrade to Premium' : 'Downgrade to Standard'}
                            </h4>
                            <div className="text-sm text-blue-700 mt-1 space-y-1">
                              <p>
                                <strong>Charged immediately:</strong> You'll be charged the difference (${getCurrentPlan()?.id === 'standard' ? '$20' : '-$20'}) right now.
                              </p>
                              <p>
                                Changes take effect immediately with prorated billing.
                              </p>
                              {subscription?.status === 'trialing' && (
                                <p className="font-medium">
                                  This will end your trial and start billing immediately.
                                </p>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => handlePlanChange(getOtherPlan()!.priceId)}
                            disabled={stripeLoading}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                          >
                            {getCurrentPlan()?.id === 'standard' ? <ArrowUpCircle className="h-4 w-4" /> : <ArrowDownCircle className="h-4 w-4" />}
                            <span>
                              {stripeLoading ? 'Processing...' : (getCurrentPlan()?.id === 'standard' ? 'Upgrade' : 'Downgrade')}
                            </span>
                          </button>
                        </div>
                      </div>
                    )}
                    <div className="flex space-x-3 pt-4 border-t">
                      <button 
                        onClick={handleManageSubscription}
                        disabled={stripeLoading}
                        className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors duration-200 font-medium flex items-center space-x-2 disabled:opacity-50"
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
                  <div className="text-center py-6">
                    <p className="text-gray-500 mb-4">No active subscription found.</p>
                    <button
                      onClick={() => window.location.href = '/get-started'}
                      className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
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