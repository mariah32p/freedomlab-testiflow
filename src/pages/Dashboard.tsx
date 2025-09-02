import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { MessageSquare, CheckCircle, Clock, AlertCircle, Star, User, Eye } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';

interface RecentTestimonial {
  id: string;
  name: string;
  company: string | null;
  message: string;
  rating: number;
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
  form_title: string;
}

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<any>(null);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    thisMonth: 0
  });
  const [, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentTestimonials, setRecentTestimonials] = useState<RecentTestimonial[]>([]);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

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

          // Get last 30 days instead of just this calendar month
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

          const { count: thisMonthCount } = await supabase
            .from('testimonials')
            .select('*', { count: 'exact', head: true })
            .in('form_id', formIds)
            .gte('submitted_at', thirtyDaysAgo.toISOString());

          setStats({
            total: totalCount || 0,
            approved: approvedCount || 0,
            thisMonth: thisMonthCount || 0
          });

          // Get recent testimonials with form titles
          const { data: recentData } = await supabase
            .from('testimonials')
            .select(`
              id,
              name,
              company,
              message,
              rating,
              status,
              submitted_at,
              form_id,
              testimonial_forms!inner(title)
            `)
            .in('form_id', formIds)
            .order('submitted_at', { ascending: false })
            .limit(5);

          if (recentData) {
            const formattedRecent: RecentTestimonial[] = recentData.map((item: any) => ({
              id: item.id,
              name: item.name,
              company: item.company,
              message: item.message,
              rating: item.rating,
              status: item.status,
              submitted_at: item.submitted_at,
              form_title: item.testimonial_forms.title
            }));
            setRecentTestimonials(formattedRecent);
          }
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

  const handleQuickStatusChange = async (testimonialId: string, newStatus: 'approved' | 'rejected') => {
    setUpdatingStatus(testimonialId);
    try {
      const { error } = await supabase
        .from('testimonials')
        .update({ 
          status: newStatus,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', testimonialId);

      if (error) throw error;

      // Update local state
      setRecentTestimonials(prev => 
        prev.map(t => t.id === testimonialId ? { ...t, status: newStatus } : t)
      );

      // Update stats
      if (newStatus === 'approved') {
        setStats(prev => ({ ...prev, approved: prev.approved + 1 }));
      }
    } catch (error) {
      console.error('Error updating testimonial status:', error);
      setError('Failed to update testimonial status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
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
                  <Clock className="h-5 w-5 text-accent-600" />
                </div>
                <div className="text-3xl font-bold text-accent-600">{stats.thisMonth}</div>
                <div className="text-sm text-gray-600 mt-1">last 30 days</div>
              </div>
            </div>

            {/* Recent Activity Section */}
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Recent Activity</h3>
                {recentTestimonials.length > 0 && (
                  <Link
                    to="/testimonials"
                   onClick={() => window.scrollTo(0, 0)}
                    className="text-primary-950 hover:text-primary-800 text-sm font-medium"
                  >
                    View All →
                  </Link>
                )}
              </div>

              {stats.total === 0 ? (
                <div className="text-center py-8">
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
              ) : recentTestimonials.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No recent activity</h4>
                  <p className="text-gray-500 mb-6">Recent testimonial submissions will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentTestimonials.map((testimonial) => (
                    <div key={testimonial.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-primary-950" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{testimonial.name}</div>
                            <div className="text-sm text-gray-500">{testimonial.company || 'No company'}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            testimonial.status === 'approved' 
                              ? 'bg-secondary-100 text-secondary-800' 
                              : testimonial.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {testimonial.status}
                          </span>
                          <span className="text-xs text-gray-500">{getTimeAgo(testimonial.submitted_at)}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 mb-3">
                        <div className="flex">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">({testimonial.rating}/5)</span>
                      </div>

                      <p className="text-gray-700 text-sm leading-relaxed mb-3 line-clamp-2">
                        "{testimonial.message}"
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                          From: {testimonial.form_title}
                        </div>
                        <div className="flex space-x-2">
                          {testimonial.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleQuickStatusChange(testimonial.id, 'approved')}
                                disabled={updatingStatus === testimonial.id}
                                className="bg-secondary-100 text-secondary-800 hover:bg-secondary-200 px-3 py-1 rounded-md text-xs font-medium transition-colors disabled:opacity-50"
                              >
                                {updatingStatus === testimonial.id ? '...' : 'Approve'}
                              </button>
                              <button
                                onClick={() => handleQuickStatusChange(testimonial.id, 'rejected')}
                                disabled={updatingStatus === testimonial.id}
                                className="bg-red-100 text-red-800 hover:bg-red-200 px-3 py-1 rounded-md text-xs font-medium transition-colors disabled:opacity-50"
                              >
                                {updatingStatus === testimonial.id ? '...' : 'Reject'}
                              </button>
                            </>
                          )}
                          <Link
                            to="/testimonials"
                            className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1 rounded-md text-xs font-medium transition-colors flex items-center space-x-1"
                          >
                            <Eye className="h-3 w-3" />
                            <span>View</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}

                  {recentTestimonials.length >= 5 && (
                    <div className="text-center pt-4">
                      <Link
                        to="/testimonials"
                       onClick={() => window.scrollTo(0, 0)}
                        className="text-primary-950 hover:text-primary-800 text-sm font-medium"
                      >
                        View all testimonials →
                      </Link>
                    </div>
                  )}
                  </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};