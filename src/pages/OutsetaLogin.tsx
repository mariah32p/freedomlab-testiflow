import React from 'react';
import { triggerLogin } from '../lib/outseta';

export default function OutsetaLogin() {
  const handleLogin = () => {
    triggerLogin();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Sign In</h1>
        <p className="text-gray-600 mb-6">
          Sign in to your TestiFlow account to continue.
        </p>
        <button
          onClick={handleLogin}
          className="w-full bg-primary-950 text-white py-4 px-6 rounded-lg hover:bg-primary-900 transition-colors font-bold text-lg"
        >
          Sign In to TestiFlow
        </button>
      </div>
    </div>
  );
}