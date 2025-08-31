import React, { useState, useEffect } from 'react';
import { TestiFlowIcon } from '../components/TestiFlowIcon';
import { 
  User, LogOut, Plus, Settings, Eye, Copy, Star, CheckCircle, X, Download, 
  FileText, Code, Share2, LayoutDashboard, FileInput, Palette, Filter, 
  ArrowRight, ArrowLeft, Play, Pause, RotateCcw 
} from 'lucide-react';

interface DemoStep {
  id: string;
  title: string;
  description: string;
  duration: number;
  activeTab: 'dashboard' | 'forms' | 'testimonials' | 'export' | 'branding';
}

const demoSteps: DemoStep[] = [
  { 
    id: 'dashboard', 
    title: 'Monitor Your Performance', 
    description: 'Start with a high-level overview of submission rates and customer sentiment.', 
    duration: 6000, 
    activeTab: 'dashboard' 
  },
  { 
    id: 'create-form', 
    title: 'Build a Custom Form', 
    description: 'Create a new form to collect testimonials from your customers.', 
    duration: 8000, 
    activeTab: 'forms' 
  },
  { 
    id: 'customer-submission', 
    title: 'Customer Submits Testimonial', 
    description: 'Watch how customers experience your branded testimonial form.', 
    duration: 10000, 
    activeTab: 'forms' 
  },
  { 
    id: 'review-testimonials', 
    title: 'Review & Approve', 
    description: 'Manage incoming testimonials with approval workflow.', 
    duration: 8000, 
    activeTab: 'testimonials' 
  },
  { 
    id: 'export-options', 
    title: 'Export & Share', 
    description: 'Export testimonials in multiple formats for your marketing campaigns.', 
    duration: 10000, 
    activeTab: 'export' 
  },
  { 
    id: 'branding', 
    title: 'Customize Branding', 
    description: 'Apply your brand colors and styling to all forms and widgets.', 
    duration: 6000, 
    activeTab: 'branding' 
  }
];

const mockTestimonials = [
  {
    id: '1',
    name: 'Sarah Johnson',
    company: 'TechCorp',
    message: 'TestiFlow has completely transformed how we collect customer feedback. The automated workflows save us hours every week!',
    rating: 5,
    status: 'approved',
    submitted_at: '2025-01-15T10:30:00Z'
  },
  {
    id: '2',
    name: 'Mike Chen',
    company: 'StartupXYZ',
    message: 'Amazing product! The testimonial management features are exactly what we needed for our marketing campaigns.',
    rating: 5,
    status: 'pending',
    submitted_at: '2025-01-14T15:45:00Z'
  },
  {
    id: '3',
    name: 'Emily Davis',
    company: 'GrowthCo',
    message: 'The export features are incredible. We can now easily use testimonials across all our marketing channels.',
    rating: 4,
    status: 'approved',
    submitted_at: '2025-01-13T09:20:00Z'
  }
];

export const Demo: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [customerFormProgress, setCustomerFormProgress] = useState(0);
  const [selectedTestimonial, setSelectedTestimonial] = useState(mockTestimonials[1]);
  const [exportFormat, setExportFormat] = useState('csv');
  const [primaryColor, setPrimaryColor] = useState('#01004d');
  const [secondaryColor, setSecondaryColor] = useState('#01b79e');

  const currentStep = demoSteps[currentStepIndex];

  // Auto-advance logic
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setTimeout(() => {
      setCurrentStepIndex((prev) => (prev + 1) % demoSteps.length);
      setProgress(0);
    }, currentStep.duration);

    const progressTimer = setInterval(() => {
      setProgress(p => {
        const increment = 100 / (currentStep.duration / 100);
        return Math.min(p + increment, 100);
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      clearInterval(progressTimer);
    };
  }, [currentStepIndex, isPlaying, currentStep.duration]);

  // Step-specific animations
  useEffect(() => {
    setProgress(0);
    
    switch (currentStep.id) {
      case 'create-form':
        setTimeout(() => setShowFormModal(true), 1000);
        setTimeout(() => setShowFormModal(false), 6000);
        break;
      case 'customer-submission':
        setTimeout(() => setShowCustomerForm(true), 1000);
        // Auto-scroll simulation
        const scrollTimer = setInterval(() => {
          setCustomerFormProgress(prev => {
            if (prev >= 100) {
              clearInterval(scrollTimer);
              setTimeout(() => setShowCustomerForm(false), 1000);
              return 100;
            }
            return prev + 2;
          });
        }, 100);
        return () => clearInterval(scrollTimer);
      case 'review-testimonials':
        setSelectedTestimonial(mockTestimonials[1]);
        setTimeout(() => {
          setSelectedTestimonial({...mockTestimonials[1], status: 'approved'});
        }, 4000);
        break;
      case 'branding':
        setTimeout(() => setPrimaryColor('#2563eb'), 2000);
        setTimeout(() => setSecondaryColor('#10b981'), 4000);
        break;
    }
  }, [currentStep.id]);

  const nextStep = () => {
    setCurrentStepIndex((prev) => (prev + 1) % demoSteps.length);
    setProgress(0);
  };

  const prevStep = () => {
    setCurrentStepIndex((prev) => (prev - 1 + demoSteps.length) % demoSteps.length);
    setProgress(0);
  };

  const resetDemo = () => {
    setCurrentStepIndex(0);
    setProgress(0);
    setShowFormModal(false);
    setShowCustomerForm(false);
    setCustomerFormProgress(0);
    setSelectedTestimonial(mockTestimonials[1]);
    setExportFormat('csv');
    setPrimaryColor('#01004d');
    setSecondaryColor('#01b79e');
  };

  return (
    <div className="h-screen w-full bg-gray-50 flex flex-col overflow-hidden">
      {/* Demo Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-3">
          <TestiFlowIcon className="h-8 w-8" style={{ color: primaryColor }} />
          <span className="text-xl font-bold">TestiFlow Demo</span>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>
          <button
            onClick={resetDemo}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Restart</span>
          </button>
        </div>
      </header>

      <div className="flex flex-grow min-h-0">
        {/* App Sidebar */}
        <nav className="w-64 bg-white border-r border-gray-200 p-4 flex-shrink-0">
          <ul className="space-y-1">
            {[
              { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
              { id: 'forms', icon: FileInput, label: 'Forms' },
              { id: 'testimonials', icon: Star, label: 'Testimonials' },
              { id: 'export', icon: Download, label: 'Export' },
              { id: 'branding', icon: Palette, label: 'Branding' },
            ].map(tab => (
              <li key={tab.id}>
                <div className={`flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  currentStep.activeTab === tab.id 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-600'
                }`}>
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </div>
              </li>
            ))}
          </ul>
        </nav>

        {/* Main Content */}
        <main className="flex-grow p-8 overflow-y-auto">
          {/* Dashboard */}
          {currentStep.activeTab === 'dashboard' && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Total Testimonials</h3>
                  <p className="text-3xl font-bold text-gray-900">247</p>
                  <p className="text-sm text-green-600 mt-1">+23 this month</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Average Rating</h3>
                  <div className="flex items-center">
                    <p className="text-3xl font-bold text-gray-900">4.8</p>
                    <Star className="h-6 w-6 text-yellow-400 fill-current ml-2" />
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Approval Rate</h3>
                  <p className="text-3xl font-bold text-gray-900">89%</p>
                  <p className="text-sm text-blue-600 mt-1">Above average</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {mockTestimonials.slice(0, 3).map((testimonial) => (
                    <div key={testimonial.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{testimonial.name}</p>
                          <p className="text-sm text-gray-500">{testimonial.company}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          testimonial.status === 'approved' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {testimonial.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Forms */}
          {currentStep.activeTab === 'forms' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">Forms</h1>
                <button
                  onClick={() => setShowFormModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-5 w-5" />
                  <span>New Form</span>
                </button>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Customer Experience Survey</h3>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">Collect feedback about customer experience</p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>Preview</span>
                    </button>
                    <button className="bg-gray-100 text-gray-600 hover:bg-gray-200 px-3 py-1 rounded-md text-xs font-medium flex items-center space-x-1">
                      <Copy className="h-3 w-3" />
                      <span>Copy Link</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Testimonials */}
          {currentStep.activeTab === 'testimonials' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">Testimonials</h1>
                <div className="flex space-x-2">
                  <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {mockTestimonials.map((testimonial) => (
                  <div key={testimonial.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{testimonial.name}</p>
                          <p className="text-sm text-gray-500">{testimonial.company}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        testimonial.status === 'approved' 
                          ? 'bg-green-100 text-green-800' 
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
                      <span className="text-sm text-gray-500">({testimonial.rating}/5)</span>
                    </div>

                    <p className="text-gray-700 text-sm leading-relaxed mb-4">
                      "{testimonial.message}"
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        View Details
                      </button>
                      {testimonial.status === 'pending' && (
                        <div className="flex space-x-2">
                          <button className="bg-green-100 text-green-800 hover:bg-green-200 px-3 py-1 rounded-md text-xs font-medium">
                            Approve
                          </button>
                          <button className="bg-red-100 text-red-800 hover:bg-red-200 px-3 py-1 rounded-md text-xs font-medium">
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Export */}
          {currentStep.activeTab === 'export' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">Export Testimonials</h1>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2">
                  <Download className="h-5 w-5" />
                  <span>Export Selected</span>
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Export Format Selection */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Choose Export Format</h3>
                  
                  <div className="space-y-3">
                    {[
                      { id: 'csv', icon: FileText, title: 'CSV Spreadsheet', desc: 'For analysis in Excel/Google Sheets', color: 'green' },
                      { id: 'json', icon: Code, title: 'JSON Data', desc: 'For developers and integrations', color: 'blue' },
                      { id: 'widget', icon: Share2, title: 'Website Widget', desc: 'HTML code to embed on your website', color: 'purple' },
                      { id: 'social', icon: Share2, title: 'Social Media Post', desc: 'Ready-to-post content for social platforms', color: 'pink' }
                    ].map((format) => (
                      <button
                        key={format.id}
                        onClick={() => setExportFormat(format.id)}
                        className={`w-full p-4 border rounded-lg text-left transition-colors ${
                          exportFormat === format.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <format.icon className={`h-6 w-6 text-${format.color}-600`} />
                          <div>
                            <div className="font-medium">{format.title}</div>
                            <div className="text-sm text-gray-500">{format.desc}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Export Preview */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
                  
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    {exportFormat === 'csv' && (
                      <div>
                        <h4 className="font-medium mb-3">CSV Export Preview</h4>
                        <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm">
                          <div className="text-gray-600">Name,Company,Rating,Message,Status</div>
                          <div>"Sarah Johnson","TechCorp",5,"TestiFlow has...","approved"</div>
                          <div>"Mike Chen","StartupXYZ",5,"Amazing product...","pending"</div>
                        </div>
                      </div>
                    )}

                    {exportFormat === 'json' && (
                      <div>
                        <h4 className="font-medium mb-3">JSON Export Preview</h4>
                        <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-sm max-h-64 overflow-y-auto">
                          <pre>{`{
  "testimonials": [
    {
      "id": "1",
      "name": "Sarah Johnson",
      "company": "TechCorp",
      "rating": 5,
      "message": "TestiFlow has completely...",
      "status": "approved"
    }
  ]
}`}</pre>
                        </div>
                      </div>
                    )}

                    {exportFormat === 'widget' && (
                      <div>
                        <h4 className="font-medium mb-3">Website Widget Preview</h4>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="bg-white rounded-lg p-4 shadow-sm">
                            <h4 className="text-center font-semibold mb-4">What Our Customers Say</h4>
                            <div className="space-y-3">
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <div className="flex mb-2">
                                  {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                                  ))}
                                </div>
                                <p className="text-sm italic mb-2">"TestiFlow has completely transformed..."</p>
                                <p className="text-xs text-gray-600">- Sarah Johnson, TechCorp</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {exportFormat === 'social' && (
                      <div>
                        <h4 className="font-medium mb-3">Social Media Post Preview</h4>
                        <div className="bg-white border rounded-lg p-4">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold text-sm">TC</span>
                            </div>
                            <div>
                              <p className="font-semibold">TechCorp</p>
                              <p className="text-sm text-gray-500">@techcorp</p>
                            </div>
                          </div>
                          <p className="mb-3">⭐⭐⭐⭐⭐ Customer Love!</p>
                          <p className="text-sm mb-3">"TestiFlow has completely transformed how we collect customer feedback..."</p>
                          <p className="text-sm text-gray-500">- Sarah Johnson, TechCorp</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Branding */}
          {currentStep.activeTab === 'branding' && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-gray-900">Form Branding</h1>
              
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
                    <div className="flex items-center space-x-4">
                      <img 
                        src="/2.png" 
                        alt="Logo" 
                        className="h-12 w-auto object-contain border border-gray-200 rounded"
                      />
                      <button className="text-sm text-blue-600 hover:text-blue-700">Change Logo</button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-10 h-10 rounded-lg border border-gray-300"
                        style={{ backgroundColor: primaryColor }}
                      ></div>
                      <input
                        type="text"
                        value={primaryColor}
                        readOnly
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-10 h-10 rounded-lg border border-gray-300"
                        style={{ backgroundColor: secondaryColor }}
                      ></div>
                      <input
                        type="text"
                        value={secondaryColor}
                        readOnly
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Preview</h3>
                  <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                    <div 
                      className="px-6 py-8 text-center text-white"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <div className="flex justify-center mb-4">
                        <img 
                          src="/2.png" 
                          alt="Logo" 
                          className="h-8 max-w-32 object-contain"
                        />
                      </div>
                      <h1 className="text-xl font-bold mb-2">Share Your Experience</h1>
                      <p className="text-white/90">We'd love to hear about your experience!</p>
                    </div>
                    <div className="p-6">
                      <button
                        className="w-full py-3 px-6 rounded-lg font-semibold text-white"
                        style={{ backgroundColor: secondaryColor }}
                      >
                        Submit Testimonial
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Customer Form Overlay */}
      {showCustomerForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
            <div 
              className="px-6 py-8 text-center text-white"
              style={{ backgroundColor: primaryColor }}
            >
              <div className="flex justify-center mb-4">
                <img 
                  src="/2.png" 
                  alt="Logo" 
                  className="h-8 max-w-32 object-contain"
                />
              </div>
              <h1 className="text-2xl font-bold mb-2">Share Your Experience</h1>
              <p className="text-white/90">We'd love to hear about your experience with us!</p>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Progress indicator */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${customerFormProgress}%` }}
                ></div>
              </div>

              {/* Form fields with progressive reveal */}
              <div className={`transition-opacity duration-500 ${customerFormProgress > 10 ? 'opacity-100' : 'opacity-30'}`}>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Name *</label>
                <input
                  type="text"
                  value={customerFormProgress > 20 ? 'Sarah Johnson' : ''}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter your name"
                />
              </div>

              <div className={`transition-opacity duration-500 ${customerFormProgress > 30 ? 'opacity-100' : 'opacity-30'}`}>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                <input
                  type="text"
                  value={customerFormProgress > 40 ? 'TechCorp' : ''}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter your company"
                />
              </div>

              <div className={`transition-opacity duration-500 ${customerFormProgress > 50 ? 'opacity-100' : 'opacity-30'}`}>
                <label className="block text-sm font-medium text-gray-700 mb-3">Rating *</label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-8 w-8 transition-colors duration-300 ${
                        customerFormProgress > 60 && star <= 5
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className={`transition-opacity duration-500 ${customerFormProgress > 70 ? 'opacity-100' : 'opacity-30'}`}>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Testimonial *</label>
                <textarea
                  rows={4}
                  value={customerFormProgress > 80 ? 'TestiFlow has completely transformed how we collect customer feedback. The automated workflows save us hours every week!' : ''}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Tell us about your experience..."
                />
              </div>

              <button
                className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-300 ${
                  customerFormProgress > 90 ? 'opacity-100' : 'opacity-50'
                }`}
                style={{ backgroundColor: secondaryColor }}
              >
                Submit Testimonial
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form Creation Modal */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Form</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Form Title</label>
                <input
                  type="text"
                  value="Customer Experience Survey"
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value="We'd love to hear about your experience with our product and services."
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md font-medium">
                  Create Form
                </button>
                <button 
                  onClick={() => setShowFormModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progress Footer */}
      <footer className="bg-white border-t border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-4">
            <button
              onClick={prevStep}
              className="flex items-center space-x-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>
            <div className="font-bold text-gray-800">{currentStep.title}</div>
            <button
              onClick={nextStep}
              className="flex items-center space-x-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <span>Next</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <span className="text-sm font-medium text-gray-600">
            {currentStepIndex + 1} / {demoSteps.length}
          </span>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex-grow">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-100"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
          <p className="text-sm text-gray-600 min-w-0 flex-shrink">{currentStep.description}</p>
        </div>
      </footer>
    </div>
  );
};