import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail } from 'lucide-react';
import { TestiFlowIcon } from '../components/TestiFlowIcon';
import { APP_CONFIG } from '../config/app';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center mb-6">
              <TestiFlowIcon className="h-8 w-8 text-indigo-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <User className="h-6 w-6 text-gray-400 mr-2" />
                <h2 className="text-lg font-medium text-gray-900">Account Information</h2>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-700">
                    {user?.email || (APP_CONFIG.ENABLE_REAL_AUTH ? 'Loading...' : 'demo@example.com')}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  Account created: {user?.created_at ? new Date(user.created_at).toLocaleDateString() : new Date().toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Testimonial Management</h3>
              <div className={`border rounded-lg p-4 ${APP_CONFIG.ENABLE_REAL_AUTH ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200'}`}>
                <p className={APP_CONFIG.ENABLE_REAL_AUTH ? 'text-blue-800' : 'text-green-800'}>
                  {APP_CONFIG.ENABLE_REAL_AUTH 
                    ? 'Welcome to TestiFlow! Your testimonial management features will be available here once the Stripe integration is complete.'
                    : 'Welcome to TestiFlow Demo! This is a preview of your dashboard. Sign up to access full testimonial management features.'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};