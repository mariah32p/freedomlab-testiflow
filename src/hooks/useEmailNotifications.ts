import { supabase } from '../lib/supabase';

export const useEmailNotifications = () => {
  const sendNewTestimonialNotification = async (
    testimonial: {
      name: string;
      company?: string;
      rating: number;
      message: string;
    },
    formTitle: string,
    userId: string
  ) => {
    try {
      const { error } = await supabase.functions.invoke('send-notification', {
        body: {
          type: 'new_testimonial',
          data: {
            testimonial,
            form_title: formTitle,
            user_id: userId,
          },
        },
      });

      if (error) {
        console.error('Error sending new testimonial notification:', error);
        throw error;
      }

      console.log('New testimonial notification sent successfully');
    } catch (error) {
      console.error('Failed to send new testimonial notification:', error);
      throw error;
    }
  };

  const sendFollowUpEmail = async (
    customerEmail: string,
    customerName: string,
    formUrl: string,
    formTitle: string
  ) => {
    try {
      const { error } = await supabase.functions.invoke('send-notification', {
        body: {
          type: 'follow_up',
          data: {
            customer_email: customerEmail,
            customer_name: customerName,
            form_url: formUrl,
            form_title: formTitle,
          },
        },
      });

      if (error) {
        console.error('Error sending follow-up email:', error);
        throw error;
      }

      console.log('Follow-up email sent successfully');
    } catch (error) {
      console.error('Failed to send follow-up email:', error);
      throw error;
    }
  };

  const sendTrialEndingNotification = async (
    userEmail: string,
    daysLeft: number,
    chargeDate: string
  ) => {
    try {
      const { error } = await supabase.functions.invoke('send-notification', {
        body: {
          type: 'trial_ending',
          data: {
            user_email: userEmail,
            days_left: daysLeft,
            charge_date: chargeDate,
          },
        },
      });

      if (error) {
        console.error('Error sending trial ending notification:', error);
        throw error;
      }

      console.log('Trial ending notification sent successfully');
    } catch (error) {
      console.error('Failed to send trial ending notification:', error);
      throw error;
    }
  };

  const sendPaymentFailureNotification = async (
    userEmail: string,
    gracePeriodEnd: string
  ) => {
    try {
      const { error } = await supabase.functions.invoke('send-notification', {
        body: {
          type: 'payment_failure',
          data: {
            user_email: userEmail,
            grace_period_end: gracePeriodEnd,
          },
        },
      });

      if (error) {
        console.error('Error sending payment failure notification:', error);
        throw error;
      }

      console.log('Payment failure notification sent successfully');
    } catch (error) {
      console.error('Failed to send payment failure notification:', error);
      throw error;
    }
  };

  return {
    sendNewTestimonialNotification,
    sendFollowUpEmail,
    sendTrialEndingNotification,
    sendPaymentFailureNotification,
  };
};