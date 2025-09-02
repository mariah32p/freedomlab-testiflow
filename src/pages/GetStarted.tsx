import React, { useState } from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { TestiFlowIcon } from '../components/TestiFlowIcon';
import { useStripe } from '../hooks/useStripe';
import { products } from '../stripe-config';
import { Alert } from '../components/Alert';

export const GetStarted: React.FC = () => {
  const { createCheckoutSession, loading, error } = useStripe();
  const [selectedPlan, setSelectedPlan] = useState<string>('premium');

  const handleStartTrial = async () => {
    const product = products.find(p => p.id === selectedPlan);
    if (!product) return;

    await createCheckoutSession(product.priceId);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="flex items-center space-x-2 bg-primary-100 px-4 py-2 rounded-full">
              <TestiFlowIcon className="h-6 w-6 text-primary-950" />
              <span className="text-primary-950 font-semibold">TestiFlow</span>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Start your 7-day free trial and experience the full power of TestiFlow.
          </p>
          <p className="text-lg text-gray-500 mb-8">
            Cancel anytime during your trial with no charges.
          </p>
        </div>

        {error && (
          <div className="mb-8">
            <Alert
              type="error"
              message={error}
              onClose={() => {}}
            />
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto mb-12">
          {/* Standard Plan */}
          <div 
            className={`bg-white rounded-2xl shadow-lg overflow-hidden border-2 cursor-pointer transition-all duration-300 hover:shadow-xl ${
              selectedPlan === 'standard' 
                ? 'border-primary-500 ring-4 ring-primary-100 transform scale-105' 
                : 'border-gray-200 hover:border-primary-300'
            }`}
            onClick={() => setSelectedPlan('standard')}
          >
            <div className={`px-6 py-8 text-center border-b border-gray-200 ${
              selectedPlan === 'standard' ? 'bg-primary-50' : 'bg-gray-50'
            }`}>
              <div className="flex items-center justify-center mb-4">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedPlan === 'standard' 
                    ? 'border-primary-500 bg-primary-500' 
                    : 'border-gray-300'
                }`}>
                  {selectedPlan === 'standard' && (
                    <Check className="h-4 w-4 text-white" />
                  )}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Standard</h3>
              <div className="mt-4 flex items-baseline justify-center">
                <span className="text-5xl font-bold text-gray-900">$29</span>
                <span className="text-xl text-gray-500 ml-1">/mo</span>
              </div>
              <p className="mt-2 text-gray-600">Perfect for small businesses getting started</p>
            </div>
            
            <div className="px-6 py-8">
              <ul className="space-y-4">
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
          <div 
            className={`bg-white rounded-2xl shadow-xl overflow-hidden border-2 cursor-pointer transition-all duration-300 hover:shadow-2xl relative ${
              selectedPlan === 'premium' 
                ? 'border-secondary-500 ring-4 ring-secondary-100 transform scale-105' 
                : 'border-secondary-300 hover:border-secondary-400'
            }`}
            onClick={() => setSelectedPlan('premium')}
          >
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-gradient-to-r from-accent-500 to-accent-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                MOST POPULAR
              </span>
            </div>
            <div className="bg-gradient-to-r from-primary-950 to-secondary-500 px-6 py-8 text-center relative">
              <div className="flex items-center justify-center mb-4">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedPlan === 'premium' 
                    ? 'border-white bg-white' 
                    : 'border-white/50'
                }`}>
                  {selectedPlan === 'premium' && (
                    <Check className="h-4 w-4 text-primary-950" />
                  )}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white">Premium</h3>
              <div className="mt-4 flex items-baseline justify-center">
                <span className="text-5xl font-bold text-white">$49</span>
                <span className="text-xl text-white/80 ml-1">/mo</span>
              </div>
              <p className="mt-2 text-white/90">Complete solution for growing businesses</p>
            </div>
            
            <div className="px-6 py-8">
              <ul className="space-y-4">
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
            <div className="mb-6">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-gradient-to-r from-secondary-500 to-accent-500 w-12 h-12 rounded-full flex items-center justify-center">
                  <Check className="h-6 w-6 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-primary-950 mb-2">
                Start Your Free Trial
              </h3>
              <div className="text-lg text-gray-600 mb-2">
                <span className="font-semibold text-primary-950">
                  {selectedPlan === 'standard' ? 'Standard Plan' : 'Premium Plan'}
                </span> selected
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-secondary-50 to-accent-50 rounded-xl p-6 mb-6 border border-secondary-200">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-950 mb-1">7 Days Free</div>
                <div className="text-sm text-gray-600 mb-3">Full access to all features</div>
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-secondary-500 mr-1" />
                    <span>No charges during trial</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-secondary-500 mr-1" />
                    <span>Cancel anytime</span>
                  </div>
                </div>
              </div>
            </div>
            
            <p className="text-gray-600 mb-6 text-center">
              After your trial, you'll be charged {selectedPlan === 'standard' ? '$29' : '$49'}/month. 
              You can change or cancel your plan anytime.
            </p>
            
            <button
              onClick={handleStartTrial}
              disabled={loading}
              className="w-full bg-primary-950 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-900 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Starting trial...
                </div>
              ) : (
                <>
                  <span>Start 7-Day Trial</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
            <p className="text-sm text-gray-500 text-center mt-2">
              7-day free trial
            </p>
            
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                By starting your trial, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};