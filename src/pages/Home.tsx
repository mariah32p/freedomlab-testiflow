import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Star, MessageSquare, CheckCircle, Users, Zap, Shield, Check, FileText, Code } from 'lucide-react';
import { TestiFlowIcon } from '../components/TestiFlowIcon';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/signup');
    window.scrollTo(0, 0);
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50 pt-4 pb-12 sm:pt-8 sm:pb-16 lg:pb-0">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-6 bg-transparent sm:pb-12 md:pb-16 lg:max-w-2xl lg:w-full lg:pb-20 xl:pb-24">
            <main className="mt-4 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-12 lg:px-8 xl:mt-16">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-3xl tracking-tight font-bold text-gray-900 sm:text-4xl md:text-5xl lg:text-6xl">
                  <span className="block xl:inline">Turn Customer</span>{' '}
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-500 xl:inline">
                    Feedback into
                  </span>{' '}
                  <span className="block xl:inline">Marketing Gold</span>
                </h1>
                <p className="mt-3 text-sm text-gray-500 sm:mt-5 sm:text-base md:text-lg lg:text-xl sm:max-w-xl sm:mx-auto md:mt-5 lg:mx-0">
                  Collect, manage, and showcase customer testimonials with beautiful forms, automated workflows, and powerful export tools. Build trust and drive conversions with authentic customer stories.
                </p>
                <div className="mt-6 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <button
                      onClick={handleGetStarted}
                      className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-primary-950 hover:bg-primary-900 sm:px-8 sm:text-base md:py-4 md:text-lg md:px-10 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      Start Free Trial
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="mt-8 lg:mt-0 lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 lg:pt-20 xl:pt-24">
          <div className="h-64 w-full sm:h-80 md:h-96 lg:h-full flex items-center justify-center py-4 sm:py-8 lg:py-12">
            {/* Main Dashboard Mockup */}
            <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto px-4 sm:px-4 lg:px-2">
              {/* Browser Window */}
              <div className="bg-white rounded-lg sm:rounded-xl shadow-xl border border-gray-200 overflow-hidden transform hover:scale-105 transition-all duration-500 hover:shadow-2xl w-full">
                {/* Browser Header */}
                <div className="bg-gray-100 px-2 sm:px-3 py-1 sm:py-2 flex items-center space-x-2 border-b border-gray-200">
                  <div className="flex space-x-2">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-400 rounded-full"></div>
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-yellow-400 rounded-full"></div>
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="flex-1 bg-white rounded-md px-1.5 py-0.5 text-xs text-gray-500 font-mono">
                    <span className="hidden sm:inline">testiflow.com/dashboard</span>
                    <span className="sm:hidden">dashboard</span>
                  </div>
                </div>
                
                {/* Dashboard Content */}
                <div className="bg-white">
                  {/* Top Navigation */}
                  <div className="bg-white border-b border-gray-100 px-2 sm:px-4 py-1 sm:py-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <TestiFlowIcon className="h-3 w-3 sm:h-4 sm:w-4 text-primary-950" />
                        <span className="text-xs sm:text-sm font-bold text-primary-950">TestiFlow</span>
                      </div>
                      <div className="flex items-center space-x-1 sm:space-x-2 text-xs">
                        <span className="text-primary-950 font-medium">Dashboard</span>
                        <span className="text-gray-500 hidden sm:inline">Forms</span>
                        <span className="text-gray-500 hidden md:inline">Testimonials</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Dashboard Stats */}
                  <div className="p-2 sm:p-3 md:p-4">
                    <div className="grid grid-cols-3 gap-1 sm:gap-2 md:gap-3 mb-2 sm:mb-3 md:mb-4">
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-1 sm:p-2 md:p-3 rounded border sm:rounded-lg border-blue-100 animate-slide-up">
                        <div className="flex items-center justify-between mb-0.5 sm:mb-1">
                          <span className="text-xs font-medium text-gray-700 hidden sm:block">Total</span>
                          <span className="text-xs font-medium text-gray-700 sm:hidden">T</span>
                          <MessageSquare className="h-2 w-2 sm:h-3 sm:w-3 text-primary-950" />
                        </div>
                        <div className="text-xs sm:text-sm md:text-xl font-bold text-primary-950 animate-count-up">47</div>
                        <div className="text-xs text-gray-500 hidden lg:block">testimonials</div>
                      </div>
                      <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 p-1 sm:p-2 md:p-3 rounded border sm:rounded-lg border-secondary-200 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        <div className="flex items-center justify-between mb-0.5 sm:mb-1">
                          <span className="text-xs font-medium text-gray-700 hidden sm:block">Approved</span>
                          <span className="text-xs font-medium text-gray-700 sm:hidden">A</span>
                          <CheckCircle className="h-2 w-2 sm:h-3 sm:w-3 text-secondary-500" />
                        </div>
                        <div className="text-xs sm:text-sm md:text-xl font-bold text-secondary-500 animate-count-up">42</div>
                        <div className="text-xs text-gray-500 hidden lg:block">ready to use</div>
                      </div>
                      <div className="bg-gradient-to-br from-accent-50 to-accent-100 p-1 sm:p-2 md:p-3 rounded border sm:rounded-lg border-accent-200 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <div className="flex items-center justify-between mb-0.5 sm:mb-1">
                          <span className="text-xs font-medium text-gray-700 hidden sm:block">This Month</span>
                          <span className="text-xs font-medium text-gray-700 sm:hidden">M</span>
                          <Star className="h-2 w-2 sm:h-3 sm:w-3 text-accent-600" />
                        </div>
                        <div className="text-xs sm:text-sm md:text-xl font-bold text-accent-600 animate-count-up">12</div>
                        <div className="text-xs text-gray-500 hidden lg:block">new reviews</div>
                      </div>
                    </div>
                    
                    {/* Recent Testimonials Preview */}
                    <div className="space-y-1 sm:space-y-2">
                      <h3 className="text-xs sm:text-sm font-semibold text-gray-900">Recent Testimonials</h3>
                      
                      {/* Testimonial Cards */}
                      <div className="space-y-1 sm:space-y-2">
                        <div className="bg-white border border-gray-200 rounded p-1.5 sm:p-2 md:p-3 hover:shadow-md transition-all duration-200 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center">
                                <Users className="h-1.5 w-1.5 sm:h-2 sm:w-2 md:h-3 md:w-3 text-primary-950" />
                              </div>
                              <div>
                                <div className="font-medium text-gray-900 text-xs">Mariah W.</div>
                                <div className="text-xs text-gray-500 hidden sm:block">Technology</div>
                              </div>
                            </div>
                            <span className="px-1 py-0.5 bg-secondary-100 text-secondary-800 rounded-full text-xs font-medium">
                              approved
                            </span>
                          </div>
                          <div className="flex items-center space-x-0.5 mb-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} className="h-1.5 w-1.5 sm:h-2 sm:w-2 text-yellow-400 fill-current" />
                            ))}
                          </div>
                          <p className="text-gray-700 text-xs leading-tight">
                            "TestiFlow has streamlined our client feedback process..."
                          </p>
                        </div>
                        
                        <div className="bg-white border border-gray-200 rounded p-1.5 sm:p-2 md:p-3 hover:shadow-md transition-all duration-200 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center">
                                <Users className="h-1.5 w-1.5 sm:h-2 sm:w-2 md:h-3 md:w-3 text-primary-950" />
                              </div>
                              <div>
                                <div className="font-medium text-gray-900 text-xs">Nathan R.</div>
                                <div className="text-xs text-gray-500 hidden sm:block">IT & Legal</div>
                              </div>
                            </div>
                            <span className="px-1 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                              pending
                            </span>
                          </div>
                          <div className="flex items-center space-x-0.5 mb-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} className="h-1.5 w-1.5 sm:h-2 sm:w-2 text-yellow-400 fill-current" />
                            ))}
                          </div>
                          <p className="text-gray-700 text-xs leading-tight">
                            "The custom branding and export features are game-changers..."
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Section */}
      <div className="py-12 sm:py-16 bg-white" id="demo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-base text-primary-950 font-semibold tracking-wide uppercase">How It Works</h2>
            <p className="mt-2 text-2xl leading-8 font-bold tracking-tight text-gray-900 sm:text-3xl md:text-4xl">
              See TestiFlow in Action
            </p>
            <p className="mt-4 max-w-2xl text-base sm:text-lg md:text-xl text-gray-500 mx-auto">
              From creation to showcase - watch how easy it is to manage testimonials
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Step 1: Create Forms */}
            <div className="text-center group">
              <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                {/* Form Builder Mockup */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
                  <div className="bg-primary-950 text-white p-2 sm:p-3 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <TestiFlowIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="text-xs sm:text-sm font-semibold">Form Builder</span>
                    </div>
                  </div>
                  <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-700">Form Title</span>
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-secondary-500 rounded-full"></div>
                    </div>
                    <div className="h-1.5 sm:h-2 bg-gray-200 rounded w-full"></div>
                    <div className="space-y-1 sm:space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-100 rounded border border-blue-300"></div>
                        <span className="text-xs text-gray-600">Custom Field</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-100 rounded border border-green-300"></div>
                        <span className="text-xs text-gray-600">Rating Field</span>
                      </div>
                    </div>
                    <button className="w-full bg-primary-950 text-white py-1 rounded text-xs font-medium">
                      Create Form
                    </button>
                  </div>
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">1. Create Forms</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Build custom testimonial collection forms with your branding, custom fields, and media upload options.
              </p>
            </div>

            {/* Step 2: Collect Feedback */}
            <div className="text-center group sm:col-span-2 lg:col-span-1">
              <div className="bg-gradient-to-br from-secondary-50 to-accent-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animation-delay-150">
                {/* Customer Form Mockup */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
                  <div className="bg-secondary-500 text-white p-2 sm:p-3 text-center">
                    <span className="text-xs sm:text-sm font-semibold">Customer Experience</span>
                  </div>
                  <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                    <div className="flex justify-center space-x-0.5 sm:space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <div className="space-y-1 sm:space-y-2">
                      <div className="h-1.5 sm:h-2 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-1.5 sm:h-2 bg-gray-200 rounded w-full"></div>
                    </div>
                    <div className="h-6 sm:h-8 bg-gray-100 rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
                      <span className="text-xs text-gray-500">📸 Upload</span>
                    </div>
                    <button className="w-full bg-secondary-500 text-white py-1 rounded text-xs font-medium">
                      Submit
                    </button>
                  </div>
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">2. Collect Feedback</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Customers fill out your branded forms with ratings, testimonials, and optional media uploads.
              </p>
            </div>

            {/* Step 3: Export & Use */}
            <div className="text-center group sm:col-span-2 lg:col-span-1">
              <div className="bg-gradient-to-br from-accent-50 to-primary-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animation-delay-300">
                {/* Export Dashboard Mockup */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
                  <div className="bg-accent-600 text-white p-2 sm:p-3 text-center">
                    <span className="text-xs sm:text-sm font-semibold">Export Dashboard</span>
                  </div>
                  <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                    <div className="grid grid-cols-3 gap-1">
                      <div className="bg-green-100 text-green-800 p-1 rounded text-center">
                        <FileText className="h-2.5 w-2.5 sm:h-3 sm:w-3 mx-auto mb-0.5 sm:mb-1" />
                        <span className="text-xs">CSV</span>
                      </div>
                      <div className="bg-blue-100 text-blue-800 p-1 rounded text-center">
                        <Code className="h-2.5 w-2.5 sm:h-3 sm:w-3 mx-auto mb-0.5 sm:mb-1" />
                        <span className="text-xs">Widget</span>
                      </div>
                      <div className="bg-purple-100 text-purple-800 p-1 rounded text-center">
                        <MessageSquare className="h-2.5 w-2.5 sm:h-3 sm:w-3 mx-auto mb-0.5 sm:mb-1" />
                        <span className="text-xs">Social</span>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded p-2">
                      <div className="flex items-center justify-center space-x-0.5 sm:space-x-1 mb-1">
                        <Star className="h-1.5 w-1.5 sm:h-2 sm:w-2 text-yellow-400 fill-current" />
                        <Star className="h-1.5 w-1.5 sm:h-2 sm:w-2 text-yellow-400 fill-current" />
                        <Star className="h-1.5 w-1.5 sm:h-2 sm:w-2 text-yellow-400 fill-current" />
                        <Star className="h-1.5 w-1.5 sm:h-2 sm:w-2 text-yellow-400 fill-current" />
                        <Star className="h-1.5 w-1.5 sm:h-2 sm:w-2 text-yellow-400 fill-current" />
                      </div>
                      <div className="h-1 bg-gray-200 rounded w-full mb-0.5 sm:mb-1"></div>
                      <div className="h-1 bg-gray-200 rounded w-2/3"></div>
                    </div>
                    <button className="w-full bg-accent-600 text-white py-1 rounded text-xs font-medium">
                      Export
                    </button>
                  </div>
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">3. Export & Use</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Export testimonials as CSV, generate website widgets, or create social media posts ready for marketing.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 sm:py-16 bg-white" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary-950 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-2xl leading-8 font-bold tracking-tight text-gray-900 sm:text-3xl md:text-4xl">
              Everything you need to manage testimonials
            </p>
            <p className="mt-4 max-w-2xl text-base sm:text-lg md:text-xl text-gray-500 lg:mx-auto">
              From collection to showcase, TestiFlow handles every step of your testimonial workflow.
            </p>
          </div>

          <div className="mt-8 sm:mt-10">
            <div className="space-y-8 sm:space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-6 lg:gap-x-8 md:gap-y-8 lg:gap-y-10">
              <div className="relative">
                <div className="absolute flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-md bg-primary-950 text-white">
                  <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <p className="ml-14 sm:ml-16 text-base sm:text-lg leading-6 font-medium text-gray-900">Smart Collection Forms</p>
                <p className="mt-2 ml-14 sm:ml-16 text-sm sm:text-base text-gray-500">
                  Create beautiful, branded forms that make it easy for customers to share their experiences. Customize fields, colors, and messaging.
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-md bg-secondary-500 text-white">
                  <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <p className="ml-14 sm:ml-16 text-base sm:text-lg leading-6 font-medium text-gray-900">Approval Workflow</p>
                <p className="mt-2 ml-14 sm:ml-16 text-sm sm:text-base text-gray-500">
                  Review testimonials before they go live. Approve, reject, or request changes with a simple click.
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-md bg-accent-500 text-white">
                  <Zap className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <p className="ml-14 sm:ml-16 text-base sm:text-lg leading-6 font-medium text-gray-900">Powerful Exports</p>
                <p className="mt-2 ml-14 sm:ml-16 text-sm sm:text-base text-gray-500">
                  Export testimonials as CSV, JSON, or generate ready-to-use website widgets for your marketing.
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-md bg-primary-600 text-white">
                  <Shield className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <p className="ml-14 sm:ml-16 text-base sm:text-lg leading-6 font-medium text-gray-900">Rich Media Support</p>
                <p className="mt-2 ml-14 sm:ml-16 text-sm sm:text-base text-gray-500">
                  Collect not just text testimonials, but also images and videos for more engaging customer stories.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Proof Section */}
      <div className="bg-gray-50 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Trusted by Growing Businesses</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-sm sm:text-base text-gray-700 mb-4 italic leading-relaxed">
                  "TestiFlow has streamlined our client feedback process incredibly. The professional forms and approval workflow have elevated our service quality."
                </p>
                <div className="text-xs sm:text-sm text-gray-600">
                  - Mariah W., Technology Solutions
                </div>
              </div>

              <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg sm:col-span-2 lg:col-span-1">
                <div className="flex items-center mb-4">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-sm sm:text-base text-gray-700 mb-4 italic leading-relaxed">
                  "The custom branding and export features are game-changers. We can now showcase client testimonials professionally across all our platforms."
                </p>
                <div className="text-xs sm:text-sm text-gray-600">
                  - Nathan R., IT & Legal Services
                </div>
              </div>

              <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg sm:col-span-2 lg:col-span-1">
                <div className="flex items-center mb-4">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-sm sm:text-base text-gray-700 mb-4 italic leading-relaxed">
                  "The video testimonial feature has been incredible for our insurance business. Clients love sharing their stories, and it builds so much trust."
                </p>
                <div className="text-xs sm:text-sm text-gray-600">
                  - Amber I., Insurance
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="bg-white py-12 sm:py-16" id="pricing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 sm:mb-12 max-w-2xl mx-auto">
              Choose the plan that fits your testimonial management needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {/* Standard Plan */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300">
              <div className="bg-gray-50 px-4 sm:px-6 py-6 sm:py-8 text-center border-b border-gray-200">
                <h3 className="text-xl sm:text-2xl font-bold text-primary-950">Standard</h3>
                <div className="mt-4 flex items-baseline justify-center">
                  <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-950">$29</span>
                  <span className="text-lg sm:text-xl text-gray-500 ml-1">/month</span>
                </div>
                <p className="mt-2 text-sm sm:text-base text-gray-600">Perfect for small businesses getting started</p>
              </div>
              
              <div className="px-4 sm:px-6 py-6 sm:py-8">
                <ul className="space-y-3 sm:space-y-4">
                  {[
                    'Up to 25 testimonials',
                    '1 collection form',
                    'Basic approval workflow',
                    'CSV export',
                    'Email notifications',
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-4 w-4 sm:h-5 sm:w-5 text-secondary-500 mr-2 sm:mr-3 flex-shrink-0" />
                      <span className="text-sm sm:text-base text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Premium Plan */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-secondary-500">
              <div className="bg-gradient-to-r from-primary-950 to-secondary-500 px-4 sm:px-6 py-6 sm:py-8 text-center">
                <h3 className="text-xl sm:text-2xl font-bold text-white">Premium</h3>
                <div className="mt-4 flex items-baseline justify-center">
                  <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">$49</span>
                  <span className="text-lg sm:text-xl text-white/80 ml-1">/month</span>
                </div>
                <p className="mt-2 text-sm sm:text-base text-white/90">Complete solution for growing businesses</p>
              </div>
              
              <div className="px-4 sm:px-6 py-6 sm:py-8">
                <ul className="space-y-3 sm:space-y-4">
                  {[
                    'Unlimited testimonials & forms',
                    'Custom fields & branding',
                    'Image + video testimonials',
                    'Website widget generator',
                    'Advanced exports (JSON, social media posts)',
                    'Tag organization',
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-4 w-4 sm:h-5 sm:w-5 text-secondary-500 mr-2 sm:mr-3 flex-shrink-0" />
                      <span className="text-sm sm:text-base text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          {/* Single CTA Button */}
          <div className="text-center mt-8 sm:mt-12">
            <button
              onClick={handleGetStarted}
              className="bg-primary-950 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-lg font-bold text-base sm:text-lg hover:bg-primary-900 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Start Your Free Trial
            </button>
          </div>
          
          <div className="text-center mt-4 sm:mt-8">
            <p className="text-sm sm:text-base text-gray-500">
              All plans include a 7-day free trial.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white py-12 sm:py-16" id="faq">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600">Everything you need to know about TestiFlow</p>
          </div>

          <div className="space-y-6 sm:space-y-8">
            <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                What's the difference between Standard and Premium plans?
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Standard is perfect for small businesses with up to 25 testimonials and 1 form. Premium offers unlimited testimonials and forms, plus advanced features like custom branding, video testimonials, and website widgets.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                Is there a free trial?
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Yes! All plans include a 7-day free trial with full access to all features. No credit card required to start.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                Can I upgrade or downgrade my plan?
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Absolutely! You can change your plan anytime from your account settings. Changes take effect immediately with prorated billing.
              </p>
            </div>


          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary-950 to-secondary-500 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Ready to Transform Your Customer Feedback?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8">
            Join hundreds of businesses using TestiFlow to collect and showcase customer testimonials.
          </p>
          <button
            onClick={handleGetStarted}
            className="bg-white text-primary-950 px-6 py-3 sm:px-8 sm:py-4 rounded-lg font-bold text-base sm:text-lg hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Start Your Free Trial Today
          </button>
          <p className="text-white/80 text-xs sm:text-sm mt-3 sm:mt-4">
            7-day free trial • Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
};