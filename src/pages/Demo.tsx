import React, { useState, useEffect, useRef } from 'react';
import { TestiFlowIcon } from '../components/TestiFlowIcon';
import { User, LogOut, Plus, Settings, Eye, Copy, ExternalLink, Star, CheckCircle, X, Clock, Upload, Save, Palette, Download, FileText, Code, Share2 } from 'lucide-react';

interface DemoStep {
  id: string;
  title: string;
  description: string;
  duration: number;
}

const demoSteps: DemoStep[] = [
  { id: 'create-form', title: 'Create Forms', description: 'Setting up testimonial collection forms', duration: 10000 },
  { id: 'custom-fields', title: 'Add Custom Fields', description: 'Adding custom questions to the form', duration: 12000 },
  { id: 'customer-submission', title: 'Customer Fills Form', description: 'Customer submitting their testimonial', duration: 15000 },
  { id: 'testimonials-approval', title: 'Review & Approve', description: 'Managing testimonials in the dashboard', duration: 10000 },
  { id: 'export-use', title: 'Export & Use', description: 'Using testimonials in your marketing', duration: 12000 },
  { id: 'branding', title: 'Customize Branding', description: 'Personalizing form appearance', duration: 8000 },
];

export const Demo: React.FC = () => {
  const demoContainerRef = useRef<HTMLDivElement>(null);

  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  // Demo state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thank_you_message: ''
  });
  const [createdForm, setCreatedForm] = useState<any>(null);
  const [showCustomFields, setShowCustomFields] = useState(false);
  const [customFields, setCustomFields] = useState<any[]>([]);
  const [showAddField, setShowAddField] = useState(false);
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
  const [viewingTestimonial, setViewingTestimonial] = useState<any>(null);
  const [primaryColor, setPrimaryColor] = useState('#01004d');
  const [secondaryColor, setSecondaryColor] = useState('#01b79e');
  const [logoUrl, setLogoUrl] = useState('');
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedExportFormat, setSelectedExportFormat] = useState<'csv' | 'json' | 'social' | 'widget'>('csv');
  const [generatedContent, setGeneratedContent] = useState('');
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedExportFormat, setSelectedExportFormat] = useState<'csv' | 'json' | 'social' | 'widget'>('csv');
  const [generatedContent, setGeneratedContent] = useState('');

  useEffect(() => {
    if (demoContainerRef.current) {
      demoContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentStep]);

  // Auto-advance timer
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setTimeout(() => {
      if (currentStep < demoSteps.length - 1) {
        setCurrentStep(prev => prev + 1);
        setProgress(0);
      } else {
        // Reset to beginning
        setCurrentStep(0);
        resetAllAnimations();
      }
    }, demoSteps[currentStep].duration);

    return () => clearTimeout(timer);
  }, [currentStep, isPlaying]);

  // Progress bar animation
  useEffect(() => {
    const duration = demoSteps[currentStep].duration;
    const interval = 50;
    const increment = (interval / duration) * 100;

    const timer = setInterval(() => {
      if (isPlaying) {
        setProgress(prev => Math.min(prev + increment, 100));
      }
    }, interval);

    return () => clearInterval(timer);
  }, [currentStep, isPlaying]);

  const resetAllAnimations = () => {
    setShowCreateForm(false);
    setFormData({ title: '', description: '', thank_you_message: '' });
    setCreatedForm(null);
    setShowCustomFields(false);
    setCustomFields([]);
    setShowAddField(false);
    setNewField({ field_type: 'select', label: '', options: [''] });
    setCustomerFormData({ name: '', email: '', company: '', message: '', rating: 0, role: '', industry: '' });
    setTestimonials([]);
    setViewingTestimonial(null);
    setPrimaryColor('#01004d');
    setSecondaryColor('#01b79e');
    setLogoUrl('');
    setShowExportModal(false);
    setGeneratedContent('');
  };

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
      submitted_at: '2024-01-15T10:30:00Z',
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
      submitted_at: '2024-01-14T14:20:00Z',
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
      submitted_at: '2024-01-13T09:15:00Z',
      form_title: 'Customer Experience Survey'
    }
  ];

  const generateSocialPost = (testimonial: any) => {
    const stars = '⭐'.repeat(testimonial.rating);
    return `${stars} Customer Love!\n\n"${testimonial.message}"\n\n- ${testimonial.name}${testimonial.company ? `, ${testimonial.company}` : ''}\n\n#CustomerSuccess #Testimonial`;
  };

  const generateWebsiteWidget = () => {
    return `<div class="testimonials-widget" style="max-width: 1000px; margin: 0 auto; padding: 20px;">
  <h3 style="text-align: center; margin-bottom: 20px; color: #333;">What Our Customers Say</h3>
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
    ${mockTestimonials.slice(0, 3).map(testimonial => `
    <div style="background: #f9f9f9; padding: 20px; border-radius: 12px; border-left: 4px solid #01b79e; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <div style="display: flex; margin-bottom: 8px;">
        ${'★'.repeat(testimonial.rating)}<span style="color: #ddd;">${'★'.repeat(5 - testimonial.rating)}</span>
      </div>
      <p style="margin: 0 0 15px 0; font-style: italic; color: #555; line-height: 1.5;">"${testimonial.message}"</p>
      <div style="font-size: 14px; color: #777;">
        - ${testimonial.name}${testimonial.company ? `, ${testimonial.company}` : ''}
      </div>
    </div>`).join('')}
  </div>
</div>`;
  };

  const handleExportDemo = () => {
    switch (selectedExportFormat) {
      case 'social':
        setGeneratedContent(generateSocialPost(mockTestimonials[0]));
        break;
      case 'widget':
        setGeneratedContent(generateWebsiteWidget());
        break;
      case 'csv':
        setGeneratedContent(`Name,Email,Company,Rating,Testimonial,Status,Date,Form
"Sarah Johnson","sarah@techcorp.com","TechCorp",5,"TestiFlow has completely transformed how we collect customer feedback. The automated workflows save us hours every week!","approved","2024-01-15","Customer Experience Survey"
"Mike Chen","mike@startup.com","StartupXYZ",5,"Amazing product! The testimonial management features are exactly what we needed for our marketing campaigns.","approved","2024-01-14","Customer Experience Survey"
"Emily Davis","emily@growth.com","GrowthCo",4,"The export features are incredible. We can now easily use testimonials across all our marketing channels.","approved","2024-01-13","Customer Experience Survey"`);
        break;
      case 'json':
        setGeneratedContent(JSON.stringify(mockTestimonials, null, 2));
        break;
    }
  };

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
      submitted_at: '2024-01-15T10:30:00Z',
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
      submitted_at: '2024-01-14T14:20:00Z',
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
      submitted_at: '2024-01-13T09:15:00Z',
      form_title: 'Customer Experience Survey'
    }
  ];

  const generateSocialPost = (testimonial: any) => {
    const stars = '⭐'.repeat(testimonial.rating);
    return `${stars} Customer Love!\n\n"${testimonial.message}"\n\n- ${testimonial.name}${testimonial.company ? `, ${testimonial.company}` : ''}\n\n#CustomerSuccess #Testimonial`;
  };

  const generateWebsiteWidget = () => {
    return `<!-- Testimonials Widget -->
<div class="testimonials-widget" style="max-width: 1000px; margin: 0 auto; padding: 20px;">
  <h3 style="text-align: center; margin-bottom: 20px; color: #333;">What Our Customers Say</h3>
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
    ${mockTestimonials.slice(0, 3).map(testimonial => `
    <div style="background: #f9f9f9; padding: 20px; border-radius: 12px; border-left: 4px solid #01b79e; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <div style="display: flex; margin-bottom: 8px;">
        ${'★'.repeat(testimonial.rating)}<span style="color: #ddd;">${'★'.repeat(5 - testimonial.rating)}</span>
      </div>
      <p style="margin: 0 0 15px 0; font-style: italic; color: #555; line-height: 1.5;">"${testimonial.message}"</p>
      <div style="font-size: 14px; color: #777;">
        - ${testimonial.name}${testimonial.company ? `, ${testimonial.company}` : ''}
      </div>
    </div>`).join('')}
  </div>
</div>`;
  };

  const handleExportDemo = () => {
    switch (selectedExportFormat) {
      case 'social':
        setGeneratedContent(generateSocialPost(mockTestimonials[0]));
        break;
      case 'widget':
        setGeneratedContent(generateWebsiteWidget());
        break;
      case 'csv':
        setGeneratedContent(`Name,Email,Company,Rating,Testimonial,Status,Date,Form
"Sarah Johnson","sarah@techcorp.com","TechCorp",5,"TestiFlow has completely transformed how we collect customer feedback. The automated workflows save us hours every week!","approved","2024-01-15","Customer Experience Survey"
"Mike Chen","mike@startup.com","StartupXYZ",5,"Amazing product! The testimonial management features are exactly what we needed for our marketing campaigns.","approved","2024-01-14","Customer Experience Survey"
"Emily Davis","emily@growth.com","GrowthCo",4,"The export features are incredible. We can now easily use testimonials across all our marketing channels.","approved","2024-01-13","Customer Experience Survey"`);
        break;
      case 'json':
        setGeneratedContent(JSON.stringify(mockTestimonials, null, 2));
        break;
    }
  };

  // Step-specific animations
  useEffect(() => {
    resetAllAnimations();

    if (currentStep === 0) {
      // Create Forms step
      setTimeout(() => setShowCreateForm(true), 1000);
      setTimeout(() => setFormData({
        title: 'Share Your Experience with TechCorp',
        description: "We'd love to hear about your experience with our software solutions!",
        thank_you_message: 'Thank you for taking the time to share your feedback!'
      }), 2500);
      setTimeout(() => {
        setShowCreateForm(false);
        setCreatedForm({
          id: '1',
          title: 'Share Your Experience with TechCorp',
          description: "We'd love to hear about your experience with our software solutions!",
          is_active: true,
          created_at: new Date().toISOString()
        });
      }, 7000);

    } else if (currentStep === 1) {
      // Custom Fields step
      setCreatedForm({
        id: '1',
        title: 'Share Your Experience with TechCorp',
        description: "We'd love to hear about your experience with our software solutions!",
        is_active: true,
        created_at: new Date().toISOString()
      });
      setTimeout(() => setShowCustomFields(true), 500);
      setTimeout(() => setShowAddField(true), 1500);
      setTimeout(() => setNewField({
        field_type: 'select',
        label: 'What is your role?',
        options: ['CEO/Founder', 'CTO', 'Marketing Manager', 'Operations Manager']
      }), 2500);
      setTimeout(() => {
        setShowAddField(false);
        setCustomFields([{
          id: '1',
          field_type: 'select',
          label: 'What is your role?',
          options: ['CEO/Founder', 'CTO', 'Marketing Manager', 'Operations Manager'],
          is_required: true
        }]);
      }, 5000);
      setTimeout(() => setShowAddField(true), 5500);
      setTimeout(() => setNewField({
        field_type: 'select',
        label: 'What industry are you in?',
        options: ['Technology', 'Healthcare', 'Finance', 'E-commerce', 'Consulting']
      }), 6000);
      setTimeout(() => {
        setShowAddField(false);
        setCustomFields(prev => [...prev, {
          id: '2',
          field_type: 'select',
          label: 'What industry are you in?',
          options: ['Technology', 'Healthcare', 'Finance', 'E-commerce', 'Consulting'],
          is_required: false
        }]);
      }, 7500);

    } else if (currentStep === 2) {
        // Set custom fields so they render in the form
        setCustomFields([
            { id: '1', field_type: 'select', label: 'What is your role?', options: ['CEO/Founder', 'CTO', 'Marketing Manager', 'Operations Manager'], is_required: true },
            { id: '2', field_type: 'select', label: 'What industry are you in?', options: ['Technology', 'Healthcare', 'Finance', 'E-commerce', 'Consulting'], is_required: false }
        ]);
      // Customer submission step
      setTimeout(() => setCustomerFormData(prev => ({ ...prev, rating: 5 })), 1000);
      setTimeout(() => setCustomerFormData(prev => ({ ...prev, name: 'Sarah Johnson' })), 2000);
      setTimeout(() => setCustomerFormData(prev => ({ ...prev, email: 'sarah@techcorp.com' })), 3000);
      setTimeout(() => setCustomerFormData(prev => ({ ...prev, company: 'TechCorp Solutions' })), 4000);
      setTimeout(() => setCustomerFormData(prev => ({ ...prev, role: 'CTO' })), 5000);
      setTimeout(() => setCustomerFormData(prev => ({ ...prev, industry: 'Technology' })), 6000);
      setTimeout(() => setCustomerFormData(prev => ({
        ...prev,
        message: 'TestiFlow has completely transformed how we collect and manage customer feedback. The automated workflows save us hours every week, and the approval system ensures we only showcase our best testimonials. Our conversion rates have improved by 40% since implementing their testimonial widgets on our website!'
      })), 7000);

    } else if (currentStep === 3) {
      // Testimonials approval step
      const testimonialsData = [
        {
          id: '1',
          name: 'Sarah Johnson',
          email: 'sarah@techcorp.com',
          company: 'TechCorp Solutions',
          message: 'TestiFlow has completely transformed how we collect and manage customer feedback. The automated workflows save us hours every week, and the approval system ensures we only showcase our best testimonials. Our conversion rates have improved by 40% since implementing their testimonial widgets on our website!',
          rating: 5,
          status: 'pending',
          submitted_at: new Date().toISOString(),
          form_id: '1',
          custom_responses: {
            'What is your role?': 'CTO',
            'What industry are you in?': 'Technology'
          }
        },
        {
          id: '2',
          name: 'Mike Chen',
          email: 'mike@startupxyz.com',
          company: 'StartupXYZ',
          message: 'Amazing tool for collecting testimonials!',
          rating: 5,
          status: 'approved',
          submitted_at: new Date(Date.now() - 86400000).toISOString(),
          form_id: '1'
        }
      ];
      setTestimonials(testimonialsData);
      setTimeout(() => {
        setViewingTestimonial(testimonialsData[0]);
      }, 2000);

    } else if (currentStep === 4) {
      // Export step animations
      setTestimonials(mockTestimonials);
      setTimeout(() => setShowExportModal(true), 1500);
      setTimeout(() => {
        setSelectedExportFormat('widget');
      }, 3000);
      setTimeout(() => {
        setGeneratedContent(generateWebsiteWidget());
      }, 5000);

    } else if (currentStep === 5) {
      // Branding step
      setTimeout(() => setLogoUrl('/2.png'), 1500);
      setTimeout(() => setPrimaryColor('#2563eb'), 3000);
      setTimeout(() => setSecondaryColor('#10b981'), 4500);
    }
  }, [currentStep]);

  const getActiveTab = () => {
    switch (currentStep) {
      case 0: return 'forms';
      case 1: return 'forms';
      case 2: return 'submit';
      case 3: return 'testimonials';
      case 4: return 'testimonials';
      case 5: return 'branding';
      default: return 'dashboard';
    }
  };

  const renderCreateFormsStep = () => (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Forms</h1>
                <p className="text-gray-600 mt-2">Create and manage testimonial collection forms</p>
              </div>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-primary-950 text-white px-6 py-3 rounded-lg hover:bg-primary-900 transition-all duration-200 flex items-center space-x-2 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus className="h-5 w-5" />
                <span>New Form</span>
              </button>
            </div>

            {createdForm ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 relative group animate-slide-in">
                  <div className="absolute top-4 right-4">
                    <div className="w-6 h-6 text-secondary-500">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17 7H22V9H17V7ZM17 11H22V13H17V11ZM17 15H22V17H17V15ZM13.5 12L16 14.5L11.5 19L8.5 16L10 14.5L11.5 16L13.5 12Z"/>
                      </svg>
                    </div>
                  </div>

                  <div className="mb-4 pr-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 leading-tight">{createdForm.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{createdForm.description}</p>
                  </div>

                  <div className="mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-secondary-100 text-secondary-800">
                      <div className="w-2 h-2 rounded-full mr-2 bg-secondary-500"></div>
                      Active
                    </span>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                      <div className="flex items-center space-x-1">
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        <span>Created {new Date(createdForm.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <button className="text-primary-950 hover:text-primary-800 text-sm font-medium flex items-center space-x-1 transition-colors">
                      <Eye className="h-4 w-4" />
                      <span>View Details</span>
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
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Settings className="h-12 w-12 text-primary-950" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">Create Your First Form</h3>
                <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg">
                  Start gathering customer testimonials by creating a customized form that you can share with your customers.
                </p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-primary-950 text-white px-8 py-4 rounded-lg hover:bg-primary-900 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-lg"
                >
                  Create Your First Form
                </button>
              </div>
            )}

            {/* Create Form Modal */}
            {showCreateForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Create New Form</h2>
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Form Title</label>
                        <input
                          type="text"
                          value={formData.title}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Thank You Message</label>
                        <input
                          type="text"
                          value={formData.thank_you_message}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          readOnly
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        value={formData.description}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        readOnly
                      />
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-blue-900 mb-3">📸 Media Upload Options</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" checked className="rounded border-gray-300 text-primary-950 focus:ring-primary-500" readOnly />
                            <label className="text-sm font-medium text-gray-700">Allow image uploads</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">Max size:</span>
                            <select className="text-xs border border-gray-300 rounded px-2 py-1" disabled>
                              <option>10MB</option>
                            </select>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" className="rounded border-gray-300 text-primary-950 focus:ring-primary-500" readOnly />
                            <label className="text-sm font-medium text-gray-700">Allow video uploads</label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-3 pt-4">
                      <button
                        type="button"
                        className="flex-1 bg-primary-950 text-white py-2 px-4 rounded-md hover:bg-primary-900 transition-colors font-medium"
                      >
                        Create Form
                      </button>
                      <button
                        type="button"
                        className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderCustomFieldsStep = () => (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            {showCustomFields && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">
                      Customize Form: Share Your Experience with TechCorp
                    </h2>
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                    <div className="space-y-6">
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
                      </div>

                      <div className="space-y-3">
                        {customFields.map((field, index) => (
                          <div key={field.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 animate-slide-in">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {field.label}
                                    {field.is_required && <span className="text-red-500 ml-1">*</span>}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    Dropdown Menu • {field.options.join(', ')}
                                  </div>
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                                <button className="p-2 text-red-400 hover:text-red-600 transition-colors">
                                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}

                        {customFields.length === 0 && !showAddField && (
                          <div className="text-center py-8 text-gray-500">
                            <p>No custom fields yet. Your form already includes the standard fields above - add additional questions here!</p>
                          </div>
                        )}
                      </div>

                      {showAddField && (
                        <div className="bg-white border border-gray-200 rounded-lg p-6 animate-slide-in">
                          <h3 className="text-lg font-bold text-gray-900 mb-4">Add Custom Field</h3>
                          
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Field Type</label>
                              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                                <p className="text-sm text-yellow-800">
                                  💡 <strong>Tip:</strong> Your form already includes name, email, company, rating, and testimonial fields.
                                  Add custom fields here for additional questions like "How did you hear about us?\" or \"What's your role?"
                                </p>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <button
                                  type="button"
                                  className="p-3 border border-primary-500 bg-primary-50 rounded-lg text-left transition-colors"
                                >
                                  <div className="flex items-center space-x-2">
                                    <span className="text-lg">📋</span>
                                    <span className="font-medium">Dropdown Menu</span>
                                  </div>
                                </button>
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Question/Label</label>
                              <input
                                type="text"
                                value={newField.label}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                readOnly
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
                              <div className="space-y-2">
                                {newField.options.map((option, index) => (
                                  <div key={index} className="flex space-x-2">
                                    <input
                                      type="text"
                                      value={option}
                                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                      readOnly
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <input type="checkbox" checked className="rounded border-gray-300 text-primary-950 focus:ring-primary-500" readOnly />
                              <label className="text-sm text-gray-700">Required field</label>
                            </div>

                            <div className="flex space-x-3 pt-4">
                              <button
                                type="button"
                                className="flex-1 bg-primary-950 text-white py-2 px-4 rounded-md hover:bg-primary-900 transition-colors"
                              >
                                Add Field
                              </button>
                              <button
                                type="button"
                                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderCustomerSubmissionStep = () => (
    <div className="min-h-screen bg-gray-50 py-12" style={{ fontFamily: 'Montserrat' }}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div
            className="px-6 py-8 text-center text-white"
            style={{ backgroundColor: primaryColor }}
          >
            <div className="flex justify-center mb-4">
                {logoUrl ? 
                    <img 
                      src="/2.png" 
                      alt="Freedom Lab Logo" 
                      className="h-8 max-w-32 object-contain"
                      onError={(e) => {
                        console.log('Logo failed to load');
                        e.currentTarget.style.display = 'none';
                      }}
                    /> :
                    <img 
                      src="/2.png" 
                      alt="Company Logo" 
                      className="h-8 max-w-32 object-contain"
                    />
                }
            </div>
            <h1 className="text-2xl font-bold mb-2">Share Your Experience with TechCorp</h1>
            <p className="text-white/90">We'd love to hear about your experience with our software solutions!</p>
          </div>

          <div className="p-6">
            <form className="space-y-6">
              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  How would you rate your experience? *
                </label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-8 w-8 transition-colors ${
                        star <= customerFormData.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                <input
                  type="text"
                  value={customerFormData.name}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  readOnly
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  value={customerFormData.email}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  readOnly
                />
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company (Optional)</label>
                <input
                  type="text"
                  value={customerFormData.company}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  readOnly
                />
              </div>

              {/* Custom Fields */}
              {customFields.map((field) => (
                <div key={field.id}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                    {field.is_required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <select
                    value={customerFormData[field.label.includes('role') ? 'role' : 'industry']}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50"
                    disabled
                    >
                    <option value="">Select an option...</option>
                    {field.options.map((option, index) => (
                        <option key={index} value={option}>{option}</option>
                    ))}
                    </select>
                </div>
              ))}

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Testimonial *</label>
                <textarea
                  rows={4}
                  value={customerFormData.message}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  readOnly
                />
              </div>

              {/* Media Upload Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Add Media (Optional)</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Click to upload an image</p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  className="w-full text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                  style={{ backgroundColor: secondaryColor }}
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  <span>Submit Testimonial</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTestimonialsApprovalStep = () => (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Testimonials</h1>
                <p className="text-gray-600 mt-2">Review, approve, and manage customer testimonials</p>
              </div>
              <div className="flex space-x-2">
                <select className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                </select>
                <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Export</span>
                </button>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200 relative animate-slide-in">
                  <div className="absolute top-4 right-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      testimonial.status === 'approved' 
                        ? 'bg-secondary-100 text-secondary-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {testimonial.status}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-primary-950" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        {testimonial.email}
                      </div>
                      {testimonial.company && (
                        <div className="text-sm text-gray-500 flex items-center">
                          <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                          </svg>
                          {testimonial.company}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">({testimonial.rating}/5)</span>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                      "{testimonial.message}"
                    </p>
                  </div>

                  {testimonial.custom_responses && (
                    <div className="mb-4">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="text-xs text-blue-800 font-medium">
                          +{Object.keys(testimonial.custom_responses).length} additional response{Object.keys(testimonial.custom_responses).length !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="text-xs text-gray-500 mb-4 space-y-1">
                    <div>From: Share Your Experience with TechCorp</div>
                    <div>Submitted: {new Date(testimonial.submitted_at).toLocaleDateString()}</div>
                  </div>

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
                          <button className="bg-secondary-100 text-secondary-800 hover:bg-secondary-200 px-3 py-1 rounded-md text-xs font-medium transition-colors">
                            Approve
                          </button>
                          <button className="bg-red-100 text-red-800 hover:bg-red-200 px-3 py-1 rounded-md text-xs font-medium transition-colors">
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* View Testimonial Modal */}
            {viewingTestimonial && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Testimonial Details</h2>
                    <button
                      onClick={() => setViewingTestimonial(null)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center">
                        <User className="h-8 w-8 text-primary-950" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xl font-semibold text-gray-900">{viewingTestimonial.name}</div>
                        <div className="text-gray-600 flex items-center space-x-1">
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                          </svg>
                          <span>{viewingTestimonial.email}</span>
                        </div>
                        {viewingTestimonial.company && (
                          <div className="text-gray-600 flex items-center space-x-1">
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                            </svg>
                            <span>{viewingTestimonial.company}</span>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          viewingTestimonial.status === 'approved' 
                            ? 'bg-secondary-100 text-secondary-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {viewingTestimonial.status}
                        </span>
                      </div>
                    </div>

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

                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Testimonial</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-800 leading-relaxed italic">
                          "{viewingTestimonial.message}"
                        </p>
                      </div>
                    </div>

                    {viewingTestimonial.custom_responses && (
                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-gray-700 mb-3">Additional Responses</h3>
                        <div className="space-y-4">
                          {Object.entries(viewingTestimonial.custom_responses).map(([question, answer]) => (
                            <div key={question} className="bg-gray-50 rounded-lg p-4">
                              <div className="text-sm font-medium text-gray-700 mb-2">{question}</div>
                              <div className="text-sm text-gray-700">{typeof answer === 'string' ? answer : ''}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Form:</span>
                          <div className="font-medium text-gray-900">Share Your Experience with TechCorp</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Submitted:</span>
                          <div className="font-medium text-gray-900">
                            {new Date(viewingTestimonial.submitted_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>

                    {viewingTestimonial.status === 'pending' && (
                      <div className="flex space-x-3">
                        <button className="flex-1 bg-secondary-500 text-white py-3 px-4 rounded-lg hover:bg-secondary-600 transition-colors font-medium flex items-center justify-center space-x-2">
                          <CheckCircle className="h-4 w-4" />
                          <span>Approve</span>
                        </button>
                        <button className="flex-1 bg-red-500 text-white py-3 px-4 rounded-lg hover:bg-red-600 transition-colors font-medium flex items-center justify-center space-x-2">
                          <X className="h-4 w-4" />
                          <span>Reject</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderExportStep = () => (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Export & Use Your Testimonials</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Export your approved testimonials in multiple formats for use across your marketing channels
            </p>
          </div>

          {/* Export Modal */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Export Testimonials</h3>
              <button
                onClick={() => setShowExportModal(!showExportModal)}
                className="bg-primary-950 text-white px-4 py-2 rounded-lg hover:bg-primary-900 transition-colors flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Export Options</span>
              </button>
            </div>

            {showExportModal && (
              <div className="space-y-6 animate-slide-in">
                {/* Format Selection */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Choose Export Format</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <button
                      onClick={() => setSelectedExportFormat('csv')}
                      className={`p-3 border rounded-lg text-left transition-colors ${
                        selectedExportFormat === 'csv'
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <FileText className="h-5 w-5 text-green-600" />
                        <span className="font-medium">CSV</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">For spreadsheets</p>
                    </button>

                    <button
                      onClick={() => setSelectedExportFormat('json')}
                      className={`p-3 border rounded-lg text-left transition-colors ${
                        selectedExportFormat === 'json'
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Code className="h-5 w-5 text-blue-600" />
                        <span className="font-medium">JSON</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">For developers</p>
                    </button>
                    
                    <button
                      onClick={() => setSelectedExportFormat('social')}
                      className={`p-3 border rounded-lg text-left transition-colors ${
                        selectedExportFormat === 'social'
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Share2 className="h-5 w-5 text-purple-600" />
                        <span className="font-medium">Social Post</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">For social media</p>
                    </button>

                    <button
                      onClick={() => setSelectedExportFormat('widget')}
                      className={`p-3 border rounded-lg text-left transition-colors ${
                        selectedExportFormat === 'widget'
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Code className="h-5 w-5 text-indigo-600" />
                        <span className="font-medium">Widget</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">HTML embed</p>
                    </button>
                  </div>
                </div>

                {/* Generate Button */}
                <div className="text-center">
                  <button
                    onClick={handleExportDemo}
                    className="bg-secondary-500 text-white px-6 py-3 rounded-lg hover:bg-secondary-600 transition-colors flex items-center space-x-2 mx-auto"
                  >
                    <Download className="h-5 w-5" />
                    <span>Generate {selectedExportFormat.toUpperCase()}</span>
                  </button>
                </div>

                {/* Generated Content Preview */}
                {generatedContent && (
                  <div className="space-y-4 animate-slide-in">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-700">
                        Generated {selectedExportFormat.toUpperCase()} Content
                      </h4>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(generatedContent);
                        }}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md text-sm hover:bg-blue-200 transition-colors flex items-center space-x-1"
                      >
                        <Copy className="h-3 w-3" />
                        <span>Copy</span>
                      </button>
                    </div>
                    
                    <div className="bg-gray-900 text-white rounded-lg p-4 border border-gray-200">
                      <pre className="text-sm whitespace-pre-wrap font-mono max-h-64 overflow-y-auto">
                        {generatedContent}
                      </pre>
                    </div>

                    {/* Live Preview for Widget */}
                    {selectedExportFormat === 'widget' && (
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-gray-700">Live Preview</h4>
                        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                            <span className="text-sm text-gray-600">How this will look on your website:</span>
                          </div>
                          <div className="p-6">
                            <div style={{ maxWidth: '1000px', margin: '0 auto', fontFamily: 'Montserrat, system-ui, sans-serif' }}>
                              <h3 style={{ textAlign: 'center', marginBottom: '20px', color: '#333', fontSize: '1.5rem', fontWeight: 'bold' }}>What Our Customers Say</h3>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                                {mockTestimonials.slice(0, 3).map(testimonial => (
                                  <div key={testimonial.id} style={{
                                    background: '#f9f9f9',
                                    padding: '20px',
                                    borderRadius: '12px',
                                    borderLeft: '4px solid #01b79e',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                  }}>
                                    <div style={{ display: 'flex', marginBottom: '8px', color: '#f5b014' }}>
                                      {'★'.repeat(testimonial.rating)}<span style={{ color: '#ddd' }}>{'★'.repeat(5 - testimonial.rating)}</span>
                                    </div>
                                    <p style={{ margin: '0 0 15px 0', fontStyle: 'italic', color: '#555', lineHeight: '1.5' }}>"{testimonial.message}"</p>
                                    <div style={{ fontSize: '14px', color: '#333', fontWeight: '600' }}>
                                      - {testimonial.name}{testimonial.company ? `, ${testimonial.company}` : ''}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderBrandingStep = () => (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Form Branding</h1>
              <p className="text-gray-600">Customize the appearance of your testimonial collection forms</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
                    <div className="flex space-x-2">
                      <input
                        type="url"
                        value={logoUrl}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="https://example.com/logo.png"
                        readOnly
                      />
                      <button
                        type="button"
                        className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center space-x-2"
                      >
                        <Upload className="h-4 w-4" />
                        <span>Upload</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                    <div className="flex space-x-3 items-center">
                      <input
                        type="color"
                        value={primaryColor}
                        className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
                        readOnly
                      />
                      <input
                        type="text"
                        value={primaryColor}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                        readOnly
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Used for headers and primary buttons</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
                    <div className="flex space-x-3 items-center">
                      <input
                        type="color"
                        value={secondaryColor}
                        className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
                        readOnly
                      />
                      <input
                        type="text"
                        value={secondaryColor}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                        readOnly
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Used for accents and highlights</p>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      className="flex-1 bg-primary-950 text-white py-3 px-4 rounded-lg hover:bg-primary-900 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Save className="h-4 w-4" />
                      <span>Save Changes</span>
                    </button>
                  </div>
                </form>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Eye className="h-5 w-5 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900">Live Preview</h3>
                </div>

                <div className="border border-gray-200 rounded-lg overflow-hidden shadow-lg">
                  <div
                    className="px-6 py-8 text-center text-white"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {logoUrl && (
                      <div className="flex justify-center mb-4">
                        <img
                          src={logoUrl}
                          alt="Logo"
                          className="h-12 max-w-48 object-contain"
                        />
                      </div>
                    )}
                    <h1 className="text-2xl font-bold mb-2">Share Your Experience with TechCorp</h1>
                    <p className="text-white/90">We'd love to hear about your experience with our software solutions!</p>
                  </div>

                  <div className="p-6 space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        How would you rate your experience? *
                      </label>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <div key={star} className="w-8 h-8 flex items-center justify-center">
                            <svg className="w-6 h-6 text-yellow-400 fill-current" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                      <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500">
                        Sarah Johnson
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Your Testimonial *</label>
                      <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 h-20 flex items-start">
                        <span className="text-sm">TestiFlow has completely transformed how we collect feedback...</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors"
                      style={{ backgroundColor: secondaryColor }}
                    >
                      Submit Testimonial
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderExportStep = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Export & Use Your Testimonials</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Export your approved testimonials in multiple formats for use across your marketing channels
        </p>
      </div>

      {/* Export Modal */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Export Testimonials</h3>
          <button
            onClick={() => setShowExportModal(!showExportModal)}
            className="bg-primary-950 text-white px-4 py-2 rounded-lg hover:bg-primary-900 transition-colors flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export Options</span>
          </button>
        </div>

        {showExportModal && (
          <div className="space-y-6">
            {/* Format Selection */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Choose Export Format</h4>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSelectedExportFormat('csv')}
                  className={`p-3 border rounded-lg text-left transition-colors ${
                    selectedExportFormat === 'csv'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-green-600" />
                    <span className="font-medium">CSV Spreadsheet</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">For Excel/Google Sheets</p>
                </button>

                <button
                  onClick={() => setSelectedExportFormat('json')}
                  className={`p-3 border rounded-lg text-left transition-colors ${
                    selectedExportFormat === 'json'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Code className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">JSON Data</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">For developers</p>
                </button>

                <button
                  onClick={() => setSelectedExportFormat('widget')}
                  className={`p-3 border rounded-lg text-left transition-colors ${
                    selectedExportFormat === 'widget'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Code className="h-5 w-5 text-indigo-600" />
                    <span className="font-medium">Website Widget</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">HTML embed code</p>
                </button>
              </div>
            </div>

            {/* Generate Button */}
            <div className="text-center">
              <button
                onClick={handleExportDemo}
                className="bg-secondary-500 text-white px-6 py-3 rounded-lg hover:bg-secondary-600 transition-colors flex items-center space-x-2 mx-auto"
              >
                <Download className="h-5 w-5" />
                <span>Generate {selectedExportFormat.toUpperCase()}</span>
              </button>
            </div>

            {/* Generated Content Preview */}
            {generatedContent && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-700">
                    Generated {selectedExportFormat.toUpperCase()} Content
                  </h4>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedContent);
                      // Could add a toast notification here
                    }}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md text-sm hover:bg-blue-200 transition-colors flex items-center space-x-1"
                  >
                    <Copy className="h-3 w-3" />
                    <span>Copy</span>
                  </button>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono max-h-64 overflow-y-auto">
                    {generatedContent}
                  </pre>
                </div>

                {/* Live Preview for Widget */}
                {selectedExportFormat === 'widget' && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-700">Live Preview</h4>
                    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                      <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                        <span className="text-sm text-gray-600">How this will look on your website:</span>
                      </div>
                      <div className="p-6">
                        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px', fontFamily: 'Montserrat, system-ui, sans-serif' }}>
                          <h3 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>What Our Customers Say</h3>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                            {mockTestimonials.slice(0, 3).map(testimonial => (
                              <div key={testimonial.id} style={{ 
                                background: '#f9f9f9', 
                                padding: '20px', 
                                borderRadius: '12px', 
                                borderLeft: '4px solid #01b79e', 
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
                              }}>
                                <div style={{ display: 'flex', marginBottom: '8px' }}>
                                  {'★'.repeat(testimonial.rating)}<span style={{ color: '#ddd' }}>{'★'.repeat(5 - testimonial.rating)}</span>
                                </div>
                                <p style={{ margin: '0 0 15px 0', fontStyle: 'italic', color: '#555', lineHeight: '1.5' }}>"{testimonial.message}"</p>
                                <div style={{ fontSize: '14px', color: '#777', fontWeight: '500' }}>
                                  - {testimonial.name}{testimonial.company ? `, ${testimonial.company}` : ''}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Mock testimonials display */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Testimonials</h3>
          <div className="space-y-4">
            {mockTestimonials.map((testimonial) => (
              <div key={testimonial.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-500">{testimonial.company}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-secondary-100 text-secondary-800">
                      approved
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  "{testimonial.message}"
                </p>
                <div className="text-xs text-gray-500">
                  Submitted: {new Date(testimonial.submitted_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return renderCreateFormsStep();
      case 1:
        return renderCustomFieldsStep();
      case 2:
        return renderCustomerSubmissionStep();
      case 'Export & Marketing':
        return renderExportStep();
      case 3:
        return renderTestimonialsApprovalStep();
      case 4:
        return renderExportStep();
      case 5:
        return renderBrandingStep();
      default:
        return renderCreateFormsStep();
    }
  };

  return (
    <div ref={demoContainerRef} className="min-h-screen bg-white">
      {/* Fake Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <TestiFlowIcon className="h-8 w-8 text-primary-950" />
                <span className="text-xl font-bold text-primary-950">TestiFlow</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  getActiveTab() === 'dashboard' 
                    ? 'text-primary-950 bg-primary-50' 
                    : 'text-gray-700 hover:text-primary-950'
                }`}
              >
                <User className="h-4 w-4" />
                <span>Dashboard</span>
              </button>
              <button
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  getActiveTab() === 'forms' 
                    ? 'text-primary-950 bg-primary-50' 
                    : 'text-gray-700 hover:text-primary-950'
                }`}
              >
                Forms
              </button>
              <button
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  getActiveTab() === 'branding' 
                    ? 'text-primary-950 bg-primary-50' 
                    : 'text-gray-700 hover:text-primary-950'
                }`}
              >
                Branding
              </button>
              <button
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  getActiveTab() === 'testimonials' 
                    ? 'text-primary-950 bg-primary-50' 
                    : 'text-gray-700 hover:text-primary-950'
                }`}
              >
                Testimonials
              </button>
              <button className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-950 transition-colors">
                Settings
              </button>
              
              <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-primary-950" />
                  </div>
                  <span className="text-sm text-gray-700">sarah@techcorp.com</span>
                </div>
                <button className="flex items-center space-x-1 text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Demo Content */}
      {renderCurrentStep()}
    </div>
  );
};