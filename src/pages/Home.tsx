import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Star, MessageSquare, Settings, Download, CheckCircle, User, Shield, Plus, Eye, Copy, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { TestiFlowIcon } from '../components/TestiFlowIcon';

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

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const demoRef = useRef<HTMLDivElement>(null);
  const [isDemoVisible, setIsDemoVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

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

  // Intersection Observer for demo
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isDemoVisible) {
          setIsDemoVisible(true);
          setCurrentStep(0);
        }
      },
      { threshold: 0.3 }
    );

    if (demoRef.current) {
      observer.observe(demoRef.current);
    }

    return () => observer.disconnect();
  }, [isDemoVisible]);

  // Auto-advance timer for demo
  useEffect(() => {
    if (!isDemoVisible) return;

    const timer = setTimeout(() => {
      if (currentStep < demoSteps.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        setCurrentStep(0);
        resetAllAnimations();
      }
    }, demoSteps[currentStep].duration);

    return () => clearTimeout(timer);
  }, [currentStep, isDemoVisible]);

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

  // Step-specific animations
  useEffect(() => {
    if (!isDemoVisible) return;
    
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

    } else if (currentStep === 2) { // Customer Submission
      setCustomFields([
        { id: '1', field_type: 'select', label: 'What is your role?', options: ['CEO/Founder', 'CTO', 'Marketing Manager', 'Operations Manager'], is_required: true }
      ]);
      setTimeout(() => setCustomerFormData(prev => ({ ...prev, rating: 5 })), 500);
      setTimeout(() => setCustomerFormData(prev => ({ ...prev, name: 'Sarah Johnson' })), 1000);
      setTimeout(() => setCustomerFormData(prev => ({ ...prev, email: 'sarah@techcorp.com' })), 1500);
      setTimeout(() => setCustomerFormData(prev => ({ ...prev, company: 'TechCorp Solutions' })), 2000);
      setTimeout(() => setCustomerFormData(prev => ({ ...prev, role: 'CTO' })), 2500);
      setTimeout(() => setCustomerFormData(prev => ({
        ...prev,
        message: 'TestiFlow has completely transformed how we collect and manage customer feedback. The automated workflows save us hours every week!'
      })), 3000);

    } else if (currentStep === 3) { // Testimonials Approval
      const testimonialsData = [
        {
          id: '1', name: 'Sarah Johnson', email: 'sarah@techcorp.com', company: 'TechCorp Solutions',
          message: 'TestiFlow has completely transformed how we collect and manage customer feedback.',
          rating: 5, status: 'pending', submitted_at: new Date().toISOString(), form_id: '1'
        },
        {
          id: '2', name: 'Mike Chen', email: 'mike@startupxyz.com', company: 'StartupXYZ',
          message: 'Amazing product! The testimonial management features are exactly what we needed.',
          rating: 5, status: 'approved', submitted_at: new Date(Date.now() - 86400000).toISOString(), form_id: '1'
        }
      ];
      setTestimonials(testimonialsData);
      
      setTimeout(() => {
        setHighlightedTestimonial('1');
      }, 1000);
      setTimeout(() => {
        setTestimonials(prev => prev.map(t => 
          t.id === '1' ? { ...t, status: 'approved' } : t
        ));
        setHighlightedTestimonial(null);
      }, 2500);

    } else if (currentStep === 4) { // Export
      setTestimonials([
        { id: '1', name: 'Sarah Johnson', company: 'TechCorp', message: 'TestiFlow has completely transformed our workflow.', rating: 5, status: 'approved' },
        { id: '2', name: 'Mike Chen', company: 'StartupXYZ', message: 'Amazing product! Exactly what we needed.', rating: 5, status: 'approved' }
      ]);
      setTimeout(() => setShowExportPanel(true), 1000);
      setTimeout(() => {
        setSelectedExportFormat('widget');
      }, 2500);
      setTimeout(() => {
        setGeneratedContent('<div class="testimonials-widget">...</div>');
      }, 4000);
    }
  }, [currentStep, isDemoVisible]);

  const handleSignupClick = () => {
    navigate('/signup');
    window.scrollTo(0, 0);
  };

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

  const renderDemoContent = () => {
    if (currentStep === 2) {
      // Customer submission view
      return (
        <div className="bg-gray-50 py-6">
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
                    <CheckCircle className="h-4 w-4" />
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
                              { value: 'csv', label: 'CSV', color: 'text-green-600' },
                              { value: 'json', label: 'JSON', color: 'text-blue-600' },
                              { value: 'widget', label: 'Widget', color: 'text-purple-600' }
                            ].map((format) => (
                              <button
                                key={format.value}
                                onClick={() => setSelectedExportFormat(format.value as any)}
                                className={`w-full p-2 border rounded-lg text-left transition-colors ${
                                  selectedExportFormat === format.value
                                    ? 'border-primary-500 bg-primary-50'
                                    : 'border-gray-200 hover:bg-gray-50'
                                }`}
                              >
                                <span className="text-sm font-medium">{format.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        <button
                          onClick={() => setGeneratedContent('<div>Generated code...</div>')}
                          className="w-full bg-secondary-500 text-white py-2 px-3 rounded-lg hover:bg-secondary-600 transition-colors flex items-center justify-center space-x-2 text-sm"
                        >
                          <Download className="h-4 w-4" />
                          <span>Generate</span>
                        </button>

                        {generatedContent && (
                          <div className="bg-gray-900 text-white rounded-lg p-3 animate-slide-in">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-gray-300">Generated Code</span>
                              <button className="bg-blue-600 text-white px-2 py-1 rounded text-xs">
                                Copy
                              </button>
                            </div>
                            <pre className="text-xs font-mono">
                              &lt;div class="testimonials-widget"&gt;...
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white">
      {/* 1. Hero Section - Hook them with the problem/solution */}
      <section className="relative bg-gradient-to-br from-primary-950 via-primary-900 to-secondary-500 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Content */}
            <div className="text-center lg:text-left">
              <div className="flex justify-center lg:justify-start mb-8">
                <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                  <TestiFlowIcon className="h-6 w-6 text-white" />
                  <span className="text-white font-semibold">TestiFlow by Freedom Lab</span>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Turn Customer Love Into
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-secondary-100 to-white">
                  Marketing Gold
                </span>
              </h1>
              
              <p className="text-xl text-white/90 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Stop losing potential customers because they can't find social proof. TestiFlow makes it effortless to collect, manage, and showcase authentic testimonials that drive conversions.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={handleSignupClick}
                  className="bg-white text-primary-950 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
                >
                  <span>Start Free Trial</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
              
              <p className="text-white/70 text-sm mt-4">
                7-day free trial • Cancel anytime
              </p>
            </div>

            {/* Right Column - Mobile Mockup */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="w-80 h-[600px] bg-gray-900 rounded-[3rem] p-2 shadow-2xl">
                  <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden">
                    {/* Mobile Status Bar */}
                    <div className="bg-gray-900 h-8 flex items-center justify-center">
                      <div className="w-20 h-1 bg-gray-600 rounded-full"></div>
                    </div>
                    
                    {/* Mobile Content */}
                    <div className="h-full bg-gray-50 overflow-hidden">
                      <div className="bg-primary-950 text-white p-4 text-center">
                        <div className="flex justify-center mb-2">
                          <TestiFlowIcon className="h-5 w-5 text-white" />
                        </div>
                        <h2 className="font-bold text-sm">Share Your Experience</h2>
                        <p className="text-xs text-white/80 mt-1">We'd love your feedback!</p>
                      </div>
                      
                      <div className="p-4 space-y-3">
                        <div>
                          <div className="text-xs text-gray-600 mb-1">Rating</div>
                          <div className="flex space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} className="h-4 w-4 text-yellow-400 fill-current" />
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-xs text-gray-600 mb-1">Name</div>
                          <div className="bg-white border border-gray-200 rounded p-2 text-xs">Sarah Johnson</div>
                        </div>
                        
                        <div>
                          <div className="text-xs text-gray-600 mb-1">Company</div>
                          <div className="bg-white border border-gray-200 rounded p-2 text-xs">TechCorp</div>
                        </div>
                        
                        <div>
                          <div className="text-xs text-gray-600 mb-1">Testimonial</div>
                          <div className="bg-white border border-gray-200 rounded p-2 h-16 text-xs text-gray-500">
                            Amazing product! Has saved us...
                          </div>
                        </div>
                        
                        <button className="w-full bg-secondary-500 text-white py-2 rounded text-sm font-medium">
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Demo Video Section - Scroll-triggered animation */}
      <section ref={demoRef} className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              See TestiFlow in Action
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Watch how easy it is to collect, manage, and use customer testimonials with our intuitive platform.
            </p>
          </div>

          {/* Step Progress */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 mb-8 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-secondary-500 rounded-full animate-pulse"></div>
                <span className="text-lg font-semibold text-gray-900">
                  Step {currentStep + 1}: {demoSteps[currentStep].title}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                {demoSteps[currentStep].description}
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-secondary-500 to-primary-950 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / demoSteps.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Demo Interface */}
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
            {/* Demo Navbar */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TestiFlowIcon className="h-6 w-6 text-primary-950" />
                  <span className="text-lg font-bold text-primary-950">TestiFlow</span>
                </div>
                <div className="flex items-center space-x-4">
                  <button className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${getActiveTab() === 'forms' ? 'text-primary-950 bg-primary-50' : 'text-gray-700 hover:text-primary-950'}`}>
                    Forms
                  </button>
                  <button className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${getActiveTab() === 'testimonials' ? 'text-primary-950 bg-primary-50' : 'text-gray-700 hover:text-primary-950'}`}>
                    Testimonials
                  </button>
                  <div className="flex items-center space-x-2 pl-4 border-l border-gray-200">
                    <div className="w-6 h-6 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center">
                      <User className="h-3 w-3 text-primary-950" />
                    </div>
                    <span className="text-sm text-gray-700">sarah@techcorp.com</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Demo Content */}
            {renderDemoContent()}
          </div>
        </div>
      </section>

      {/* 3. Key Features - Detailed breakdown */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Manage Testimonials
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From collection to conversion, TestiFlow provides all the tools you need to turn customer feedback into powerful marketing assets.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: MessageSquare,
                title: 'Smart Collection Forms',
                description: 'Create beautiful, branded forms that make it easy for customers to share their experiences.',
                color: 'text-blue-600',
                bgColor: 'bg-blue-50'
              },
              {
                icon: Settings,
                title: 'Custom Fields & Logic',
                description: 'Add custom questions, conditional logic, and rich media uploads to gather detailed feedback.',
                color: 'text-purple-600',
                bgColor: 'bg-purple-50'
              },
              {
                icon: CheckCircle,
                title: 'Approval Workflow',
                description: 'Review and approve testimonials before they go live. Maintain quality and brand consistency.',
                color: 'text-secondary-500',
                bgColor: 'bg-secondary-50'
              },
              {
                icon: Download,
                title: 'Export & Integration',
                description: 'Export testimonials as CSV, JSON, or embed widgets directly on your website.',
                color: 'text-green-600',
                bgColor: 'bg-green-50'
              },
              {
                icon: Star,
                title: 'Rich Media Support',
                description: 'Collect video testimonials, photos, and detailed ratings for more engaging social proof.',
                color: 'text-yellow-600',
                bgColor: 'bg-yellow-50'
              },
              {
                icon: Shield,
                title: 'Privacy & Compliance',
                description: 'Built-in consent management and data protection features to keep you compliant.',
                color: 'text-red-600',
                bgColor: 'bg-red-50'
              }
            ].map((feature, index) => (
              <div key={index} className="group hover:shadow-lg transition-all duration-300 bg-white border border-gray-200 rounded-xl p-6">
                <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Social Proof - Build trust */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by Growing Businesses
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of companies using TestiFlow to showcase their customer success
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "TestiFlow has completely transformed how we collect customer feedback. The automated workflows save us hours every week!",
                author: "Sarah Johnson",
                role: "CTO, TechCorp",
                rating: 5
              },
              {
                quote: "The export features are incredible. We can now easily use testimonials across all our marketing channels.",
                author: "Mike Chen",
                role: "Marketing Director, StartupXYZ",
                rating: 5
              },
              {
                quote: "Amazing product! The testimonial management features are exactly what we needed for our campaigns.",
                author: "Emily Davis",
                role: "Growth Manager, ScaleCo",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.quote}"</p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-primary-950" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.author}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Pricing - Convert when they're convinced */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Choose the plan that fits your testimonial management needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Basic Plan */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300">
              <div className="bg-gray-50 px-6 py-8 text-center border-b border-gray-200">
                <h3 className="text-2xl font-bold text-primary-950">Basic</h3>
                <div className="mt-4 flex items-baseline justify-center">
                  <span className="text-5xl font-bold text-primary-950">$29</span>
                  <span className="text-xl text-gray-500 ml-1">/month</span>
                </div>
                <p className="mt-2 text-gray-600">Perfect for small businesses</p>
              </div>
              
              <div className="px-6 py-8">
                <ul className="space-y-4">
                  {[
                    'Up to 50 testimonials',
                    'Email collection forms',
                    'Basic organization',
                    'Export to CSV',
                    'Simple branding',
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-secondary-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-secondary-500 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-accent-500 to-accent-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                  MOST POPULAR
                </span>
              </div>
              <div className="bg-gradient-to-r from-primary-950 to-secondary-500 px-6 py-8 text-center">
                <h3 className="text-2xl font-bold text-white">Pro</h3>
                <div className="mt-4 flex items-baseline justify-center">
                  <span className="text-5xl font-bold text-white">$49</span>
                  <span className="text-xl text-white/80 ml-1">/month</span>
                </div>
                <p className="mt-2 text-white/90">Perfect for agencies and growing businesses</p>
              </div>
              
              <div className="px-6 py-8">
                <ul className="space-y-4">
                  {[
                    'Everything in Basic, plus:',
                    'Unlimited testimonials',
                    'Approval workflow',
                    'Rich media support',
                    'Integration tools',
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-secondary-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <button
              onClick={handleSignupClick}
              className="bg-primary-950 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-900 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 mx-auto"
            >
              <span>Start Free Trial</span>
              <ArrowRight className="h-5 w-5" />
            </button>
            <p className="text-gray-500 text-sm mt-3">7-day free trial</p>
          </div>
        </div>
      </section>

      {/* 6. FAQ - Handle objections */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about TestiFlow
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                question: "How quickly can I start collecting testimonials?",
                answer: "You can create your first form and start collecting testimonials within minutes. Our intuitive setup process guides you through creating branded forms that you can share immediately."
              },
              {
                question: "Can I customize the look and feel of my forms?",
                answer: "Absolutely! TestiFlow includes comprehensive branding options including custom logos, colors, fonts, and thank you messages to match your brand perfectly."
              },
              {
                question: "What happens to my testimonials if I cancel?",
                answer: "You can export all your testimonials as CSV or JSON before canceling. We also provide a 30-day grace period to download your data after cancellation."
              },
              {
                question: "Do you offer integrations with other tools?",
                answer: "Yes! TestiFlow provides export options and embeddable widgets that work with most marketing tools, websites, and CRM systems. We're constantly adding new integrations."
              },
              {
                question: "Is there a limit on form responses?",
                answer: "The Basic plan includes up to 50 testimonials, while the Pro plan offers unlimited testimonials. You can upgrade anytime as your needs grow."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                  {expandedFaq === index ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Final CTA - Last chance conversion */}
      <section className="py-24 bg-gradient-to-r from-primary-950 to-secondary-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Customer Feedback?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses using TestiFlow to collect and showcase authentic customer testimonials that drive real results.
          </p>
          
          <button
            onClick={handleSignupClick}
            className="bg-white text-primary-950 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 mx-auto"
          >
            <span>Start Your Free Trial</span>
            <ArrowRight className="h-5 w-5" />
          </button>
          
          <p className="text-white/70 text-sm mt-4">
            7-day free trial • Cancel anytime
          </p>
        </div>
      </section>
    </div>
  );
};