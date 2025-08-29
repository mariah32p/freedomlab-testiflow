import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User } from 'lucide-react';
import { TestiFlowIcon } from './TestiFlowIcon';

export const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <TestiFlowIcon className="h-8 w-8 text-navy" />
              <span className="text-xl font-bold text-primary-950">TestiFlow</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-1 text-gray-700 hover:text-primary-950 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <User className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-1 text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/pricing"
                  className="text-gray-700 hover:text-primary-950 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Pricing
                </Link>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-950 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="bg-primary-950 text-white hover:bg-primary-900 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};