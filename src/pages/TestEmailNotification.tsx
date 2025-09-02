import React, { useState } from 'react';
import { useEmailNotifications } from '../hooks/useEmailNotifications';
import { useAuth } from '../contexts/AuthContext';
import { Alert } from '../components/Alert';
import { Send, Mail } from 'lucide-react';

export const TestEmailNotification: React.FC = () => {
  const { user } = useAuth();
  const { sendNewTestimonialNotification, sendTrialEndingNotification, sendPaymentFailureNotification } = useEmailNotifications();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [emailType, setEmailType] = useState<'testimonial' | 'trial_ending' | 'payment_failure'>('testimonial');

  const handleTestEmail = async () => {
    if (!user) {
      setError('You must be logged in to test email notifications');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      switch (emailType) {
        case 'testimonial':
          await sendNewTestimonialNotification(
            {
              name: 'John Smith',
              company: 'Test Company Inc.',
              rating: 5,
              message: 'This is a test testimonial to verify that email notifications are working correctly. The system should send this to the form owner via email.',
            },
            'Test Form - Email Notification',
            user.id
          );
          break;
        case 'trial_ending':
          await sendTrialEndingNotification(
            user.email!,
            3,
            new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()
          );
          break;
        case 'payment_failure':
          await sendPaymentFailureNotification(
            user.email!,
            new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
          );
          break;
      }

      setSuccess(`Test ${emailType.replace('_', ' ')} email sent successfully to ${user.email}! Check your inbox (and spam folder) for the notification.`);
    } catch (error) {
      console.error('Test email failed:', error);
      setError(`Failed to send test email: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="text-center">
              <Mail className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Test Email Notifications</h1>
              <p className="text-gray-600 mb-8">
                Test different email notification types by sending samples to your email address.
              </p>

              {error && (
                <div className="mb-6">
                  <Alert
                    type="error"
                    message={error}
                    onClose={() => setError(null)}
                  />
                </div>
              )}

              {success && (
                <div className="mb-6">
                  <Alert
                    type="success"
                    message={success}
                    onClose={() => setSuccess(null)}
                  />
                </div>
              )}

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Type to Test
                </label>
                <select
                  value={emailType}
                  onChange={(e) => setEmailType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="testimonial">New Testimonial Notification</option>
                  <option value="trial_ending">Trial Ending Reminder</option>
                  <option value="payment_failure">Payment Failure Notice</option>
                </select>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="text-sm font-medium text-blue-900 mb-2">Test Details</h3>
                <div className="text-sm text-blue-700 space-y-1">
                  <p><strong>Recipient:</strong> {user?.email}</p>
                  {emailType === 'testimonial' && (
                    <>
                      <p><strong>Test Testimonial:</strong> John Smith from Test Company Inc.</p>
                      <p><strong>Rating:</strong> 5 stars</p>
                      <p><strong>Form:</strong> Test Form - Email Notification</p>
                    </>
                  )}
                  {emailType === 'trial_ending' && (
                    <>
                      <p><strong>Trial Days Left:</strong> 3 days</p>
                      <p><strong>Charge Date:</strong> {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                    </>
                  )}
                  {emailType === 'payment_failure' && (
                    <>
                      <p><strong>Grace Period End:</strong> {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                      <p><strong>Action Required:</strong> Update payment method</p>
                    </>
                  )}
                </div>
              </div>

              <button
                onClick={handleTestEmail}
                disabled={loading}
                className="bg-primary-950 text-white px-6 py-3 rounded-lg hover:bg-primary-900 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed mx-auto"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Sending Test Email...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Send Test Email</span>
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 mt-4">
                This will send a test email notification to your registered email address using the selected template type.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};