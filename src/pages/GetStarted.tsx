import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import { TestiFlowIcon } from '../components/TestiFlowIcon';
import { useStripe } from '../hooks/useStripe';
import { products } from '../stripe-config';
import { Alert } from '../components/Alert';

export const GetStarted: React.FC = () => {
  const navigate = useNavigate();
  const { createCheckoutSession, loading, error } = useStripe();
  const [selectedPlan, setSelectedPlan] = useState<string>('pro');

  const handleStartTrial = async () => {
    const product = products.find(p => p.id === selectedPlan);
    if (!product) return;

    await createCheckoutSession(product.priceId);
  };

  const basicFeatures = [
    'Up to 100 testimonials/month',
    'Basic collection forms',
    'Standard export formats',
    'Email support',
    'Basic analytics',
  ];

  const proFeatures = [
    'Unlimited testimonial collection',
    'Legal rights tracking & consent management',
    'Ad-ready export formats',
    'Custom collection forms',
    'Advanced analytics & reporting',
    'Priority email support',
    'API access',
    'White-label options',
  ];

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
          <p className="text-xl text-gray-600 mb-8">
            Start your 7-day free trial. No credit card required during trial.
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

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Basic Plan */}
          <div 
            className={`bg-white rounded-2xl shadow-lg overflow-hidden border-2 cursor-pointer transition-all duration-300 ${
              selectedPlan === 'basic' 
                ? 'border-primary-500 ring-2 ring-primary-200' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedPlan('basic')}
          >
            <div className="bg-gray-50 px-6 py-8 text-center border-b border-gray-200">
              <div className="flex items-center justify-center mb-4">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedPlan === 'basic' 
                    ? 'border-primary-500 bg-primary-500' 
                    : 'border-gray-300'
                }`}>
                  {selectedPlan === 'basic' && (
                    <Check className="h-4 w-4 text-white" />
                  )}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Basic</h3>
              <div className="mt-4 flex items-baseline justify-center">
                <span className="text-5xl font-bold text-gray-900">$29</span>
                <span className="text-xl text-gray-500 ml-1">/month</span>
              </div>
              <p className="mt-2 text-gray-600">Perfect for small teams getting started</p>
            </div>
            
            <div className="px-6 py-8">
              <ul className="space-y-4">
                {basicFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-secondary-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Pro Plan */}
          <div 
            className={`bg-white rounded-2xl shadow-xl overflow-hidden border-2 cursor-pointer transition-all duration-300 ${
              selectedPlan === 'pro' 
                ? 'border-secondary-500 ring-2 ring-secondary-200' 
                : 'border-secondary-300 hover:border-secondary-400'
            }`}
            onClick={() => setSelectedPlan('pro')}
          >
            <div className="bg-gradient-to-r from-primary-950 to-secondary-500 px-6 py-8 text-center relative">
              <div className="absolute top-4 right-4">
                <span className="bg-white text-primary-950 px-3 py-1 rounded-full text-xs font-semibold">
                  RECOMMENDED
                </span>
              </div>
              <div className="flex items-center justify-center mb-4">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedPlan === 'pro' 
                    ? 'border-white bg-white' 
                    : 'border-white/50'
                }`}>
                  {selectedPlan === 'pro' && (
                    <Check className="h-4 w-4 text-primary-950" />
                  )}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white">Pro</h3>
              <div className="mt-4 flex items-baseline justify-center">
                <span className="text-5xl font-bold text-white">$49</span>
                <span className="text-xl text-white/80 ml-1">/month</span>
              </div>
              <p className="mt-2 text-white/90">Everything you need to scale</p>
            </div>
            
            <div className="px-6 py-8">
              <ul className="space-y-4">
                {proFeatures.map((feature, index) => (
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
        <div className="text-center">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 max-w-md mx-auto">
            <h3 className="text-2xl font-bold text-primary-950 mb-4">
              Start Your 7-Day Free Trial
            </h3>
            <p className="text-gray-600 mb-6">
              {selectedPlan === 'basic' ? 'Basic Plan' : 'Pro Plan'} selected. 
              You can change your plan anytime during or after your trial.
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
            <p className="text-sm text-gray-500 text-center mt-3">
              7-day free trial • Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};