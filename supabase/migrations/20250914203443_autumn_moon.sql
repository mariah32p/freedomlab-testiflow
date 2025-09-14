/*
  # Migrate to Outseta User Management

  1. Schema Changes
    - Add `outseta_uid` column to all user-related tables
    - Update foreign key relationships to use Outseta UIDs
    - Keep existing data intact during migration

  2. New Tables
    - `outseta_users` - Cache Outseta user data locally
    
  3. Migration Strategy
    - Add new columns without breaking existing functionality
    - Existing Supabase auth users can be migrated gradually
    - New signups will use Outseta UIDs exclusively
*/

-- Create outseta_users table to cache user data locally
CREATE TABLE IF NOT EXISTS outseta_users (
  outseta_uid text PRIMARY KEY,
  email text UNIQUE NOT NULL,
  first_name text,
  last_name text,
  full_name text,
  account_uid text,
  plan_uid text,
  account_stage integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_sync_at timestamptz DEFAULT now()
);

ALTER TABLE outseta_users ENABLE ROW LEVEL SECURITY;

-- Users can only read their own data
CREATE POLICY "Users can read own data"
  ON outseta_users
  FOR SELECT
  TO authenticated
  USING (outseta_uid = current_setting('app.current_user_outseta_uid', true));

-- Service role can manage all user data (for sync operations)
CREATE POLICY "Service role can manage all users"
  ON outseta_users
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Add outseta_uid columns to existing tables (nullable for migration)
DO $$
BEGIN
  -- Add to testimonial_forms
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'testimonial_forms' AND column_name = 'outseta_uid'
  ) THEN
    ALTER TABLE testimonial_forms ADD COLUMN outseta_uid text;
    CREATE INDEX IF NOT EXISTS idx_testimonial_forms_outseta_uid ON testimonial_forms(outseta_uid);
  END IF;

  -- Add to form_branding
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'form_branding' AND column_name = 'outseta_uid'
  ) THEN
    ALTER TABLE form_branding ADD COLUMN outseta_uid text;
    CREATE INDEX IF NOT EXISTS idx_form_branding_outseta_uid ON form_branding(outseta_uid);
  END IF;

  -- Add to testimonial_tags
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'testimonial_tags' AND column_name = 'outseta_uid'
  ) THEN
    ALTER TABLE testimonial_tags ADD COLUMN outseta_uid text;
    CREATE INDEX IF NOT EXISTS idx_testimonial_tags_outseta_uid ON testimonial_tags(outseta_uid);
  END IF;
END $$;

-- Update RLS policies to work with both user_id and outseta_uid during migration

-- Update testimonial_forms policies
DROP POLICY IF EXISTS "Users can manage their own forms" ON testimonial_forms;
CREATE POLICY "Users can manage their own forms"
  ON testimonial_forms
  FOR ALL
  TO authenticated
  USING (
    user_id = auth.uid() OR 
    outseta_uid = current_setting('app.current_user_outseta_uid', true)
  )
  WITH CHECK (
    user_id = auth.uid() OR 
    outseta_uid = current_setting('app.current_user_outseta_uid', true)
  );

-- Update form_branding policies
DROP POLICY IF EXISTS "Users can manage their own branding" ON form_branding;
CREATE POLICY "Users can manage their own branding"
  ON form_branding
  FOR ALL
  TO authenticated
  USING (
    user_id = auth.uid() OR 
    outseta_uid = current_setting('app.current_user_outseta_uid', true)
  )
  WITH CHECK (
    user_id = auth.uid() OR 
    outseta_uid = current_setting('app.current_user_outseta_uid', true)
  );

-- Update testimonial_tags policies
DROP POLICY IF EXISTS "Users can manage their own tags" ON testimonial_tags;
CREATE POLICY "Users can manage their own tags"
  ON testimonial_tags
  FOR ALL
  TO authenticated
  USING (
    user_id = auth.uid() OR 
    outseta_uid = current_setting('app.current_user_outseta_uid', true)
  )
  WITH CHECK (
    user_id = auth.uid() OR 
    outseta_uid = current_setting('app.current_user_outseta_uid', true)
  );

-- Create function to set current user context for RLS
CREATE OR REPLACE FUNCTION set_current_user_outseta_uid(uid text)
RETURNS void AS $$
BEGIN
  PERFORM set_config('app.current_user_outseta_uid', uid, true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION set_current_user_outseta_uid(text) TO authenticated;