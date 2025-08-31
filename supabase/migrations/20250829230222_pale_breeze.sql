/*
  # Create testimonial forms table

  1. New Tables
    - `testimonial_forms`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `title` (text) - Form title
      - `description` (text) - Form description
      - `thank_you_message` (text) - Message shown after submission
      - `is_active` (boolean) - Whether form accepts submissions
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `testimonial_forms` table
    - Add policy for users to manage their own forms
*/

CREATE TABLE IF NOT EXISTS testimonial_forms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL DEFAULT 'Share Your Experience',
  description text DEFAULT 'We''d love to hear about your experience with us!',
  thank_you_message text DEFAULT 'Thank you for your testimonial!',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE testimonial_forms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own forms"
  ON testimonial_forms
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_testimonial_forms_updated_at
  BEFORE UPDATE ON testimonial_forms
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();