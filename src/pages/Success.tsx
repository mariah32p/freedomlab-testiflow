import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';

export const Success: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h2>
          
          <p className="text-gray-600 mb-8">
            Thank you for subscribing to TestiFlow. Your account has been activated and you now have access to all Pro features.
          </p>
          
          <div className="flex items-center justify-center space-x-2 text-gray-500 mb-4">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-950"></div>
            <span>Setting up your account...</span>
          </div>
          
          <p className="text-sm text-gray-500 mt-4">
            You'll be redirected automatically. If this takes too long, you may need to choose a plan.
          </p>
        </div>
      </div>
    </div>
  );
};