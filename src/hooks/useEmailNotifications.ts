import { supabase } from '../lib/supabase';
import { sendEmail, emailTemplates } from '../lib/email';

export const useEmailNotifications = () => {
  const sendNewTestimonialNotification = async (
    testimonial: {
      name: string;
      company?: string;
      rating: number;
      message: string;
    },
    formTitle: string,
    formOwnerUserId: string
  ) => {
    try {
      // Get form owner's email from auth.users
      const { data: userData, error: userError } = await supabase.auth.admin.getUserById(formOwnerUserId);
      
      if (userError || !userData.user?.email) {
        console.error('Failed to get form owner email:', userError);
        return;
      }

      const emailTemplate = emailTemplates.newTestimonialNotification({
        name: testimonial.name,
        company: testimonial.company,
        rating: testimonial.rating,
        message: testimonial.message,
        formTitle
      });

      await sendEmail({
        to: userData.user.email,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
        text: emailTemplate.text
      });

      console.log('New testimonial notification sent successfully');
    } catch (error) {
      console.error('Failed to send new testimonial notification:', error);
      throw error;
    }
  };

  return {
    sendNewTestimonialNotification
  };
};