import React, { useState, useEffect } from 'react';
import { TestiFlowIcon } from '../components/TestiFlowIcon';
import { User, LogOut, Plus, Settings, Copy, ExternalLink, Star, Download, FileText, Code, Send, ArrowUp, ArrowDown } from 'lucide-react';

interface DemoStep {
  id: string;
  title: string;
  description: string;
  duration: number;
}

const demoSteps: DemoStep[] = [
  { id: 'create-form', title: 'Create Forms', description: 'Setting up testimonial collection forms', duration: 6000 },
  { id: 'custom-fields', title: 'Add Custom Fields', description: 'Adding custom questions to the form', duration: 7000 },
  { id: 'customer-submission', title: 'Customer Fills Form', description: 'Customer submitting their testimonial', duration: 6000 },
  { id: 'testimonials-approval', title: 'Review & Approve', description: 'Managing testimonials in the dashboard', duration: 6000 },
  { id: 'export-use', title: 'Export & Use', description: 'Using testimonials in your marketing', duration: 7000 },
];

// Mock testimonials for export demo
const mockTestimonials = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@techcorp.com',
    company: 'TechCorp',
    message: 'TestiFlow has completely transformed how we collect customer feedback. The automated workflows save us hours every week!',
    rating: 5,
    status: 'approved',
    submitted_at: '2025-01-15T10:30:00Z',
    form_title: 'Customer Experience Survey'
  },
  {
    id: '2',
    name: 'Mike Chen',
    email: 'mike@startup.com',
    company: 'StartupXYZ',
    message: 'Amazing product! The testimonial management features are exactly what we needed for our marketing campaigns.',
    rating: 5,
    status: 'approved',
    submitted_at: '2025-01-14T14:20:00Z',
    form_title: 'Customer Experience Survey'
  },
  {
    id: '3',
    name: 'Emily Davis',
    email: 'emily@growth.com',
    company: 'GrowthCo',
    message: 'The export features are incredible. We can now easily use testimonials across all our marketing channels.',
    rating: 4,
    status: 'approved',
    submitted_at: '2025-01-13T09:15:00Z',
    form_title: 'Customer Experience Survey'
  }
];

export const Demo: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  // Demo state
  const [showCreatePanel, setShowCreatePanel] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thank_you_message: ''
  });
  const [createdForm, setCreatedForm] = useState<any>(null);
  const [showCustomFieldsPanel, setShowCustomFieldsPanel] = useState(false);
  const [customFields, setCustomFields] = useState<any[]>([]);
  const [showAddFieldPanel, setShowAddFieldPanel] = useState(false);
  const [newField, setNewField] = useState({ field_type: 'select', label: '', options: [''] });
  const [customerFormData, setCustomerFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
    rating: 0,
    role: '',
    industry: ''
  });
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [showExportPanel, setShowExportPanel] = useState(false);
  const [selectedExportFormat, setSelectedExportFormat] = useState<'csv' | 'json' | 'widget'>('csv');
  const [generatedContent, setGeneratedContent] = useState('');
  const [highlightedTestimonial, setHighlightedTestimonial] = useState<string | null>(null);

  // Auto-advance timer
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentStep < demoSteps.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        // Reset to beginning
        setCurrentStep(0);
        resetAllAnimations();
      }
    }, demoSteps[currentStep].duration);

    return () => clearTimeout(timer);
  }, [currentStep]);

  const resetAllAnimations = () => {
    setShowCreatePanel(false);
    setFormData({ title: '', description: '', thank_you_message: '' });
    setCreatedForm(null);
    setShowCustomFieldsPanel(false);
    setCustomFields([]);
    setShowAddFieldPanel(false);
    setNewField({ field_type: 'select', label: '', options: [''] });
    setCustomerFormData({ name: '', email: '', company: '', message: '', rating: 0, role: '', industry: '' });
    setTestimonials([]);
    setShowExportPanel(false);
    setGeneratedContent('');
    setHighlightedTestimonial(null);
  };

  const demoGenerateWebsiteWidget = () => {
    return `<div class="testimonials-widget" style="max-width: 1000px; margin: 0 auto; padding: 20px; font-family: 'Montserrat', system-ui, sans-serif;">
  <h3 style="text-align: center; margin-bottom: 20px; color: #333; font-family: 'Montserrat', system-ui, sans-serif;">What Our Customers Say</h3>
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
    ${mockTestimonials.slice(0, 3).map(testimonial => `
    <div style="background: #f9f9f9; padding: 20px; border-radius: 12px; border-left: 4px solid #01b79e; box-shadow: 0 2px 4px rgba(0,0,0,0.1); font-family: 'Montserrat', system-ui, sans-serif;">
      <div style="display: flex; margin-bottom: 8px;">
        ${'★'.repeat(testimonial.rating)}<span style="color: #ddd;">${'★'.repeat(5 - testimonial.rating)}</span>
      </div>
      <p style="margin: 0 0 15px 0; font-style: italic; color: #555; line-height: 1.5;">"${testimonial.message}"</p>
      <div style="font-size: 14px; color: #777; font-family: 'Montserrat', system-ui, sans-serif;">
        - ${testimonial.name}${testimonial.company ? `, ${testimonial.company}` : ''}
      </div>
    </div>`).join('')}
  </div>
</div>`;
  };

  // Step-specific animations
  useEffect(() => {
    resetAllAnimations();

    if (currentStep === 0) { // Create Forms
      setTimeout(() => setShowCreatePanel(true), 500);
      setTimeout(() => setFormData({
        title: 'Share Your Experience with TechCorp',
        description: "We'd love to hear about your experience with our software solutions!",
        thank_you_message: 'Thank you for taking the time to share your feedback!'
      }), 1500);
      setTimeout(() => {
        setShowCreatePanel(false);
        setCreatedForm({
          id: '1',
          title: 'Share Your Experience with TechCorp',
          description: "We'd love to hear about your experience with our software solutions!",
          is_active: true,
          created_at: new Date().toISOString()
        });
      }, 4500);

    } else if (currentStep === 1) { // Custom Fields
      setCreatedForm({
        id: '1',
        title: 'Share Your Experience with TechCorp',
        description: "We'd love to hear about your experience with our software solutions!",
        is_active: true,
        created_at: new Date().toISOString()
      });
      setTimeout(() => setShowCustomFieldsPanel(true), 500);
      setTimeout(() => setShowAddFieldPanel(true), 1000);
      setTimeout(() => setNewField({
        field_type: 'select',
        label: 'What is your role?',
        options: ['CEO/Founder', 'CTO', 'Marketing Manager', 'Operations Manager']
      }), 2000);
      setTimeout(() => {
        setShowAddFieldPanel(false);
        setCustomFields([{
          id: '1',
          field_type: 'select',
          label: 'What is your role?',
          options: ['CEO/Founder', 'CTO', 'Marketing Manager', 'Operations Manager'],
          is_required: true
        }]);
      }, 3500);
      setTimeout(() => setShowAddFieldPanel(true), 4000);
      setTimeout(() => setNewField({
        field_type: 'select',
        label: 'What industry are you in?',
        options: ['Technology', 'Healthcare', 'Finance', 'E-commerce', 'Consulting']
      }), 4500);
      setTimeout(() => {
        setShowAddFieldPanel(false);
        setCustomFields(prev => [...prev, {
          id: '2',
          field_type: 'select',
          label: 'What industry are you in?',
          options: ['Technology', 'Healthcare', 'Finance', 'E-commerce', 'Consulting'],
          is_required: false
        }]);
      }, 6000);

    } else if (currentStep === 2) { // Customer Submission
      setCustomFields([
        { id: '1', field_type: 'select', label: 'What is your role?', options: ['CEO/Founder', 'CTO', 'Marketing Manager', 'Operations Manager'], is_required: true },
        { id: '2', field_type: 'select', label: 'What industry are you in?', options: ['Technology', 'Healthcare', 'Finance', 'E-commerce', 'Consulting'], is_required: false }
      ]);
      setTimeout(() => setCustomerFormData(prev => ({ ...prev, rating: 5 })), 500);
      setTimeout(() => setCustomerFormData(prev => ({ ...prev, name: 'Sarah Johnson' })), 1000);
      setTimeout(() => setCustomerFormData(prev => ({ ...prev, email: 'sarah@techcorp.com' })), 1500);
      setTimeout(() => setCustomerFormData(prev => ({ ...prev, company: 'TechCorp Solutions' })), 2000);
      setTimeout(() => setCustomerFormData(prev => ({ ...prev, role: 'CTO' })), 2500);
      setTimeout(() => setCustomerFormData(prev => ({ ...prev, industry: 'Technology' })), 3000);
      setTimeout(() => setCustomerFormData(prev => ({
        ...prev,
        message: 'TestiFlow has completely transformed how we collect and manage customer feedback. The automated workflows save us hours every week and the interface is so intuitive!'
      })), 3500);

    } else if (currentStep === 3) { // Testimonials Approval
      const testimonialsData = [
        {
          id: '1', name: 'Sarah Johnson', email: 'sarah@techcorp.com', company: 'TechCorp Solutions',
          message: 'TestiFlow has completely transformed how we collect and manage customer feedback. The automated workflows save us hours every week!',
          rating: 5, status: 'pending', submitted_at: new Date().toISOString(), form_id: '1',
          custom_responses: { 'What is your role?': 'CTO', 'What industry are you in?': 'Technology' }
        },
        {
          id: '2', name: 'Mike Chen', email: 'mike@startupxyz.com', company: 'StartupXYZ',
          message: 'Amazing product! The testimonial management features are exactly what we needed for our marketing campaigns.',
          rating: 5, status: 'approved', submitted_at: new Date(Date.now() - 86400000).toISOString(), form_id: '1'
        },
        {
          id: '3', name: 'Emily Davis', email: 'emily@growth.com', company: 'GrowthCo',
          message: 'The export features are incredible. We can now easily use testimonials across all our marketing channels.',
          rating: 4, status: 'pending', submitted_at: new Date(Date.now() - 172800000).toISOString(), form_id: '1'
        }
      ];
      setTestimonials(testimonialsData);
      
      // Highlight and approve testimonials
      setTimeout(() => {
        setHighlightedTestimonial('1');
      }, 1000);
      setTimeout(() => {
        setTestimonials(prev => prev.map(t => 
          t.id === '1' ? { ...t, status: 'approved' } : t
        ));
        setHighlightedTestimonial(null);
      }, 2500);
      
      setTimeout(() => {
        setHighlightedTestimonial('3');
      }, 3500);
      setTimeout(() => {
        setTestimonials(prev => prev.map(t => 
          t.id === '3' ? { ...t, status: 'approved' } : t
        ));
        setHighlightedTestimonial(null);
      }, 5000);

    } else if (currentStep === 4) { // Export
      setTestimonials(mockTestimonials);
      setTimeout(() => setShowExportPanel(true), 1000);
      setTimeout(() => {
        setSelectedExportFormat('widget');
      }, 2500);
      setTimeout(() => {
        setGeneratedContent(demoGenerateWebsiteWidget());
      }, 4000);
    }
  }, [currentStep]);

  const getActiveTab = () => {
    switch (currentStep) {
      case 0:
      case 1:
        return 'forms';
      case 2:
        return 'submit';
      case 3:
      case 4:
        return 'testimonials';
      default:
        return 'dashboard';
    }
  };

  const renderMainContent = () => {
    if (currentStep === 2) {
      // Customer submission view
      return (
        <div className="bg-gray-50 py-8">
          <div className="max-w-2xl mx-auto px-4">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="px-6 py-6 text-center text-white bg-primary-950">
                <div className="flex justify-center mb-3">
                  <TestiFlowIcon className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-xl font-bold mb-2">Share Your Experience with TechCorp</h1>
                <p className="text-white/90 text-sm">We'd love to hear about your experience with our software solutions!</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">How would you rate your experience? *</label>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className={`h-6 w-6 ${star <= customerFormData.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                    <input type="text" value={customerFormData.name} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                    <input type="email" value={customerFormData.email} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company (Optional)</label>
                    <input type="text" value={customerFormData.company} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" readOnly />
                  </div>
                  {customFields.map((field) => (
                    <div key={field.id}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}{field.is_required && <span className="text-red-500 ml-1">*</span>}</label>
                      <select value={field.id === '1' ? customerFormData.role : customerFormData.industry} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" disabled>
                        <option value="">Select an option...</option>
                        {field.options.map((option: string, index: number) => (<option key={index} value={option}>{option}</option>))}
                      </select>
                    </div>
                  ))}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Testimonial *</label>
                    <textarea rows={3} value={customerFormData.message} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" readOnly />
                  </div>
                  <button type="submit" className="w-full bg-secondary-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-secondary-600 transition-colors flex items-center justify-center space-x-2">
                    <Send className="h-4 w-4" />
                    <span>Submit Testimonial</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Default dashboard views
    return (
      <div className="bg-gray-50 py-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {getActiveTab() === 'forms' ? 'Forms' : 'Testimonials'}
                  </h1>
                  <p className="text-gray-600 text-sm mt-1">
                    {getActiveTab() === 'forms' 
                      ? 'Create and manage testimonial collection forms'
                      : 'Review, approve, and manage customer testimonials'
                    }
                  </p>
                </div>
                {getActiveTab() === 'forms' && (
                  <button
                    onClick={() => setShowCreatePanel(true)}
                    className={`bg-primary-950 text-white px-4 py-2 rounded-lg hover:bg-primary-900 transition-all duration-200 flex items-center space-x-2 font-medium shadow-lg ${
                      currentStep === 0 ? 'ring-4 ring-primary-200 animate-pulse' : ''
                    }`}
                  >
                    <Plus className="h-4 w-4" />
                    <span>New Form</span>
                  </button>
                )}
                {getActiveTab() === 'testimonials' && (
                  <button
                    onClick={() => setShowExportPanel(true)}
                    className={`border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2 ${
                      currentStep === 4 ? 'ring-4 ring-blue-200 animate-pulse' : ''
                    }`}
                  >
                    <Download className="h-4 w-4" />
                    <span>Export</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2">
                  {getActiveTab() === 'forms' ? (
                    <>
                      {createdForm ? (
                        <div className="space-y-4">
                          <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-200 animate-slide-in">
                            <div className="mb-3">
                              <h3 className="text-lg font-semibold text-gray-900 mb-1 leading-tight">{createdForm.title}</h3>
                              <p className="text-gray-600 text-sm leading-relaxed">{createdForm.description}</p>
                            </div>
                            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                              <button 
                                onClick={() => setShowCustomFieldsPanel(true)}
                                className={`text-primary-950 hover:text-primary-800 text-sm font-medium flex items-center space-x-1 transition-colors ${
                                  currentStep === 1 ? 'ring-2 ring-primary-200 rounded px-2 py-1' : ''
                                }`}
                              >
                                <Settings className="h-4 w-4" />
                                <span>Custom Fields</span>
                              </button>
                              <div className="flex space-x-2">
                                <button className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1 rounded-md text-sm font-medium transition-colors flex items-center space-x-1">
                                  <Copy className="h-3 w-3" />
                                  <span>Copy</span>
                                </button>
                                <button className="bg-gray-50 text-gray-600 hover:bg-gray-100 px-3 py-1 rounded-md text-sm font-medium transition-colors flex items-center space-x-1">
                                  <ExternalLink className="h-3 w-3" />
                                  <span>Preview</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Settings className="h-8 w-8 text-primary-950" />
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">Create Your First Form</h3>
                          <p className="text-gray-500 text-sm max-w-md mx-auto">
                            Start gathering customer testimonials by creating a customized form.
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="space-y-4">
                      {testimonials.map((testimonial) => (
                        <div 
                          key={testimonial.id} 
                          className={`bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all duration-200 ${
                            highlightedTestimonial === testimonial.id ? 'ring-4 ring-secondary-200 shadow-lg scale-105' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center">
                                <User className="h-4 w-4 text-primary-950" />
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900 text-sm">{testimonial.name}</div>
                                <div className="text-xs text-gray-500">{testimonial.company}</div>
                              </div>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              testimonial.status === 'approved' 
                                ? 'bg-secondary-100 text-secondary-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {testimonial.status}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 mb-3">
                            <div className="flex">
                              {[...Array(testimonial.rating)].map((_, i) => (
                                <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                              ))}
                            </div>
                            <span className="text-xs text-gray-500">({testimonial.rating}/5)</span>
                          </div>
                          <p className="text-gray-700 text-sm leading-relaxed mb-3">"{testimonial.message}"</p>
                          <div className="flex items-center justify-end">
                            {testimonial.status === 'pending' && (
                              <div className="flex space-x-2">
                                <button className="bg-secondary-100 text-secondary-800 hover:bg-secondary-200 px-3 py-1 rounded-md text-xs font-medium transition-colors">
                                  Approve
                                </button>
                                <button className="bg-red-100 text-red-800 hover:bg-red-200 px-3 py-1 rounded-md text-xs font-medium transition-colors">
                                  Reject
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Side Panel */}
                <div className="lg:col-span-1">
                  {/* Create Form Panel */}
                  {showCreatePanel && (
                    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-lg animate-slide-in">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Create New Form</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Form Title</label>
                          <input
                            type="text"
                            value={formData.title}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            readOnly
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                          <textarea
                            value={formData.description}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            readOnly
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Thank You Message</label>
                          <input
                            type="text"
                            value={formData.thank_you_message}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            readOnly
                          />
                        </div>
                        <div className="flex space-x-2 pt-3">
                          <button className="flex-1 bg-primary-950 text-white py-2 px-3 rounded-md font-medium text-sm">
                            Create Form
                          </button>
                          <button className="flex-1 bg-gray-300 text-gray-700 py-2 px-3 rounded-md font-medium text-sm">
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Custom Fields Panel */}
                  {showCustomFieldsPanel && (
                    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-lg animate-slide-in">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900">Custom Fields</h3>
                        <button className="bg-primary-950 text-white px-3 py-1 rounded-md text-sm flex items-center space-x-1">
                          <Plus className="h-3 w-3" />
                          <span>Add</span>
                        </button>
                      </div>
                      
                      {/* Add Field Panel */}
                      {showAddFieldPanel && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 animate-slide-in">
                          <h4 className="text-sm font-medium text-blue-900 mb-2">Adding New Field</h4>
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={newField.label}
                              className="w-full px-2 py-1 border border-blue-300 rounded text-sm"
                              readOnly
                            />
                            <div className="text-xs text-blue-700">Type: {newField.field_type}</div>
                          </div>
                        </div>
                      )}

                      {/* Existing Fields */}
                      <div className="space-y-2">
                        {customFields.map((field) => (
                          <div key={field.id} className="bg-gray-50 border border-gray-200 rounded-lg p-3 animate-slide-in">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium text-gray-900 text-sm">
                                  {field.label}
                                  {field.is_required && <span className="text-red-500 ml-1">*</span>}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {field.field_type === 'select' ? 'Dropdown' : field.field_type}
                                </div>
                              </div>
                              <div className="flex space-x-1">
                                <button className="p-1 text-gray-400 hover:text-gray-600">
                                  <ArrowUp className="h-3 w-3" />
                                </button>
                                <button className="p-1 text-gray-400 hover:text-gray-600">
                                  <ArrowDown className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Export Panel */}
                  {showExportPanel && (
                    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-lg animate-slide-in">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Export Options</h3>
                      <div className="space-y-3">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Choose Format</h4>
                          <div className="space-y-2">
                            {[
                              { value: 'csv', label: 'CSV', icon: FileText, color: 'text-green-600' },
                              { value: 'json', label: 'JSON', icon: Code, color: 'text-blue-600' },
                              { value: 'widget', label: 'Widget', icon: Code, color: 'text-purple-600' }
                            ].map((format) => (
                              <button
                                key={format.value}
                                onClick={() => setSelectedExportFormat(format.value as any)}
                                className={`w-full p-2 border rounded-lg text-left transition-colors flex items-center space-x-2 ${
                                  selectedExportFormat === format.value
                                    ? 'border-primary-500 bg-primary-50'
                                    : 'border-gray-200 hover:bg-gray-50'
                                }`}
                              >
                                <format.icon className={`h-4 w-4 ${format.color}`} />
                                <span className="text-sm font-medium">{format.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        <button
                          onClick={() => setGeneratedContent(demoGenerateWebsiteWidget())}
                          className="w-full bg-secondary-500 text-white py-2 px-3 rounded-lg hover:bg-secondary-600 transition-colors flex items-center justify-center space-x-2 text-sm"
                        >
                          <Download className="h-4 w-4" />
                          <span>Generate</span>
                        </button>

                        {generatedContent && (
                          <div className="space-y-3 animate-slide-in">
                            <div className="bg-gray-900 text-white rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs text-gray-300">Generated Code</span>
                                <button className="bg-blue-600 text-white px-2 py-1 rounded text-xs flex items-center space-x-1">
                                  <Copy className="h-3 w-3" />
                                  <span>Copy</span>
                                </button>
                              </div>
                              <pre className="text-xs whitespace-pre-wrap font-mono max-h-32 overflow-y-auto">
                                {generatedContent.substring(0, 200)}...
                              </pre>
                            </div>
                            
                            {selectedExportFormat === 'widget' && (
                              <div className="border border-gray-200 rounded-lg overflow-hidden">
                                <div className="bg-gray-50 px-3 py-2 border-b">
                                  <span className="text-xs text-gray-600">Live Preview</span>
                                </div>
                                <div className="p-3 bg-white">
                                  <div className="text-center mb-3">
                                    <h4 className="font-semibold text-gray-900 text-sm">What Our Customers Say</h4>
                                  </div>
                                  <div className="space-y-2">
                                    {mockTestimonials.slice(0, 2).map(testimonial => (
                                      <div key={testimonial.id} className="bg-gray-50 rounded-lg p-2 border-l-2 border-secondary-500">
                                        <div className="flex mb-1">
                                          {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} className="h-3 w-3 text-yellow-400 fill-current" />
                                          ))}
                                        </div>
                                        <p className="text-xs text-gray-700 mb-1 italic">"{testimonial.message.substring(0, 60)}..."</p>
                                        <div className="text-xs text-gray-500">- {testimonial.name}</div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Empty state for testimonials */}
                {getActiveTab() === 'testimonials' && testimonials.length === 0 && (
                  <div className="lg:col-span-2">
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Star className="h-8 w-8 text-primary-950" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">No testimonials yet</h3>
                      <p className="text-gray-500 text-sm">
                        Testimonials will appear here once customers submit them.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white">
      {/* Demo Navbar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between h-12">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <TestiFlowIcon className="h-6 w-6 text-primary-950" />
                <span className="text-lg font-bold text-primary-950">TestiFlow</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${getActiveTab() === 'forms' ? 'text-primary-950 bg-primary-50' : 'text-gray-700 hover:text-primary-950'}`}>
                Forms
              </button>
              <button className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${getActiveTab() === 'testimonials' ? 'text-primary-950 bg-primary-50' : 'text-gray-700 hover:text-primary-950'}`}>
                Testimonials
              </button>
              <div className="flex items-center space-x-2 pl-3 border-l border-gray-200">
                <div className="flex items-center space-x-1">
                  <div className="w-6 h-6 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center">
                    <User className="h-3 w-3 text-primary-950" />
                  </div>
                  <span className="text-xs text-gray-700 hidden sm:block">sarah@techcorp.com</span>
                </div>
                <button className="flex items-center space-x-1 text-gray-700 hover:text-red-600 text-xs transition-colors">
                  <LogOut className="h-3 w-3" />
                  <span className="hidden sm:block">Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Step Progress Indicator */}
      <div className="bg-blue-50 border-b border-blue-200 py-2">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-blue-800">
                Step {currentStep + 1}: {demoSteps[currentStep].title}
              </span>
            </div>
            <div className="text-xs text-blue-600">
              {demoSteps[currentStep].description}
            </div>
          </div>
        </div>
      </div>

      {/* Main Demo Content */}
      {renderMainContent()}
    </div>
  );
};