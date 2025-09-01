import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Star, MessageSquare, Download, Settings, CheckCircle, Play, Users, TrendingUp, Clock, Plus, X } from 'lucide-react';
import { TestiFlowIcon } from '../components/TestiFlowIcon';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const demoRef = useRef<HTMLDivElement>(null);
  const [demoInView, setDemoInView] = useState(false);

  // Demo animation state
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showTestimonials, setShowTestimonials] = useState(false);
  const [showExport, setShowExport] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !demoInView) {
          setDemoInView(true);
          startDemoAnimation();
          startDemoAnimation();
        }
      },
      { threshold: 0.3 }
    );

    if (demoRef.current) {
      observer.observe(demoRef.current);
    }

    return () => observer.disconnect();
  }, [demoInView]);

  // Auto-advance through steps when demo is in view
  useEffect(() => {
    if (!demoInView || isAnimating) return;

    const timer = setTimeout(() => {
      setIsAnimating(true);
      setCurrentStep(prev => {
        const nextStep = prev >= 2 ? 0 : prev + 1;
        setTimeout(() => setIsAnimating(false), 500);
        return nextStep;
      });
    }, 4000); // Change step every 4 seconds

    return () => clearTimeout(timer);
  }, [currentStep, demoInView, isAnimating]);

  const startDemoAnimation = () => {
    setCurrentStep(0);
    setIsAnimating(false);
  };

  const startDemoAnimation = () => {
    // Reset state
    setCurrentStep(0);
    setShowCreateForm(false);
    setShowTestimonials(false);
    setShowExport(false);

    // Step 1: Create Form
    setTimeout(() => {
      setCurrentStep(1);
      setShowCreateForm(true);
    }, 500);

    // Step 2: Show Testimonials
    setTimeout(() => {
      setCurrentStep(2);
      setShowCreateForm(false);
      setShowTestimonials(true);
    }, 3000);

    // Step 3: Export
    setTimeout(() => {
      setCurrentStep(3);
      setShowExport(true);
    }, 6000);

    // Reset and loop
    setTimeout(() => {
      setCurrentStep(0);
      setShowCreateForm(false);
      setShowTestimonials(false);
      setShowExport(false);
      if (demoInView) {
        startDemoAnimation();
      }
    }, 9000);
  };

  const handleGetStarted = () => {
    navigate('/signup');
  };

  return (
    <div className="bg-white">
      {/* 1. Hero Section */}
      <section className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20 lg:pt-12 lg:pb-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Content */}
            <div className="text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-medium mb-8">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                7-Day Free Trial Available
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
                Stop Losing
                <span className="block bg-gradient-to-r from-primary-950 to-secondary-500 bg-clip-text text-transparent">
                  Customer Feedback
                </span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-gray-600 mb-10 leading-relaxed max-w-2xl">
                Collect testimonials in one organized place. Export them ready for your website, ads, and social media.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
                <button
                  onClick={handleGetStarted}
                  className="bg-primary-950 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary-900 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center justify-center space-x-3"
                >
                  <span>Start Free Trial</span>
                  <ArrowRight className="h-6 w-6" />
                </button>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center justify-center lg:justify-start space-x-8 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-secondary-500" />
                  <span>7-day free trial</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-secondary-500" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>

            {/* Right: Phone Mockup */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                {/* Phone Frame */}
                <div className="w-80 h-[640px] bg-gray-900 rounded-[3rem] p-3 shadow-2xl">
                  <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                    {/* Status Bar */}
                    <div className="bg-gray-50 h-8 flex items-center justify-center">
                      <div className="flex space-x-1">
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                      </div>
                    </div>

                    {/* Form Header */}
                    <div className="bg-primary-950 px-6 py-8 text-center text-white">
                      <TestiFlowIcon className="h-8 w-8 text-white mx-auto mb-3" />
                      <h2 className="text-lg font-bold mb-2">Share Your Experience</h2>
                      <p className="text-white/80 text-sm">We'd love your feedback!</p>
                    </div>

                    {/* Form Content */}
                    <div className="p-6 space-y-6">
                      {/* Rating */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Rate your experience</label>
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-7 w-7 text-yellow-400 fill-current" />
                          ))}
                        </div>
                      </div>

                      {/* Name Field */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <div className="w-full px-3 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 text-sm">
                          Sarah Johnson
                        </div>
                      </div>

                      {/* Testimonial */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Your testimonial</label>
                        <div className="w-full px-3 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 text-sm h-20 flex items-start">
                          <span>This platform is amazing for collecting...</span>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <button className="w-full bg-secondary-500 text-white py-4 rounded-lg font-semibold text-lg shadow-lg">
                        Submit Testimonial
                      </button>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 bg-white rounded-full p-3 shadow-lg">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white rounded-full p-3 shadow-lg">
                  <Star className="h-6 w-6 text-yellow-400 fill-current" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Demo Video Section */}
      <section ref={demoRef} className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">See TestiFlow in Action</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how easy it is to collect, organize, and use customer testimonials
            </p>
          </div>

          {/* Step Progress */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4 bg-white rounded-full px-6 py-3 shadow-lg border border-gray-200">
              {['Create Form', 'Collect Reviews', 'Export & Use'].map((step, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-500 ${
                    index <= currentStep 
                      ? 'bg-secondary-500 text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {index + 1}
                  </div>
                  <span className={`text-sm font-medium transition-colors duration-500 ${
                    index <= currentStep ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step}
                  </span>
                  {index < 2 && (
                    <div className={`w-8 h-0.5 transition-colors duration-500 ${
                      index < currentStep ? 'bg-secondary-500' : 'bg-gray-200'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Demo */}
          <div className="hidden lg:block">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 min-h-[600px]">
              {/* Demo Navbar */}
              <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <TestiFlowIcon className="h-6 w-6 text-primary-950" />
                    <span className="font-bold text-primary-950">TestiFlow</span>
                  </div>
                  <div className="flex items-center space-x-6">
                    <span className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-300 ${
                      currentStep === 0 ? 'bg-primary-100 text-primary-950' : 'text-gray-600'
                    }`}>
                      Forms
                    </span>
                    <span className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-300 ${
                      currentStep >= 1 ? 'bg-primary-100 text-primary-950' : 'text-gray-600'
                    }`}>
                      Testimonials
                    </span>
                    <span className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-300 ${
                      currentStep >= 2 ? 'bg-primary-100 text-primary-950' : 'text-gray-600'
                    }`}>
                      Export
                    </span>
                  </div>
                </div>
              </div>

              {/* Demo Content */}
              <div className="p-8 min-h-[500px] relative">
                {/* Step 0: Create Form */}
                {currentStep === 0 && (
                  <div className="animate-slide-in">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Create Collection Forms</h3>
                        <p className="text-gray-600">Set up branded forms to collect customer testimonials</p>
                      </div>
                      <button className="bg-primary-950 text-white px-6 py-3 rounded-lg flex items-center space-x-2 shadow-lg">
                        <Plus className="h-5 w-5" />
                        <span>New Form</span>
                      </button>
                    </div>
                    
                    <div className="grid lg:grid-cols-2 gap-8">
                      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-4">Form Builder</h4>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Form Title</label>
                            <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 font-medium">
                              Share Your Experience
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700">
                              We'd love to hear about your experience with us!
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <input type="checkbox" checked className="rounded border-gray-300 text-primary-950" readOnly />
                            <span className="text-sm text-gray-700">Allow image uploads</span>
                          </div>
                          <button className="w-full bg-primary-950 text-white py-3 rounded-lg font-semibold">
                            Create Form
                          </button>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg">
                        <h4 className="font-semibold text-gray-900 mb-4">Live Preview</h4>
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                          <div className="bg-primary-950 px-4 py-6 text-center text-white">
                            <TestiFlowIcon className="h-6 w-6 text-white mx-auto mb-2" />
                            <h5 className="font-bold">Share Your Experience</h5>
                            <p className="text-white/80 text-sm">We'd love to hear about your experience!</p>
                          </div>
                          <div className="p-4 space-y-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Rating *</label>
                              <div className="flex space-x-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star key={star} className="h-4 w-4 text-yellow-400 fill-current" />
                                ))}
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Name *</label>
                              <div className="w-full px-2 py-2 border border-gray-300 rounded bg-gray-50 text-xs text-gray-500">
                                Your name here...
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Testimonial *</label>
                              <div className="w-full px-2 py-2 border border-gray-300 rounded bg-gray-50 text-xs text-gray-500 h-16">
                                Share your experience...
                              </div>
                            </div>
                            <button className="w-full bg-secondary-500 text-white py-2 rounded font-medium text-sm">
                              Submit Testimonial
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 1: Collect Reviews */}
                {currentStep === 1 && (
                  <div className="animate-slide-in">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Collect & Manage Reviews</h3>
                        <p className="text-gray-600">Customers submit testimonials through your branded forms</p>
                      </div>
                      <div className="flex space-x-3">
                        <span className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-medium">
                          2 Pending Review
                        </span>
                        <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                          8 Approved
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {[
                        { 
                          name: 'Sarah Johnson', 
                          company: 'TechCorp Solutions', 
                          rating: 5, 
                          message: 'TestiFlow has completely transformed how we collect customer feedback. The automated workflows save us hours every week!', 
                          status: 'pending',
                          highlight: true
                        },
                        { 
                          name: 'Mike Chen', 
                          company: 'StartupXYZ', 
                          rating: 5, 
                          message: 'Amazing product! The testimonial management features are exactly what we needed for our marketing campaigns.', 
                          status: 'approved',
                          highlight: false
                        },
                        { 
                          name: 'Emily Davis', 
                          company: 'GrowthCo', 
                          rating: 4, 
                          message: 'The export features are incredible. We can now easily use testimonials across all our marketing channels.', 
                          status: 'pending',
                          highlight: false
                        }
                      ].map((testimonial, index) => (
                        <div key={index} className={`bg-white border rounded-xl p-6 transition-all duration-500 ${
                          testimonial.highlight ? 'border-secondary-300 shadow-lg ring-4 ring-secondary-100' : 'border-gray-200 hover:shadow-md'
                        }`}>
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center">
                                <span className="text-primary-950 font-bold">
                                  {testimonial.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900">{testimonial.name}</div>
                                <div className="text-sm text-gray-600">{testimonial.company}</div>
                              </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
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
                                <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500">({testimonial.rating}/5)</span>
                          </div>
                          
                          <p className="text-gray-700 leading-relaxed mb-4">"{testimonial.message}"</p>
                          
                          {testimonial.status === 'pending' && (
                            <div className="flex space-x-3">
                              <button className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors flex items-center space-x-2">
                                <CheckCircle className="h-4 w-4" />
                                <span>Approve</span>
                              </button>
                              <button className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors flex items-center space-x-2">
                                <X className="h-4 w-4" />
                                <span>Reject</span>
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2: Export & Use */}
                {currentStep === 2 && (
                  <div className="animate-slide-in">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Export & Use Everywhere</h3>
                        <p className="text-gray-600">Turn testimonials into marketing assets for any channel</p>
                      </div>
                      <button className="bg-secondary-500 text-white px-6 py-3 rounded-lg flex items-center space-x-2 shadow-lg">
                        <Download className="h-5 w-5" />
                        <span>Export</span>
                      </button>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                          <div className="flex items-center space-x-3 mb-4">
                            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                              <MessageSquare className="h-5 w-5 text-white" />
                            </div>
                            <h4 className="font-semibold text-blue-900">Website Widget</h4>
                          </div>
                          <div className="bg-white rounded-lg p-4 border border-blue-200">
                            <div className="text-center mb-3">
                              <h5 className="font-semibold text-gray-900 text-sm">What Our Customers Say</h5>
                            </div>
                            <div className="space-y-3">
                              <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-secondary-500">
                                <div className="flex mb-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="h-3 w-3 text-yellow-400 fill-current" />
                                  ))}
                                </div>
                                <p className="text-xs text-gray-700 italic">"Amazing platform! Saves us hours..."</p>
                                <div className="text-xs text-gray-500 mt-1">- Sarah J., TechCorp</div>
                              </div>
                              <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-secondary-500">
                                <div className="flex mb-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="h-3 w-3 text-yellow-400 fill-current" />
                                  ))}
                                </div>
                                <p className="text-xs text-gray-700 italic">"Perfect for our marketing campaigns."</p>
                                <div className="text-xs text-gray-500 mt-1">- Mike C., StartupXYZ</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                          <div className="flex items-center space-x-3 mb-4">
                            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                              <TrendingUp className="h-5 w-5 text-white" />
                            </div>
                            <h4 className="font-semibold text-green-900">Social Media Post</h4>
                          </div>
                          <div className="bg-white rounded-lg p-4 border border-green-200">
                            <div className="text-sm text-gray-700 space-y-1">
                              <div className="font-medium">⭐⭐⭐⭐⭐ Customer Love!</div>
                              <div className="italic">"Amazing platform! Saves us hours every week and the interface is so intuitive!"</div>
                              <div className="text-gray-600">- Sarah Johnson, TechCorp Solutions</div>
                              <div className="text-blue-600 font-medium">#CustomerSuccess #Testimonial</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                            <Download className="h-5 w-5 text-white" />
                          </div>
                          <h4 className="font-semibold text-purple-900">Export Options</h4>
                        </div>
                        <div className="space-y-3">
                          <div className="bg-white rounded-lg p-4 border border-purple-200 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
                                <span className="text-green-600 text-xs">📊</span>
                              </div>
                              <span className="text-sm font-medium text-gray-900">CSV Spreadsheet</span>
                            </div>
                            <button className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">Export</button>
                          </div>
                          <div className="bg-white rounded-lg p-4 border border-purple-200 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                                <span className="text-blue-600 text-xs">💻</span>
                              </div>
                              <span className="text-sm font-medium text-gray-900">Website Code</span>
                            </div>
                            <button className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">Generate</button>
                          </div>
                          <div className="bg-white rounded-lg p-4 border border-purple-200 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-6 h-6 bg-orange-100 rounded flex items-center justify-center">
                                <span className="text-orange-600 text-xs">📱</span>
                              </div>
                              <span className="text-sm font-medium text-gray-900">Social Posts</span>
                            </div>
                            <button className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">Create</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Mobile Demo */}
          <div className="lg:hidden">
            <div className="space-y-8">
              {/* Step Cards */}
              <div className="grid gap-6">
                {/* Create Forms */}
                <div className={`bg-white rounded-xl p-6 border-2 transition-all duration-500 ${
                  currentStep === 0 ? 'border-primary-500 shadow-lg' : 'border-gray-200'
                }`}>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                      currentStep === 0 ? 'bg-primary-950 text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <Settings className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Create Forms</h3>
                      <p className="text-sm text-gray-600">Build branded collection forms</p>
                    </div>
                  </div>
                  
                  {currentStep === 0 && (
                    <div className="animate-slide-in">
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="space-y-3">
                          <div>
                            <div className="text-xs font-medium text-gray-700 mb-1">Form Title</div>
                            <div className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm">
                              Share Your Experience
                            </div>
                          </div>
                          <div>
                            <div className="text-xs font-medium text-gray-700 mb-1">Description</div>
                            <div className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm">
                              We'd love your feedback!
                            </div>
                          </div>
                          <button className="w-full bg-primary-950 text-white py-2 rounded font-medium text-sm">
                            Create Form
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Collect Reviews */}
                <div className={`bg-white rounded-xl p-6 border-2 transition-all duration-500 ${
                  currentStep === 1 ? 'border-secondary-500 shadow-lg' : 'border-gray-200'
                }`}>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                      currentStep === 1 ? 'bg-secondary-500 text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <MessageSquare className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Collect Reviews</h3>
                      <p className="text-sm text-gray-600">Customers submit testimonials</p>
                    </div>
                  </div>
                  
                  {currentStep === 1 && (
                    <div className="animate-slide-in space-y-3">
                      <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                              <span className="text-yellow-600 text-xs font-bold">SJ</span>
                            </div>
                            <span className="text-sm font-medium">Sarah Johnson</span>
                          </div>
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">Pending</span>
                        </div>
                        <div className="flex mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <p className="text-xs text-gray-700">"Amazing platform! Saves us hours..."</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-green-600 text-xs font-bold">MC</span>
                            </div>
                            <span className="text-sm font-medium">Mike Chen</span>
                          </div>
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Approved</span>
                        </div>
                        <div className="flex mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <p className="text-xs text-gray-700">"Perfect for marketing campaigns."</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Export & Use */}
                <div className={`bg-white rounded-xl p-6 border-2 transition-all duration-500 ${
                  currentStep === 2 ? 'border-purple-500 shadow-lg' : 'border-gray-200'
                }`}>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                      currentStep === 2 ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <Download className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Export & Use</h3>
                      <p className="text-sm text-gray-600">Ready for any marketing channel</p>
                    </div>
                  </div>
                  
                  {currentStep === 2 && (
                    <div className="animate-slide-in">
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-white rounded p-3 border text-center">
                            <div className="text-green-600 mb-1">📊</div>
                            <div className="text-xs font-medium">CSV Export</div>
                          </div>
                          <div className="bg-white rounded p-3 border text-center">
                            <div className="text-blue-600 mb-1">💻</div>
                            <div className="text-xs font-medium">Website Widget</div>
                          </div>
                          <div className="bg-white rounded p-3 border text-center">
                            <div className="text-orange-600 mb-1">📱</div>
                            <div className="text-xs font-medium">Social Posts</div>
                          </div>
                          <div className="bg-white rounded p-3 border text-center">
                            <div className="text-purple-600 mb-1">📧</div>
                            <div className="text-xs font-medium">Email Ready</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Key Features */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Everything You Need</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From collection to conversion, TestiFlow handles your entire testimonial workflow
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Settings className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Smart Collection</h3>
              <p className="text-gray-600">
                Create branded forms that customers actually want to fill out. Custom fields, media uploads, and mobile-optimized design.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Easy Management</h3>
              <p className="text-gray-600">
                Review, approve, and organize testimonials with tags. Approval workflow ensures only your best reviews go live.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Download className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Ready to Use</h3>
              <p className="text-gray-600">
                Export as website widgets, social media posts, or CSV data. Your testimonials are ready for any marketing channel.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Social Proof */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Loved by Growing Businesses</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Chen",
                role: "Marketing Director",
                company: "TechFlow",
                message: "TestiFlow transformed how we collect customer feedback. We went from scattered emails to organized testimonials in days.",
                rating: 5
              },
              {
                name: "Mike Rodriguez",
                role: "Agency Owner",
                company: "Growth Partners",
                message: "Our clients love the branded forms. We've increased testimonial collection by 300% since switching to TestiFlow.",
                rating: 5
              },
              {
                name: "Emily Watson",
                role: "SaaS Founder",
                company: "DataSync",
                message: "The export features are incredible. We use testimonials everywhere now - website, ads, social media. Game changer.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">"{testimonial.message}"</p>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-950 font-semibold">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}, {testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Pricing */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Simple Pricing</h2>
            <p className="text-xl text-gray-600">Start free, upgrade when you're ready</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-all duration-300">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Basic</h3>
              <div className="mb-6">
                <span className="text-5xl font-bold text-gray-900">$29</span>
                <span className="text-xl text-gray-500">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Up to 50 testimonials</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Custom forms</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Basic exports</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-primary-950 to-secondary-500 text-white rounded-2xl p-8 hover:shadow-xl transition-all duration-300 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-accent-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  MOST POPULAR
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Pro</h3>
              <div className="mb-6">
                <span className="text-5xl font-bold">$49</span>
                <span className="text-xl text-white/80">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  <span>Unlimited testimonials</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  <span>Advanced exports & widgets</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  <span>Video testimonials</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  <span>Priority support</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center mt-12">
            <button
              onClick={handleGetStarted}
              className="bg-primary-950 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary-900 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              Start Your Free Trial
            </button>
            <p className="text-sm text-gray-500 mt-3">7-day free trial • Cancel anytime</p>
          </div>
        </div>
      </section>

      {/* 6. FAQ */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {[
              {
                question: "How quickly can I start collecting testimonials?",
                answer: "You can create your first form and start collecting testimonials in under 2 minutes. No technical setup required."
              },
              {
                question: "Can I customize the look of my forms?",
                answer: "Yes! Add your logo, brand colors, and custom questions. Forms automatically match your brand identity."
              },
              {
                question: "What export options do you offer?",
                answer: "Export as CSV for analysis, JSON for developers, website widgets for embedding, or formatted social media posts."
              },
              {
                question: "Is there a limit on testimonials?",
                answer: "Basic plan includes 50 testimonials. Pro plan has unlimited testimonials and advanced features."
              }
            ].map((faq, index) => (
              <details key={index} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-all">
                <summary className="font-semibold text-gray-900 cursor-pointer text-lg">
                  {faq.question}
                </summary>
                <p className="text-gray-600 mt-4 leading-relaxed">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Final CTA */}
      <section className="py-24 bg-primary-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Turn Feedback Into Marketing Gold?
          </h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Join hundreds of businesses using TestiFlow to collect, organize, and leverage customer testimonials.
          </p>
          
          <button
            onClick={handleGetStarted}
            className="bg-secondary-500 text-white px-10 py-5 rounded-xl font-bold text-xl hover:bg-secondary-600 transition-all duration-200 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
          >
            Start Your Free Trial Today
          </button>
          
          <p className="text-white/60 mt-6">
            7-day free trial • Full access • Cancel anytime
          </p>
        </div>
      </section>
    </div>
  );
};