import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription, canCreateForm } from '../hooks/useSubscription';
import { UpgradePrompt } from '../components/UpgradePrompt';
import { supabase } from '../lib/supabase';
import { Plus, Edit, Trash2, ExternalLink, Copy, Eye, Settings, X, Calendar, ToggleLeft, ToggleRight, FileText } from 'lucide-react';
import { Alert } from '../components/Alert';
import { FormBuilder } from '../components/FormBuilder';

interface TestimonialForm {
  id: string;
  title: string;
  description: string;
  thank_you_message: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  allow_image_uploads?: boolean;
  allow_video_uploads?: boolean;
  max_image_size_mb?: number;
  max_video_size_mb?: number;
  custom_field_count?: number;
}

export const Forms: React.FC = () => {
  const { user } = useAuth();
  const subscription = useSubscription();
  const [forms, setForms] = useState<TestimonialForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingForm, setEditingForm] = useState<TestimonialForm | null>(null);
  const [deletingForm, setDeletingForm] = useState<TestimonialForm | null>(null);
  const [customizingForm, setCustomizingForm] = useState<TestimonialForm | null>(null);
  const [viewingForm, setViewingForm] = useState<TestimonialForm | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: 'Share Your Experience',
    description: "We'd love to hear about your experience with us!",
    thank_you_message: 'Thank you for your testimonial!',
    allow_image_uploads: true,
    allow_video_uploads: false,
    max_image_size_mb: 10,
    max_video_size_mb: 100
  });

  useEffect(() => {
    fetchForms();
  }, [user]);

  const fetchForms = async () => {
    if (!user) return;

    try {
      const { data: formsData, error } = await supabase
        .from('testimonial_forms')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Get custom field counts for each form
      const formsWithCounts = await Promise.all(
        (formsData || []).map(async (form) => {
          const { count } = await supabase
            .from('form_fields')
            .select('*', { count: 'exact', head: true })
            .eq('form_id', form.id);
          
          return {
            ...form,
            custom_field_count: count || 0
          };
        })
      );
      
      setForms(formsWithCounts);
    } catch (error) {
      console.error('Error fetching forms:', error);
      setError('Failed to load forms');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setError(null);
      const { data, error } = await supabase
        .from('testimonial_forms')
        .insert([{
          user_id: user.id,
          title: formData.title,
          description: formData.description,
          thank_you_message: formData.thank_you_message,
          is_active: true,
          allow_image_uploads: formData.allow_image_uploads,
          allow_video_uploads: formData.allow_video_uploads,
          max_image_size_mb: formData.max_image_size_mb,
          max_video_size_mb: formData.max_video_size_mb
        }])
        .select()
        .single();

      if (error) throw error;

      setForms([data, ...forms]);
      setShowCreateForm(false);
      setFormData({
        title: 'Share Your Experience',
        description: "We'd love to hear about your experience with us!",
        thank_you_message: 'Thank you for your testimonial!',
        allow_image_uploads: true,
        allow_video_uploads: false,
        max_image_size_mb: 10,
        max_video_size_mb: 100
      });
      setSuccess('Form created successfully!');
    } catch (error) {
      console.error('Error creating form:', error);
      setError('Failed to create form');
    }
  };

  const handleUpdateForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !editingForm) return;

    try {
      setError(null);
      const { data, error } = await supabase
        .from('testimonial_forms')
        .update({
          title: formData.title,
          description: formData.description,
          thank_you_message: formData.thank_you_message,
          allow_image_uploads: formData.allow_image_uploads,
          allow_video_uploads: formData.allow_video_uploads,
          max_image_size_mb: formData.max_image_size_mb,
          max_video_size_mb: formData.max_video_size_mb
        })
        .eq('id', editingForm.id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setForms(forms.map(form => form.id === editingForm.id ? data : form));
      setEditingForm(null);
      setShowCreateForm(false);
      setFormData({
        title: 'Share Your Experience',
        description: "We'd love to hear about your experience with us!",
        thank_you_message: 'Thank you for your testimonial!',
        allow_image_uploads: true,
        allow_video_uploads: false,
        max_image_size_mb: 10,
        max_video_size_mb: 100
      });
      setSuccess('Form updated successfully!');
    } catch (error) {
      console.error('Error updating form:', error);
      setError('Failed to update form');
    }
  };

  const handleToggleActive = async (form: TestimonialForm) => {
    try {
      const { error } = await supabase
        .from('testimonial_forms')
        .update({ is_active: !form.is_active })
        .eq('id', form.id)
        .eq('user_id', user!.id);

      if (error) throw error;

      setForms(forms.map(f => 
        f.id === form.id ? { ...f, is_active: !f.is_active } : f
      ));
      setSuccess(`Form ${!form.is_active ? 'activated' : 'deactivated'} successfully!`);
    } catch (error) {
      console.error('Error toggling form status:', error);
      setError('Failed to update form status');
    }
  };

  const handleDeleteForm = async (formId: string) => {
    try {
      const { error } = await supabase
        .from('testimonial_forms')
        .delete()
        .eq('id', formId)
        .eq('user_id', user!.id);

      if (error) throw error;

      setForms(forms.filter(f => f.id !== formId));
      setDeletingForm(null);
      setSuccess('Form deleted successfully!');
    } catch (error) {
      console.error('Error deleting form:', error);
      setError('Failed to delete form');
    }
  };

  const getFormUrl = (formId: string) => {
    return `${window.location.origin}/submit/${formId}`;
  };

  const copyFormUrl = (formId: string) => {
    navigator.clipboard.writeText(getFormUrl(formId)).then(() => {
      setSuccess('Form link copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy URL:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = getFormUrl(formId);
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setSuccess('Form link copied to clipboard!');
    });
  };

  const startEdit = (form: TestimonialForm) => {
    setEditingForm(form);
    setFormData({
      title: form.title,
      description: form.description || '',
      thank_you_message: form.thank_you_message || '',
      allow_image_uploads: form.allow_image_uploads ?? true,
      allow_video_uploads: form.allow_video_uploads ?? false,
      max_image_size_mb: form.max_image_size_mb ?? 10,
      max_video_size_mb: form.max_video_size_mb ?? 100
    });
    setShowCreateForm(true);
  };

  const cancelEdit = () => {
    setEditingForm(null);
    setShowCreateForm(false);
    setFormData({
      title: 'Share Your Experience',
      description: "We'd love to hear about your experience with us!",
      thank_you_message: 'Thank you for your testimonial!',
      allow_image_uploads: true,
      allow_video_uploads: false,
      max_image_size_mb: 10,
      max_video_size_mb: 100
    });
  };

  const handleCreateFormClick = () => {
    if (!canCreateForm(subscription)) {
      setError(`You've reached the limit of ${subscription.limits.maxForms} form${subscription.limits.maxForms !== 1 ? 's' : ''} for your current plan. Upgrade to Premium for unlimited forms.`);
      return;
    }
    setShowCreateForm(true);
  };

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
                <h1 className="text-3xl font-bold text-gray-900">Forms</h1>
                <p className="text-gray-600 mt-2">Create and manage testimonial collection forms</p>
              </div>
              <button
                onClick={handleCreateFormClick}
                className="bg-primary-950 text-white px-6 py-3 rounded-lg hover:bg-primary-900 transition-all duration-200 flex items-center space-x-2 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus className="h-5 w-5" />
                <span>New Form</span>
              </button>
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

            {success && (
              <div className="mb-6">
                <Alert
                  type="success"
                  message={success}
                  onClose={() => setSuccess(null)}
                />
              </div>
            )}

            {/* Create/Edit Form Modal */}
            {showCreateForm && (
              <div 
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                onClick={() => cancelEdit()}
              >
                <div 
                  className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900">
                      {editingForm ? 'Edit Form' : 'Create New Form'}
                    </h2>
                    <button
                      onClick={cancelEdit}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <form onSubmit={editingForm ? handleUpdateForm : handleCreateForm} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Form Title
                        </label>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Thank You Message
                        </label>
                        <input
                          type="text"
                          value={formData.thank_you_message}
                          onChange={(e) => setFormData({ ...formData, thank_you_message: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    {/* Media Upload Settings */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-blue-900 mb-3">📸 Media Upload Options</h4>
                      
                      <div className="space-y-4">
                        {/* Image Uploads */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="allow_images"
                              checked={formData.allow_image_uploads}
                              onChange={(e) => setFormData({ ...formData, allow_image_uploads: e.target.checked })}
                              className="rounded border-gray-300 text-primary-950 focus:ring-primary-500"
                            />
                            <label htmlFor="allow_images" className="text-sm font-medium text-gray-700">
                              Allow image uploads
                            </label>
                          </div>
                          {formData.allow_image_uploads && (
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-gray-500">Max size:</span>
                              <select
                                value={formData.max_image_size_mb}
                                onChange={(e) => setFormData({ ...formData, max_image_size_mb: parseInt(e.target.value) })}
                                className="text-xs border border-gray-300 rounded px-2 py-1"
                              >
                                <option value={5}>5MB</option>
                                <option value={10}>10MB</option>
                                <option value={20}>20MB</option>
                                <option value={50}>50MB</option>
                              </select>
                            </div>
                          )}
                        </div>

                        {/* Video Uploads */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="allow_videos"
                              checked={formData.allow_video_uploads}
                              onChange={(e) => setFormData({ ...formData, allow_video_uploads: e.target.checked })}
                              className="rounded border-gray-300 text-primary-950 focus:ring-primary-500"
                              disabled={!subscription.limits.canUseVideoUploads}
                            />
                            <label htmlFor="allow_videos" className="text-sm font-medium text-gray-700">
                              Allow video uploads
                              {!subscription.limits.canUseVideoUploads && (
                                <span className="text-accent-600 ml-1 text-xs">(Premium)</span>
                              )}
                            </label>
                          </div>
                          {formData.allow_video_uploads && subscription.limits.canUseVideoUploads && (
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-gray-500">Max size:</span>
                              <select
                                value={formData.max_video_size_mb}
                                onChange={(e) => setFormData({ ...formData, max_video_size_mb: parseInt(e.target.value) })}
                                className="text-xs border border-gray-300 rounded px-2 py-1"
                              >
                                <option value={50}>50MB</option>
                                <option value={100}>100MB</option>
                                <option value={200}>200MB</option>
                                <option value={500}>500MB</option>
                              </select>
                            </div>
                          )}
                        </div>
                        
                        {!subscription.limits.canUseVideoUploads && (
                          <div className="mt-2">
                            <UpgradePrompt 
                              feature="Video Testimonials"
                              description="Collect rich video testimonials from customers"
                              inline
                            />
                          </div>
                        )}
                      </div>
                      
                      <p className="text-xs text-blue-700 mt-3">
                        💡 Enable media uploads to collect richer testimonials with photos and videos
                      </p>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <FileText className="h-4 w-4 text-blue-900" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-blue-900 mb-1">💡 Standard vs Custom Fields</h4>
                          <p className="text-sm text-blue-700">
                            Your form includes: <strong>Name</strong> (for attribution), <strong>Email</strong> (contact), <strong>Company</strong> (optional), <strong>Rating</strong> (1-5 stars), and <strong>Testimonial</strong> (main message for marketing). Add custom fields after creation for extra questions.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-3 pt-4">
                      <button
                        type="submit"
                        className="flex-1 bg-primary-950 text-white py-2 px-4 rounded-md hover:bg-primary-900 transition-colors font-medium"
                      >
                        {editingForm ? 'Save Changes' : 'Create Form'}
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Delete Confirmation Modal */}
            {deletingForm && (
              <div 
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                onClick={() => setDeletingForm(null)}
              >
                <div 
                  className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Delete Form</h2>
                    <button
                      onClick={() => setDeletingForm(null)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <p className="text-gray-600 mb-6">
                    Are you sure you want to delete "<strong>{deletingForm.title}</strong>"? 
                    This will also delete all associated testimonials and cannot be undone.
                  </p>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleDeleteForm(deletingForm.id)}
                      className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors font-medium"
                    >
                      Delete Form
                    </button>
                    <button
                      onClick={() => setDeletingForm(null)}
                      className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Forms Grid */}
            {forms.length === 0 ? (
              <div className="text-center py-16">
                {!canCreateForm(subscription) ? (
                  <UpgradePrompt 
                    feature="Multiple Forms"
                    description="Create unlimited testimonial collection forms with different questions and branding for various campaigns."
                  />
                ) : (
                  <>
                    <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Settings className="h-12 w-12 text-primary-950" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-3">Create Your First Form</h3>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg">
                      Start gathering customer testimonials by creating a customized form that you can share with your customers.
                    </p>
                    <button
                      onClick={handleCreateFormClick}
                      className="bg-primary-950 text-white px-8 py-4 rounded-lg hover:bg-primary-900 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-lg"
                    >
                      Create Your First Form
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {forms.map((form) => (
                  <div key={form.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 relative group">
                    {/* Status Toggle */}
                    <div className="absolute top-4 right-4">
                      <button
                        onClick={() => handleToggleActive(form)}
                        className="flex items-center space-x-2 transition-colors"
                        title={form.is_active ? 'Deactivate form' : 'Activate form'}
                      >
                        {form.is_active ? (
                          <ToggleRight className="h-6 w-6 text-secondary-500" />
                        ) : (
                          <ToggleLeft className="h-6 w-6 text-gray-400" />
                        )}
                      </button>
                    </div>

                    {/* Form Header */}
                    <div className="mb-4 pr-8">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 leading-tight">{form.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{form.description}</p>
                    </div>

                    {/* Status Badge */}
                    <div className="mb-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        form.is_active 
                          ? 'bg-secondary-100 text-secondary-800' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          form.is_active ? 'bg-secondary-500' : 'bg-gray-400'
                        }`}></div>
                        {form.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    {/* Form Info */}
                    <div className="mb-6">
                      <div className="flex items-center text-sm text-gray-500 space-x-4">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>Created {new Date(form.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Settings className="h-4 w-4" />
                          <span>{form.custom_field_count || 0} custom field{(form.custom_field_count || 0) !== 1 ? 's' : ''}</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <button
                        onClick={() => setViewingForm(form)}
                        className="text-primary-950 hover:text-primary-800 text-sm font-medium flex items-center space-x-1 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View Details</span>
                      </button>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => copyFormUrl(form.id)}
                          className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1 rounded-md text-sm font-medium transition-colors flex items-center space-x-1"
                          title="Copy shareable link"
                        >
                          <Copy className="h-3 w-3" />
                          <span>Copy</span>
                        </button>
                        <a
                          href={getFormUrl(form.id)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-gray-50 text-gray-600 hover:bg-gray-100 px-3 py-1 rounded-md text-sm font-medium transition-colors flex items-center space-x-1"
                          title="Preview form"
                        >
                          <ExternalLink className="h-3 w-3" />
                          <span>Preview</span>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* View Form Details Modal */}
            {viewingForm && (
              <div 
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                onClick={() => setViewingForm(null)}
              >
                <div 
                  className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Modal Header */}
                  <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Form Details</h2>
                    <button
                      onClick={() => setViewingForm(null)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Modal Content */}
                  <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                    <>
                    {/* Form Info */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-2xl font-semibold text-gray-900">{viewingForm.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          viewingForm.is_active 
                            ? 'bg-secondary-100 text-secondary-800' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {viewingForm.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                          <p className="text-gray-600 text-sm">{viewingForm.description}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Thank You Message</h4>
                          <p className="text-gray-600 text-sm">{viewingForm.thank_you_message}</p>
                        </div>
                      </div>

                      <div className="bg-blue-50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-blue-900 mb-2">📋 Shareable Form Link</h4>
                        <div className="flex items-center space-x-2">
                          <code className="flex-1 bg-white px-3 py-2 rounded border text-sm text-gray-700 font-mono">
                            {getFormUrl(viewingForm.id)}
                          </code>
                          <button
                            onClick={() => copyFormUrl(viewingForm.id)}
                            className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition-colors flex items-center space-x-1"
                          >
                            <Copy className="h-4 w-4" />
                            <span>Copy</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Combined Settings Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {/* Form Metadata */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">📅 Form Details</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Created:</span>
                            <span className="font-medium text-gray-900">
                              {new Date(viewingForm.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Updated:</span>
                            <span className="font-medium text-gray-900">
                              {new Date(viewingForm.updated_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Media Upload Settings */}
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-blue-900 mb-3">📸 Media Settings</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-blue-700">Images:</span>
                            <span className="font-medium text-blue-900">
                              {viewingForm.allow_image_uploads ? `${viewingForm.max_image_size_mb || 10}MB` : 'Disabled'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-blue-700">Videos:</span>
                            <span className="font-medium text-blue-900">
                              {viewingForm.allow_video_uploads ? `${viewingForm.max_video_size_mb || 100}MB` : 'Disabled'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      <button
                        onClick={() => {
                          startEdit(viewingForm);
                          setViewingForm(null);
                        }}
                        className="flex-1 bg-primary-950 text-white py-3 px-4 rounded-lg hover:bg-primary-900 transition-colors font-medium flex items-center justify-center space-x-2"
                      >
                        <Edit className="h-4 w-4" />
                        <span>Edit Form</span>
                      </button>
                      <button
                        onClick={() => {
                          setCustomizingForm(viewingForm);
                          setViewingForm(null);
                        }}
                        className={`flex-1 py-3 px-4 rounded-lg transition-colors font-medium flex items-center justify-center space-x-2 ${
                          subscription.limits.canUseCustomFields
                            ? 'bg-secondary-500 text-white hover:bg-secondary-600'
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                        disabled={!subscription.limits.canUseCustomFields}
                      >
                        <Settings className="h-4 w-4" />
                        <span>Custom Fields</span>
                      </button>
                      <button
                        onClick={() => {
                          setDeletingForm(viewingForm);
                          setViewingForm(null);
                        }}
                        className="bg-red-500 text-white py-3 px-4 rounded-lg hover:bg-red-600 transition-colors font-medium flex items-center justify-center"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    
                    {!subscription.limits.canUseCustomFields && (
                      <div className="mt-4">
                        <UpgradePrompt 
                          feature="Custom Fields"
                          description="Add custom questions beyond the standard fields"
                          inline
                        />
                      </div>
                    )}
                    </>
                  </div>
                </div>
              </div>
            )}

            {/* Form Customization Modal */}
            {customizingForm && (
              <div 
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                onClick={() => setCustomizingForm(null)}
              >
                <div 
                  className="bg-white rounded-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">
                      Customize Form: {customizingForm.title}
                    </h2>
                    <button
                      onClick={() => setCustomizingForm(null)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                    <FormBuilder 
                      formId={customizingForm.id}
                      onFieldsChange={() => {
                        // Refresh forms to update custom field count
                        fetchForms();
                      }}
                    />
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