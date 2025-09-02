import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../hooks/useSubscription';
import { UpgradePrompt } from '../components/UpgradePrompt';
import { TestimonialTagger } from '../components/TestimonialTagger';
import { supabase } from '../lib/supabase';
import { MessageSquare, Star, User, CheckCircle, Clock, X, Download, Trash2, MoreVertical, Eye, Mail, Building, Filter } from 'lucide-react';
import { Alert } from '../components/Alert';
import { ExportModal } from '../components/ExportModal';
import { ExportTestimonial } from '../utils/exportUtils';

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
  image_url: string | null;
  video_url: string | null;
}

interface TestimonialForm {
  id: string;
  title: string;
}

interface FormField {
  id: string;
  label: string;
  field_type: string;
}

interface FormResponse {
  field_id: string;
  value: string;
  field: FormField;
}

interface TestimonialTag {
  id: string;
  name: string;
  color: string;
}
export const Testimonials: React.FC = () => {
  const { user } = useAuth();
  const subscription = useSubscription();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [forms, setForms] = useState<TestimonialForm[]>([]);
  const [tags, setTags] = useState<TestimonialTag[]>([]);
  const [testimonialTags, setTestimonialTags] = useState<Record<string, TestimonialTag[]>>({});
  const [testimonialResponses, setTestimonialResponses] = useState<Record<string, FormResponse[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [tagFilter, setTagFilter] = useState<string>('all');
  const [deletingTestimonial, setDeletingTestimonial] = useState<Testimonial | null>(null);
  const [showActionsFor, setShowActionsFor] = useState<string | null>(null);
  const [viewingTestimonial, setViewingTestimonial] = useState<Testimonial | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  // Close actions menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.actions-menu') && !target.closest('.actions-button')) {
        setShowActionsFor(null);
      }
    };

    if (showActionsFor) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showActionsFor]);
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

      // Get user's tags (always fetch, but only show UI if Premium)
      const { data: tagsData, error: tagsError } = await supabase
        .from('testimonial_tags')
        .select('*')
        .eq('user_id', user.id)
        .order('name');

      if (tagsError) {
        console.error('Error fetching tags:', tagsError);
      } else {
        setTags(tagsData || []);
      }

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

        // Get tag assignments for testimonials if Premium
        if (subscription.limits.canUseTags && testimonialsData && testimonialsData.length > 0) {
          const testimonialIds = testimonialsData.map(t => t.id);
          
          const { data: tagAssignments, error: tagAssignmentsError } = await supabase
            .from('testimonial_tag_assignments')
            .select(`
              testimonial_id,
              tag:testimonial_tags(id, name, color)
            `)
            .in('testimonial_id', testimonialIds);

          if (tagAssignmentsError) {
            console.error('Error fetching tag assignments:', tagAssignmentsError);
          } else if (tagAssignments) {
            // Group tags by testimonial ID
            const tagsByTestimonial: Record<string, TestimonialTag[]> = {};
            tagAssignments.forEach((assignment: any) => {
              if (assignment.tag) {
                if (!tagsByTestimonial[assignment.testimonial_id]) {
                  tagsByTestimonial[assignment.testimonial_id] = [];
                }
                tagsByTestimonial[assignment.testimonial_id].push(assignment.tag);
              }
            });
            setTestimonialTags(tagsByTestimonial);
          }
        }
        // Get custom field responses for all testimonials
        if (testimonialsData && testimonialsData.length > 0) {
          const testimonialIds = testimonialsData.map(t => t.id);
          
          const { data: responsesData, error: responsesError } = await supabase
            .from('form_responses')
            .select(`
              testimonial_id,
              field_id,
              value,
              field:form_fields(id, label, field_type)
            `)
            .in('testimonial_id', testimonialIds);

          if (responsesError) {
            console.error('Error fetching responses:', responsesError);
          } else if (responsesData) {
            // Group responses by testimonial ID
            const responsesByTestimonial: Record<string, FormResponse[]> = {};
            responsesData.forEach((response: any) => {
              if (!responsesByTestimonial[response.testimonial_id]) {
                responsesByTestimonial[response.testimonial_id] = [];
              }
              responsesByTestimonial[response.testimonial_id].push({
                field_id: response.field_id,
                value: response.value,
                field: response.field
              });
            });
            setTestimonialResponses(responsesByTestimonial);
          }
        }
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      setError('Failed to load testimonials');
      setLoading(false);
    }
  };

  const handleStatusChange = async (testimonialId: string, newStatus: 'approved' | 'rejected' | 'pending') => {
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
      setShowActionsFor(null);
    } catch (error) {
      console.error('Error updating testimonial status:', error);
      setError('Failed to update testimonial status');
    }
  };

  const handleDeleteTestimonial = async (testimonialId: string) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', testimonialId);

      if (error) throw error;

      setTestimonials(testimonials.filter(t => t.id !== testimonialId));
      setDeletingTestimonial(null);
      setShowActionsFor(null);
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      setError('Failed to delete testimonial');
    }
  };

  const getFormTitle = (formId: string) => {
    const form = forms.find(f => f.id === formId);
    return form?.title || 'Unknown Form';
  };

  const getFilteredTestimonials = () => {
    let filtered = testimonials.filter(t => 
      filter === 'all' || t.status === filter
    );

    // Apply tag filter if Premium and tag filter is set
    if (subscription.limits.canUseTags && tagFilter !== 'all') {
      filtered = filtered.filter(t => {
        const testimonialTagList = testimonialTags[t.id] || [];
        return testimonialTagList.some(tag => tag.id === tagFilter);
      });
    }
    return filtered;
  };

  const prepareExportData = (): ExportTestimonial[] => {
    return getFilteredTestimonials().map(testimonial => ({
      id: testimonial.id,
      name: testimonial.name,
      email: testimonial.email,
      company: testimonial.company,
      message: testimonial.message,
      rating: testimonial.rating,
      status: testimonial.status,
      submitted_at: testimonial.submitted_at,
      form_title: getFormTitle(testimonial.form_id),
      custom_responses: testimonialResponses[testimonial.id]?.reduce((acc, response) => {
        acc[response.field.label] = response.value;
        return acc;
      }, {} as Record<string, string>)
    }));
  };

  const renderCustomFieldValue = (response: FormResponse) => {
    const { field, value } = response;
    
    switch (field.field_type) {
      case 'rating':
        const rating = parseInt(value) || 0;
        return (
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }`}
              />
            ))}
            <span className="text-sm text-gray-600 ml-2">({rating}/5)</span>
          </div>
        );
      case 'checkbox':
        const selectedOptions = value.split(',').filter(v => v.trim());
        return (
          <div className="flex flex-wrap gap-1">
            {selectedOptions.map((option, index) => (
              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {option.trim()}
              </span>
            ))}
          </div>
        );
      case 'url':
        return (
          <a 
            href={value} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline text-sm"
          >
            {value}
          </a>
        );
      case 'email':
        return (
          <a 
            href={`mailto:${value}`}
            className="text-blue-600 hover:text-blue-800 underline text-sm"
          >
            {value}
          </a>
        );
      default:
        return <span className="text-sm text-gray-700">{value}</span>;
    }
  };

  const filteredTestimonials = getFilteredTestimonials();

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
              <div className="flex space-x-2 items-center">
                {/* Tag Filter - Premium only */}
                {subscription.limits.canUseTags && tags.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <Filter className="h-4 w-4 text-gray-400" />
                    <select
                      value={tagFilter}
                      onChange={(e) => setTagFilter(e.target.value)}
                      className="border border-gray-300 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                      <option value="all">All Tags</option>
                      {tags.map((tag) => (
                        <option key={tag.id} value={tag.id}>
                          {tag.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
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
                <button 
                  onClick={() => setShowExportModal(true)}
                  className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </button>
              </div>
            </div>

            {/* Usage Warning for Standard Plan */}
            {subscription.plan === 'standard' && subscription.currentUsage.testimonialCount >= 20 && (
              <div className="mb-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-800 font-medium">
                        You're approaching your limit
                      </p>
                      <p className="text-yellow-700 text-sm">
                        {subscription.currentUsage.testimonialCount}/25 testimonials used. Upgrade to Premium for unlimited testimonials.
                      </p>
                    </div>
                    <button
                      onClick={() => window.location.href = '/get-started'}
                      className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium"
                    >
                      Manage Subscription
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* At Limit Warning for Standard Plan */}
            {subscription.plan === 'standard' && subscription.currentUsage.testimonialCount >= 25 && (
              <div className="mb-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-800 font-medium">
                        You've reached your testimonial limit
                      </p>
                      <p className="text-red-700 text-sm">
                        25/25 testimonials used. New submissions will be blocked until you upgrade to Premium.
                      </p>
                    </div>
                    <button
                      onClick={() => window.location.href = '/get-started'}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                    >
                      Manage Subscription
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Standard Plan Tag Restriction Notice */}
            {!subscription.limits.canUseTags && tags.length > 0 && (
              <div className="mb-6">
                <UpgradePrompt 
                  feature="Tag Organization"
                  description="You have tags created but need Premium to assign them to testimonials and use filtering."
                  inline
                />
              </div>
            )}

            {error && (
              <div className="mb-6">
                <Alert
                  type="error"
                  message={error}
                  onClose={() => setError(null)}
                />
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

            {/* Testimonials Grid */}
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
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredTestimonials.map((testimonial) => {
                  const customResponses = testimonialResponses[testimonial.id] || [];
                  const hasCustomFields = customResponses.length > 0;

                  return (
                    <div key={testimonial.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200 relative">
                      {/* Status Badge */}
                      <div className="absolute top-4 right-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          testimonial.status === 'approved' 
                            ? 'bg-secondary-100 text-secondary-800' 
                            : testimonial.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {testimonial.status}
                        </span>
                      </div>

                      {/* Customer Info */}
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-primary-950" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">{testimonial.name}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {testimonial.email}
                          </div>
                          {testimonial.company && (
                            <div className="text-sm text-gray-500 flex items-center">
                              <Building className="h-3 w-3 mr-1" />
                              {testimonial.company}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center space-x-2 mb-4">
                        <div className="flex">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">({testimonial.rating}/5)</span>
                      </div>

                      {/* Message Preview */}
                      <div className="mb-4">
                        <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                          "{testimonial.message}"
                        </p>
                        
                        {/* Media Indicators */}
                        {(testimonial.image_url || testimonial.video_url) && (
                          <div className="flex items-center space-x-2 mt-3">
                            {testimonial.image_url && (
                              <div className="flex items-center space-x-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs">
                                <Eye className="h-3 w-3" />
                                <span>Image</span>
                              </div>
                            )}
                            {testimonial.video_url && (
                              <div className="flex items-center space-x-1 bg-purple-50 text-purple-700 px-2 py-1 rounded-full text-xs">
                                <Eye className="h-3 w-3" />
                                <span>Video</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Custom Fields Indicator */}
                      {hasCustomFields && (
                        <div className="mb-4">
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <div className="text-xs text-blue-800 font-medium">
                              +{customResponses.length} additional response{customResponses.length !== 1 ? 's' : ''}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Tags Display */}
                      {subscription.limits.canUseTags ? (
                        testimonialTags[testimonial.id]?.length > 0 && (
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-1">
                            {testimonialTags[testimonial.id].map((tag) => (
                              <span
                                key={tag.id}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                                style={{ 
                                  backgroundColor: `${tag.color}20`,
                                  border: `1px solid ${tag.color}`,
                                  color: tag.color
                                }}
                              >
                                {tag.name}
                              </span>
                            ))}
                          </div>
                        </div>
                        )
                      ) : (
                        testimonialTags[testimonial.id]?.length > 0 && (
                          <div className="mb-4">
                            <UpgradePrompt 
                              feature="Tag Organization"
                              description="Upgrade to Premium to organize testimonials with tags"
                              inline
                            />
                          </div>
                        )
                      )}
                      {/* Form & Date */}
                      <div className="text-xs text-gray-500 mb-4 space-y-1">
                        <div>From: {getFormTitle(testimonial.form_id)}</div>
                        <div>Submitted: {new Date(testimonial.submitted_at).toLocaleDateString()}</div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <button
                          onClick={() => setViewingTestimonial(testimonial)}
                          className="text-primary-950 hover:text-primary-800 text-sm font-medium flex items-center space-x-1 transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                          <span>View Full</span>
                        </button>

                        <div className="flex space-x-2">
                          {testimonial.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleStatusChange(testimonial.id, 'approved')}
                                className="bg-secondary-100 text-secondary-800 hover:bg-secondary-200 px-3 py-1 rounded-md text-xs font-medium transition-colors"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleStatusChange(testimonial.id, 'rejected')}
                                className="bg-red-100 text-red-800 hover:bg-red-200 px-3 py-1 rounded-md text-xs font-medium transition-colors"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          
                          <div className="relative">
                            <button
                              className="actions-button p-1 text-gray-400 hover:text-gray-600 transition-colors"
                              onClick={() => setShowActionsFor(showActionsFor === testimonial.id ? null : testimonial.id)}
                            >
                              <MoreVertical className="h-4 w-4" />
                            </button>
                            
                            {showActionsFor === testimonial.id && (
                              <div className="actions-menu absolute right-0 bottom-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-40">
                                <div className="py-1">
                                  {testimonial.status !== 'approved' && (
                                    <button
                                      onClick={() => handleStatusChange(testimonial.id, 'approved')}
                                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-secondary-50 hover:text-secondary-700 flex items-center space-x-2"
                                    >
                                      <CheckCircle className="h-4 w-4" />
                                      <span>Approve</span>
                                    </button>
                                  )}
                                  {testimonial.status !== 'rejected' && (
                                    <button
                                      onClick={() => handleStatusChange(testimonial.id, 'rejected')}
                                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 flex items-center space-x-2"
                                    >
                                      <X className="h-4 w-4" />
                                      <span>Reject</span>
                                    </button>
                                  )}
                                  {testimonial.status !== 'pending' && (
                                    <button
                                      onClick={() => handleStatusChange(testimonial.id, 'pending')}
                                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-700 flex items-center space-x-2"
                                    >
                                      <Clock className="h-4 w-4" />
                                      <span>Mark as Pending</span>
                                    </button>
                                  )}
                                  <hr className="my-1" />
                                  <button
                                    onClick={() => {
                                      setDeletingTestimonial(testimonial);
                                      setShowActionsFor(null);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    <span>Delete</span>
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Full Testimonial View Modal */}
            {viewingTestimonial && (
              <div 
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                onClick={() => setViewingTestimonial(null)}
              >
                <div 
                  className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Modal Header */}
                  <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Testimonial Details</h2>
                    <button
                      onClick={() => setViewingTestimonial(null)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Modal Content */}
                  <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                    {/* Customer Info */}
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center">
                        <User className="h-8 w-8 text-primary-950" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xl font-semibold text-gray-900">{viewingTestimonial.name}</div>
                        <div className="text-gray-600 flex items-center space-x-1">
                          <Mail className="h-4 w-4" />
                          <span>{viewingTestimonial.email}</span>
                        </div>
                        {viewingTestimonial.company && (
                          <div className="text-gray-600 flex items-center space-x-1">
                            <Building className="h-4 w-4" />
                            <span>{viewingTestimonial.company}</span>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          viewingTestimonial.status === 'approved' 
                            ? 'bg-secondary-100 text-secondary-800' 
                            : viewingTestimonial.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {viewingTestimonial.status}
                        </span>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Overall Rating</h3>
                      <div className="flex items-center space-x-2">
                        <div className="flex">
                          {[...Array(viewingTestimonial.rating)].map((_, i) => (
                            <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <span className="text-lg font-semibold text-gray-900">({viewingTestimonial.rating}/5)</span>
                      </div>
                    </div>

                    {/* Main Testimonial */}
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Testimonial</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-800 leading-relaxed italic">
                          "{viewingTestimonial.message}"
                        </p>
                      </div>
                    </div>

                    {/* Media Content */}
                    {(viewingTestimonial.image_url || viewingTestimonial.video_url) && (
                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-gray-700 mb-3">Media</h3>
                        <div className="space-y-4">
                          {viewingTestimonial.image_url && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-600 mb-2">Image</h4>
                              <img 
                                src={viewingTestimonial.image_url} 
                                alt="Testimonial" 
                                className="w-full max-w-md rounded-lg border border-gray-200 shadow-sm"
                              />
                            </div>
                          )}
                          {viewingTestimonial.video_url && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-600 mb-2">Video</h4>
                              <video 
                                src={viewingTestimonial.video_url} 
                                className="w-full max-w-md rounded-lg border border-gray-200 shadow-sm"
                                controls
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Custom Field Responses */}
                    {testimonialResponses[viewingTestimonial.id] && testimonialResponses[viewingTestimonial.id].length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-gray-700 mb-3">Additional Responses</h3>
                        <div className="space-y-4">
                          {testimonialResponses[viewingTestimonial.id].map((response) => (
                            <div key={response.field_id} className="bg-gray-50 rounded-lg p-4">
                              <div className="text-sm font-medium text-gray-700 mb-2">
                                {response.field.label}
                              </div>
                              <div>
                                {renderCustomFieldValue(response)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tags Section */}
                    {subscription.limits.canUseTags && (
                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-gray-700 mb-3">Tags</h3>
                        {tags.length === 0 ? (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                            <div className="text-sm text-yellow-800">
                              <strong>No tags available.</strong> 
                              <a href="/tags" className="text-yellow-900 underline hover:text-yellow-700 ml-1">
                                Create tags first
                              </a> to organize testimonials.
                            </div>
                          </div>
                        ) : (
                          <TestimonialTagger 
                            testimonialId={viewingTestimonial.id}
                            onTagsChange={fetchData}
                          />
                        )}
                      </div>
                    )}

                    {/* Form & Date Info */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Form:</span>
                          <div className="font-medium text-gray-900">{getFormTitle(viewingTestimonial.form_id)}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Submitted:</span>
                          <div className="font-medium text-gray-900">
                            {new Date(viewingTestimonial.submitted_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      {viewingTestimonial.status !== 'approved' && (
                        <button
                          onClick={() => {
                            handleStatusChange(viewingTestimonial.id, 'approved');
                            setViewingTestimonial(null);
                          }}
                          className="flex-1 bg-secondary-500 text-white py-3 px-4 rounded-lg hover:bg-secondary-600 transition-colors font-medium flex items-center justify-center space-x-2"
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span>Approve</span>
                        </button>
                      )}
                      {viewingTestimonial.status !== 'rejected' && (
                        <button
                          onClick={() => {
                            handleStatusChange(viewingTestimonial.id, 'rejected');
                            setViewingTestimonial(null);
                          }}
                          className="flex-1 bg-red-500 text-white py-3 px-4 rounded-lg hover:bg-red-600 transition-colors font-medium flex items-center justify-center space-x-2"
                        >
                          <X className="h-4 w-4" />
                          <span>Reject</span>
                        </button>
                      )}
                      {viewingTestimonial.status !== 'pending' && (
                        <button
                          onClick={() => {
                            handleStatusChange(viewingTestimonial.id, 'pending');
                            setViewingTestimonial(null);
                          }}
                          className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors font-medium flex items-center justify-center space-x-2"
                        >
                          <Clock className="h-4 w-4" />
                          <span>Mark as Pending</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Delete Confirmation Modal */}
            {deletingTestimonial && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Delete Testimonial</h2>
                  <p className="text-gray-600 mb-6">
                    Are you sure you want to delete the testimonial from <strong>{deletingTestimonial.name}</strong>? 
                    This action cannot be undone.
                  </p>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex">
                        {[...Array(deletingTestimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">by {deletingTestimonial.name}</span>
                    </div>
                    <p className="text-sm text-gray-700 italic">"{deletingTestimonial.message}"</p>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleDeleteTestimonial(deletingTestimonial.id)}
                      className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors font-medium"
                    >
                      Delete Testimonial
                    </button>
                    <button
                      onClick={() => setDeletingTestimonial(null)}
                      className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Export Modal */}
            {showExportModal && (
              <ExportModal
                testimonials={prepareExportData()}
                onClose={() => setShowExportModal(false)}
                onSuccess={(message) => {
                  setSuccess(message);
                  setShowExportModal(false);
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};