import React, { useEffect, useState } from 'react';
import { TestiFlowIcon } from '../components/TestiFlowIcon';
import { initializeOutseta } from '../lib/outseta';

export const OutsetaLogin: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      await initializeOutseta();
    };
    
    initialize();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="flex items-center space-x-2 bg-primary-100 px-4 py-2 rounded-full">
              <TestiFlowIcon className="h-6 w-6 text-primary-950" />
              <span className="text-primary-950 font-semibold">TestiFlow</span>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {isLogin ? 'Welcome Back' : 'Start Your Free Trial'}
          </h1>
          <p className="text-lg text-gray-600">
            {isLogin 
              ? 'Sign in to your TestiFlow account' 
              : 'Get full access to TestiFlow for 7 days, then continue for just $29/month'
            }
          </p>
        </div>

        {/* Toggle Buttons */}
        <div className="flex bg-gray-100 rounded-lg p-1 mb-8">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              isLogin 
                ? 'bg-white text-primary-950 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              !isLogin 
                ? 'bg-white text-primary-950 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Start Trial
          </button>
        </div>

        {/* Embedded Forms */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {isLogin ? (
            /* Login Form */
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-6 text-center">
                Sign In to Your Account
              </h3>
              
              <div 
                data-o-auth="1"
                data-mode="embed"
                data-widget-mode="login"
                className="min-h-[300px]"
              ></div>
            </div>
          ) : (
            /* Signup Form */
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-6 text-center">
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
          )}
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