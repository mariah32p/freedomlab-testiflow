import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Plus, Edit, Trash2, ExternalLink, Copy, Eye, Settings } from 'lucide-react';
import { Alert } from '../components/Alert';

interface TestimonialForm {
  id: string;
  title: string;
  description: string;
  thank_you_message: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const Forms: React.FC = () => {
  const { user } = useAuth();
  const [forms, setForms] = useState<TestimonialForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingForm, setEditingForm] = useState<TestimonialForm | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: 'Share Your Experience',
    description: "We'd love to hear about your experience with us!",
    thank_you_message: 'Thank you for your testimonial!'
  });

  useEffect(() => {
    fetchForms();
  }, [user]);

  const fetchForms = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('testimonial_forms')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setForms(data || []);
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
          is_active: true
        }])
        .select()
        .single();

      if (error) throw error;

      setForms([data, ...forms]);
      setShowCreateForm(false);
      setFormData({
        title: 'Share Your Experience',
        description: "We'd love to hear about your experience with us!",
        thank_you_message: 'Thank you for your testimonial!'
      });
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
          thank_you_message: formData.thank_you_message
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
        thank_you_message: 'Thank you for your testimonial!'
      });
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
    } catch (error) {
      console.error('Error toggling form status:', error);
      setError('Failed to update form status');
    }
  };

  const handleDeleteForm = async (formId: string) => {
    if (!confirm('Are you sure you want to delete this form? This will also delete all associated testimonials.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('testimonial_forms')
        .delete()
        .eq('id', formId)
        .eq('user_id', user!.id);

      if (error) throw error;

      setForms(forms.filter(f => f.id !== formId));
    } catch (error) {
      console.error('Error deleting form:', error);
      setError('Failed to delete form');
    }
  };

  const getFormUrl = (formId: string) => {
    return `${window.location.origin}/form/${formId}`;
  };

  const copyFormUrl = (formId: string) => {
    navigator.clipboard.writeText(getFormUrl(formId));
    // You could add a toast notification here
  };

  const startEdit = (form: TestimonialForm) => {
    setEditingForm(form);
    setFormData({
      title: form.title,
      description: form.description || '',
      thank_you_message: form.thank_you_message || ''
    });
    setShowCreateForm(true);
  };

  const cancelEdit = () => {
    setEditingForm(null);
    setShowCreateForm(false);
    setFormData({
      title: 'Share Your Experience',
      description: "We'd love to hear about your experience with us!",
      thank_you_message: 'Thank you for your testimonial!'
    });
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
                onClick={() => setShowCreateForm(true)}
                className="bg-primary-950 text-white px-4 py-2 rounded-lg hover:bg-primary-900 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
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

            {/* Create/Edit Form Modal */}
            {showCreateForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    {editingForm ? 'Edit Form' : 'Create New Form'}
                  </h2>
                  
                  <form onSubmit={editingForm ? handleUpdateForm : handleCreateForm} className="space-y-4">
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
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Thank You Message
                      </label>
                      <textarea
                        value={formData.thank_you_message}
                        onChange={(e) => setFormData({ ...formData, thank_you_message: e.target.value })}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div className="flex space-x-3 pt-4">
                      <button
                        type="submit"
                        className="flex-1 bg-primary-950 text-white py-2 px-4 rounded-md hover:bg-primary-900 transition-colors"
                      >
                        {editingForm ? 'Save Changes' : 'Create Form'}
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Forms List */}
            {forms.length === 0 ? (
              <div className="text-center py-12">
                <Settings className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No forms yet</h3>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                  Create your first testimonial collection form to start gathering customer feedback.
                </p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-primary-950 text-white px-6 py-3 rounded-lg hover:bg-primary-900 transition-all duration-200 flex items-center space-x-2 mx-auto font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Plus className="h-5 w-5" />
                  <span>Create Your First Form</span>
                </button>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {forms.map((form) => (
                  <div key={form.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{form.title}</h3>
                        <p className="text-gray-600 text-sm line-clamp-2">{form.description}</p>
                      </div>
                      <div className="flex items-center space-x-1 ml-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          form.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {form.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500 mb-4">
                      Created {new Date(form.created_at).toLocaleDateString()}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => startEdit(form)}
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Edit form"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => copyFormUrl(form.id)}
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Copy form URL"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        <a
                          href={getFormUrl(form.id)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Preview form"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleToggleActive(form)}
                          className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                            form.is_active
                              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {form.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleDeleteForm(form.id)}
                          className="p-1 text-red-400 hover:text-red-600 transition-colors"
                          title="Delete form"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
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