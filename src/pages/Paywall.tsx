import React, { useEffect } from 'react';
import { Lock, ArrowRight } from 'lucide-react';
import { TestiFlowIcon } from '../components/TestiFlowIcon';
import { initializeOutseta, TESTIFLOW_PLAN } from '../lib/outseta';
import { useOutsetaAuth } from '../contexts/OutsetaAuthContext';

export const Paywall: React.FC = () => {
  const { user, account } = useOutsetaAuth();

  useEffect(() => {
    const initialize = async () => {
      await initializeOutseta();
    };
    
    initialize();
  }, []);

  const isTrialExpired = account?.billingStageName?.toLowerCase().includes('trial');
  const isCanceled = account?.billingStageName?.toLowerCase().includes('cancel');

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <Lock className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {isTrialExpired ? 'Trial Expired' : isCanceled ? 'Subscription Canceled' : 'Access Restricted'}
          </h1>
          <p className="text-lg text-gray-600">
            {isTrialExpired 
              ? 'Your 7-day trial has ended. Subscribe to continue using TestiFlow.'
              : isCanceled
              ? 'Your subscription has been canceled. Reactivate to regain access.'
              : 'You need an active TestiFlow subscription to access this content.'
            }
          </p>
        </div>

        {/* Account Status */}
        {user && account && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Account Status</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Email:</span>
                <div className="font-medium text-gray-900">{user.email}</div>
              </div>
              <div>
                <span className="text-gray-500">Status:</span>
                <div className="font-medium text-red-600">{account.billingStageName}</div>
              </div>
            </div>
          </div>
        )}

        {/* Plan Selection */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 mb-8">
          <div className="bg-primary-950 px-6 py-8 text-center text-white">
            <TestiFlowIcon className="h-8 w-8 text-white mx-auto mb-4" />
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

        {/* Embedded Checkout */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6 text-center">
            {isTrialExpired ? 'Continue with TestiFlow' : 'Reactivate Your Subscription'}
          </h3>
          
          <div 
            data-o-auth="1"
            data-widget-mode="register"
            data-plan-uid={TESTIFLOW_PLAN.uid}
            data-plan-payment-term="month"
            data-skip-plan-options="true"
            data-require-payment="true"
            data-mode="embed"
            className="min-h-[400px]"
          ></div>
        </div>

        {/* Help Text */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Questions? Contact us at{' '}
            <a href="mailto:support@freedomlab.ai" className="text-primary-950 hover:text-primary-800">
              support@freedomlab.ai
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};