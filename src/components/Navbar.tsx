import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { TestiFlowIcon } from './TestiFlowIcon';

export const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleSignupClick = () => {
    navigate('/signup');
    window.scrollTo(0, 0);
    setMobileMenuOpen(false); // Close menu on navigation
  };

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Left aligned */}
          <div className="flex items-center">
            {/* FIX 1: Wrapped the logo icon in a Link to make it navigable */}
            <Link to="/" className="flex items-center space-x-2">
              <TestiFlowIcon className="h-8 w-8 text-primary-950" />
              <span className="text-xl font-bold text-primary-950">TestiFlow</span>
            </Link>
          </div>

          {/* Desktop Navigation - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-8">
            {user ? (
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
                <Link
                  to="/settings"
                  className="text-gray-700 hover:text-primary-950 transition-colors"
                >
                  Settings
                </Link>
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
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-950 transition-colors"
                >
                  Login
                </Link>
                <button
                  onClick={handleSignupClick}
                  className="bg-primary-950 text-white hover:bg-primary-900 px-6 py-2 rounded-md font-semibold transition-colors"
                >
                  Try Free
                </button>
              </>
            )}
          </div>

          {/* Mobile Controls - Only visible on mobile */}
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
            {!user && (
              <>
                <button
                  onClick={handleSignupClick}
                  className="bg-primary-950 text-white hover:bg-primary-900 px-4 py-2 rounded-md text-sm font-semibold transition-colors"
                  style={{ minHeight: '44px' }}
                >
                  Try Free
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu - Only visible when open */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {user ? (
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
                  <Link
                    to="/settings"
                    className="block text-gray-700 hover:text-primary-950 hover:bg-gray-50 px-3 py-3 rounded-md text-base font-medium transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 text-gray-700 hover:text-red-600 hover:bg-gray-50 px-3 py-3 rounded-md text-base font-medium transition-colors w-full text-left"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block text-gray-700 hover:text-primary-950 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  {/* FIX 2: Added the "Try Free" button for consistency */}
                  <button
                    onClick={handleSignupClick}
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