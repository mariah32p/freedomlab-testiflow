import React, { useEffect } from 'react';
import { Check } from 'lucide-react';
import { TestiFlowIcon } from '../components/TestiFlowIcon';
import { initializeOutseta } from '../lib/outseta';

export const OutsetaPricing: React.FC = () => {
  useEffect(() => {
    const initialize = async () => {
      try {
        await initializeOutseta();
        console.log('Outseta initialized for pricing page');
      } catch (error) {
        console.error('Failed to initialize Outseta:', error);
      }
    };
    
    initialize();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <TestiFlowIcon className="h-12 w-12 text-primary-950" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Start Your Free Trial
          </h1>
          <p className="text-xl text-gray-600">
            Get full access to TestiFlow for 7 days, then continue for just $29/month
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Plan Details */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
            <div className="bg-primary-950 px-6 py-8 text-center text-white">
              <h3 className="text-2xl font-bold">TestiFlow Standard</h3>
              <div className="mt-4 flex items-baseline justify-center">
                <span className="text-5xl font-bold">$29</span>
                <span className="text-xl ml-1">/month</span>
              </div>
              <p className="mt-2 text-white/90">Everything you need to manage testimonials</p>
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

          {/* Signup Form */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <h3 className="text-2xl font-bold text-primary-950 mb-6 text-center">
              Start Your 7-Day Free Trial
            </h3>
            
            <div 
              data-o-auth="1"
              data-widget-mode="register"
              data-plan-uid="jW78klmq"
              data-plan-payment-term="month"
              data-skip-plan-options="true"
              data-require-payment="true"
              data-trial-days="7"
              data-mode="embed"
              className="min-h-[400px]"
            ></div>
            
            <p className="text-sm text-gray-500 text-center mt-4">
              7-day free trial • $29/month after trial • Cancel anytime
            </p>
            
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <a href="/login" className="text-primary-950 hover:text-primary-800 font-medium">
                  Sign in here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};