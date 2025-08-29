import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, MessageSquare, CheckCircle, Download, Plus, FileText, Clock, AlertCircle } from 'lucide-react';
import { TestiFlowIcon } from '../components/TestiFlowIcon';
import { APP_CONFIG } from '../config/app';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
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

  const getTrialDaysLeft = () => {
    if (!subscription?.current_period_end) return 0;
    const endDate = new Date(subscription.current_period_end * 1000);
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const getChargeDate = () => {
    if (!subscription?.current_period_end) return '';
    const endDate = new Date(subscription.current_period_end * 1000);
    return endDate.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            {/* Subscription Status Banners */}
            {subscription?.status === 'trialing' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-blue-600 mr-2" />
                    <div>
                      <p className="text-blue-800 font-medium">
                        Trial ends in {getTrialDaysLeft()} day{getTrialDaysLeft() !== 1 ? 's' : ''}
                      </p>
                      <p className="text-blue-600 text-sm">
                        Your card will be charged on {getChargeDate()}
                      </p>
                    </div>
                  </div>
                  <Link
                    to="/settings"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Manage Subscription
                  </Link>
                </div>
              </div>
            )}

            {subscription?.status === 'past_due' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                    <div>
                      <p className="text-red-800 font-medium">Payment Issue</p>
                      <p className="text-red-600 text-sm">
                        Please update your payment method to continue using TestiFlow
                      </p>
                    </div>
                  </div>
                  <Link
                    to="/settings"
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Update Payment
                  </Link>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                  <p className="text-red-800">{error}</p>
                </div>
              </div>
            )}

            {/* Tab Navigation */}
            <div className="border-b border-gray-200 mb-8">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'dashboard'
                      ? 'border-primary-950 text-primary-950'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('forms')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'forms'
                      ? 'border-primary-950 text-primary-950'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Forms
                </button>
                <button
                  onClick={() => setActiveTab('submissions')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'submissions'
                      ? 'border-primary-950 text-primary-950'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Testimonials
                </button>
              </nav>
            </div>

            {/* Overview Tab */}
            {activeTab === 'dashboard' && (
              <div>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back!</h2>
                  <p className="text-gray-600">Here's what's happening with your testimonials</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">Total</h3>
                      <MessageSquare className="h-5 w-5 text-primary-950" />
                    </div>
                    <div className="text-3xl font-bold text-primary-950">0</div>
                    <div className="text-sm text-gray-600 mt-1">testimonials collected</div>
                  </div>
                  <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 p-6 rounded-xl border border-secondary-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">Published</h3>
                      <CheckCircle className="h-5 w-5 text-secondary-500" />
                    </div>
                    <div className="text-3xl font-bold text-secondary-500">0</div>
                    <div className="text-sm text-gray-600 mt-1">ready to use</div>
                  </div>
                  <div className="bg-gradient-to-br from-accent-50 to-accent-100 p-6 rounded-xl border border-accent-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">This Month</h3>
                      <Download className="h-5 w-5 text-accent-600" />
                    </div>
                    <div className="text-3xl font-bold text-accent-600">0</div>
                    <div className="text-sm text-gray-600 mt-1">new testimonials</div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 p-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">Get Started</h3>
                  <div className="text-center">
                    <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Create your first collection form</h4>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">Start gathering customer testimonials by creating a customized form that you can share with your customers.</p>
                    <button
                      onClick={() => setActiveTab('forms')}
                      className="bg-primary-950 text-white px-6 py-3 rounded-lg hover:bg-primary-900 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      Create Your First Form
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Forms Tab */}
            {activeTab === 'forms' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Forms</h2>
                    <p className="text-gray-600 mt-1">Create and manage testimonial collection forms</p>
                  </div>
                  <button className="bg-primary-950 text-white px-4 py-2 rounded-lg hover:bg-primary-900 transition-colors flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>New Form</span>
                  </button>
                </div>
                
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No forms yet</h3>
                  <p className="text-gray-500 mb-8 max-w-md mx-auto">Create your first testimonial collection form to start gathering customer feedback and build social proof.</p>
                  <button className="bg-primary-950 text-white px-6 py-3 rounded-lg hover:bg-primary-900 transition-all duration-200 flex items-center space-x-2 mx-auto font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                    <Plus className="h-5 w-5" />
                    <span>Create Your First Form</span>
                  </button>
                </div>
              </div>
            )}

            {/* Testimonials Tab */}
            {activeTab === 'submissions' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Testimonials</h2>
                    <p className="text-gray-600 mt-1">Review, approve, and manage customer testimonials</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                      Filter
                    </button>
                    <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                      Export
                    </button>
                  </div>
                </div>
                
                <div className="text-center py-12">
                  <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No testimonials yet</h3>
                  <p className="text-gray-500 mb-8 max-w-md mx-auto">Once you create and share forms, customer testimonials will appear here for review and approval.</p>
                  <button 
                    onClick={() => setActiveTab('forms')}
                    className="bg-primary-950 text-white px-6 py-3 rounded-lg hover:bg-primary-900 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Create a Form First
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};