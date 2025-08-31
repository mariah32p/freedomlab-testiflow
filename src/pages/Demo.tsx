import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, SkipForward, SkipBack, Star, MessageSquare, CheckCircle, Download, User, Building, Mail, Eye, Settings, Plus, Copy, ExternalLink } from 'lucide-react';
import { TestiFlowIcon } from '../components/TestiFlowIcon';

interface DemoStep {
  id: string;
  title: string;
  description: string;
  duration: number;
}

const demoSteps: DemoStep[] = [
  { id: 'dashboard', title: 'Dashboard Overview', description: 'See your testimonial metrics at a glance', duration: 4000 },
  { id: 'forms', title: 'Form Creation', description: 'Create customized testimonial collection forms', duration: 4000 },
  { id: 'collection', title: 'Testimonial Collection', description: 'Customers submit testimonials through your forms', duration: 4000 },
  { id: 'management', title: 'Review & Approval', description: 'Manage and approve incoming testimonials', duration: 4000 },
  { id: 'export', title: 'Export & Share', description: 'Export testimonials for marketing campaigns', duration: 4000 },
];

const AnimatedCounter: React.FC<{ target: number; duration?: number; suffix?: string }> = ({ 
  target, 
  duration = 1000, 
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
  const [showFormCreation, setShowFormCreation] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [createdForms, setCreatedForms] = useState<Array<{ id: string; title: string; active: boolean }>>([]);
  
  // Collection state
  const [showTestimonialForm, setShowTestimonialForm] = useState(false);
  const [customerRating, setCustomerRating] = useState(0);
  const [customerMessage, setCustomerMessage] = useState('');
  const [submissionComplete, setSubmissionComplete] = useState(false);
  
  // Management state
  const [testimonials, setTestimonials] = useState<Array<{
    id: string;
    name: string;
    company: string;
    rating: number;
    message: string;
    status: 'pending' | 'approved' | 'rejected';
  }>>([]);
  const [selectedTestimonial, setSelectedTestimonial] = useState<string | null>(null);
  
  // Export state
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState<'csv' | 'widget' | 'social'>('csv');
  const [generatedContent, setGeneratedContent] = useState('');

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
        }, 500);
        
        setTimeout(() => {
          setRecentActivity(['New testimonial from Sarah Johnson', 'Form "Customer Feedback" created']);
        }, 1500);
        
        setTimeout(() => {
          setRecentActivity(prev => [...prev, 'Testimonial approved for Mike Chen']);
        }, 2500);
        break;

      case 1: // Forms
        setTimeout(() => {
          setShowFormCreation(true);
        }, 500);
        
        setTimeout(() => {
          setFormTitle('Customer Experience Survey');
        }, 1500);
        
        setTimeout(() => {
          setCreatedForms([{ id: '1', title: 'Customer Experience Survey', active: true }]);
          setShowFormCreation(false);
        }, 2500);
        break;

      case 2: // Collection
        setTimeout(() => {
          setShowTestimonialForm(true);
        }, 500);
        
        setTimeout(() => {
          setCustomerRating(5);
        }, 1500);
        
        setTimeout(() => {
          setCustomerMessage('TestiFlow has completely transformed how we collect customer feedback!');
        }, 2000);
        
        setTimeout(() => {
          setSubmissionComplete(true);
        }, 3000);
        break;

      case 3: // Management
        setTimeout(() => {
          setTestimonials([
            { id: '1', name: 'Sarah Johnson', company: 'TechCorp', rating: 5, message: 'Amazing product! Has saved us countless hours.', status: 'pending' },
            { id: '2', name: 'Mike Chen', company: 'StartupXYZ', rating: 4, message: 'Great tool for managing testimonials.', status: 'pending' },
          ]);
        }, 500);
        
        setTimeout(() => {
          setSelectedTestimonial('1');
        }, 1500);
        
        setTimeout(() => {
          setTestimonials(prev => prev.map(t => 
            t.id === '1' ? { ...t, status: 'approved' } : t
          ));
          setSelectedTestimonial(null);
        }, 2500);
        break;

      case 4: // Export
        setTimeout(() => {
          setShowExportModal(true);
        }, 500);
        
        setTimeout(() => {
          setExportFormat('widget');
        }, 1500);
        
        setTimeout(() => {
          setGeneratedContent('<div class="testimonials-widget">...</div>');
        }, 2500);
        break;
    }
  }, [currentStep]);

  const resetAllAnimations = useCallback(() => {
    setDashboardStats({ total: 0, approved: 0, thisMonth: 0 });
    setRecentActivity([]);
    setShowFormCreation(false);
    setFormTitle('');
    setCreatedForms([]);
    setShowTestimonialForm(false);
    setCustomerRating(0);
    setCustomerMessage('');
    setSubmissionComplete(false);
    setTestimonials([]);
    setSelectedTestimonial(null);
    setShowExportModal(false);
    setExportFormat('csv');
    setGeneratedContent('');
    setProgress(0);
  }, []);

  const resetStepAnimations = useCallback(() => {
    // Reset only current step animations
    switch (currentStep) {
      case 0:
        setDashboardStats({ total: 0, approved: 0, thisMonth: 0 });
        setRecentActivity([]);
        break;
      case 1:
        setShowFormCreation(false);
        setFormTitle('');
        setCreatedForms([]);
        break;
      case 2:
        setShowTestimonialForm(false);
        setCustomerRating(0);
        setCustomerMessage('');
        setSubmissionComplete(false);
        break;
      case 3:
        setTestimonials([]);
        setSelectedTestimonial(null);
        break;
      case 4:
        setShowExportModal(false);
        setGeneratedContent('');
        break;
    }
  }, [currentStep]);

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex);
    setProgress(0);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const nextStep = () => {
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      setProgress(0);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setProgress(0);
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Total Testimonials</h3>
            <MessageSquare className="h-5 w-5 text-primary-950" />
          </div>
          <div className="text-3xl font-bold text-primary-950">
            <AnimatedCounter target={dashboardStats.total} />
          </div>
          <div className="text-sm text-gray-600 mt-1">collected this year</div>
        </div>
        
        <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 p-6 rounded-xl border border-secondary-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Approved</h3>
            <CheckCircle className="h-5 w-5 text-secondary-500" />
          </div>
          <div className="text-3xl font-bold text-secondary-500">
            <AnimatedCounter target={dashboardStats.approved} />
          </div>
          <div className="text-sm text-gray-600 mt-1">ready for marketing</div>
        </div>
        
        <div className="bg-gradient-to-br from-accent-50 to-accent-100 p-6 rounded-xl border border-accent-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">This Month</h3>
            <Download className="h-5 w-5 text-accent-600" />
          </div>
          <div className="text-3xl font-bold text-accent-600">
            <AnimatedCounter target={dashboardStats.thisMonth} />
          </div>
          <div className="text-sm text-gray-600 mt-1">new submissions</div>
        </div>
      </div>

      {recentActivity.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div 
                key={index} 
                className="flex items-center space-x-3 animate-slide-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="w-2 h-2 bg-secondary-500 rounded-full"></div>
                <span className="text-gray-700">{activity}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderForms = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Forms</h2>
          <p className="text-gray-600">Create and manage testimonial collection forms</p>
        </div>
        <button className="bg-primary-950 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>New Form</span>
        </button>
      </div>

      {showFormCreation && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 animate-slide-in">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Form</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Form Title</label>
              <input
                type="text"
                value={formTitle}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                placeholder="Enter form title..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                rows={2}
                readOnly
                value="We'd love to hear about your experience with our product!"
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              />
            </div>
          </div>
        </div>
      )}

      {createdForms.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {createdForms.map((form) => (
            <div key={form.id} className="bg-white border border-gray-200 rounded-lg p-6 animate-slide-in">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{form.title}</h3>
                <span className="px-2 py-1 bg-secondary-100 text-secondary-800 rounded-full text-sm">
                  Active
                </span>
              </div>
              <div className="flex space-x-2">
                <button className="bg-blue-50 text-blue-600 px-3 py-1 rounded-md text-sm flex items-center space-x-1">
                  <Copy className="h-3 w-3" />
                  <span>Copy Link</span>
                </button>
                <button className="bg-gray-50 text-gray-600 px-3 py-1 rounded-md text-sm flex items-center space-x-1">
                  <ExternalLink className="h-3 w-3" />
                  <span>Preview</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderCollection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Customer Testimonial Form</h2>
        <p className="text-gray-600">This is what your customers see</p>
      </div>

      {showTestimonialForm && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden animate-slide-in">
            <div className="bg-primary-950 px-6 py-8 text-center text-white">
              <TestiFlowIcon className="h-8 w-8 text-white mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">Customer Experience Survey</h1>
              <p className="text-white/90">We'd love to hear about your experience with our product!</p>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  How would you rate your experience? *
                </label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-8 w-8 transition-colors ${
                        star <= customerRating
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
                  value="Sarah Johnson"
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <input
                  type="text"
                  value="TechCorp Inc."
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Testimonial *</label>
                <textarea
                  rows={4}
                  value={customerMessage}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  placeholder="Tell us about your experience..."
                />
              </div>

              {submissionComplete ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Thank You!</h3>
                  <p className="text-gray-600">Your testimonial has been submitted successfully.</p>
                </div>
              ) : (
                <button className="w-full bg-secondary-500 text-white py-3 px-6 rounded-lg font-semibold">
                  Submit Testimonial
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Testimonials</h2>
          <p className="text-gray-600">Review, approve, and manage customer testimonials</p>
        </div>
        <div className="flex space-x-2">
          <select className="border border-gray-300 px-3 py-2 rounded-lg">
            <option>All Status</option>
            <option>Pending</option>
            <option>Approved</option>
          </select>
        </div>
      </div>

      {testimonials.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id} 
              className={`bg-white border rounded-lg p-6 transition-all duration-300 animate-slide-in ${
                selectedTestimonial === testimonial.id 
                  ? 'border-primary-500 ring-2 ring-primary-100' 
                  : 'border-gray-200 hover:shadow-lg'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-primary-950" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.company}</div>
                  </div>
                </div>
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

              <div className="flex items-center space-x-2 mb-3">
                <div className="flex">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-gray-500">({testimonial.rating}/5)</span>
              </div>

              <p className="text-gray-700 text-sm mb-4">"{testimonial.message}"</p>

              {testimonial.status === 'pending' && (
                <div className="flex space-x-2">
                  <button 
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                      selectedTestimonial === testimonial.id
                        ? 'bg-secondary-500 text-white'
                        : 'bg-secondary-100 text-secondary-800 hover:bg-secondary-200'
                    }`}
                  >
                    Approve
                  </button>
                  <button className="bg-red-100 text-red-800 hover:bg-red-200 px-3 py-1 rounded-md text-xs font-medium transition-colors">
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderExport = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Export Testimonials</h2>
          <p className="text-gray-600">Export testimonials for marketing campaigns</p>
        </div>
        <button className="bg-primary-950 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
          <Download className="h-4 w-4" />
          <span>Export</span>
        </button>
      </div>

      {showExportModal && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 animate-slide-in">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Export Format</h3>
          
          <div className="grid gap-3 mb-6">
            {[
              { id: 'csv', label: 'CSV Spreadsheet', icon: '📊', desc: 'For analysis in Excel/Google Sheets' },
              { id: 'widget', label: 'Website Widget', icon: '🌐', desc: 'HTML code to embed on your website' },
              { id: 'social', label: 'Social Media Post', icon: '📱', desc: 'Ready-to-post social content' },
            ].map((format) => (
              <button
                key={format.id}
                className={`p-4 border rounded-lg text-left transition-colors ${
                  exportFormat === format.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{format.icon}</span>
                  <div>
                    <div className="font-medium">{format.label}</div>
                    <div className="text-sm text-gray-500">{format.desc}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {generatedContent && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Generated Content:</span>
                <button className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md text-sm">
                  Copy Code
                </button>
              </div>
              <div className="bg-white p-3 rounded border text-sm font-mono text-gray-700 max-h-32 overflow-y-auto">
                {exportFormat === 'widget' ? (
                  <div>{'<div class="testimonials-widget">...</div>'}</div>
                ) : exportFormat === 'social' ? (
                  <div>⭐⭐⭐⭐⭐ Customer Love!<br/><br/>"Amazing product! Has saved us countless hours."<br/><br/>- Sarah Johnson, TechCorp Inc.</div>
                ) : (
                  <div>testimonials_export.csv downloaded</div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0: return renderDashboard();
      case 1: return renderForms();
      case 2: return renderCollection();
      case 3: return renderManagement();
      case 4: return renderExport();
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
              <div className="flex items-center space-x-1 text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  currentStep === 0 ? 'bg-primary-100 text-primary-800' : 'text-gray-500'
                }`}>
                  Dashboard
                </span>
              </div>
              <div className="flex items-center space-x-1 text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  currentStep === 1 ? 'bg-primary-100 text-primary-800' : 'text-gray-500'
                }`}>
                  Forms
                </span>
              </div>
              <div className="flex items-center space-x-1 text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  currentStep === 2 ? 'bg-primary-100 text-primary-800' : 'text-gray-500'
                }`}>
                  Collection
                </span>
              </div>
              <div className="flex items-center space-x-1 text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  currentStep === 3 ? 'bg-primary-100 text-primary-800' : 'text-gray-500'
                }`}>
                  Testimonials
                </span>
              </div>
              <div className="flex items-center space-x-1 text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  currentStep === 4 ? 'bg-primary-100 text-primary-800' : 'text-gray-500'
                }`}>
                  Export
                </span>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 min-h-[600px]">
          {renderCurrentStep()}
        </div>
      </div>
    </div>
  );
};