import React from 'react';
import { Link } from 'react-router-dom';
import { Check, TestTube } from 'lucide-react';

export const Pricing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-2 bg-indigo-100 px-4 py-2 rounded-full">
              <TestTube className="h-6 w-6 text-indigo-600" />
              <span className="text-indigo-600 font-semibold">TestiFlow Pricing</span>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Choose the plan that fits your testimonial management needs
          </p>
        </div>

        <div className="max-w-lg mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-indigo-500">
            <div className="bg-indigo-600 px-6 py-8 text-center">
              <h3 className="text-2xl font-bold text-white">Pro Plan</h3>
              <div className="mt-4 flex items-baseline justify-center">
                <span className="text-5xl font-bold text-white">$29</span>
                <span className="text-xl text-indigo-200 ml-1">/month</span>
              </div>
              <p className="mt-2 text-indigo-200">Everything you need to manage testimonials</p>
            </div>
            
            <div className="px-6 py-8">
              <ul className="space-y-4">
                {[
                  'Unlimited testimonial collection',
                  'Legal rights tracking & consent management',
                  'Ad-ready export formats',
                  'Custom collection forms',
                  'Analytics & reporting',
                  'Priority email support',
                  'API access',
                ].map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-8">
                <Link
                  to="/signup"
                  className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center"
                >
                  Start Free Trial
                </Link>
                <p className="text-sm text-gray-500 text-center mt-2">
                  14-day free trial • No credit card required
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">
            Frequently Asked Questions
          </h3>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-2">
                What's included in the free trial?
              </h4>
              <p className="text-gray-600">
                Full access to all Pro features for 14 days. No credit card required to start.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-2">
                Can I cancel anytime?
              </h4>
              <p className="text-gray-600">
                Yes, you can cancel your subscription at any time. No long-term contracts or cancellation fees.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-2">
                Do you offer refunds?
              </h4>
              <p className="text-gray-600">
                We offer a 30-day money-back guarantee if you're not satisfied with TestiFlow.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};