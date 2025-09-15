import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User, LogOut, Settings } from 'lucide-react';
import { useOutsetaAuth } from '../contexts/OutsetaAuthContext';
import { TestiFlowIcon } from './TestiFlowIcon';
import { triggerLogin, triggerSignup, triggerProfile } from '../lib/outseta';

export const OutsetaNavbar = () => {
  const { user, isAuthenticated, signOut } = useOutsetaAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [mobileMenuOpen]);

  const handleSignOut = () => {
    signOut();
    setMobileMenuOpen(false);
  };

  const handleLogin = () => {
    triggerLogin();
    setMobileMenuOpen(false);
  };

  const handleSignup = async () => {
    // Navigate to pricing page where embedded signup form is located
    window.location.href = '/pricing';
    setMobileMenuOpen(false);
  };

  const handleProfile = async () => {
    await triggerProfile();
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50" ref={mobileMenuRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center space-x-2">
              <TestiFlowIcon className="h-8 w-8 text-primary-950" />
              <span className="text-xl font-bold text-primary-950">TestiFlow</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary-950 transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/forms"
                  className="text-gray-700 hover:text-primary-950 transition-colors"
                >
                  Forms
                </Link>
                <Link
                  to="/testimonials"
                  className="text-gray-700 hover:text-primary-950 transition-colors"
                >
                  Testimonials
                </Link>
                <Link
                  to="/branding"
                  className="text-gray-700 hover:text-primary-950 transition-colors"
                >
                  Branding
                </Link>
                <Link
                  to="/tags"
                  className="text-gray-700 hover:text-primary-950 transition-colors"
                >
                  Tags
                </Link>
                <button
                  onClick={handleProfile}
                  className="text-gray-700 hover:text-primary-950 transition-colors"
                >
                  Account
                </button>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleLogin}
                  className="text-gray-700 hover:text-primary-950 transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={handleSignup}
                  className="bg-primary-950 text-white hover:bg-primary-900 px-6 py-2 rounded-md font-semibold transition-colors"
                >
                  Try Free
                </button>
              </>
            )}
          </div>

          {/* Mobile Controls */}
          <div className="md:hidden flex items-center space-x-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
            {!isAuthenticated && (
              <button
                onClick={handleSignup}
                className="bg-primary-950 text-white hover:bg-primary-900 px-4 py-2 rounded-md text-sm font-semibold transition-colors"
                style={{ minHeight: '44px' }}
              >
                Try Free
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="flex items-center space-x-2 text-gray-700 hover:text-primary-950 hover:bg-gray-50 px-3 py-3 rounded-md text-base font-medium transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    to="/forms"
                    className="block text-gray-700 hover:text-primary-950 hover:bg-gray-50 px-3 py-3 rounded-md text-base font-medium transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Forms
                  </Link>
                  <Link
                    to="/testimonials"
                    className="block text-gray-700 hover:text-primary-950 hover:bg-gray-50 px-3 py-3 rounded-md text-base font-medium transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Testimonials
                  </Link>
                  <Link
                    to="/branding"
                    className="block text-gray-700 hover:text-primary-950 hover:bg-gray-50 px-3 py-3 rounded-md text-base font-medium transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Branding
                  </Link>
                  <Link
                    to="/tags"
                    className="block text-gray-700 hover:text-primary-950 hover:bg-gray-50 px-3 py-3 rounded-md text-base font-medium transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Tags
                  </Link>
                  <button
                    onClick={handleProfile}
                    className="block text-gray-700 hover:text-primary-950 hover:bg-gray-50 px-3 py-3 rounded-md text-base font-medium transition-colors w-full text-left"
                  >
                    Account
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 text-gray-700 hover:text-red-600 hover:bg-gray-50 px-3 py-3 rounded-md text-base font-medium transition-colors w-full text-left"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleLogin}
                    className="block text-gray-700 hover:text-primary-950 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium transition-colors w-full text-left"
                  >
                    Login
                  </button>
                  <button
                    onClick={handleSignup}
                    className="block w-full text-left bg-primary-950 text-white hover:bg-primary-900 px-3 py-2 rounded-md text-base font-medium transition-colors mt-2"
                  >
                    Try Free
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};