import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { X, Plus } from 'lucide-react';

interface TestimonialTag {
  id: string;
  name: string;
  color: string;
}

interface TestimonialTaggerProps {
  testimonialId: string;
  onTagsChange?: () => void;
}

export const TestimonialTagger: React.FC<TestimonialTaggerProps> = ({ 
  testimonialId,
  onTagsChange
}) => {
  const { user } = useAuth();
  const [availableTags, setAvailableTags] = useState<TestimonialTag[]>([]);
  const [assignedTags, setAssignedTags] = useState<TestimonialTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTagSelector, setShowTagSelector] = useState(false);

  useEffect(() => {
    fetchTags();
  }, [user, testimonialId]);

  const fetchTags = async () => {
    if (!user) return;

    try {
      // Get all user's tags
      const { data: allTags, error: tagsError } = await supabase
        .from('testimonial_tags')
        .select('*')
        .eq('user_id', user.id)
        .order('name');

      if (tagsError) throw tagsError;

      // Get assigned tags for this testimonial
      const { data: assignments, error: assignmentsError } = await supabase
        .from('testimonial_tag_assignments')
        .select(`
          tag_id,
          tag:testimonial_tags(id, name, color)
        `)
        .eq('testimonial_id', testimonialId);

      if (assignmentsError) throw assignmentsError;

      setAvailableTags(allTags || []);
      setAssignedTags(assignments?.map((a: any) => a.tag).filter(Boolean) || []);
    } catch (error) {
      console.error('Error fetching tags:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignTag = async (tagId: string) => {
    try {
      const { data, error } = await supabase
        .from('testimonial_tag_assignments')
        .insert([{
          testimonial_id: testimonialId,
          tag_id: tagId,
        }])
        .select();

      if (error) throw error;

      const tag = availableTags.find(t => t.id === tagId);
      if (tag) {
        setAssignedTags([...assignedTags, tag]);
        onTagsChange?.();
      }
      
      console.log('Tag assigned successfully:', data);
    } catch (error) {
      console.error('Error assigning tag:', error);
    }
  };

  const handleRemoveTag = async (tagId: string) => {
    try {
      const { error } = await supabase
        .from('testimonial_tag_assignments')
        .delete()
        .eq('testimonial_id', testimonialId)
        .eq('tag_id', tagId);

      if (error) throw error;

      setAssignedTags(assignedTags.filter(t => t.id !== tagId));
      onTagsChange?.();
    } catch (error) {
      console.error('Error removing tag:', error);
    }
  };

  const unassignedTags = availableTags.filter(
    tag => !assignedTags.some(assigned => assigned.id === tag.id)
  );

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-950"></div>
        <span className="text-sm text-gray-500">Loading tags...</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Assigned Tags */}
      <div className="flex flex-wrap gap-2">
        {assignedTags.map((tag) => (
          <div
            key={tag.id}
            className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium border"
            style={{ 
              backgroundColor: `${tag.color}20`,
              borderColor: tag.color,
              color: tag.color
            }}
          >
            <span>{tag.name}</span>
            <button
              onClick={() => handleRemoveTag(tag.id)}
              className="hover:bg-black hover:bg-opacity-10 rounded-full p-0.5 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        
        {/* Add Tag Button */}
        {unassignedTags.length > 0 && (
          <button
            onClick={() => setShowTagSelector(!showTagSelector)}
            className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium border border-dashed border-gray-300 text-gray-600 hover:border-primary-500 hover:text-primary-950 transition-colors"
          >
            <Plus className="h-3 w-3" />
            <span>Add Tag</span>
          </button>
        )}
      </div>

      {/* Tag Selector Dropdown */}
      {showTagSelector && unassignedTags.length > 0 && (
        <div className="relative">
          <div className="absolute top-0 left-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-48 max-h-48 overflow-y-auto">
            <div className="py-1">
              {unassignedTags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => {
                    handleAssignTag(tag.id);
                    setShowTagSelector(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                >
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: tag.color }}
                  ></div>
                  <span>{tag.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {assignedTags.length === 0 && unassignedTags.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div className="text-sm text-yellow-800">
            <strong>No tags available.</strong> 
            <a href="/tags" className="text-yellow-900 underline hover:text-yellow-700 ml-1">
              Create tags first
            </a> to organize testimonials.
          </div>
        </div>
      )}
    </div>
  );
};