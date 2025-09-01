import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Shield, Zap, ArrowRight, BarChart3, CheckCircle, Globe, User, Settings } from 'lucide-react';
import { Demo } from './Demo';
// The unused TestiFlowIcon import was removed

export const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleSignupClick = () => {
    navigate('/signup');
    window.scrollTo(0, 0);
  };

  return (
    <>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-16 pb-16 sm:pb-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Side - Content */}
            <div>
              <div className="mb-6 sm:mb-8">
                <div className="inline-flex items-center space-x-2 bg-secondary-100 text-secondary-800 px-4 py-2 rounded-full font-semibold text-sm mb-8">
                  <span>🎉</span>
                  <span>7-Day Free Trial Available</span>
                </div>
                
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary-950 mb-4 sm:mb-6 leading-tight">
                  Transform Customer
                  <span className="text-secondary-500"> Testimonials</span>
                  <br />
                  Into Marketing Gold
                </h1>
                
                <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                  Complete testimonial collection and management platform with legal rights tracking
                  and automatic ad-ready export formats for marketing teams.
                </p>
                
                <div className="mb-6">
                  <button
                    onClick={handleSignupClick}
                    className="bg-primary-950 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-primary-900 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-base sm:text-lg w-full sm:w-auto justify-center"
                  >
                    <span>Start Free Trial</span>
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
                
                <p className="text-gray-500 text-sm text-center sm:text-left">
                  <strong>7-day free trial</strong> • Cancel anytime
                </p>
              </div>
            </div>

            {/* Right Side - Mockup */}
            <div className="relative mt-8 lg:mt-0">
              {/* Desktop Demo - Hidden on mobile */}
              <div className="hidden sm:block bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                {/* Browser Header */}
                <div className="bg-gray-100 px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-200 flex items-center space-x-2 sm:space-x-3">
                  <div className="flex space-x-1.5">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="flex-1 bg-white rounded-md px-2 sm:px-3 py-1 text-xs sm:text-sm text-gray-500 text-center">
                    testiflow.com/dashboard
                  </div>
                </div>
                
                {/* Dashboard Content */}
                <div className="p-4 sm:p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">Recent Testimonials</h2>
                    <div className="bg-secondary-100 text-secondary-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                      +12 this week
                    </div>
                  </div>
                  
                  {/* Testimonial Cards */}
                  <div className="space-y-3 sm:space-y-4">
                    {[
                      { name: 'Sarah Johnson', company: 'TechCorp', rating: 5, status: 'approved' },
                      { name: 'Mike Chen', company: 'StartupXYZ', rating: 5, status: 'pending' },
                      { name: 'Emily Davis', company: 'GrowthCo', rating: 4, status: 'approved' }
                    ].map((testimonial, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-2 sm:mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center">
                              <User className="h-3 w-3 sm:h-4 sm:w-4 text-primary-950" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 text-xs sm:text-sm">{testimonial.name}</div>
                              <div className="text-xs text-gray-500 hidden sm:block">{testimonial.company}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="flex">
                              {[...Array(testimonial.rating)].map((_, i) => (
                                <Star key={i} className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-yellow-400 fill-current" />
                              ))}
                            </div>
                            <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium ${
                              testimonial.status === 'approved'
                                ? 'bg-secondary-100 text-secondary-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {testimonial.status}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2 hidden sm:block">
                          "Amazing product! Has completely transformed our workflow and saved us countless hours..."
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200">
                    <div className="text-center">
                      <div className="text-base sm:text-lg font-bold text-primary-950">247</div>
                      <div className="text-xs text-gray-500">Total</div>
                    </div>
                    <div className="text-center">
                      <div className="text-base sm:text-lg font-bold text-secondary-500">189</div>
                      <div className="text-xs text-gray-500">Approved</div>
                    </div>
                    <div className="text-center">
                      <div className="text-base sm:text-lg font-bold text-accent-600">156</div>
                      <div className="text-xs text-gray-500">Exported</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Mobile Demo - Only visible on mobile */}
              <div className="sm:hidden bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden max-w-sm mx-auto">
                {/* Mobile Header */}
                <div className="bg-gray-900 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-1 h-4 bg-white rounded-full"></div>
                    <div className="w-1 h-4 bg-white rounded-full"></div>
                    <div className="w-1 h-4 bg-white rounded-full"></div>
                  </div>
                  <div className="text-white text-sm font-medium">9:41</div>
                  <div className="flex items-center space-x-1">
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-white rounded-full"></div>
                      <div className="w-1 h-1 bg-white rounded-full"></div>
                      <div className="w-1 h-1 bg-white rounded-full"></div>
                      <div className="w-1 h-1 bg-white rounded-full"></div>
                    </div>
                    <div className="w-6 h-3 border border-white rounded-sm">
                      <div className="w-4 h-1.5 bg-white rounded-sm m-0.5"></div>
                    </div>
                  </div>
                </div>
                
                {/* Mobile Browser Bar */}
                <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
                  <div className="bg-white rounded-full px-3 py-1.5 text-xs text-gray-600 flex items-center">
                    <span className="text-green-600 mr-2">🔒</span>
                    app.testiflow.com
                  </div>
                </div>
                
                {/* Mobile App Content */}
                <div className="p-4">
                  {/* Mobile Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">Dashboard</h2>
                      <p className="text-xs text-gray-500">Welcome back, Sarah</p>
                    </div>
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-primary-950" />
                    </div>
                  </div>
                  
                  {/* Mobile Stats Cards */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="bg-blue-50 p-3 rounded-lg text-center">
                      <div className="text-lg font-bold text-primary-950">247</div>
                      <div className="text-xs text-gray-500">Total</div>
                    </div>
                    <div className="bg-secondary-50 p-3 rounded-lg text-center">
                      <div className="text-lg font-bold text-secondary-500">189</div>
                      <div className="text-xs text-gray-500">Approved</div>
                    </div>
                    <div className="bg-accent-50 p-3 rounded-lg text-center">
                      <div className="text-lg font-bold text-accent-600">+12</div>
                      <div className="text-xs text-gray-500">This Week</div>
                    </div>
                  </div>
                  
                  {/* Mobile Testimonial List */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-900">Recent Testimonials</h3>
                    {[
                      { name: 'Sarah J.', rating: 5, status: 'approved' },
                      { name: 'Mike C.', rating: 5, status: 'pending' },
                      { name: 'Emily D.', rating: 4, status: 'approved' }
                    ].map((testimonial, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center">
                              <User className="h-3 w-3 text-primary-950" />
                            </div>
                            <span className="font-medium text-gray-900 text-sm">{testimonial.name}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <div className="flex">
                              {[...Array(testimonial.rating)].map((_, i) => (
                                <Star key={i} className="h-3 w-3 text-yellow-400 fill-current" />
                              ))}
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              testimonial.status === 'approved'
                                ? 'bg-secondary-100 text-secondary-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {testimonial.status}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600">
                          "Amazing product! Has transformed our workflow..."
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  {/* Mobile Bottom Navigation */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-4 gap-1">
                      <button className="flex flex-col items-center py-2 text-primary-950">
                        <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mb-1">
                          <BarChart3 className="h-3 w-3" />
                        </div>
                        <span className="text-xs">Dashboard</span>
                      </button>
                      <button className="flex flex-col items-center py-2 text-gray-500">
                        <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center mb-1">
                          <Settings className="h-3 w-3" />
                        </div>
                        <span className="text-xs">Forms</span>
                      </button>
                      <button className="flex flex-col items-center py-2 text-gray-500">
                        <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center mb-1">
                          <Star className="h-3 w-3" />
                        </div>
                        <span className="text-xs">Reviews</span>
                      </button>
                      <button className="flex flex-col items-center py-2 text-gray-500">
                        <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center mb-1">
                          <User className="h-3 w-3" />
                        </div>
                        <span className="text-xs">Profile</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-secondary-500 text-white px-4 py-2 rounded-lg shadow-lg transform rotate-3">
                <div className="text-sm font-semibold">Live Updates!</div>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-accent-500 text-white px-4 py-2 rounded-lg shadow-lg transform -rotate-2">
                <div className="text-sm font-semibold">Export Ready</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Section */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-semibold text-sm mb-6">
              <span>🎬</span>
              <span>Interactive Demo</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-primary-950 mb-4">
              See TestiFlow in Action
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Watch how easy it is to collect, manage, and export testimonials. This interactive demo shows the complete workflow from form creation to marketing use.
            </p>
          </div>
          
          {/* Browser Window */}
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden max-w-7xl mx-auto">
            {/* Browser Header */}
            <div className="bg-gray-100 px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-200 flex items-center space-x-2 sm:space-x-3">
              <div className="flex space-x-1.5">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
              <div className="flex-1 bg-white rounded-md px-3 py-1.5 text-sm text-gray-700 border border-gray-200">
                <span className="text-gray-400">🔒</span> https://app.testiflow.com/dashboard
              </div>
              <div className="hidden sm:flex items-center space-x-2">
                <div className="w-6 h-6 bg-gray-200 rounded border border-gray-300"></div>
                <div className="w-6 h-6 bg-gray-200 rounded border border-gray-300"></div>
              </div>
            </div>
            
            {/* Demo Content */}
            <div className="relative h-[600px] sm:h-[700px] lg:h-[800px] overflow-hidden">
              <Demo />
            </div>
          </div>
          
          <div className="text-center mt-4 sm:mt-6">
            <p className="text-gray-500 text-xs sm:text-sm">
              ↗️ Watch the complete TestiFlow workflow in action
            </p>
          </div>
        </div>
      </div>


      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-primary-950 mb-6">
                Smart Testimonial Collection
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Automated collection forms with customizable questions, follow-up sequences, and built-in consent management.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-secondary-500" />
                  </div>
                  <span className="text-gray-700">Customizable collection forms</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-secondary-500" />
                  </div>
                  <span className="text-gray-700">Automated follow-up sequences</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-secondary-500" />
                  </div>
                  <span className="text-gray-700">Built-in legal consent tracking</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="bg-primary-950 px-6 py-4">
                  <h3 className="text-white font-semibold">Customer Feedback Form</h3>
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">How was your experience?</label>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-6 w-6 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tell us more about your experience</label>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <p className="text-gray-600 text-sm">
                        "TestiFlow has completely transformed how we collect and manage customer feedback. The automated workflows save us hours every week!"
                      </p>
                    </div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-800">I consent to use this testimonial for marketing purposes</span>
                    </div>
                  </div>
                  <button className="w-full bg-primary-950 text-white py-3 rounded-lg font-medium hover:bg-primary-900 transition-colors">
                    Submit Testimonial
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Management Dashboard Mockup */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Testimonial Management</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {[
                      { name: 'Sarah Johnson', company: 'TechCorp', status: 'approved', rating: 5, consent: true },
                      { name: 'Mike Chen', company: 'StartupXYZ', status: 'pending', rating: 4, consent: true },
                      { name: 'Emily Davis', company: 'GrowthCo', status: 'approved', rating: 5, consent: false },
                    ].map((testimonial, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
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
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              testimonial.status === 'approved'
                                ? 'bg-secondary-100 text-secondary-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {testimonial.status}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          "Amazing product! Has saved us countless hours and improved our workflow significantly."
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Shield className={`h-4 w-4 ${testimonial.consent ? 'text-secondary-500' : 'text-gray-400'}`} />
                            <span className="text-xs text-gray-500">
                              {testimonial.consent ? 'Marketing consent given' : 'No marketing consent'}
                            </span>
                          </div>
                          <div className="flex space-x-2">
                            <button className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full transition-colors">
                              Edit
                            </button>
                            <button className="text-xs bg-primary-100 hover:bg-primary-200 text-primary-950 px-3 py-1 rounded-full transition-colors">
                              Export
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="order-1 lg:order-2">
              <h2 className="text-4xl font-bold text-primary-950 mb-6">
                Powerful Management Dashboard
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Review, approve, and organize testimonials with our intuitive dashboard. Track consent status and manage usage rights effortlessly.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-secondary-500" />
                  </div>
                  <span className="text-gray-700">Bulk approval and rejection</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-secondary-500" />
                  </div>
                  <span className="text-gray-700">Legal consent tracking</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-secondary-500" />
                  </div>
                  <span className="text-gray-700">Smart filtering and search</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Export Formats Mockup */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary-950 mb-6">
              Export to Any Marketing Channel
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              One-click export to marketing-ready formats. From social media posts to website widgets, we've got you covered.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Social Media Export */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-accent-500 to-accent-600 px-6 py-4">
                <h3 className="text-white font-semibold flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  Social Media Post
                </h3>
              </div>
              <div className="p-6">
                <div className="bg-gradient-to-br from-accent-50 to-accent-100 rounded-lg p-4 border border-accent-200">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div>
                      <div className="font-medium text-gray-900">Sarah Johnson</div>
                      <div className="text-sm text-gray-500">@sarahj_tech</div>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm mb-3">
                    "TestiFlow has completely transformed how we collect customer feedback! 🚀 The automated workflows are a game-changer. #CustomerSuccess #TestiFlow"
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>2:34 PM</span>
                    <span>•</span>
                    <span>Dec 15, 2024</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Website Widget */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-primary-600 to-primary-950 px-6 py-4">
                <h3 className="text-white font-semibold flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  Website Widget
                </h3>
              </div>
              <div className="p-6">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="text-center mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">What Our Customers Say</h4>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                      <div className="flex mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <p className="text-sm text-gray-700 mb-2">
                        "Incredible tool for managing testimonials!"
                      </p>
                      <div className="text-xs text-gray-500">- Mike Chen, StartupXYZ</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                      <div className="flex mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <p className="text-sm text-gray-700 mb-2">
                        "Saves us hours every week!"
                      </p>
                      <div className="text-xs text-gray-500">- Emily Davis, GrowthCo</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Analytics Export */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-secondary-500 to-secondary-600 px-6 py-4">
                <h3 className="text-white font-semibold flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Analytics Report
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Collection Rate</span>
                    <span className="font-semibold text-gray-900">87%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-secondary-500 h-2 rounded-full" style={{ width: '87%' }}></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Avg. Rating</span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-semibold text-gray-900">4.8</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Response Time</span>
                    <span className="font-semibold text-gray-900">2.3 days</span>
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <button className="w-full bg-secondary-100 hover:bg-secondary-200 text-secondary-800 py-2 rounded-lg text-sm font-medium transition-colors">
                      Download Full Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary-950 mb-4">
              Everything You Need in One Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From collection to conversion, TestiFlow handles every aspect of your testimonial workflow.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-primary-50 to-accent-50 border border-primary-100 hover:shadow-lg transition-all duration-300">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="h-8 w-8 text-primary-950" />
              </div>
              <h3 className="text-xl font-semibold text-primary-950 mb-4">Smart Collection</h3>
              <p className="text-gray-600">
                Automated testimonial collection with customizable forms and follow-up sequences that increase response rates.
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-secondary-50 to-secondary-100 border border-secondary-200 hover:shadow-lg transition-all duration-300">
              <div className="bg-secondary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-secondary-500" />
              </div>
              <h3 className="text-xl font-semibold text-primary-950 mb-4">Legal Rights Tracking</h3>
              <p className="text-gray-600">
                Built-in consent management and usage rights tracking for compliance and peace of mind.
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-accent-50 to-accent-100 border border-accent-200 hover:shadow-lg transition-all duration-300">
              <div className="bg-accent-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="h-8 w-8 text-accent-600" />
              </div>
              <h3 className="text-xl font-semibold text-primary-950 mb-4">Ad-Ready Exports</h3>
              <p className="text-gray-600">
                One-click export to marketing-ready formats for social media, websites, and campaigns.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Mockup */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-primary-950 mb-6">
                Powerful Analytics & Insights
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Track performance, measure impact, and optimize your testimonial strategy with detailed analytics and reporting.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <BarChart3 className="h-4 w-4 text-primary-950" />
                  </div>
                  <span className="text-gray-700">Real-time performance metrics</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <BarChart3 className="h-4 w-4 text-primary-950" />
                  </div>
                  <span className="text-gray-700">Conversion tracking</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <BarChart3 className="h-4 w-4 text-primary-950" />
                  </div>
                  <span className="text-gray-700">Custom reporting dashboards</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Performance Analytics</h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-primary-950">87%</div>
                      <div className="text-sm text-gray-600">Response Rate</div>
                    </div>
                    <div className="text-center p-4 bg-secondary-50 rounded-lg">
                      <div className="text-2xl font-bold text-secondary-500">4.8</div>
                      <div className="text-sm text-gray-600">Avg Rating</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Email Campaigns</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-primary-950 h-2 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                        <span className="text-sm font-medium">75%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Social Media</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-accent-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                        </div>
                        <span className="text-sm font-medium">92%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Website Forms</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-secondary-500 h-2 rounded-full" style={{ width: '68%' }}></div>
                        </div>
                        <span className="text-sm font-medium">68%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-primary-950">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Testimonials?
          </h2>
          <p className="text-xl text-primary-100 mb-12">
            Join thousands of marketing teams who trust TestiFlow to manage their customer testimonials.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleSignupClick}
              className="bg-white text-primary-950 px-8 py-4 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-lg"
            >
              <span>Start Your Free Trial Now</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};