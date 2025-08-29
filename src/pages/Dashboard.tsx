import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, MessageSquare, CheckCircle, Download, Plus, FileText, Clock, AlertCircle } from 'lucide-react';
import { TestiFlowIcon } from '../components/TestiFlowIcon';
import { APP_CONFIG } from '../config/app';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<any>(null);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    thisMonth: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
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

        // Get testimonial stats
        const { data: formsData } = await supabase
          .from('testimonial_forms')
          .select('id')
          .eq('user_id', user.id);

        if (formsData && formsData.length > 0) {
          const formIds = formsData.map(f => f.id);
          
          // Get total testimonials
          const { count: totalCount } = await supabase
            .from('testimonials')
            .select('*', { count: 'exact', head: true })
            .in('form_id', formIds);

          // Get approved testimonials
          const { count: approvedCount } = await supabase
            .from('testimonials')
            .select('*', { count: 'exact', head: true })
            .in('form_id', formIds)
            .eq('status', 'approved');

          // Get this month's testimonials
          const startOfMonth = new Date();
          startOfMonth.setDate(1);
          startOfMonth.setHours(0, 0, 0, 0);

          const { count: thisMonthCount } = await supabase
            .from('testimonials')
            .select('*', { count: 'exact', head: true })
            .in('form_id', formIds)
            .gte('created_at', startOfMonth.toISOString());

          setStats({
            total: totalCount || 0,
            approved: approvedCount || 0,
            thisMonth: thisMonthCount || 0
          });
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching subscription data:', error);
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };

    fetchData();
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


            {/* Dashboard Content */}
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
                <div className="text-3xl font-bold text-primary-950">{stats.total}</div>
                <div className="text-sm text-gray-600 mt-1">testimonials collected</div>
              </div>
              <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 p-6 rounded-xl border border-secondary-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Approved</h3>
                  <CheckCircle className="h-5 w-5 text-secondary-500" />
                </div>
                <div className="text-3xl font-bold text-secondary-500">{stats.approved}</div>
                <div className="text-sm text-gray-600 mt-1">ready to use</div>
              </div>
              <div className="bg-gradient-to-br from-accent-50 to-accent-100 p-6 rounded-xl border border-accent-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">This Month</h3>
                  <Download className="h-5 w-5 text-accent-600" />
                </div>
                <div className="text-3xl font-bold text-accent-600">{stats.thisMonth}</div>
                <div className="text-sm text-gray-600 mt-1">new testimonials</div>
              </div>
            </div>

            {stats.total === 0 ? (
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">Get Started</h3>
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Create your first collection form</h4>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">Start gathering customer testimonials by creating a customized form that you can share with your customers.</p>
                  <button
                    onClick={() => window.location.href = '/forms'}
                    className="bg-primary-950 text-white px-6 py-3 rounded-lg hover:bg-primary-900 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Create Your First Form
                  </button>
                  </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">Recent Activity</h3>
                <div className="text-center">
                  <CheckCircle className="h-12 w-12 text-secondary-500 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Great progress!</h4>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    You've collected {stats.total} testimonial{stats.total !== 1 ? 's' : ''} so far. 
                    {stats.approved > 0 && ` ${stats.approved} ${stats.approved === 1 ? 'is' : 'are'} approved and ready to use.`}
                  </p>
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={() => window.location.href = '/testimonials'}
                      className="bg-secondary-500 text-white px-6 py-3 rounded-lg hover:bg-secondary-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      View Testimonials
                    </button>
                    <button
                      onClick={() => window.location.href = '/forms'}
                      className="bg-primary-950 text-white px-6 py-3 rounded-lg hover:bg-primary-900 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      Create Another Form
                    </button>
                  </div>
                  </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};