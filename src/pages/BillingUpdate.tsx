import React, { useEffect } from 'react';
import { AlertCircle, CreditCard } from 'lucide-react';
import { TestiFlowIcon } from '../components/TestiFlowIcon';
import { initializeOutseta } from '../lib/outseta';
import { useOutsetaAuth } from '../contexts/OutsetaAuthContext';

export const BillingUpdate: React.FC = () => {
  const { user, account, refreshAuth } = useOutsetaAuth();

  useEffect(() => {
    const initialize = async () => {
      await initializeOutseta();
    };
    
    initialize();

    // Listen for billing updates
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://freedomlab.outseta.com') return;
      
      if (event.data.type === 'outseta.profile.updated') {
        console.log('Billing updated, refreshing auth state');
        setTimeout(refreshAuth, 1000);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [refreshAuth]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <TestiFlowIcon className="h-12 w-12 text-primary-950" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Update Your Payment Method</h1>
          <p className="text-lg text-gray-600">
            Your payment failed. Please update your payment method to continue using TestiFlow.
          </p>
        </div>

        {/* Alert */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-medium text-red-800">Payment Issue Detected</h3>
              <p className="text-red-700 mt-1">
                We couldn't process your payment for TestiFlow. Update your payment method below to restore access.
              </p>
            </div>
          </div>
        </div>

        {/* Account Info */}
        {user && account && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <CreditCard className="h-5 w-5 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900">Account Information</h3>
            </div>
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

        {/* Embedded Profile for Billing */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6 text-center">
            Update Payment Method
          </h3>
          
          <div 
            data-o-profile="1"
            data-tab="billing"
            data-mode="embed"
            className="min-h-[500px]"
          ></div>
        </div>

        {/* Help Text */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Having trouble? Contact support at{' '}
            <a href="mailto:support@freedomlab.ai" className="text-primary-950 hover:text-primary-800">
              support@freedomlab.ai
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};