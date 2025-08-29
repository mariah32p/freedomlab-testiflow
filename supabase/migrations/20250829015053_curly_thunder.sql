/*
  # Create Stripe Customers Table

  1. New Tables
    - `stripe_customers`: Links Supabase users to Stripe customers
      - `id` (bigint, primary key, auto-generated)
      - `user_id` (uuid, references auth.users, unique)
      - `customer_id` (text, Stripe customer ID, unique)
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)
      - `deleted_at` (timestamp with time zone, for soft delete)

  2. Security
    - Enable RLS on `stripe_customers` table
    - Add policy for authenticated users to read their own customer data
*/

CREATE TABLE IF NOT EXISTS stripe_customers (
  id bigint primary key generated always as identity,
  user_id uuid references auth.users(id) not null unique,
  customer_id text not null unique,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  deleted_at timestamp with time zone default null
);

ALTER TABLE stripe_customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own customer data"
    ON stripe_customers
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid() AND deleted_at IS NULL);