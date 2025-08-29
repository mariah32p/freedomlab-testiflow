import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { MessageSquare, Star, User, CheckCircle, Clock, X, Filter, Download } from 'lucide-react';
import { Alert } from '../components/Alert';

interface Testimonial {
  id: string;
  name: string;
  email: string;
  company: string | null;
  message: string;
  rating: number;
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
  form_id: string;
}

interface TestimonialForm {
  id: string;
  title: string;
}

export const Testimonials: React.FC = () => {
  const { user } = useAuth();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [forms, setForms] = useState<TestimonialForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    try {
      setError(null);
      
      // Get user's forms
      const { data: formsData, error: formsError } = await supabase
        .from('testimonial_forms')
        .select('id, title')
        .eq('user_id', user.id);

      if (formsError) throw formsError;
      setForms(formsData || []);

      if (formsData && formsData.length > 0) {
        const formIds = formsData.map(f => f.id);
        
        // Get testimonials for user's forms
        const { data: testimonialsData, error: testimonialsError } = await supabase
          .from('testimonials')
          .select('*')
          .in('form_id', formIds)
          .order('submitted_at', { ascending: false });

        if (testimonialsError) throw testimonialsError;
        setTestimonials(testimonialsData || []);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      setError('Failed to load testimonials');
      setLoading(false);
    }
  };

  const handleStatusChange = async (testimonialId: string, newStatus: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .update({ 
          status: newStatus,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', testimonialId);

      if (error) throw error;

      setTestimonials(testimonials.map(t => 
        t.id === testimonialId ? { ...t, status: newStatus } : t
      ));
    } catch (error) {
      console.error('Error updating testimonial status:', error);
      setError('Failed to update testimonial status');
    }
  };

  const getFormTitle = (formId: string) => {
    const form = forms.find(f => f.id === formId);
    return form?.title || 'Unknown Form';
  };

  const filteredTestimonials = testimonials.filter(t => 
    filter === 'all' || t.status === filter
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-950"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Testimonials</h1>
                <p className="text-gray-600 mt-2">Review, approve, and manage customer testimonials</p>
              </div>
              <div className="flex space-x-2">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                  className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
                <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-6">
                <Alert
                  type="error"
                  message={error}
                  onClose={() => setError(null)}
                />
              </div>
            )}

            {/* Testimonials List */}
            {filteredTestimonials.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {filter === 'all' ? 'No testimonials yet' : `No ${filter} testimonials`}
                </h3>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                  {filter === 'all' 
                    ? 'Once you create and share forms, customer testimonials will appear here for review and approval.'
                    : `No testimonials with ${filter} status found.`
                  }
                </p>
                {filter === 'all' && (
                  <button 
                    onClick={() => window.location.href = '/forms'}
                    className="bg-primary-950 text-white px-6 py-3 rounded-lg hover:bg-primary-900 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Create a Form First
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTestimonials.map((testimonial) => (
                  <div key={testimonial.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{testimonial.name}</div>
                          <div className="text-sm text-gray-500">{testimonial.email}</div>
                          {testimonial.company && (
                            <div className="text-sm text-gray-500">{testimonial.company}</div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="flex">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          testimonial.status === 'approved' 
                            ? 'bg-secondary-100 text-secondary-800' 
                            : testimonial.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {testimonial.status}
                        </span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-gray-700 leading-relaxed">"{testimonial.message}"</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        <div>From: {getFormTitle(testimonial.form_id)}</div>
                        <div>Submitted: {new Date(testimonial.submitted_at).toLocaleDateString()}</div>
                      </div>
                      
                      {testimonial.status === 'pending' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleStatusChange(testimonial.id, 'rejected')}
                            className="px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded-md text-sm font-medium transition-colors flex items-center space-x-1"
                          >
                            <X className="h-3 w-3" />
                            <span>Reject</span>
                          </button>
                          <button
                            onClick={() => handleStatusChange(testimonial.id, 'approved')}
                            className="px-3 py-1 bg-secondary-100 text-secondary-700 hover:bg-secondary-200 rounded-md text-sm font-medium transition-colors flex items-center space-x-1"
                          >
                            <CheckCircle className="h-3 w-3" />
                            <span>Approve</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};