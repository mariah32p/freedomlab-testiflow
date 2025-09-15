import React from 'react';
import { triggerLogin, triggerProfile, triggerLogout } from '../lib/outseta';

interface OutsetaNavbarProps {
  isAuthenticated?: boolean;
}

export default function OutsetaNavbar({ isAuthenticated = false }: OutsetaNavbarProps) {
  const handleLogin = () => {
    triggerLogin();
  };

  const handleProfile = () => {
    triggerProfile();
  };

  const handleLogout = () => {
    triggerLogout();
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-bold text-gray-900">TestiFlow</span>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <button
                  onClick={handleProfile}
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={handleLogin}
                className="bg-primary-950 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-900"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}