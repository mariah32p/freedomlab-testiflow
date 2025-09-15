import React from 'react';
import { triggerSignup } from '../lib/outseta';

export default function OutsetaPricing() {
  const handleSignup = () => {
    triggerSignup();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">TestiFlow Standard</h1>
        <p className="text-gray-600 mb-6">
          Get started with TestiFlow and manage your testimonials.
        </p>
        <button
          onClick={handleSignup}
          className="w-full bg-primary-950 text-white py-4 px-6 rounded-lg hover:bg-primary-900 transition-colors font-bold text-lg"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}