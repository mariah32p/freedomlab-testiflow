import { Resend } from 'resend';

const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY);

export interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export const sendEmail = async (template: EmailTemplate) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'TestiFlow by Freedom Lab <info@freedomlab.ai>',
      to: template.to,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });

    if (error) {
      console.error('Email sending error:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    console.log('Email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Email service error:', error);
    throw error;
  }
};

// Email templates
export const emailTemplates = {
  newTestimonialNotification: (testimonial: {
    name: string;
    company?: string;
    rating: number;
    message: string;
    formTitle: string;
  }) => ({
    subject: `New testimonial received from ${testimonial.name}`,
    html: `
      <div style="font-family: 'Montserrat', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #01004d; margin: 0; font-size: 24px;">TestiFlow by Freedom Lab</h1>
          <p style="color: #666; margin: 5px 0 0 0;">New Testimonial Received</p>
        </div>
        
        <div style="background: #f8f9fa; border-radius: 12px; padding: 24px; margin-bottom: 20px;">
          <div style="display: flex; align-items: center; margin-bottom: 16px;">
            <div style="background: #01b79e; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
              👤
            </div>
            <div>
              <h3 style="margin: 0; color: #01004d; font-size: 18px;">${testimonial.name}</h3>
              ${testimonial.company ? `<p style="margin: 0; color: #666; font-size: 14px;">${testimonial.company}</p>` : ''}
            </div>
          </div>
          
          <div style="margin-bottom: 16px;">
            <div style="color: #666; font-size: 14px; margin-bottom: 4px;">Rating:</div>
            <div>${'⭐'.repeat(testimonial.rating)} (${testimonial.rating}/5)</div>
          </div>
          
          <div style="margin-bottom: 16px;">
            <div style="color: #666; font-size: 14px; margin-bottom: 4px;">Testimonial:</div>
            <div style="background: white; padding: 16px; border-radius: 8px; border-left: 4px solid #01b79e;">
              <em>"${testimonial.message}"</em>
            </div>
          </div>
          
          <div style="color: #666; font-size: 14px;">
            <strong>Form:</strong> ${testimonial.formTitle}
          </div>
        </div>
        
        <div style="text-align: center;">
          <a href="${window.location.origin}/testimonials" 
             style="background: #01004d; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block; font-weight: 600;">
            Review in Dashboard
          </a>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #999; font-size: 12px;">
          <p>This email was sent by TestiFlow by Freedom Lab</p>
        </div>
      </div>
    `,
    text: `New testimonial received from ${testimonial.name}${testimonial.company ? ` (${testimonial.company})` : ''}

Rating: ${testimonial.rating}/5 stars
Testimonial: "${testimonial.message}"
Form: ${testimonial.formTitle}

Review in your dashboard: ${window.location.origin}/testimonials`
  }),

  testimonialFollowUp: (customerEmail: string, customerName: string, formUrl: string, formTitle: string) => ({
    subject: `We'd love your feedback - ${formTitle}`,
    html: `
      <div style="font-family: 'Montserrat', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #01004d; margin: 0; font-size: 24px;">TestiFlow by Freedom Lab</h1>
        </div>
        
        <div style="background: #f8f9fa; border-radius: 12px; padding: 24px; margin-bottom: 20px;">
          <h2 style="color: #01004d; margin: 0 0 16px 0;">Hi ${customerName},</h2>
          
          <p style="color: #333; line-height: 1.6; margin-bottom: 16px;">
            We hope you've had a great experience with us! We'd love to hear about it.
          </p>
          
          <p style="color: #333; line-height: 1.6; margin-bottom: 24px;">
            Your feedback helps us improve and helps other customers learn about our services. 
            It only takes 2 minutes to share your thoughts.
          </p>
          
          <div style="text-align: center;">
            <a href="${formUrl}" 
               style="background: #01b79e; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; display: inline-block; font-weight: 600; font-size: 16px;">
              Share Your Experience
            </a>
          </div>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #999; font-size: 12px;">
          <p>This email was sent by TestiFlow by Freedom Lab</p>
        </div>
      </div>
    `,
    text: `Hi ${customerName},

We hope you've had a great experience with us! We'd love to hear about it.

Your feedback helps us improve and helps other customers learn about our services. It only takes 2 minutes to share your thoughts.

Share your experience: ${formUrl}

This email was sent by TestiFlow by Freedom Lab`
  }),

  weeklyDigest: (userEmail: string, stats: {
    newTestimonials: number;
    pendingReviews: number;
    totalApproved: number;
    weekStart: string;
    weekEnd: string;
  }) => ({
    subject: `Your TestiFlow weekly summary - ${stats.newTestimonials} new testimonials`,
    html: `
      <div style="font-family: 'Montserrat', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #01004d; margin: 0; font-size: 24px;">TestiFlow by Freedom Lab</h1>
          <p style="color: #666; margin: 5px 0 0 0;">Weekly Summary</p>
        </div>
        
        <div style="background: #f8f9fa; border-radius: 12px; padding: 24px; margin-bottom: 20px;">
          <h2 style="color: #01004d; margin: 0 0 20px 0;">Week of ${stats.weekStart} - ${stats.weekEnd}</h2>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px; margin-bottom: 20px;">
            <div style="background: white; padding: 16px; border-radius: 8px; text-align: center; border-left: 4px solid #01b79e;">
              <div style="font-size: 24px; font-weight: bold; color: #01004d;">${stats.newTestimonials}</div>
              <div style="color: #666; font-size: 14px;">New Testimonials</div>
            </div>
            <div style="background: white; padding: 16px; border-radius: 8px; text-align: center; border-left: 4px solid #f59e0b;">
              <div style="font-size: 24px; font-weight: bold; color: #01004d;">${stats.pendingReviews}</div>
              <div style="color: #666; font-size: 14px;">Pending Reviews</div>
            </div>
            <div style="background: white; padding: 16px; border-radius: 8px; text-align: center; border-left: 4px solid #10b981;">
              <div style="font-size: 24px; font-weight: bold; color: #01004d;">${stats.totalApproved}</div>
              <div style="color: #666; font-size: 14px;">Total Approved</div>
            </div>
          </div>
          
          ${stats.pendingReviews > 0 ? `
          <div style="background: #fef3cd; border: 1px solid #fbbf24; border-radius: 8px; padding: 16px; margin-top: 16px;">
            <p style="margin: 0; color: #92400e;">
              <strong>Action needed:</strong> You have ${stats.pendingReviews} testimonial${stats.pendingReviews !== 1 ? 's' : ''} waiting for review.
            </p>
          </div>
          ` : ''}
        </div>
        
        <div style="text-align: center;">
          <a href="${window.location.origin}/testimonials" 
             style="background: #01004d; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block; font-weight: 600;">
            View Dashboard
          </a>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #999; font-size: 12px;">
          <p>This email was sent by TestiFlow by Freedom Lab</p>
        </div>
      </div>
    `,
    text: `TestiFlow Weekly Summary - Week of ${stats.weekStart} - ${stats.weekEnd}

📊 Your Stats:
- ${stats.newTestimonials} new testimonials
- ${stats.pendingReviews} pending reviews  
- ${stats.totalApproved} total approved

${stats.pendingReviews > 0 ? `⚠️ Action needed: ${stats.pendingReviews} testimonial${stats.pendingReviews !== 1 ? 's' : ''} waiting for review.` : ''}

View your dashboard: ${window.location.origin}/testimonials

This email was sent by TestiFlow by Freedom Lab`
  })
};