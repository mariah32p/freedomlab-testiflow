import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Trash2, Edit3, Save, X, ArrowUp, ArrowDown } from 'lucide-react';
import { Alert } from './Alert';

interface FormField {
  id: string;
  field_type: 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'rating' | 'email' | 'url';
  label: string;
  placeholder: string;
  options: string[];
  is_required: boolean;
  sort_order: number;
}

interface FormBuilderProps {
  formId: string;
  onFieldsChange?: () => void;
}

const FIELD_TYPES = [
  { value: 'text', label: 'Short Text', icon: '📝' },
  { value: 'textarea', label: 'Long Text', icon: '📄' },
  { value: 'email', label: 'Email', icon: '📧' },
  { value: 'url', label: 'Website URL', icon: '🔗' },
  { value: 'select', label: 'Dropdown Menu', icon: '📋', description: 'Select one option from a list' },
  { value: 'radio', label: 'Single Choice', icon: '🔘', description: 'Choose one option (radio buttons)' },
  { value: 'checkbox', label: 'Multi-Select', icon: '✅', description: 'Select multiple options (checkboxes)' },
  { value: 'rating', label: 'Additional Rating', icon: '⭐', description: 'Extra star rating (main rating already included)' },
];

export const FormBuilder: React.FC<FormBuilderProps> = ({ formId, onFieldsChange }) => {
  const [fields, setFields] = useState<FormField[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<FormField | null>(null);
  const [showAddField, setShowAddField] = useState(false);

  // New field form state
  const [newField, setNewField] = useState({
    field_type: 'text' as FormField['field_type'],
    label: '',
    placeholder: '',
    options: [''],
    is_required: false,
  });

  useEffect(() => {
    fetchFields();
  }, [formId]);

  const fetchFields = async () => {
    try {
      const { data, error } = await supabase
        .from('form_fields')
        .select('*')
        .eq('form_id', formId)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setFields(data || []);
    } catch (error) {
      console.error('Error fetching form fields:', error);
      setError('Failed to load form fields');
    } finally {
      setLoading(false);
    }
  };

  const handleAddField = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setError(null);
      const maxOrder = Math.max(...fields.map(f => f.sort_order), -1);
      
      const { data, error } = await supabase
        .from('form_fields')
        .insert([{
          form_id: formId,
          field_type: newField.field_type,
          label: newField.label,
          placeholder: newField.placeholder,
          options: newField.field_type === 'select' || newField.field_type === 'radio' || newField.field_type === 'checkbox' 
            ? newField.options.filter(opt => opt.trim()) 
            : [],
          is_required: newField.is_required,
          sort_order: maxOrder + 1,
        }])
        .select()
        .single();

      if (error) throw error;

      setFields([...fields, data]);
      setShowAddField(false);
      setNewField({
        field_type: 'text',
        label: '',
        placeholder: '',
        options: [''],
        is_required: false,
      });
      setSuccess('Field added successfully!');
      onFieldsChange?.();
    } catch (error) {
      console.error('Error adding field:', error);
      setError('Failed to add field');
    }
  };

  const handleUpdateField = async (field: FormField) => {
    try {
      setError(null);
      const { error } = await supabase
        .from('form_fields')
        .update({
          field_type: field.field_type,
          label: field.label,
          placeholder: field.placeholder,
          options: field.field_type === 'select' || field.field_type === 'radio' || field.field_type === 'checkbox' 
            ? field.options.filter(opt => opt.trim()) 
            : [],
          is_required: field.is_required,
        })
        .eq('id', field.id);

      if (error) throw error;

      setFields(fields.map(f => f.id === field.id ? field : f));
      setEditingField(null);
      setSuccess('Field updated successfully!');
      onFieldsChange?.();
    } catch (error) {
      console.error('Error updating field:', error);
      setError('Failed to update field');
    }
  };

  const handleDeleteField = async (fieldId: string) => {
    try {
      const { error } = await supabase
        .from('form_fields')
        .delete()
        .eq('id', fieldId);

      if (error) throw error;

      setFields(fields.filter(f => f.id !== fieldId));
      setSuccess('Field deleted successfully!');
      onFieldsChange?.();
    } catch (error) {
      console.error('Error deleting field:', error);
      setError('Failed to delete field');
    }
  };

  const handleReorder = async (dragIndex: number, hoverIndex: number) => {
    if (dragIndex === hoverIndex) return;
    
    const newFields = [...fields];
    const [draggedField] = newFields.splice(dragIndex, 1);
    newFields.splice(hoverIndex, 0, draggedField);
    
    // Update sort_order for all fields
    const updatedFields = newFields.map((field, index) => ({
      ...field,
      sort_order: index,
    }));
    
    setFields(updatedFields);
    
    // Save new order to database
    try {
      for (let i = 0; i < updatedFields.length; i++) {
        await supabase
          .from('form_fields')
          .update({ sort_order: i })
          .eq('id', updatedFields[i].id);
      }
      setSuccess('Field order updated!');
    } catch (error) {
      console.error('Error reordering fields:', error);
      setError('Failed to save field order');
    }
  };

  const moveFieldUp = (index: number) => {
    if (index > 0) {
      handleReorder(index, index - 1);
    }
  };

  const moveFieldDown = (index: number) => {
    if (index < fields.length - 1) {
      handleReorder(index, index + 1);
    }
  };

  const addOption = (options: string[]) => {
    return [...options, ''];
  };

  const updateOption = (options: string[], index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    return newOptions;
  };

  const removeOption = (options: string[], index: number) => {
    return options.filter((_, i) => i !== index);
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
          <h3 className="text-lg font-medium text-gray-900">Custom Fields</h3>
          <p className="text-sm text-gray-600">Add custom questions beyond the standard fields (name, email, company, rating, testimonial)</p>
        </div>
        <button
          onClick={() => setShowAddField(true)}
          className="bg-primary-950 text-white px-4 py-2 rounded-lg hover:bg-primary-900 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Field</span>
        </button>
      </div>

      {/* Standard Fields Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h4 className="text-sm font-medium text-blue-900 mb-2">📋 Standard Fields (Already Included)</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-blue-800">⭐ Overall Rating</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-blue-800">👤 Customer Name</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-blue-800">📧 Email Address</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-blue-800">🏢 Company (Optional)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-blue-800">💬 Main Testimonial</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-blue-800">📸 Media Uploads</span>
          </div>
        </div>
        <p className="text-xs text-blue-700 mt-3">
          ✨ These fields are automatically included in every form. Use custom fields below to ask additional questions.
        </p>
      </div>
      {/* Fields List */}
      <div className="space-y-3">
        {fields.map((field, index) => (
          <div key={field.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex flex-col space-y-1">
                  <button
                    onClick={() => moveFieldUp(index)}
                    disabled={index === 0}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ArrowUp className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => moveFieldDown(index)}
                    disabled={index === fields.length - 1}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ArrowDown className="h-3 w-3" />
                  </button>
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    {field.label}
                    {field.is_required && <span className="text-red-500 ml-1">*</span>}
                  </div>
                  <div className="text-sm text-gray-500">
                    {FIELD_TYPES.find(t => t.value === field.field_type)?.label} 
                    {field.placeholder && ` • ${field.placeholder}`}
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setEditingField(field)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteField(field.id)}
                  className="p-2 text-red-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {fields.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No custom fields yet. Your form already includes the standard fields above - add additional questions here!</p>
          </div>
        )}
      </div>

      {/* Add Field Modal */}
      {showAddField && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Add Custom Field</h2>
            
            <form onSubmit={handleAddField} className="space-y-4">
              {/* Field Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Field Type
                </label>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                  <p className="text-sm text-yellow-800">
                    💡 <strong>Tip:</strong> Your form already includes name, email, company, rating, and testimonial fields. 
                    Add custom fields here for additional questions like "How did you hear about us?\" or \"What's your role?"
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {FIELD_TYPES.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setNewField({ ...newField, field_type: type.value as FormField['field_type'] })}
                      className={`p-3 border rounded-lg text-left transition-colors ${
                        newField.field_type === type.value
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{type.icon}</span>
                        <span className="font-medium">{type.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Label */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Question/Label
                </label>
                <input
                  type="text"
                  value={newField.label}
                  onChange={(e) => setNewField({ ...newField, label: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="What would you like to ask?"
                  required
                />
              </div>

              {/* Placeholder */}
              {(newField.field_type === 'text' || newField.field_type === 'textarea' || newField.field_type === 'email' || newField.field_type === 'url') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Placeholder Text (Optional)
                  </label>
                  <input
                    type="text"
                    value={newField.placeholder}
                    onChange={(e) => setNewField({ ...newField, placeholder: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter placeholder text..."
                  />
                </div>
              )}

              {/* Options for select/radio/checkbox */}
              {(newField.field_type === 'select' || newField.field_type === 'radio' || newField.field_type === 'checkbox') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Options
                  </label>
                  <div className="space-y-2">
                    {newField.options.map((option, index) => (
                      <div key={index} className="flex space-x-2">
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => setNewField({ 
                            ...newField, 
                            options: updateOption(newField.options, index, e.target.value)
                          })}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder={`Option ${index + 1}`}
                        />
                        {newField.options.length > 1 && (
                          <button
                            type="button"
                            onClick={() => setNewField({ 
                              ...newField, 
                              options: removeOption(newField.options, index)
                            })}
                            className="p-2 text-red-400 hover:text-red-600 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setNewField({ 
                        ...newField, 
                        options: addOption(newField.options)
                      })}
                      className="text-sm text-primary-950 hover:text-primary-800 flex items-center space-x-1"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Add Option</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Required Toggle */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="required"
                  checked={newField.is_required}
                  onChange={(e) => setNewField({ ...newField, is_required: e.target.checked })}
                  className="rounded border-gray-300 text-primary-950 focus:ring-primary-500"
                />
                <label htmlFor="required" className="text-sm text-gray-700">
                  Required field
                </label>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary-950 text-white py-2 px-4 rounded-md hover:bg-primary-900 transition-colors"
                >
                  Add Field
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddField(false);
                    setNewField({
                      field_type: 'text',
                      label: '',
                      placeholder: '',
                      options: [''],
                      is_required: false,
                    });
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Field Modal */}
      {editingField && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Edit Field</h2>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              handleUpdateField(editingField);
            }} className="space-y-4">
              {/* Field Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Field Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {FIELD_TYPES.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setEditingField({ 
                        ...editingField, 
                        field_type: type.value as FormField['field_type'],
                        options: type.value === 'select' || type.value === 'radio' || type.value === 'checkbox' 
                          ? (editingField.options.length > 0 ? editingField.options : [''])
                          : []
                      })}
                      className={`p-3 border rounded-lg text-left transition-colors ${
                        editingField.field_type === type.value
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                        <span className="text-lg">{type.icon}</span>
                        <span className="font-medium">{type.label}</span>
                      </div>
                        {type.description && (
                          <p className="text-xs text-gray-500">{type.description}</p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Label */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Question/Label
                </label>
                <input
                  type="text"
                  value={editingField.label}
                  onChange={(e) => setEditingField({ ...editingField, label: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              {/* Placeholder */}
              {(editingField.field_type === 'text' || editingField.field_type === 'textarea' || editingField.field_type === 'email' || editingField.field_type === 'url') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Placeholder Text (Optional)
                  </label>
                  <input
                    type="text"
                    value={editingField.placeholder}
                    onChange={(e) => setEditingField({ ...editingField, placeholder: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              )}

              {/* Options */}
              {(editingField.field_type === 'select' || editingField.field_type === 'radio' || editingField.field_type === 'checkbox') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Options
                  </label>
                  <div className="space-y-2">
                    {editingField.options.map((option, index) => (
                      <div key={index} className="flex space-x-2">
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => setEditingField({ 
                            ...editingField, 
                            options: updateOption(editingField.options, index, e.target.value)
                          })}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder={`Option ${index + 1}`}
                        />
                        {editingField.options.length > 1 && (
                          <button
                            type="button"
                            onClick={() => setEditingField({ 
                              ...editingField, 
                              options: removeOption(editingField.options, index)
                            })}
                            className="p-2 text-red-400 hover:text-red-600 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setEditingField({ 
                        ...editingField, 
                        options: addOption(editingField.options)
                      })}
                      className="text-sm text-primary-950 hover:text-primary-800 flex items-center space-x-1"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Add Option</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Required Toggle */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-required"
                  checked={editingField.is_required}
                  onChange={(e) => setEditingField({ ...editingField, is_required: e.target.checked })}
                  className="rounded border-gray-300 text-primary-950 focus:ring-primary-500"
                />
                <label htmlFor="edit-required" className="text-sm text-gray-700">
                  Required field
                </label>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary-950 text-white py-2 px-4 rounded-md hover:bg-primary-900 transition-colors flex items-center justify-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditingField(null)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};