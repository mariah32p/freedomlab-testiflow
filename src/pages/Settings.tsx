import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const Settings: React.FC = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Plan:</span>
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-950">
                        {subscription.price_id === 'price_1Rznb5Dn6VTzl81bjqFfCagv' ? 'Basic' : 
                         subscription.price_id === 'price_1Rznb5Dn6VTzl81b8Hx5UQt6' ? 'Pro' : 'Unknown'}
                      </span>
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
                    <div className="pt-4 border-t border-gray-200">
                      <button className="bg-primary-950 text-white px-4 py-2 rounded-lg hover:bg-primary-900 transition-all duration-200 font-medium shadow-md hover:shadow-lg">
                        Manage Subscription
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">No active subscription</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};