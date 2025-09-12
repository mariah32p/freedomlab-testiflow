/*
  # Database Cleanup Script
  
  This script will completely clean out all TestiFlow data including:
  1. All testimonial-related data
  2. All Stripe customer and subscription data  
  3. All auth users
  
  ⚠️ WARNING: This will delete ALL data and cannot be undone!
  
  Run this in the Supabase SQL Editor to start fresh.
*/

-- Step 1: Delete all testimonial-related data (in correct order due to foreign keys)

-- Delete form responses first (references testimonials and form_fields)
DELETE FROM form_responses;

-- Delete testimonial tag assignments (references testimonials and tags)
DELETE FROM testimonial_tag_assignments;

-- Delete testimonials (references forms)
DELETE FROM testimonials;

-- Delete form fields (references forms)
DELETE FROM form_fields;

-- Delete testimonial forms
DELETE FROM testimonial_forms;

-- Delete form branding
DELETE FROM form_branding;

-- Delete testimonial tags
DELETE FROM testimonial_tags;

-- Step 2: Delete Stripe-related data

-- Delete subscription cleanup log
DELETE FROM subscription_cleanup_log;

-- Delete stripe subscriptions
DELETE FROM stripe_subscriptions;

-- Delete stripe orders
DELETE FROM stripe_orders;

-- Delete stripe customers
DELETE FROM stripe_customers;

-- Step 3: Delete all auth users (this will cascade delete any remaining references)
-- Note: This uses the auth.users table directly with admin privileges

DO $$
DECLARE
    user_record RECORD;
BEGIN
    -- Loop through all users and delete them one by one
    FOR user_record IN SELECT id FROM auth.users LOOP
        -- Delete the user (this will cascade to any remaining references)
        DELETE FROM auth.users WHERE id = user_record.id;
        RAISE NOTICE 'Deleted user: %', user_record.id;
    END LOOP;
END $$;

-- Step 4: Reset any sequences (optional, but ensures clean IDs)
-- Note: Only reset sequences that exist and are used by our tables

DO $$
BEGIN
    -- Reset sequences for tables that use bigint auto-increment
    IF EXISTS (SELECT 1 FROM information_schema.sequences WHERE sequence_name = 'stripe_customers_id_seq') THEN
        ALTER SEQUENCE stripe_customers_id_seq RESTART WITH 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.sequences WHERE sequence_name = 'stripe_subscriptions_id_seq') THEN
        ALTER SEQUENCE stripe_subscriptions_id_seq RESTART WITH 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.sequences WHERE sequence_name = 'stripe_orders_id_seq') THEN
        ALTER SEQUENCE stripe_orders_id_seq RESTART WITH 1;
    END IF;
END $$;

-- Verification: Check that all tables are empty
SELECT 
    'testimonial_forms' as table_name, 
    COUNT(*) as row_count 
FROM testimonial_forms
UNION ALL
SELECT 
    'testimonials' as table_name, 
    COUNT(*) as row_count 
FROM testimonials
UNION ALL
SELECT 
    'form_fields' as table_name, 
    COUNT(*) as row_count 
FROM form_fields
UNION ALL
SELECT 
    'form_responses' as table_name, 
    COUNT(*) as row_count 
FROM form_responses
UNION ALL
SELECT 
    'testimonial_tags' as table_name, 
    COUNT(*) as row_count 
FROM testimonial_tags
UNION ALL
SELECT 
    'testimonial_tag_assignments' as table_name, 
    COUNT(*) as row_count 
FROM testimonial_tag_assignments
UNION ALL
SELECT 
    'form_branding' as table_name, 
    COUNT(*) as row_count 
FROM form_branding
UNION ALL
SELECT 
    'stripe_customers' as table_name, 
    COUNT(*) as row_count 
FROM stripe_customers
UNION ALL
SELECT 
    'stripe_subscriptions' as table_name, 
    COUNT(*) as row_count 
FROM stripe_subscriptions
UNION ALL
SELECT 
    'stripe_orders' as table_name, 
    COUNT(*) as row_count 
FROM stripe_orders
UNION ALL
SELECT 
    'auth_users' as table_name, 
    COUNT(*) as row_count 
FROM auth.users;