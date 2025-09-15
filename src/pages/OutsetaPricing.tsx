import React, { useEffect } from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { TestiFlowIcon } from '../components/TestiFlowIcon';
import { initializeOutseta, triggerSignup } from '../lib/outseta';

export const OutsetaPricing: React.FC = () => {
  useEffect(() => {
    const initialize = async () => {
      // Initialize Outseta when component mounts and wait for it to be ready
      await initializeOutseta();
    };
    
    initialize();
  }, []);

  const handleGetStarted = async () => {
    // Scroll to the embedded signup form
    const signupElement = document.getElementById('embedded-signup');
    if (signupElement) {
      signupElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-2 bg-primary-100 px-4 py-2 rounded-full">
              <TestiFlowIcon className="h-6 w-6 text-primary-950" />
              <span className="text-primary-950 font-semibold">TestiFlow Pricing</span>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
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
              <ul className="space-y-4">
                {[
                  'Unlimited testimonials & forms',
                  'Custom fields & branding',
                  'Image + video testimonials',
                  'Website widget generator',
                  'Advanced exports (JSON, CSV)',
                  'Tag organization',
                ].map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-secondary-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Premium Plan - Disabled */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-gray-300 opacity-60 cursor-not-allowed pointer-events-none relative">
            <div className="bg-gray-500 px-6 py-8 text-center">
              <h3 className="text-2xl font-bold text-white">Premium</h3>
              <div className="mt-4 flex items-baseline justify-center">
                <span className="text-5xl font-bold text-white">$49</span>
                <span className="text-xl text-white/80 ml-1">/month</span>
              </div>
              <p className="mt-2 text-white/90">Complete solution for growing businesses</p>
            </div>
            
            <div className="px-6 py-8 relative">
              <div className="absolute inset-0 bg-gray-100 bg-opacity-75 rounded-b-2xl flex items-center justify-center">
                <span className="text-gray-600 font-semibold">Coming Soon</span>
              </div>
              <ul className="space-y-4">
                {[
                  'Advanced analytics & insights',
                  'White-label branding removal',
                  'API access for integrations',
                  'Custom domain support',
                ].map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-secondary-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        {/* Single CTA Section */}
        {/* Embedded Signup Section */}
        <div className="text-center mt-16" id="embedded-signup">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 max-w-md mx-auto">
            <h3 className="text-2xl font-bold text-primary-950 mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-gray-600 mb-6">
              Start with a 7-day free trial. Get access to all Standard plan features.
            </p>
            
            {/* Embedded Outseta Signup Form */}
            <div 
              data-o-auth="1"
              data-widget-mode="register"
              data-plan-uid="jW78klmq"
              data-plan-payment-term="month"
              data-plan-options="false"
              data-require-payment="true"
              data-trial-days="7"
              data-mode="embed"
              className="min-h-[400px]"
            ></div>
            
            <p className="text-sm text-gray-500 text-center mt-4">
              7-day free trial • Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};