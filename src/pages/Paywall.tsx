import React from 'react';
import { triggerLogin } from '../lib/outseta';

export default function Paywall() {
  const handleSubscribe = () => {
    triggerLogin();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Subscription Required</h1>
        <p className="text-gray-600 mb-6">
          You need an active subscription to access this feature.
        </p>
        <button
          onClick={handleSubscribe}
          className="w-full bg-primary-950 text-white py-4 px-6 rounded-lg hover:bg-primary-900 transition-colors font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          Subscribe Now
        </button>
      </div>
    </div>
  );
}