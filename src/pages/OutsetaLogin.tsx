import React, { useEffect } from 'react';
import { TestiFlowIcon } from '../components/TestiFlowIcon';
import { initializeOutseta } from '../lib/outseta';

export const OutsetaLogin: React.FC = () => {
  useEffect(() => {
    const initialize = async () => {
      try {
        await initializeOutseta();
        console.log('Outseta initialized for login page');
      } catch (error) {
        console.error('Failed to initialize Outseta:', error);
      }
    };
    
    initialize();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <TestiFlowIcon className="h-12 w-12 text-primary-950" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome Back
          </h1>
          <p className="text-lg text-gray-600">
            Sign in to your TestiFlow account
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <h3 className="text-xl font-medium text-gray-900 mb-6 text-center">
            Sign In to Your Account
          </h3>
          
          <div 
            data-o-auth="1"
            data-mode="embed"
            data-widget-mode="login"
            className="min-h-[300px]"
          ></div>
          
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <a href="/pricing" className="text-primary-950 hover:text-primary-800 font-medium">
                Start your free trial
              </a>
            </p>
          </div>
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