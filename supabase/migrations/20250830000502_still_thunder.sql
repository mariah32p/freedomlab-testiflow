/*
  # Add form fields for custom questions

  1. New Tables
    - `form_fields`
      - `id` (uuid, primary key)
      - `form_id` (uuid, foreign key to testimonial_forms)
      - `field_type` (enum: text, textarea, select, radio, checkbox, rating, email, url)
      - `label` (text, the question/label)
      - `placeholder` (text, optional placeholder text)
      - `options` (jsonb, for select/radio/checkbox options)
      - `is_required` (boolean, whether field is mandatory)
      - `sort_order` (integer, for ordering fields)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `form_fields` table
    - Add policy for form owners to manage their fields
    - Add policy for public to read fields for active forms

  3. Changes
    - Add enum type for field types
    - Create form_fields table with proper constraints
    - Set up RLS policies for security
*/

-- Create enum for field types
CREATE TYPE form_field_type AS ENUM (
  'text',
  'textarea', 
  'select',
  'radio',
  'checkbox',
  'rating',
  'email',
  'url'
);

-- Create form_fields table
CREATE TABLE IF NOT EXISTS form_fields (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id uuid NOT NULL REFERENCES testimonial_forms(id) ON DELETE CASCADE,
  field_type form_field_type NOT NULL,
  label text NOT NULL,
  placeholder text DEFAULT '',
  options jsonb DEFAULT '[]'::jsonb,
  is_required boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE form_fields ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Form owners can manage their form fields"
  ON form_fields
  FOR ALL
  TO authenticated
  USING (
    form_id IN (
      SELECT id FROM testimonial_forms 
      WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    form_id IN (
      SELECT id FROM testimonial_forms 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Public can read fields for active forms"
  ON form_fields
  FOR SELECT
  TO anon, authenticated
  USING (
    form_id IN (
      SELECT id FROM testimonial_forms 
      WHERE is_active = true
    )
  );

-- Create index for better performance
CREATE INDEX IF NOT EXISTS form_fields_form_id_sort_order_idx 
  ON form_fields(form_id, sort_order);