import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, AlertCircle, ExternalLink, CreditCard, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useStripe } from '../hooks/useStripe';
import { Alert } from '../components/Alert';
import { useNavigate } from 'react-router-dom';

export const Settings: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { createPortalSession, changePlan, loading: stripeLoading, error: stripeError } = useStripe();
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

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
    // Remove URL-based plan change detection since we now handle it immediately
  }, []);

  const getCurrentPlan = () => {
    if (!subscription?.price_id) return null;
     
     console.log('Settings: Getting current plan for price_id:', subscription.price_id);
     // Since we only have Standard plan now, just return a simple object
     return { name: 'Standard Plan', id: 'standard' };
  };

  const handleManageSubscription = async () => {
    await createPortalSession();
  };

  const isInGracePeriod = () => {
    return subscription?.status === 'past_due';
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    
    setDeleting(true);
    setError(null);
    
    try {
      // Delete user account (this will cascade delete all related data due to foreign keys)
      const { error } = await supabase.auth.admin.deleteUser(user.id);
      
      if (error) throw error;
      
      // Sign out and redirect
      await supabase.auth.signOut();
      navigate('/');
      
    } catch (error) {
      console.error('Error deleting account:', error);
      setError('Failed to delete account. Please try again.');
      setDeleting(false);
    }
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

              {/* Danger Zone */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h2 className="text-lg font-medium text-red-900 mb-4">Danger Zone</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-red-800 mb-2">Delete Account</h3>
                    <p className="text-sm text-red-700 mb-4">
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center space-x-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete Account</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h2 className="text-xl font-bold text-red-900 mb-4">Delete Account</h2>
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 font-medium mb-2">⚠️ This action cannot be undone!</p>
                  <p className="text-red-700 text-sm">
                    Deleting your account will permanently remove:
                  </p>
                  <ul className="text-red-700 text-sm mt-2 space-y-1">
                    <li>• All testimonial forms</li>
                    <li>• All collected testimonials</li>
                    <li>• Custom fields and branding</li>
                    <li>• Tags and organization</li>
                    <li>• Your account and subscription</li>
                  </ul>
                </div>
                
                <p className="text-gray-600 text-sm">
                  Type your email address to confirm deletion:
                </p>
                
                <input
                  type="email"
                  placeholder={user?.email || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  onChange={(e) => {
                    const deleteButton = document.getElementById('confirm-delete') as HTMLButtonElement;
                    if (deleteButton) {
                      deleteButton.disabled = e.target.value !== user?.email;
                    }
                  }}
                />
                
                <div className="flex space-x-3">
                  <button
                    id="confirm-delete"
                    onClick={handleDeleteAccount}
                    disabled={deleting}
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deleting ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Deleting...
                      </div>
                    ) : (
                      'Delete My Account'
                    )}
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={deleting}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors font-medium disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};