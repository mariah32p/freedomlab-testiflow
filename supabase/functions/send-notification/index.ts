import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

const sendEmail = async (template: EmailTemplate) => {
  if (!RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY environment variable is not set');
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'TestiFlow by Freedom Lab <info@freedomlab.ai>',
      to: [template.to],
      subject: template.subject,
      html: template.html,
      text: template.text,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Resend API error: ${error}`);
  }

  return await response.json();
};

const generateNewTestimonialEmail = (testimonial: any, formTitle: string, userEmail: string) => {
  return {
    to: userEmail,
    subject: `New testimonial received from ${testimonial.name}`,
    html: `
      <div style="font-family: 'Montserrat', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #01004d; margin: 0; font-size: 24px;">TestiFlow by Freedom Lab</h1>
          <p style="color: #666; margin: 5px 0 0 0;">New Testimonial Received</p>
        </div>
        
        <div style="background: #f8f9fa; border-radius: 12px; padding: 24px; margin-bottom: 20px;">
          <div style="display: flex; align-items: center; margin-bottom: 16px;">
            <div style="background: #01b79e; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 12px; font-size: 18px;">
              👤
            </div>
            <div>
              <h3 style="margin: 0; color: #01004d; font-size: 18px;">${testimonial.name}</h3>
              ${testimonial.company ? `<p style="margin: 0; color: #666; font-size: 14px;">${testimonial.company}</p>` : ''}
            </div>
          </div>
          
          <div style="margin-bottom: 16px;">
            <div style="color: #666; font-size: 14px; margin-bottom: 4px;">Rating:</div>
            <div style="font-size: 18px;">${'⭐'.repeat(testimonial.rating)} (${testimonial.rating}/5)</div>
          </div>
          
          <div style="margin-bottom: 16px;">
            <div style="color: #666; font-size: 14px; margin-bottom: 4px;">Testimonial:</div>
            <div style="background: white; padding: 16px; border-radius: 8px; border-left: 4px solid #01b79e;">
              <em>"${testimonial.message}"</em>
            </div>
          </div>
          
          <div style="color: #666; font-size: 14px;">
            <strong>Form:</strong> ${formTitle}
          </div>
        </div>
        
        <div style="text-align: center;">
          <a href="${Deno.env.get('APP_URL') || 'https://testiflow.com'}/testimonials" 
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
Form: ${formTitle}

Review in your dashboard: ${Deno.env.get('APP_URL') || 'https://testiflow.com'}/testimonials

This email was sent by TestiFlow by Freedom Lab`
  };
};

Deno.serve(async (req) => {
  try {
    if (req.method === 'OPTIONS') {
      return new Response(null, { 
        status: 204,
        headers: corsHeaders
      });
    }

    if (req.method !== 'POST') {
      return new Response('Method not allowed', { 
        status: 405,
        headers: corsHeaders
      });
    }

    const { type, data } = await req.json();

    switch (type) {
      case 'new_testimonial':
        const { testimonial, form_title, user_id } = data;
        
        // Get form owner's email using admin privileges (secure in Edge Function)
        const { data: userData, error: userError } = await supabase.auth.admin.getUserById(user_id);
        
        if (userError || !userData?.user?.email) {
          throw new Error(`Failed to get user email: ${userError?.message || 'User not found'}`);
        }
        
        const emailTemplate = generateNewTestimonialEmail(testimonial, form_title, userData.user.email);
        await sendEmail(emailTemplate);
        break;

      case 'follow_up':
        const { customer_email, customer_name, form_url, form_title: followUpFormTitle } = data;
        const followUpTemplate = {
          to: customer_email,
          subject: `We'd love your feedback - ${followUpFormTitle}`,
          html: `
            <div style="font-family: 'Montserrat', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #01004d; margin: 0; font-size: 24px;">TestiFlow by Freedom Lab</h1>
              </div>
              
              <div style="background: #f8f9fa; border-radius: 12px; padding: 24px; margin-bottom: 20px;">
                <h2 style="color: #01004d; margin: 0 0 16px 0;">Hi ${customer_name},</h2>
                
                <p style="color: #333; line-height: 1.6; margin-bottom: 16px;">
                  We hope you've had a great experience with us! We'd love to hear about it.
                </p>
                
                <p style="color: #333; line-height: 1.6; margin-bottom: 24px;">
                  Your feedback helps us improve and helps other customers learn about our services. 
                  It only takes 2 minutes to share your thoughts.
                </p>
                
                <div style="text-align: center;">
                  <a href="${form_url}" 
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
          text: `Hi ${customer_name},

We hope you've had a great experience with us! We'd love to hear about it.

Your feedback helps us improve and helps other customers learn about our services. It only takes 2 minutes to share your thoughts.

Share your experience: ${form_url}

This email was sent by TestiFlow by Freedom Lab`
        };
        await sendEmail(followUpTemplate);
        break;

      case 'trial_ending':
        const { user_email: trialUserEmail, days_left, charge_date } = data;
        const trialTemplate = {
          to: trialUserEmail,
          subject: `Your TestiFlow trial ends in ${days_left} day${days_left !== 1 ? 's' : ''}`,
          html: `
            <div style="font-family: 'Montserrat', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #01004d; margin: 0; font-size: 24px;">TestiFlow by Freedom Lab</h1>
                <p style="color: #666; margin: 5px 0 0 0;">Trial Ending Soon</p>
              </div>
              
              <div style="background: #f8f9fa; border-radius: 12px; padding: 24px; margin-bottom: 20px;">
                <h2 style="color: #01004d; margin: 0 0 16px 0;">Your trial ends in ${days_left} day${days_left !== 1 ? 's' : ''}</h2>
                
                <p style="color: #333; line-height: 1.6; margin-bottom: 16px;">
                  Your TestiFlow trial will end on <strong>${charge_date}</strong>. After that, your card will be charged and you'll continue with full access to all features.
                </p>
                
                <p style="color: #333; line-height: 1.6; margin-bottom: 24px;">
                  No action needed - your subscription will continue automatically. You can manage your billing or cancel anytime in your settings.
                </p>
              </div>
              
              <div style="text-align: center;">
                <a href="${Deno.env.get('APP_URL') || 'https://testiflow.com'}/settings" 
                   style="background: #01004d; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block; font-weight: 600;">
                  Manage Subscription
                </a>
              </div>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #999; font-size: 12px;">
                <p>This email was sent by TestiFlow by Freedom Lab</p>
              </div>
            </div>
          `,
          text: `Your TestiFlow trial ends in ${days_left} day${days_left !== 1 ? 's' : ''}

Your trial will end on ${charge_date}. After that, your card will be charged and you'll continue with full access to all features.

No action needed - your subscription will continue automatically. You can manage your billing or cancel anytime in your settings.

Manage subscription: ${Deno.env.get('APP_URL') || 'https://testiflow.com'}/settings

This email was sent by TestiFlow by Freedom Lab`
        };
        await sendEmail(trialTemplate);
        break;

      case 'payment_failure':
        const { user_email: failureUserEmail, grace_period_end } = data;
        const failureTemplate = {
          to: failureUserEmail,
          subject: 'Action Required: Update your payment method - TestiFlow',
          html: `
            <div style="font-family: 'Montserrat', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #01004d; margin: 0; font-size: 24px;">TestiFlow by Freedom Lab</h1>
                <p style="color: #666; margin: 5px 0 0 0;">Payment Issue</p>
              </div>
              
              <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; padding: 24px; margin-bottom: 20px;">
                <h2 style="color: #dc2626; margin: 0 0 16px 0;">Payment Method Needs Attention</h2>
                
                <p style="color: #333; line-height: 1.6; margin-bottom: 16px;">
                  We were unable to process your payment for TestiFlow. This could be due to an expired card, insufficient funds, or your bank declining the charge.
                </p>
                
                <p style="color: #333; line-height: 1.6; margin-bottom: 16px;">
                  <strong>Don't worry!</strong> Your account remains active until <strong>${grace_period_end}</strong>. Please update your payment method to continue using TestiFlow without interruption.
                </p>
                
                <div style="background: #fee2e2; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
                  <p style="margin: 0; color: #991b1b; font-size: 14px;">
                    <strong>⏰ Grace Period:</strong> You have until ${grace_period_end} to update your payment method before your account is suspended.
                  </p>
                </div>
              </div>
              
              <div style="text-align: center;">
                <a href="${Deno.env.get('APP_URL') || 'https://testiflow.com'}/settings" 
                   style="background: #dc2626; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; display: inline-block; font-weight: 600; font-size: 16px;">
                  Update Payment Method
                </a>
              </div>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #999; font-size: 12px;">
                <p>This email was sent by TestiFlow by Freedom Lab</p>
              </div>
            </div>
          `,
          text: `Payment Method Needs Attention - TestiFlow

We were unable to process your payment for TestiFlow. This could be due to an expired card, insufficient funds, or your bank declining the charge.

Don't worry! Your account remains active until ${grace_period_end}. Please update your payment method to continue using TestiFlow without interruption.

Update your payment method: ${Deno.env.get('APP_URL') || 'https://testiflow.com'}/settings

This email was sent by TestiFlow by Freedom Lab`
        };
        await sendEmail(failureTemplate);
        break;

      default:
        throw new Error(`Unknown email type: ${type}`);
    }

    return new Response(
      JSON.stringify({ success: true }), 
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error: any) {
    console.error('Error sending email:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});