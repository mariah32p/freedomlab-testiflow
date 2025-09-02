import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import { TestiFlowIcon } from '../components/TestiFlowIcon';

export const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const [error] = React.useState<string>('');
  const [loading] = React.useState<boolean>(false);

  const handleSignupClick = () => {
    navigate('/signup');
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-2 bg-teal/10 px-4 py-2 rounded-full">
              <TestiFlowIcon className="h-6 w-6 text-teal" />
              <span className="text-teal font-semibold">TestiFlow Pricing</span>
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
              <ul className="space-y-4 mb-8">
                {[
                  'Up to 25 testimonials',
                  '1 collection form - Simple form to request testimonials',
                  'Basic approval workflow - Review before testimonials go live',
                  'CSV export',
                  'Email notifications - Get notified of new submissions',
                ].map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-secondary-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Premium Plan */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-secondary-500">
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
                  'Image + video testimonials - Rich media collection',
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
            </div>
          </div>
        </div>
        
        {/* Single CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 max-w-md mx-auto">
            <h3 className="text-2xl font-bold text-primary-950 mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-gray-600 mb-6">
              Choose your plan after signing up. Start with a 7-day free trial.
            </p>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}
            
            <button
              onClick={handleSignupClick}
              disabled={loading}
              className="w-full bg-primary-950 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-900 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Start Free Trial</span>
              <ArrowRight className="h-5 w-5" />
            </button>
            <p className="text-sm text-gray-500 text-center mt-2">
              7-day free trial
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};