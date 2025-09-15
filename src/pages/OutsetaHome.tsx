import React from 'react';
import { triggerLogin } from '../lib/outseta';

export default function OutsetaHome() {
  const handleGetStarted = () => {
    triggerLogin();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Welcome to TestiFlow
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Manage and showcase your testimonials with ease.
          </p>
          <button
            onClick={handleGetStarted}
            className="bg-primary-950 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-900 transition-colors"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}