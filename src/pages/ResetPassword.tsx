import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Alert } from '../components/Alert';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { TestiFlowIcon } from '../components/TestiFlowIcon';

export const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const getPasswordStrength = (password: string) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    const score = Object.values(requirements).filter(Boolean).length;
    return { requirements, score };
  };

  const passwordStrength = getPasswordStrength(password);
  const isPasswordStrong = passwordStrength.score >= 4;

  useEffect(() => {
    // Supabase sends reset tokens in the URL hash (#) rather than the query string
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = searchParams.get('access_token') || hashParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token') || hashParams.get('refresh_token');

    if (!accessToken || !refreshToken) {
      setError('Invalid or expired reset link. Please request a new password reset.');
      return;
    }

    // Set the session with the tokens from the URL
    supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (!isPasswordStrong) {
      setError('Please create a stronger password that meets the requirements below');
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }

    setLoading(false);
  };

  const handleBackToLogin = () => {
    // Clear any existing session and redirect to login
    supabase.auth.signOut();
    navigate('/login');
    window.location.reload(); // Refresh to ensure clean state
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <div className="flex items-center space-x-2">
              <TestiFlowIcon className="h-8 w-8 text-indigo-600" />
              <span className="text-2xl font-bold text-gray-900">TestiFlow</span>
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Password Updated
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
            <div className="flex justify-center mb-6">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Your password has been successfully updated!
            </h3>
            
            <p className="text-gray-600 mb-8">
              You can now sign in with your new password.
            </p>
            
            <button
              onClick={handleBackToLogin}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md font-semibold hover:bg-indigo-700 transition-colors"
            >
              Continue to Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="flex items-center space-x-2">
            <TestiFlowIcon className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl font-bold text-gray-900">TestiFlow</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Set new password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter your new password below
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-6">
              <Alert
                type="error"
                message={error}
                onClose={() => setError('')}
              />
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter your new password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                  )}
                </button>
              </div>
            </div>
            
            {password && (
              <div className="mt-2">
                <div className="text-xs text-gray-600 mb-2">Password strength:</div>
                <div className="space-y-1">
                  <div className={`text-xs flex items-center ${passwordStrength.requirements.length ? 'text-green-600' : 'text-gray-400'}`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${passwordStrength.requirements.length ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    At least 8 characters
                  </div>
                  <div className={`text-xs flex items-center ${passwordStrength.requirements.uppercase ? 'text-green-600' : 'text-gray-400'}`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${passwordStrength.requirements.uppercase ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    One uppercase letter
                  </div>
                  <div className={`text-xs flex items-center ${passwordStrength.requirements.lowercase ? 'text-green-600' : 'text-gray-400'}`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${passwordStrength.requirements.lowercase ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    One lowercase letter
                  </div>
                  <div className={`text-xs flex items-center ${passwordStrength.requirements.number ? 'text-green-600' : 'text-gray-400'}`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${passwordStrength.requirements.number ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    One number
                  </div>
                  <div className={`text-xs flex items-center ${passwordStrength.requirements.special ? 'text-green-600' : 'text-gray-400'}`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${passwordStrength.requirements.special ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    One special character
                  </div>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Confirm your new password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || !isPasswordStrong}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating password...
                  </div>
                ) : (
                  'Update password'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};