import React, { useState, useEffect, useCallback } from 'react';
import { Star, MessageSquare, CheckCircle, Download, User, Building, Mail, Eye, Settings, Plus, Copy, ExternalLink, Filter, MoreVertical, Edit, Trash2, Clock, X, Calendar, ToggleRight, ToggleLeft, Upload, Palette, Save, RotateCcw, ArrowRight, Send, Play, Image as ImageIcon } from 'lucide-react';
import { TestiFlowIcon } from '../components/TestiFlowIcon';

interface DemoStep {
  id: string;
  title: string;
  description: string;
  duration: number;
}

const demoSteps: DemoStep[] = [
  { id: 'dashboard', title: 'Dashboard Overview', description: 'See your testimonial metrics at a glance', duration: 8000 },
  { id: 'forms', title: 'Form Management', description: 'Create and manage testimonial collection forms', duration: 10000 },
  { id: 'testimonials', title: 'Testimonial Review', description: 'Review and approve customer testimonials', duration: 12000 },
  { id: 'branding', title: 'Brand Customization', description: 'Customize form appearance and branding', duration: 8000 },
  { id: 'collection', title: 'Customer Experience', description: 'What customers see when submitting', duration: 10000 },
];

const AnimatedCounter: React.FC<{ target: number; duration?: number; suffix?: string }> = ({ 
  target, 
  duration = 2000, 
  suffix = '' 
}) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const increment = target / (duration / 50);
    const timer = setInterval(() => {
      setCount(prev => {
        const next = prev + increment;
        return next >= target ? target : next;
      });
    }, 50);
    
    return () => clearInterval(timer);
  }, [target, duration]);
  
  return <span>{Math.round(count)}{suffix}</span>;
};

export const Demo: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  
  // Dashboard state
  const [dashboardStats, setDashboardStats] = useState({ total: 0, approved: 0, thisMonth: 0 });
  const [recentActivity, setRecentActivity] = useState<string[]>([]);
  
  // Forms state
  const [forms, setForms] = useState<Array<{
    id: string;
    title: string;
    description: string;
    is_active: boolean;
    created_at: string;
    testimonial_count: number;
  }>>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newFormTitle, setNewFormTitle] = useState('');
  const [viewingForm, setViewingForm] = useState<string | null>(null);
  
  // Testimonials state
  const [testimonials, setTestimonials] = useState<Array<{
    id: string;
    name: string;
    email: string;
    company: string;
    rating: number;
    message: string;
    status: 'pending' | 'approved' | 'rejected';
    submitted_at: string;
    form_title: string;
    image_url?: string;
    video_url?: string;
    custom_responses?: Array<{ label: string; value: string; type: string }>;
  }>>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [viewingTestimonial, setViewingTestimonial] = useState<string | null>(null);
  const [showActionsFor, setShowActionsFor] = useState<string | null>(null);
  
  // Branding state
  const [brandingSettings, setBrandingSettings] = useState({
    logo_url: '',
    primary_color: '#01004d',
    secondary_color: '#01b79e',
    font_family: 'Montserrat'
  });
  const [showBrandingPreview, setShowBrandingPreview] = useState(false);
  
  // Collection state (customer view)
  const [customerForm, setCustomerForm] = useState({
    rating: 0,
    name: '',
    email: '',
    company: '',
    message: '',
    submitted: false
  });
  const [hoveredRating, setHoveredRating] = useState(0);

  // Auto-advance timer
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setTimeout(() => {
      if (currentStep < demoSteps.length - 1) {
        setCurrentStep(prev => prev + 1);
        setProgress(0);
      } else {
        setCurrentStep(0);
        resetAllAnimations();
      }
    }, demoSteps[currentStep].duration);

    return () => clearTimeout(timer);
  }, [currentStep, isPlaying]);

  // Progress bar animation
  useEffect(() => {
    if (!isPlaying) return;
    
    const duration = demoSteps[currentStep].duration;
    const interval = 50;
    const increment = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress(prev => Math.min(prev + increment, 100));
    }, interval);

    return () => clearInterval(timer);
  }, [currentStep, isPlaying]);

  // Step-specific animations
  useEffect(() => {
    resetStepAnimations();

    switch (currentStep) {
      case 0: // Dashboard
        setTimeout(() => {
          setDashboardStats({ total: 247, approved: 189, thisMonth: 23 });
        }, 800);
        
        setTimeout(() => {
          setRecentActivity(['New testimonial from Sarah Johnson received']);
        }, 2000);
        
        setTimeout(() => {
          setRecentActivity(prev => [...prev, 'Form "Product Feedback" created']);
        }, 3500);
        
        setTimeout(() => {
          setRecentActivity(prev => [...prev, 'Testimonial approved for Mike Chen']);
        }, 5000);
        
        setTimeout(() => {
          setRecentActivity(prev => [...prev, '5 testimonials exported to marketing team']);
        }, 6500);
        break;

      case 1: // Forms
        setTimeout(() => {
          setForms([
            {
              id: '1',
              title: 'Product Feedback Survey',
              description: 'Collect feedback from customers who purchased our main product',
              is_active: true,
              created_at: '2024-12-10',
              testimonial_count: 47
            },
            {
              id: '2', 
              title: 'Service Experience Form',
              description: 'Get testimonials from customers about our support service',
              is_active: true,
              created_at: '2024-12-08',
              testimonial_count: 23
            }
          ]);
        }, 1000);
        
        setTimeout(() => {
          setShowCreateForm(true);
        }, 3000);
        
        setTimeout(() => {
          setNewFormTitle('VIP Customer Experience');
        }, 4500);
        
        setTimeout(() => {
          setForms(prev => [...prev, {
            id: '3',
            title: 'VIP Customer Experience',
            description: 'Exclusive feedback form for our premium customers',
            is_active: true,
            created_at: '2024-12-15',
            testimonial_count: 0
          }]);
          setShowCreateForm(false);
          setNewFormTitle('');
        }, 6500);
        
        setTimeout(() => {
          setViewingForm('3');
        }, 8000);
        break;

      case 2: // Testimonials
        setTimeout(() => {
          setTestimonials([
            {
              id: '1',
              name: 'Sarah Johnson',
              email: 'sarah@techcorp.com',
              company: 'TechCorp Solutions',
              rating: 5,
              message: 'TestiFlow has completely transformed how we collect and manage customer feedback. The automated workflows save us hours every week, and the approval process ensures we only showcase our best testimonials. Highly recommend!',
              status: 'pending',
              submitted_at: '2024-12-15T10:30:00Z',
              form_title: 'Product Feedback Survey',
              image_url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
              custom_responses: [
                { label: 'How did you hear about us?', value: 'LinkedIn recommendation', type: 'select' },
                { label: 'What\'s your role?', value: 'Marketing Director', type: 'text' }
              ]
            },
            {
              id: '2',
              name: 'Michael Chen',
              email: 'mike@startupxyz.com', 
              company: 'StartupXYZ',
              rating: 4,
              message: 'Great tool for managing testimonials. The export features are particularly useful for our marketing campaigns. Would love to see more integration options in the future.',
              status: 'approved',
              submitted_at: '2024-12-14T15:45:00Z',
              form_title: 'Service Experience Form',
              custom_responses: [
                { label: 'Product satisfaction', value: '4', type: 'rating' },
                { label: 'Favorite features', value: 'Export tools,Approval workflow', type: 'checkbox' }
              ]
            },
            {
              id: '3',
              name: 'Emily Rodriguez',
              email: 'emily@growthco.io',
              company: 'GrowthCo',
              rating: 5,
              message: 'Outstanding platform! The branding customization allows us to maintain our brand identity while collecting testimonials. The analytics help us understand our customer satisfaction trends.',
              status: 'pending',
              submitted_at: '2024-12-15T09:15:00Z',
              form_title: 'VIP Customer Experience',
              video_url: 'demo-video',
              custom_responses: [
                { label: 'Industry', value: 'SaaS/Technology', type: 'select' },
                { label: 'Company size', value: '50-100 employees', type: 'radio' }
              ]
            }
          ]);
        }, 1000);
        
        setTimeout(() => {
          setFilter('pending');
        }, 3000);
        
        setTimeout(() => {
          setViewingTestimonial('1');
        }, 5000);
        
        setTimeout(() => {
          setViewingTestimonial(null);
          setTestimonials(prev => prev.map(t => 
            t.id === '1' ? { ...t, status: 'approved' } : t
          ));
        }, 8000);
        
        setTimeout(() => {
          setFilter('approved');
        }, 9500);
        break;

      case 3: // Branding
        setTimeout(() => {
          setBrandingSettings({
            logo_url: 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=200',
            primary_color: '#1e40af',
            secondary_color: '#0ea5e9',
            font_family: 'Inter'
          });
        }, 2000);
        
        setTimeout(() => {
          setShowBrandingPreview(true);
        }, 4000);
        
        setTimeout(() => {
          setBrandingSettings(prev => ({
            ...prev,
            primary_color: '#7c3aed',
            secondary_color: '#a855f7'
          }));
        }, 6000);
        break;

      case 4: // Collection (Customer View)
        setTimeout(() => {
          setCustomerForm(prev => ({ ...prev, rating: 5 }));
        }, 2000);
        
        setTimeout(() => {
          setCustomerForm(prev => ({ ...prev, name: 'David Thompson' }));
        }, 3500);
        
        setTimeout(() => {
          setCustomerForm(prev => ({ ...prev, email: 'david@innovatecorp.com' }));
        }, 4500);
        
        setTimeout(() => {
          setCustomerForm(prev => ({ ...prev, company: 'InnovateCorp' }));
        }, 5500);
        
        setTimeout(() => {
          setCustomerForm(prev => ({ 
            ...prev, 
            message: 'TestiFlow has revolutionized our customer feedback process. The platform is intuitive, powerful, and has helped us showcase authentic customer experiences that drive real business results. Our conversion rates have increased by 40% since implementing their testimonial widgets on our website.'
          }));
        }, 6500);
        
        setTimeout(() => {
          setCustomerForm(prev => ({ ...prev, submitted: true }));
        }, 8500);
        break;
    }
  }, [currentStep]);

  const resetAllAnimations = useCallback(() => {
    setDashboardStats({ total: 0, approved: 0, thisMonth: 0 });
    setRecentActivity([]);
    setForms([]);
    setShowCreateForm(false);
    setNewFormTitle('');
    setViewingForm(null);
    setTestimonials([]);
    setFilter('all');
    setViewingTestimonial(null);
    setShowActionsFor(null);
    setBrandingSettings({
      logo_url: '',
      primary_color: '#01004d',
      secondary_color: '#01b79e',
      font_family: 'Montserrat'
    });
    setShowBrandingPreview(false);
    setCustomerForm({
      rating: 0,
      name: '',
      email: '',
      company: '',
      message: '',
      submitted: false
    });
    setHoveredRating(0);
    setProgress(0);
  }, []);

  const resetStepAnimations = useCallback(() => {
    switch (currentStep) {
      case 0:
        setDashboardStats({ total: 0, approved: 0, thisMonth: 0 });
        setRecentActivity([]);
        break;
      case 1:
        setForms([]);
        setShowCreateForm(false);
        setNewFormTitle('');
        setViewingForm(null);
        break;
      case 2:
        setTestimonials([]);
        setFilter('all');
        setViewingTestimonial(null);
        setShowActionsFor(null);
        break;
      case 3:
        setBrandingSettings({
          logo_url: '',
          primary_color: '#01004d',
          secondary_color: '#01b79e',
          font_family: 'Montserrat'
        });
        setShowBrandingPreview(false);
        break;
      case 4:
        setCustomerForm({
          rating: 0,
          name: '',
          email: '',
          company: '',
          message: '',
          submitted: false
        });
        setHoveredRating(0);
        break;
    }
  }, [currentStep]);

  const getActiveNavItem = () => {
    switch (currentStep) {
      case 0: return 'dashboard';
      case 1: return 'forms';
      case 2: return 'testimonials';
      case 3: return 'branding';
      case 4: return 'collection';
      default: return 'dashboard';
    }
  };

  const renderDashboard = () => (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            {/* Trial Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-blue-600 mr-2" />
                  <div>
                    <p className="text-blue-800 font-medium">
                      Trial ends in 5 days
                    </p>
                    <p className="text-blue-600 text-sm">
                      Your card will be charged on December 22, 2024
                    </p>
                  </div>
                </div>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Manage Subscription
                </button>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, Sarah!</h2>
              <p className="text-gray-600">Here's what's happening with your testimonials</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Total</h3>
                  <MessageSquare className="h-5 w-5 text-primary-950" />
                </div>
                <div className="text-3xl font-bold text-primary-950">
                  <AnimatedCounter target={dashboardStats.total} />
                </div>
                <div className="text-sm text-gray-600 mt-1">testimonials collected</div>
              </div>
              <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 p-6 rounded-xl border border-secondary-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Approved</h3>
                  <CheckCircle className="h-5 w-5 text-secondary-500" />
                </div>
                <div className="text-3xl font-bold text-secondary-500">
                  <AnimatedCounter target={dashboardStats.approved} />
                </div>
                <div className="text-sm text-gray-600 mt-1">ready to use</div>
              </div>
              <div className="bg-gradient-to-br from-accent-50 to-accent-100 p-6 rounded-xl border border-accent-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">This Month</h3>
                  <Download className="h-5 w-5 text-accent-600" />
                </div>
                <div className="text-3xl font-bold text-accent-600">
                  <AnimatedCounter target={dashboardStats.thisMonth} />
                </div>
                <div className="text-sm text-gray-600 mt-1">new testimonials</div>
              </div>
            </div>

            {recentActivity.length > 0 && (
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">Recent Activity</h3>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div 
                      key={index} 
                      className="flex items-center space-x-3 animate-slide-in"
                      style={{ animationDelay: `${index * 0.2}s` }}
                    >
                      <div className="w-2 h-2 bg-secondary-500 rounded-full"></div>
                      <span className="text-gray-700">{activity}</span>
                      <span className="text-xs text-gray-500 ml-auto">
                        {index === 0 ? '2 min ago' : index === 1 ? '1 hour ago' : index === 2 ? '3 hours ago' : '1 day ago'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderForms = () => (
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
                className="bg-primary-950 text-white px-6 py-3 rounded-lg hover:bg-primary-900 transition-all duration-200 flex items-center space-x-2 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus className="h-5 w-5" />
                <span>New Form</span>
              </button>
            </div>

            {showCreateForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-slide-in">
                <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Create New Form</h2>
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Form Title</label>
                      <input
                        type="text"
                        value={newFormTitle}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Enter form title..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        rows={2}
                        value="Exclusive feedback form for our premium customers"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Thank You Message</label>
                      <input
                        type="text"
                        value="Thank you for your valuable feedback!"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-blue-900 mb-3">📸 Media Upload Options</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" checked className="rounded border-gray-300 text-primary-950" />
                          <label className="text-sm font-medium text-gray-700">Allow image uploads (10MB max)</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded border-gray-300 text-primary-950" />
                          <label className="text-sm font-medium text-gray-700">Allow video uploads (100MB max)</label>
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

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {forms.map((form, index) => (
                <div 
                  key={form.id} 
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 relative group animate-slide-in"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="absolute top-4 right-4">
                    <ToggleRight className="h-6 w-6 text-secondary-500" />
                  </div>

                  <div className="mb-4 pr-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 leading-tight">{form.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{form.description}</p>
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
                        <Calendar className="h-4 w-4" />
                        <span>Created {new Date(form.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {form.testimonial_count} testimonials collected
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <button
                      className="text-primary-950 hover:text-primary-800 text-sm font-medium flex items-center space-x-1 transition-colors"
                    >
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
              ))}
            </div>

            {viewingForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-slide-in">
                <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Form Details</h2>
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-semibold text-gray-900">VIP Customer Experience</h3>
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-secondary-100 text-secondary-800">
                        Active
                      </span>
                    </div>
                    
                    <div className="bg-blue-50 rounded-lg p-4 mb-4">
                      <h4 className="text-sm font-medium text-blue-900 mb-2">Shareable Link</h4>
                      <div className="flex items-center space-x-2">
                        <code className="flex-1 bg-white px-3 py-2 rounded border text-sm text-gray-700 font-mono">
                          https://testiflow.com/submit/vip-customer-exp
                        </code>
                        <button className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition-colors flex items-center space-x-1">
                          <Copy className="h-4 w-4" />
                          <span>Copy</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <button className="flex-1 bg-primary-950 text-white py-3 px-4 rounded-lg hover:bg-primary-900 transition-colors font-medium flex items-center justify-center space-x-2">
                        <Edit className="h-4 w-4" />
                        <span>Edit Form</span>
                      </button>
                      <button className="flex-1 bg-secondary-500 text-white py-3 px-4 rounded-lg hover:bg-secondary-600 transition-colors font-medium flex items-center justify-center space-x-2">
                        <Settings className="h-4 w-4" />
                        <span>Custom Fields</span>
                      </button>
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

  const renderTestimonials = () => (
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
                <select
                  value={filter}
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

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={testimonial.id} 
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200 relative animate-slide-in"
                  style={{ animationDelay: `${index * 0.3}s` }}
                >
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
                      <div className="text-sm text-gray-500 flex items-center">
                        <Building className="h-3 w-3 mr-1" />
                        {testimonial.company}
                      </div>
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

                  {testimonial.custom_responses && testimonial.custom_responses.length > 0 && (
                    <div className="mb-4">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="text-xs text-blue-800 font-medium">
                          +{testimonial.custom_responses.length} additional response{testimonial.custom_responses.length !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="text-xs text-gray-500 mb-4 space-y-1">
                    <div>From: {testimonial.form_title}</div>
                    <div>Submitted: {new Date(testimonial.submitted_at).toLocaleDateString()}</div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <button
                      onClick={() => setViewingTestimonial(testimonial.id)}
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
                      
                      <div className="relative">
                        <button
                          onClick={() => setShowActionsFor(showActionsFor === testimonial.id ? null : testimonial.id)}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {viewingTestimonial && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-slide-in">
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
                    {(() => {
                      const testimonial = testimonials.find(t => t.id === viewingTestimonial);
                      if (!testimonial) return null;

                      return (
                        <>
                          <div className="flex items-center space-x-4 mb-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center">
                              <User className="h-8 w-8 text-primary-950" />
                            </div>
                            <div className="flex-1">
                              <div className="text-xl font-semibold text-gray-900">{testimonial.name}</div>
                              <div className="text-gray-600 flex items-center space-x-1">
                                <Mail className="h-4 w-4" />
                                <span>{testimonial.email}</span>
                              </div>
                              <div className="text-gray-600 flex items-center space-x-1">
                                <Building className="h-4 w-4" />
                                <span>{testimonial.company}</span>
                              </div>
                            </div>
                          </div>

                          <div className="mb-6">
                            <h3 className="text-sm font-medium text-gray-700 mb-2">Overall Rating</h3>
                            <div className="flex items-center space-x-2">
                              <div className="flex">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                  <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
                                ))}
                              </div>
                              <span className="text-lg font-semibold text-gray-900">({testimonial.rating}/5)</span>
                            </div>
                          </div>

                          <div className="mb-6">
                            <h3 className="text-sm font-medium text-gray-700 mb-2">Testimonial</h3>
                            <div className="bg-gray-50 rounded-lg p-4">
                              <p className="text-gray-800 leading-relaxed italic">
                                "{testimonial.message}"
                              </p>
                            </div>
                          </div>

                          {testimonial.image_url && (
                            <div className="mb-6">
                              <h3 className="text-sm font-medium text-gray-700 mb-3">Image</h3>
                              <img 
                                src={testimonial.image_url} 
                                alt="Testimonial" 
                                className="w-full max-w-md rounded-lg border border-gray-200 shadow-sm"
                              />
                            </div>
                          )}

                          {testimonial.custom_responses && (
                            <div className="mb-6">
                              <h3 className="text-sm font-medium text-gray-700 mb-3">Additional Responses</h3>
                              <div className="space-y-4">
                                {testimonial.custom_responses.map((response, index) => (
                                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                                    <div className="text-sm font-medium text-gray-700 mb-2">
                                      {response.label}
                                    </div>
                                    <div className="text-sm text-gray-700">
                                      {response.type === 'rating' ? (
                                        <div className="flex items-center space-x-1">
                                          {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                              key={star}
                                              className={`h-4 w-4 ${
                                                star <= parseInt(response.value) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                              }`}
                                            />
                                          ))}
                                          <span className="text-sm text-gray-600 ml-2">({response.value}/5)</span>
                                        </div>
                                      ) : (
                                        response.value
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

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
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderBranding = () => (
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
                  <div className="flex space-x-2">
                    <input
                      type="url"
                      value={brandingSettings.logo_url}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="https://example.com/logo.png"
                    />
                    <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center space-x-2">
                      <Upload className="h-4 w-4" />
                      <span>Upload</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Color Presets</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { name: 'TestiFlow Default', primary: '#01004d', secondary: '#01b79e' },
                      { name: 'Ocean Blue', primary: '#0066cc', secondary: '#00a8ff' },
                      { name: 'Royal Purple', primary: '#4a148c', secondary: '#9c27b0' },
                      { name: 'Forest Green', primary: '#2d5a27', secondary: '#4caf50' },
                    ].map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                      >
                        <div className="flex space-x-1">
                          <div 
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: preset.primary }}
                          ></div>
                          <div 
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: preset.secondary }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-700">{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                  <div className="flex space-x-3 items-center">
                    <input
                      type="color"
                      value={brandingSettings.primary_color}
                      className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
                    />
                    <input
                      type="text"
                      value={brandingSettings.primary_color}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
                  <div className="flex space-x-3 items-center">
                    <input
                      type="color"
                      value={brandingSettings.secondary_color}
                      className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
                    />
                    <input
                      type="text"
                      value={brandingSettings.secondary_color}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                    />
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button className="flex-1 bg-primary-950 text-white py-3 px-4 rounded-lg hover:bg-primary-900 transition-colors flex items-center justify-center space-x-2">
                    <Save className="h-4 w-4" />
                    <span>Save Changes</span>
                  </button>
                  <button className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
                    <RotateCcw className="h-4 w-4" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>

              {showBrandingPreview && (
                <div className="space-y-6 animate-slide-in">
                  <div className="flex items-center space-x-2 mb-4">
                    <Eye className="h-5 w-5 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-900">Live Preview</h3>
                  </div>

                  <div className="border border-gray-200 rounded-lg overflow-hidden shadow-lg">
                    <div 
                      className="px-6 py-8 text-center text-white"
                      style={{ 
                        backgroundColor: brandingSettings.primary_color,
                        fontFamily: brandingSettings.font_family 
                      }}
                    >
                      {brandingSettings.logo_url && (
                        <div className="flex justify-center mb-4">
                          <img 
                            src={brandingSettings.logo_url} 
                            alt="Logo" 
                            className="h-12 max-w-48 object-contain"
                          />
                        </div>
                      )}
                      <h1 className="text-2xl font-bold mb-2">Share Your Experience</h1>
                      <p className="text-white/90">We'd love to hear about your experience with us!</p>
                    </div>

                    <div className="p-6 space-y-6" style={{ fontFamily: brandingSettings.font_family }}>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          How would you rate your experience? *
                        </label>
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-6 w-6 text-yellow-400 fill-current" />
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                        <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500">
                          John Smith
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Your Testimonial *</label>
                        <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 h-20 flex items-start">
                          <span className="text-sm">This product has been amazing for our business...</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors"
                        style={{ 
                          backgroundColor: brandingSettings.secondary_color,
                          fontFamily: brandingSettings.font_family 
                        }}
                      >
                        Submit Testimonial
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCollection = () => (
    <div className="min-h-screen bg-gray-50 py-12" style={{ fontFamily: brandingSettings.font_family }}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div 
            className="px-6 py-8 text-center text-white"
            style={{ backgroundColor: brandingSettings.primary_color }}
          >
            <div className="flex justify-center mb-4">
              {brandingSettings.logo_url ? (
                <img 
                  src={brandingSettings.logo_url} 
                  alt="Logo" 
                  className="h-8 max-w-32 object-contain"
                />
              ) : (
                <TestiFlowIcon className="h-8 w-8 text-white" />
              )}
            </div>
            <h1 className="text-2xl font-bold mb-2">VIP Customer Experience</h1>
            <p className="text-white/90">Exclusive feedback form for our premium customers</p>
          </div>

          <div className="p-6">
            {customerForm.submitted ? (
              <div className="text-center py-16 animate-slide-in">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Thank You!</h2>
                <p className="text-gray-600">Thank you for your valuable feedback!</p>
              </div>
            ) : (
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    How would you rate your experience? *
                  </label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-8 w-8 transition-colors ${
                          star <= customerForm.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    value={customerForm.name}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    value={customerForm.email}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter your email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                  <input
                    type="text"
                    value={customerForm.company}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter your company name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Testimonial *</label>
                  <textarea
                    rows={4}
                    value={customerForm.message}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Tell us about your experience..."
                  />
                </div>

                {/* Custom Fields */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">How did you hear about us? *</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="">Select an option...</option>
                    <option value="linkedin">LinkedIn recommendation</option>
                    <option value="google">Google search</option>
                    <option value="referral">Word of mouth</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">What's your role?</label>
                  <input
                    type="text"
                    value="Marketing Director"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Marketing Manager, CEO, Developer"
                  />
                </div>

                {/* Media Upload */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Add Media (Optional)</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                      <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Click to upload an image</p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="button"
                    className="w-full text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                    style={{ backgroundColor: brandingSettings.secondary_color }}
                  >
                    <Send className="h-4 w-4" />
                    <span>Submit Testimonial</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0: return renderDashboard();
      case 1: return renderForms();
      case 2: return renderTestimonials();
      case 3: return renderBranding();
      case 4: return renderCollection();
      default: return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Mimics logged-in navbar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <TestiFlowIcon className="h-8 w-8 text-navy" />
                <span className="text-xl font-bold text-primary-950">TestiFlow</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                getActiveNavItem() === 'dashboard' ? 'bg-primary-100 text-primary-950' : 'text-gray-700 hover:text-primary-950'
              }`}>
                <span>Dashboard</span>
              </div>
              <div className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                getActiveNavItem() === 'forms' ? 'bg-primary-100 text-primary-950' : 'text-gray-700 hover:text-primary-950'
              }`}>
                <span>Forms</span>
              </div>
              <div className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                getActiveNavItem() === 'branding' ? 'bg-primary-100 text-primary-950' : 'text-gray-700 hover:text-primary-950'
              }`}>
                <span>Branding</span>
              </div>
              <div className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                getActiveNavItem() === 'testimonials' ? 'bg-primary-100 text-primary-950' : 'text-gray-700 hover:text-primary-950'
              }`}>
                <span>Testimonials</span>
              </div>
              <div className="flex items-center space-x-1 text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                <span>Settings</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-primary-950" />
                </div>
                <span>sarah@techcorp.com</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      {renderCurrentStep()}
    </div>
  );
};