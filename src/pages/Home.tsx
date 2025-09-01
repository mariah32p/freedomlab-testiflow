import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Star, MessageSquare, CheckCircle, Users, Zap, Shield, Check, FileText } from 'lucide-react';
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
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-transparent sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-bold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Turn Customer</span>{' '}
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-500 xl:inline">
                    Feedback into
                  </span>{' '}
                  <span className="block xl:inline">Marketing Gold</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Collect, manage, and showcase customer testimonials with beautiful forms, automated workflows, and powerful export tools. Build trust and drive conversions with authentic customer stories.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <button
                      onClick={handleGetStarted}
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-950 hover:bg-primary-900 md:py-4 md:text-lg md:px-10 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      Start Free Trial
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </button>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <button
                      onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
                      className="w-full flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 transition-colors"
                    >
                      Watch Demo
                    </button>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <div className="h-56 w-full bg-gradient-to-br from-primary-100 to-secondary-100 sm:h-72 md:h-96 lg:w-full lg:h-full flex items-center justify-center">
            {/* Phone Mockup */}
            <div className="relative">
              <div className="w-64 h-96 bg-gray-900 rounded-3xl p-2 shadow-2xl">
                <div className="w-full h-full bg-white rounded-2xl overflow-hidden">
                  {/* Phone Screen Content */}
                  <div className="bg-primary-950 text-white p-4 text-center">
                    <TestiFlowIcon className="h-6 w-6 text-white mx-auto mb-2" />
                    <h3 className="font-bold text-sm">Share Your Experience</h3>
                    <p className="text-xs text-white/80">Rate your experience with us</p>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex justify-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                    <div className="h-16 bg-gray-100 rounded border-2 border-dashed border-gray-300"></div>
                    <button className="w-full bg-secondary-500 text-white py-2 rounded-lg text-sm font-medium">
                      Submit Testimonial
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>



      {/* Features Section */}
      <div className="py-12 bg-white" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary-950 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to manage testimonials
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              From collection to showcase, TestiFlow handles every step of your testimonial workflow.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-950 text-white">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Smart Collection Forms</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Create beautiful, branded forms that make it easy for customers to share their experiences. Customize fields, colors, and messaging.
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-secondary-500 text-white">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Approval Workflow</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Review testimonials before they go live. Approve, reject, or request changes with a simple click.
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-accent-500 text-white">
                  <Zap className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Powerful Exports</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Export testimonials as CSV, JSON, or generate ready-to-use website widgets and social media posts.
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-600 text-white">
                  <Shield className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Rich Media Support</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Collect not just text testimonials, but also images and videos for more engaging customer stories.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Proof Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Trusted by Growing Businesses</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "TestiFlow has completely transformed how we collect customer feedback. The automated workflows save us hours every week!"
                </p>
                <div className="text-sm text-gray-600">
                  - Sarah Johnson, TechCorp Solutions
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "The export features are incredible. We can now easily use testimonials across all our marketing channels."
                </p>
                <div className="text-sm text-gray-600">
                  - Mike Chen, StartupXYZ
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "Amazing product! The testimonial management features are exactly what we needed for our marketing campaigns."
                </p>
                <div className="text-sm text-gray-600">
                  - Emily Davis, GrowthCo
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="bg-white py-16" id="pricing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Choose the plan that fits your testimonial management needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Standard Plan */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300">
              <div className="bg-gray-50 px-6 py-8 text-center border-b border-gray-200">
                <h3 className="text-2xl font-bold text-primary-950">Standard</h3>
                <div className="mt-4 flex items-baseline justify-center">
                  <span className="text-5xl font-bold text-primary-950">$29</span>
                  <span className="text-xl text-gray-500 ml-1">/month</span>
                </div>
                <p className="mt-2 text-gray-600">Perfect for small businesses getting started</p>
              </div>
              
              <div className="px-6 py-8">
                <ul className="space-y-4 mb-8">
                  {[
                    'Up to 25 testimonials',
                    '1 collection form',
                    'Basic approval workflow',
                    'CSV export',
                    'Email notifications',
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-5 w-5 text-secondary-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={handleGetStarted}
                  className="w-full bg-primary-950 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-900 transition-colors"
                >
                  Start Free Trial
                </button>
              </div>
            </div>

            {/* Premium Plan */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-secondary-500 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-accent-500 to-accent-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                  MOST POPULAR
                </span>
              </div>
              <div className="bg-gradient-to-r from-primary-950 to-secondary-500 px-6 py-8 text-center">
                <h3 className="text-2xl font-bold text-white">Premium</h3>
                <div className="mt-4 flex items-baseline justify-center">
                  <span className="text-5xl font-bold text-white">$49</span>
                  <span className="text-xl text-white/80 ml-1">/month</span>
                </div>
                <p className="mt-2 text-white/90">Complete solution for growing businesses</p>
              </div>
              
              <div className="px-6 py-8">
                <ul className="space-y-4 mb-8">
                  {[
                    'Unlimited testimonials & forms',
                    'Custom fields & branding',
                    'Image + video testimonials',
                    'Website widget generator',
                    'Advanced exports (JSON, social media posts)',
                    'Tag organization',
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-5 w-5 text-secondary-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={handleGetStarted}
                  className="w-full bg-secondary-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-secondary-600 transition-colors"
                >
                  Start Free Trial
                </button>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <p className="text-gray-500">
              All plans include a 7-day free trial.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white py-16" id="faq">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Everything you need to know about TestiFlow</p>
          </div>

          <div className="space-y-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What's the difference between Standard and Premium plans?
              </h3>
              <p className="text-gray-600">
                Standard is perfect for small businesses with up to 25 testimonials and 1 form. Premium offers unlimited testimonials and forms, plus advanced features like custom branding, video testimonials, and website widgets.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is there a free trial?
              </h3>
              <p className="text-gray-600">
                Yes! All plans include a 7-day free trial with full access to all features. No credit card required to start.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I upgrade or downgrade my plan?
              </h3>
              <p className="text-gray-600">
                Absolutely! You can change your plan anytime from your account settings. Changes take effect immediately with prorated billing.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What happens to my data if I cancel?
              </h3>
              <p className="text-gray-600">
                Your data remains accessible for 30 days after cancellation. You can export all your testimonials before the account is permanently deleted.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Do you offer annual discounts?
              </h3>
              <p className="text-gray-600">
                Currently we offer monthly billing. Annual billing options with discounts are coming soon!
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept all major credit cards (Visa, MasterCard, American Express) and debit cards through our secure Stripe integration.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary-950 to-secondary-500 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Customer Feedback?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join hundreds of businesses using TestiFlow to collect and showcase customer testimonials.
          </p>
          <button
            onClick={handleGetStarted}
            className="bg-white text-primary-950 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Start Your Free Trial Today
          </button>
          <p className="text-white/80 text-sm mt-4">
            7-day free trial • Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
};