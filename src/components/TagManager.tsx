import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Plus, X, Edit3, Save, Trash2, Tag } from 'lucide-react';
import { Alert } from './Alert';

interface TestimonialTag {
  id: string;
  name: string;
  color: string;
  created_at: string;
}

interface TagManagerProps {
  onTagsChange?: () => void;
}

const PRESET_COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#F97316', // Orange
  '#06B6D4', // Cyan
  '#84CC16', // Lime
  '#EC4899', // Pink
  '#6B7280', // Gray
];

export const TagManager: React.FC<TagManagerProps> = ({ onTagsChange }) => {
  const { user } = useAuth();
  const [tags, setTags] = useState<TestimonialTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showCreateTag, setShowCreateTag] = useState(false);
  const [editingTag, setEditingTag] = useState<TestimonialTag | null>(null);
  const [deletingTag, setDeletingTag] = useState<TestimonialTag | null>(null);

  // Form state
  const [tagData, setTagData] = useState({
    name: '',
    color: PRESET_COLORS[0],
  });

  useEffect(() => {
    fetchTags();
  }, [user]);

  const fetchTags = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('testimonial_tags')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTags(data || []);
    } catch (error) {
      console.error('Error fetching tags:', error);
      setError('Failed to load tags');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setError(null);
      const { data, error } = await supabase
        .from('testimonial_tags')
        .insert([{
          user_id: user.id,
          name: tagData.name.trim(),
          color: tagData.color,
        }])
        .select()
        .single();

      if (error) throw error;

      setTags([data, ...tags]);
      setShowCreateTag(false);
      setTagData({ name: '', color: PRESET_COLORS[0] });
      setSuccess('Tag created successfully!');
      onTagsChange?.();
    } catch (error: any) {
      console.error('Error creating tag:', error);
      if (error.code === '23505') {
        setError('A tag with this name already exists');
      } else {
        setError('Failed to create tag');
      }
    }
  };

  const handleUpdateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !editingTag) return;

    try {
      setError(null);
      const { data, error } = await supabase
        .from('testimonial_tags')
        .update({
          name: tagData.name.trim(),
          color: tagData.color,
        })
        .eq('id', editingTag.id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setTags(tags.map(tag => tag.id === editingTag.id ? data : tag));
      setEditingTag(null);
      setTagData({ name: '', color: PRESET_COLORS[0] });
      setSuccess('Tag updated successfully!');
      onTagsChange?.();
    } catch (error: any) {
      console.error('Error updating tag:', error);
      if (error.code === '23505') {
        setError('A tag with this name already exists');
      } else {
        setError('Failed to update tag');
      }
    }
  };

  const handleDeleteTag = async (tagId: string) => {
    try {
      const { error } = await supabase
        .from('testimonial_tags')
        .delete()
        .eq('id', tagId)
        .eq('user_id', user!.id);

      if (error) throw error;

      setTags(tags.filter(t => t.id !== tagId));
      setDeletingTag(null);
      setSuccess('Tag deleted successfully!');
      onTagsChange?.();
    } catch (error) {
      console.error('Error deleting tag:', error);
      setError('Failed to delete tag');
    }
  };

  const startEdit = (tag: TestimonialTag) => {
    setEditingTag(tag);
    setTagData({
      name: tag.name,
      color: tag.color,
    });
    setShowCreateTag(true);
  };

  const cancelEdit = () => {
    setEditingTag(null);
    setShowCreateTag(false);
    setTagData({ name: '', color: PRESET_COLORS[0] });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-950"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError(null)}
        />
      )}

      {success && (
        <Alert
          type="success"
          message={success}
          onClose={() => setSuccess(null)}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Tags & Categories</h3>
          <p className="text-sm text-gray-600">Organize testimonials with custom tags for better management</p>
        </div>
        <button
          onClick={() => setShowCreateTag(true)}
          className="bg-primary-950 text-white px-4 py-2 rounded-lg hover:bg-primary-900 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>New Tag</span>
        </button>
      </div>

      {/* Tags Grid */}
      {tags.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <Tag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">No tags yet</h4>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Create tags to organize your testimonials by product, service, campaign, or any other category.
          </p>
          <button
            onClick={() => setShowCreateTag(true)}
            className="bg-primary-950 text-white px-6 py-3 rounded-lg hover:bg-primary-900 transition-colors font-medium"
          >
            Create Your First Tag
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tags.map((tag) => (
            <div key={tag.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: tag.color }}
                  ></div>
                  <span className="font-medium text-gray-900">{tag.name}</span>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => startEdit(tag)}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeletingTag(tag)}
                    className="p-1 text-red-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                Created {new Date(tag.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Tag Modal */}
      {showCreateTag && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={cancelEdit}
        >
          <div 
            className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {editingTag ? 'Edit Tag' : 'Create New Tag'}
              </h2>
              <button
                onClick={cancelEdit}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={editingTag ? handleUpdateTag : handleCreateTag} className="space-y-4">
              {/* Tag Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tag Name
                </label>
                <input
                  type="text"
                  value={tagData.name}
                  onChange={(e) => setTagData({ ...tagData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., Product A, Campaign 2024, VIP Customers"
                  required
                />
              </div>

              {/* Color Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tag Color
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setTagData({ ...tagData, color })}
                      className={`w-10 h-10 rounded-lg border-2 transition-all ${
                        tagData.color === color
                          ? 'border-gray-800 scale-110'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <div className="mt-2 flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Custom:</span>
                  <input
                    type="color"
                    value={tagData.color}
                    onChange={(e) => setTagData({ ...tagData, color: e.target.value })}
                    className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                  />
                </div>
              </div>

              {/* Preview */}
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm text-gray-600 mb-2">Preview:</div>
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: tagData.color }}
                  ></div>
                  <span className="text-sm font-medium text-gray-900">
                    {tagData.name || 'Tag Name'}
                  </span>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary-950 text-white py-2 px-4 rounded-md hover:bg-primary-900 transition-colors font-medium flex items-center justify-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>{editingTag ? 'Save Changes' : 'Create Tag'}</span>
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
      {deletingTag && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setDeletingTag(null)}
        >
          <div 
            className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Delete Tag</h2>
              <button
                onClick={() => setDeletingTag(null)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the tag "<strong>{deletingTag.name}</strong>"? 
              This will remove it from all testimonials and cannot be undone.
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={() => handleDeleteTag(deletingTag.id)}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors font-medium"
              >
                Delete Tag
              </button>
              <button
                onClick={() => setDeletingTag(null)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};