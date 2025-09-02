/*
  # Create testimonial tags system

  1. New Tables
    - `testimonial_tags`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `name` (text) - Tag name
      - `color` (text) - Hex color for tag display
      - `created_at` (timestamp)
    
    - `testimonial_tag_assignments`
      - `testimonial_id` (uuid, foreign key to testimonials)
      - `tag_id` (uuid, foreign key to testimonial_tags)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Users can only manage their own tags
    - Users can only assign tags to their own testimonials
*/

CREATE TABLE IF NOT EXISTS testimonial_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  color text DEFAULT '#3B82F6',
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, name)
);

CREATE TABLE IF NOT EXISTS testimonial_tag_assignments (
  testimonial_id uuid REFERENCES testimonials(id) ON DELETE CASCADE NOT NULL,
  tag_id uuid REFERENCES testimonial_tags(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (testimonial_id, tag_id)
);

ALTER TABLE testimonial_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonial_tag_assignments ENABLE ROW LEVEL SECURITY;

-- Tags policies
CREATE POLICY "Users can manage their own tags"
  ON testimonial_tags
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Tag assignments policies
CREATE POLICY "Users can manage tag assignments for their testimonials"
  ON testimonial_tag_assignments
  FOR ALL
  TO authenticated
  USING (
    testimonial_id IN (
      SELECT t.id FROM testimonials t
      JOIN testimonial_forms f ON t.form_id = f.id
      WHERE f.user_id = auth.uid()
    )
  )
  WITH CHECK (
    testimonial_id IN (
      SELECT t.id FROM testimonials t
      JOIN testimonial_forms f ON t.form_id = f.id
      WHERE f.user_id = auth.uid()
    )
    AND
    tag_id IN (
      SELECT id FROM testimonial_tags
      WHERE user_id = auth.uid()
    )
  );