/*
  # Add anonymous access to active testimonial forms

  1. Security Updates
    - Add policy for anonymous users to read active testimonial forms
    - Add policy for anonymous users to read form branding for active forms
    - Add policy for anonymous users to read form fields for active forms

  This enables public form submission without requiring authentication.
*/

-- Allow anonymous users to read active testimonial forms
CREATE POLICY "Anonymous users can read active forms"
  ON testimonial_forms
  FOR SELECT
  TO anon
  USING (is_active = true);

-- Allow anonymous users to read form branding for active forms
CREATE POLICY "Anonymous users can read branding for active forms"
  ON form_branding
  FOR SELECT
  TO anon
  USING (user_id IN (
    SELECT user_id 
    FROM testimonial_forms 
    WHERE is_active = true
  ));

-- Allow anonymous users to read form fields for active forms (this policy should already exist but let's ensure it)
DROP POLICY IF EXISTS "Public can read fields for active forms" ON form_fields;
CREATE POLICY "Public can read fields for active forms"
  ON form_fields
  FOR SELECT
  TO anon, authenticated
  USING (form_id IN (
    SELECT id 
    FROM testimonial_forms 
    WHERE is_active = true
  ));