import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useStripe } from '../hooks/useStripe';
import { products } from '../stripe-config.js';
import { TestiFlowIcon } from '../components/TestiFlowIcon';

export const Pricing: React.FC = () => {
  const { user } = useAuth();
  const { createCheckoutSession, loading, error } = useStripe();
  const navigate = useNavigate();

  const handleSubscribe = async () => {
    if (!user) {
      navigate('/signup');
      return;
    }

    const product = products.find(p => p.id === 'pro'); // Get the Pro product
    if (!product) return;
    
    await createCheckoutSession(product.priceId);
  };

  const handleBasicSubscribe = async () => {
    if (!user) {
      navigate('/signup');
      return;
    }

    const product = products.find(p => p.id === 'basic'); // Get the Basic product
    if (!product) return;
    
    await createCheckoutSession(product.priceId);
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
          {/* Basic Plan */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300">
            <div className="bg-gray-50 px-6 py-8 text-center border-b border-gray-200">
              <h3 className="text-2xl font-bold text-navy">Basic</h3>
              <div className="mt-4 flex items-baseline justify-center">
                <span className="text-5xl font-bold text-navy">$29</span>
                <span className="text-xl text-gray-500 ml-1">/month</span>
              </div>
              <p className="mt-2 text-gray-600">Perfect for small teams getting started</p>
            </div>
            
            <div className="px-6 py-8">
              <ul className="space-y-4 mb-8">
                {[
                  'Up to 100 testimonials/month',
                  'Basic collection forms',
                  'Standard export formats',
                  'Email support',
                  'Basic analytics',
                ].map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-teal mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button
                onClick={handleBasicSubscribe}
                disabled={loading}
                className="w-full bg-primary-950 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-900 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  'Start Free Trial'
                )}
              </button>
            </div>
          </div>

          {/* Pro Plan */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-secondary-500">
            <div className="bg-gradient-to-r from-primary-950 to-secondary-500 px-6 py-8 text-center">
              <h3 className="text-2xl font-bold text-white">Pro</h3>
              <div className="mt-4 flex items-baseline justify-center">
                <span className="text-5xl font-bold text-white">$49</span>
                <span className="text-xl text-white/80 ml-1">/month</span>
              </div>
              <p className="mt-2 text-white/90">Everything you need to scale</p>
            </div>
            
            <div className="px-6 py-8">
              <ul className="space-y-4 mb-8">
                {[
                  'Unlimited testimonial collection',
                  'Legal rights tracking & consent management',
                  'Ad-ready export formats',
                  'Custom collection forms',
                  'Advanced analytics & reporting',
                  'Priority email support',
                  'API access',
                  'White-label options',
                ].map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-teal mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div>
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 text-sm">{error}</p>
                  </div>
                )}
                <button
                  onClick={handleSubscribe}
                  disabled={loading}
                  className="w-full bg-secondary-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-secondary-600 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    'Start Free Trial'
                  )}
                </button>
                <p className="text-sm text-gray-500 text-center mt-2">
                  7-day free trial • No credit card required
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};