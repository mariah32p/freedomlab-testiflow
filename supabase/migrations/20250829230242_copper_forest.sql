/*
  # Create form branding table

  1. New Tables
    - `form_branding`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `logo_url` (text) - URL to uploaded logo
      - `primary_color` (text) - Primary brand color (hex)
      - `secondary_color` (text) - Secondary brand color (hex)
      - `font_family` (text) - Font family name
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `form_branding` table
    - Users can only manage their own branding
*/

CREATE TABLE IF NOT EXISTS form_branding (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  logo_url text,
  primary_color text DEFAULT '#01004d',
  secondary_color text DEFAULT '#01b79e',
  font_family text DEFAULT 'Montserrat',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE form_branding ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own branding"
  ON form_branding
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create updated_at trigger for branding
CREATE TRIGGER update_form_branding_updated_at
  BEFORE UPDATE ON form_branding
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();