/*
  # Create testimonials table

  1. New Tables
    - `testimonials`
      - `id` (uuid, primary key)
      - `form_id` (uuid, foreign key to testimonial_forms)
      - `name` (text) - Customer name
      - `email` (text) - Customer email
      - `company` (text) - Customer company (optional)
      - `message` (text) - Testimonial message
      - `rating` (integer) - 1-5 star rating
      - `status` (text) - pending, approved, rejected
      - `image_url` (text) - Optional image attachment
      - `video_url` (text) - Optional video attachment
      - `submitted_at` (timestamp)
      - `reviewed_at` (timestamp) - When approved/rejected
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `testimonials` table
    - Add policy for form owners to manage testimonials
    - Add policy for public submission (insert only)
*/

CREATE TYPE testimonial_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id uuid REFERENCES testimonial_forms(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  company text,
  message text NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  status testimonial_status DEFAULT 'pending',
  image_url text,
  video_url text,
  submitted_at timestamptz DEFAULT now(),
  reviewed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Policy for form owners to view and manage testimonials
CREATE POLICY "Form owners can manage testimonials"
  ON testimonials
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

-- Policy for public submission (anyone can insert)
CREATE POLICY "Anyone can submit testimonials"
  ON testimonials
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy for public to read their own submissions (optional, for confirmation)
CREATE POLICY "Public can read active form testimonials"
  ON testimonials
  FOR SELECT
  TO anon, authenticated
  USING (
    form_id IN (
      SELECT id FROM testimonial_forms 
      WHERE is_active = true
    )
  );