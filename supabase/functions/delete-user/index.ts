import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }), 
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }), 
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`Starting user deletion process for user: ${user.id} (${user.email})`);

    // Step 1: Delete all user data in correct order (respecting foreign keys)
    
    // Delete form responses first (references testimonials and form_fields)
    const { error: responsesError } = await supabase
      .from('form_responses')
      .delete()
      .in('testimonial_id', 
        supabase
          .from('testimonials')
          .select('id')
          .in('form_id', 
            supabase
              .from('testimonial_forms')
              .select('id')
              .eq('user_id', user.id)
          )
      );

    if (responsesError) {
      console.error('Error deleting form responses:', responsesError);
    }

    // Delete testimonial tag assignments
    const { error: tagAssignmentsError } = await supabase
      .from('testimonial_tag_assignments')
      .delete()
      .in('testimonial_id', 
        supabase
          .from('testimonials')
          .select('id')
          .in('form_id', 
            supabase
              .from('testimonial_forms')
              .select('id')
              .eq('user_id', user.id)
          )
      );

    if (tagAssignmentsError) {
      console.error('Error deleting tag assignments:', tagAssignmentsError);
    }

    // Delete testimonials (references forms)
    const { error: testimonialsError } = await supabase
      .from('testimonials')
      .delete()
      .in('form_id', 
        supabase
          .from('testimonial_forms')
          .select('id')
          .eq('user_id', user.id)
      );

    if (testimonialsError) {
      console.error('Error deleting testimonials:', testimonialsError);
    }

    // Delete form fields (references forms)
    const { error: fieldsError } = await supabase
      .from('form_fields')
      .delete()
      .in('form_id', 
        supabase
          .from('testimonial_forms')
          .select('id')
          .eq('user_id', user.id)
      );

    if (fieldsError) {
      console.error('Error deleting form fields:', fieldsError);
    }

    // Delete testimonial forms
    const { error: formsError } = await supabase
      .from('testimonial_forms')
      .delete()
      .eq('user_id', user.id);

    if (formsError) {
      console.error('Error deleting forms:', formsError);
    }

    // Delete form branding
    const { error: brandingError } = await supabase
      .from('form_branding')
      .delete()
      .eq('user_id', user.id);

    if (brandingError) {
      console.error('Error deleting branding:', brandingError);
    }

    // Delete testimonial tags
    const { error: tagsError } = await supabase
      .from('testimonial_tags')
      .delete()
      .eq('user_id', user.id);

    if (tagsError) {
      console.error('Error deleting tags:', tagsError);
    }

    // Delete Stripe data
    const { error: subscriptionsError } = await supabase
      .from('stripe_subscriptions')
      .delete()
      .in('customer_id', 
        supabase
          .from('stripe_customers')
          .select('customer_id')
          .eq('user_id', user.id)
      );

    if (subscriptionsError) {
      console.error('Error deleting subscriptions:', subscriptionsError);
    }

    const { error: customersError } = await supabase
      .from('stripe_customers')
      .delete()
      .eq('user_id', user.id);

    if (customersError) {
      console.error('Error deleting customers:', customersError);
    }

    // Step 2: Delete the auth user (this will cascade delete any remaining references)
    const { error: deleteUserError } = await supabase.auth.admin.deleteUser(user.id);

    if (deleteUserError) {
      console.error('Error deleting auth user:', deleteUserError);
      throw new Error(`Failed to delete user: ${deleteUserError.message}`);
    }

    console.log(`Successfully deleted user: ${user.id} (${user.email})`);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'User and all associated data deleted successfully'
      }), 
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error: any) {
    console.error('Error deleting user:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});