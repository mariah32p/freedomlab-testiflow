/*
  # Add media upload settings to testimonial forms

  1. New Columns
    - `allow_image_uploads` (boolean) - Whether to allow image uploads
    - `allow_video_uploads` (boolean) - Whether to allow video uploads  
    - `max_image_size_mb` (integer) - Maximum image file size in MB
    - `max_video_size_mb` (integer) - Maximum video file size in MB

  2. Changes
    - Add columns to existing testimonial_forms table
    - Set sensible defaults for existing forms
*/

-- Add media upload settings columns to testimonial_forms table
DO $$
BEGIN
  -- Add allow_image_uploads column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'testimonial_forms' AND column_name = 'allow_image_uploads'
  ) THEN
    ALTER TABLE testimonial_forms ADD COLUMN allow_image_uploads boolean DEFAULT true;
  END IF;

  -- Add allow_video_uploads column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'testimonial_forms' AND column_name = 'allow_video_uploads'
  ) THEN
    ALTER TABLE testimonial_forms ADD COLUMN allow_video_uploads boolean DEFAULT false;
  END IF;

  -- Add max_image_size_mb column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'testimonial_forms' AND column_name = 'max_image_size_mb'
  ) THEN
    ALTER TABLE testimonial_forms ADD COLUMN max_image_size_mb integer DEFAULT 10;
  END IF;

  -- Add max_video_size_mb column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'testimonial_forms' AND column_name = 'max_video_size_mb'
  ) THEN
    ALTER TABLE testimonial_forms ADD COLUMN max_video_size_mb integer DEFAULT 100;
  END IF;
END $$;