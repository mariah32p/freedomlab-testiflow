/*
  # Add form responses for custom field data

  1. New Tables
    - `form_responses`
      - `id` (uuid, primary key)
      - `testimonial_id` (uuid, foreign key to testimonials)
      - `field_id` (uuid, foreign key to form_fields)
      - `value` (text, the response value)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `form_responses` table
    - Add policy for form owners to read responses
    - Add policy for public to insert responses

  3. Changes
    - Create form_responses table
    - Set up proper foreign key relationships
    - Add RLS policies for security
*/

-- Create form_responses table
CREATE TABLE IF NOT EXISTS form_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  testimonial_id uuid NOT NULL REFERENCES testimonials(id) ON DELETE CASCADE,
  field_id uuid NOT NULL REFERENCES form_fields(id) ON DELETE CASCADE,
  value text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE form_responses ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Form owners can read responses to their forms"
  ON form_responses
  FOR SELECT
  TO authenticated
  USING (
    field_id IN (
      SELECT ff.id FROM form_fields ff
      JOIN testimonial_forms tf ON ff.form_id = tf.id
      WHERE tf.user_id = auth.uid()
    )
  );

CREATE POLICY "Public can insert responses"
  ON form_responses
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS form_responses_testimonial_id_idx 
  ON form_responses(testimonial_id);

CREATE INDEX IF NOT EXISTS form_responses_field_id_idx 
  ON form_responses(field_id);

-- Create unique constraint to prevent duplicate responses
ALTER TABLE form_responses 
ADD CONSTRAINT form_responses_testimonial_field_unique 
UNIQUE (testimonial_id, field_id);