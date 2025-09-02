import React from 'react';
import { useSubscription } from '../hooks/useSubscription';
import { UpgradePrompt } from '../components/UpgradePrompt';
import { TagManager } from '../components/TagManager';

export const Tags: React.FC = () => {
  const subscription = useSubscription();

  // Show upgrade prompt for Standard users
  if (!subscription.limits.canUseTags) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Tag Organization</h1>
                <p className="text-gray-600">Organize testimonials with custom tags and categories</p>
              </div>
              
              <UpgradePrompt 
                feature="Tag Organization"
                description="Create custom tags to organize testimonials by product, service, campaign, or any other category for better management and filtering."
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Tag Organization</h1>
              <p className="text-gray-600">Organize testimonials with custom tags and categories</p>
            </div>
            <TagManager />
          </div>
        </div>
      </div>
    </div>
  );
};