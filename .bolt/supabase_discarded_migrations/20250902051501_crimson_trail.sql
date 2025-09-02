/*
  # Fix anonymous access to public forms

  1. Security Updates
    - Add policy for anonymous users to read active testimonial forms
    - Add policy for anonymous users to read form branding
    - Ensure anonymous users can read custom fields for active forms
  
  2. Changes
    - Allow anon role to read active forms
    - Allow anon role to read branding for form owners
    - Verify existing policies for form fields and testimonial submission
*/

-- Allow anonymous users to read active testimonial forms
CREATE POLICY IF NOT EXISTS "Anonymous users can read active forms"
  ON testimonial_forms
  FOR SELECT
  TO anon
  USING (is_active = true);

-- Allow anonymous users to read form branding for active forms
CREATE POLICY IF NOT EXISTS "Anonymous users can read branding for active forms"
  ON form_branding
  FOR SELECT
  TO anon
  USING (user_id IN (
    SELECT user_id 
    FROM testimonial_forms 
    WHERE is_active = true
  ));

-- Verify that anonymous users can read form fields for active forms (should already exist)
-- This policy should already exist based on the schema, but let's ensure it's there
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'form_fields' 
    AND policyname = 'Public can read fields for active forms'
  ) THEN
    CREATE POLICY "Public can read fields for active forms"
      ON form_fields
      FOR SELECT
      TO anon, authenticated
      USING (form_id IN (
        SELECT id 
        FROM testimonial_forms 
        WHERE is_active = true
      ));
  END IF;
END $$;