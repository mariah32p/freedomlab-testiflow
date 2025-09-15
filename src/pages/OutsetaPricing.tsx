import React, { useEffect } from 'react';
import { Check } from 'lucide-react';
import { TestiFlowIcon } from '../components/TestiFlowIcon';
import { initializeOutseta } from '../lib/outseta';

export const OutsetaPricing: React.FC = () => {
  useEffect(() => {
    const initialize = async () => {
      await initializeOutseta();
    };
    
    initialize();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-2 bg-primary-100 px-4 py-2 rounded-full">
              <TestiFlowIcon className="h-6 w-6 text-primary-950" />
              <span className="text-primary-950 font-semibold">TestiFlow</span>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Start Your Free Trial
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Get full access to TestiFlow for 7 days, then continue for just $29/month
          </p>
        </div>

        <div className="max-w-md mx-auto">
          {/* Plan Overview */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 mb-8">
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

          {/* Embedded Signup Form */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <h3 className="text-xl font-bold text-primary-950 mb-6 text-center">
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
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-2xl mx-auto mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What happens during the free trial?
              </h3>
              <p className="text-gray-600">
                You get full access to all TestiFlow features for 7 days. We'll collect your payment method but won't charge until the trial ends.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What's included in the Standard plan?
              </h3>
              <p className="text-gray-600">
                Everything you need: unlimited testimonials and forms, custom fields, branding customization, video uploads, advanced exports, and tag organization.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I cancel anytime?
              </h3>
              <p className="text-gray-600">
                Yes! You can cancel your subscription at any time from your account settings. No long-term contracts or cancellation fees.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};