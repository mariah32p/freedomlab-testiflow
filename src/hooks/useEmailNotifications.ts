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

  const sendWeeklyDigest = async (
    userEmail: string,
    stats: {
      newTestimonials: number;
      pendingReviews: number;
      totalApproved: number;
      weekStart: string;
      weekEnd: string;
    }
  ) => {
    try {
      const { error } = await supabase.functions.invoke('send-notification', {
        body: {
          type: 'weekly_digest',
          data: {
            user_email: userEmail,
            stats,
          },
        },
      });

      if (error) {
        console.error('Error sending weekly digest:', error);
        throw error;
      }

      console.log('Weekly digest sent successfully');
    } catch (error) {
      console.error('Failed to send weekly digest:', error);
      throw error;
    }
  };

  return {
    sendNewTestimonialNotification,
    sendFollowUpEmail,
    sendWeeklyDigest,
  };
};