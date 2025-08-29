/*
  # Step 1: Create Stripe Customers Table

  1. New Tables
    - `stripe_customers`
      - `id` (bigint, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `customer_id` (text, unique Stripe customer ID)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `deleted_at` (timestamp, for soft deletes)

  2. Security
    - Enable RLS on `stripe_customers` table
    - Add policy for authenticated users to read their own customer data

  3. Constraints
    - Unique constraint on customer_id
    - Unique constraint on user_id
    - Foreign key to auth.users
*/

CREATE TABLE IF NOT EXISTS stripe_customers (
  id bigserial PRIMARY KEY,
  user_id uuid UNIQUE NOT NULL REFERENCES auth.users(id),
  customer_id text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

ALTER TABLE stripe_customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own customer data"
  ON stripe_customers
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() AND deleted_at IS NULL);