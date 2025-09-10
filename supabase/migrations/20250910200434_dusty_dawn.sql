/*
  # Fix Multiple Subscriptions Issue

  1. Database Safeguards
    - Add trigger to prevent multiple active subscriptions per customer
    - Add indexes for better performance
    - Add helper functions for subscription management

  2. Cleanup Existing Data
    - Identify and log customers with multiple subscriptions
    - Keep the most recent subscription, mark others as replaced
    - Create audit trail for all changes

  3. Prevention Measures
    - Trigger automatically handles new subscription conflicts
    - Helper functions ensure consistent subscription queries
    - Logging for debugging and monitoring
*/

-- Create a log table for tracking subscription cleanup
CREATE TABLE IF NOT EXISTS subscription_cleanup_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id text NOT NULL,
  old_subscription_id text NOT NULL,
  new_subscription_id text NOT NULL,
  action text NOT NULL,
  reason text,
  cleaned_at timestamptz DEFAULT now()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_stripe_subscriptions_customer_status 
ON stripe_subscriptions(customer_id, status);

CREATE INDEX IF NOT EXISTS idx_stripe_subscriptions_status_updated 
ON stripe_subscriptions(status, updated_at);

-- Helper function to get the active subscription for a customer
CREATE OR REPLACE FUNCTION get_active_subscription(customer_id_param text)
RETURNS stripe_subscriptions AS $$
DECLARE
  result stripe_subscriptions;
BEGIN
  -- Priority: active > trialing > past_due
  SELECT * INTO result
  FROM stripe_subscriptions
  WHERE customer_id = customer_id_param
    AND status IN ('active', 'trialing', 'past_due')
    AND deleted_at IS NULL
  ORDER BY 
    CASE status
      WHEN 'active' THEN 1
      WHEN 'trialing' THEN 2
      WHEN 'past_due' THEN 3
      ELSE 4
    END,
    updated_at DESC
  LIMIT 1;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to handle subscription conflicts
CREATE OR REPLACE FUNCTION handle_subscription_conflict()
RETURNS TRIGGER AS $$
DECLARE
  existing_sub stripe_subscriptions;
  conflict_count integer;
BEGIN
  -- Only process active subscription statuses
  IF NEW.status NOT IN ('active', 'trialing') THEN
    RETURN NEW;
  END IF;

  -- Check for existing active subscriptions for this customer
  SELECT COUNT(*) INTO conflict_count
  FROM stripe_subscriptions
  WHERE customer_id = NEW.customer_id
    AND status IN ('active', 'trialing')
    AND id != COALESCE(NEW.id, '')
    AND deleted_at IS NULL;

  -- If conflicts exist, mark older ones as replaced
  IF conflict_count > 0 THEN
    -- Log the cleanup action
    INSERT INTO subscription_cleanup_log (
      customer_id,
      old_subscription_id,
      new_subscription_id,
      action,
      reason
    )
    SELECT 
      customer_id,
      subscription_id,
      NEW.subscription_id,
      'auto_replaced',
      'New subscription created, replacing older one'
    FROM stripe_subscriptions
    WHERE customer_id = NEW.customer_id
      AND status IN ('active', 'trialing')
      AND id != COALESCE(NEW.id, '')
      AND deleted_at IS NULL;

    -- Mark conflicting subscriptions as canceled
    UPDATE stripe_subscriptions
    SET 
      status = 'canceled',
      updated_at = now()
    WHERE customer_id = NEW.customer_id
      AND status IN ('active', 'trialing')
      AND id != COALESCE(NEW.id, '')
      AND deleted_at IS NULL;

    RAISE NOTICE 'Automatically canceled % conflicting subscriptions for customer %', 
      conflict_count, NEW.customer_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
DROP TRIGGER IF EXISTS prevent_multiple_active_subscriptions_trigger ON stripe_subscriptions;
CREATE TRIGGER prevent_multiple_active_subscriptions_trigger
  BEFORE INSERT OR UPDATE ON stripe_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION handle_subscription_conflict();

-- Clean up any existing duplicate subscriptions
DO $$
DECLARE
  customer_record RECORD;
  subscription_record RECORD;
  keep_subscription_id text;
  cleanup_count integer := 0;
BEGIN
  -- Find customers with multiple active subscriptions
  FOR customer_record IN
    SELECT customer_id, COUNT(*) as sub_count
    FROM stripe_subscriptions
    WHERE status IN ('active', 'trialing')
      AND deleted_at IS NULL
    GROUP BY customer_id
    HAVING COUNT(*) > 1
  LOOP
    RAISE NOTICE 'Found customer % with % active subscriptions', 
      customer_record.customer_id, customer_record.sub_count;

    -- Get the subscription to keep (most recent active, or most recent trialing)
    SELECT subscription_id INTO keep_subscription_id
    FROM stripe_subscriptions
    WHERE customer_id = customer_record.customer_id
      AND status IN ('active', 'trialing')
      AND deleted_at IS NULL
    ORDER BY 
      CASE status
        WHEN 'active' THEN 1
        WHEN 'trialing' THEN 2
        ELSE 3
      END,
      updated_at DESC
    LIMIT 1;

    -- Log and cancel the duplicates
    FOR subscription_record IN
      SELECT *
      FROM stripe_subscriptions
      WHERE customer_id = customer_record.customer_id
        AND status IN ('active', 'trialing')
        AND subscription_id != keep_subscription_id
        AND deleted_at IS NULL
    LOOP
      -- Log the cleanup
      INSERT INTO subscription_cleanup_log (
        customer_id,
        old_subscription_id,
        new_subscription_id,
        action,
        reason
      ) VALUES (
        customer_record.customer_id,
        subscription_record.subscription_id,
        keep_subscription_id,
        'migration_cleanup',
        'Removed duplicate subscription during migration'
      );

      -- Mark as canceled
      UPDATE stripe_subscriptions
      SET 
        status = 'canceled',
        updated_at = now()
      WHERE id = subscription_record.id;

      cleanup_count := cleanup_count + 1;
      
      RAISE NOTICE 'Canceled duplicate subscription % for customer %', 
        subscription_record.subscription_id, customer_record.customer_id;
    END LOOP;
  END LOOP;

  RAISE NOTICE 'Migration cleanup complete. Canceled % duplicate subscriptions', cleanup_count;
END $$;

-- Create a view for easier subscription management
CREATE OR REPLACE VIEW active_user_subscriptions AS
SELECT 
  sc.user_id,
  ss.customer_id,
  ss.subscription_id,
  ss.price_id,
  ss.status,
  ss.current_period_start,
  ss.current_period_end,
  ss.cancel_at_period_end,
  ss.payment_method_brand,
  ss.payment_method_last4,
  ss.created_at,
  ss.updated_at
FROM stripe_customers sc
JOIN stripe_subscriptions ss ON sc.customer_id = ss.customer_id
WHERE ss.status IN ('active', 'trialing', 'past_due')
  AND ss.deleted_at IS NULL
  AND sc.deleted_at IS NULL;

-- Grant access to the view
GRANT SELECT ON active_user_subscriptions TO authenticated;
GRANT SELECT ON active_user_subscriptions TO anon;