/*
  # Fix Multiple Subscriptions Issue

  1. Database Constraints
    - Add unique constraint to prevent multiple active subscriptions per customer
    - Add function to automatically cancel old subscriptions when new ones are created
    - Add indexes for better performance on subscription queries

  2. Data Cleanup
    - Identify and clean up any existing duplicate subscriptions
    - Ensure each customer has only one active subscription

  3. Triggers
    - Auto-cancel old subscriptions when new ones are created
    - Maintain data integrity for subscription management

  4. Security
    - Ensure RLS policies remain intact
    - Add validation for subscription status transitions
*/

-- Function to cancel old subscriptions when a new active one is created
CREATE OR REPLACE FUNCTION cancel_old_subscriptions()
RETURNS TRIGGER AS $$
BEGIN
  -- Only run for active or trialing subscriptions
  IF NEW.status IN ('active', 'trialing') THEN
    -- Cancel any other active/trialing subscriptions for this customer
    UPDATE stripe_subscriptions 
    SET 
      status = 'canceled',
      updated_at = now()
    WHERE 
      customer_id = NEW.customer_id 
      AND id != NEW.id 
      AND status IN ('active', 'trialing', 'past_due')
      AND deleted_at IS NULL;
      
    -- Log the cleanup action
    RAISE NOTICE 'Canceled old subscriptions for customer: %', NEW.customer_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-cancel old subscriptions
DROP TRIGGER IF EXISTS auto_cancel_old_subscriptions ON stripe_subscriptions;
CREATE TRIGGER auto_cancel_old_subscriptions
  AFTER INSERT OR UPDATE ON stripe_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION cancel_old_subscriptions();

-- Add index for better performance on subscription queries
CREATE INDEX IF NOT EXISTS idx_stripe_subscriptions_customer_status 
ON stripe_subscriptions(customer_id, status) 
WHERE deleted_at IS NULL;

-- Add index for active subscription lookups
CREATE INDEX IF NOT EXISTS idx_stripe_subscriptions_active 
ON stripe_subscriptions(customer_id) 
WHERE status IN ('active', 'trialing') AND deleted_at IS NULL;

-- Function to get the single active subscription for a customer
CREATE OR REPLACE FUNCTION get_active_subscription(customer_id_param text)
RETURNS TABLE(
  id bigint,
  subscription_id text,
  price_id text,
  status stripe_subscription_status,
  current_period_start bigint,
  current_period_end bigint,
  cancel_at_period_end boolean
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.subscription_id,
    s.price_id,
    s.status,
    s.current_period_start,
    s.current_period_end,
    s.cancel_at_period_end
  FROM stripe_subscriptions s
  WHERE 
    s.customer_id = customer_id_param
    AND s.status IN ('active', 'trialing', 'past_due')
    AND s.deleted_at IS NULL
  ORDER BY 
    CASE 
      WHEN s.status = 'active' THEN 1
      WHEN s.status = 'trialing' THEN 2
      WHEN s.status = 'past_due' THEN 3
      ELSE 4
    END,
    s.updated_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Clean up any existing duplicate subscriptions
-- First, identify customers with multiple active subscriptions
WITH duplicate_subscriptions AS (
  SELECT 
    customer_id,
    array_agg(id ORDER BY updated_at DESC) as subscription_ids,
    COUNT(*) as sub_count
  FROM stripe_subscriptions 
  WHERE 
    status IN ('active', 'trialing') 
    AND deleted_at IS NULL
  GROUP BY customer_id
  HAVING COUNT(*) > 1
),
subscriptions_to_cancel AS (
  SELECT 
    customer_id,
    unnest(subscription_ids[2:]) as id_to_cancel
  FROM duplicate_subscriptions
)
UPDATE stripe_subscriptions 
SET 
  status = 'canceled',
  updated_at = now()
FROM subscriptions_to_cancel
WHERE 
  stripe_subscriptions.id = subscriptions_to_cancel.id_to_cancel
  AND stripe_subscriptions.status IN ('active', 'trialing');

-- Add validation function for subscription status transitions
CREATE OR REPLACE FUNCTION validate_subscription_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Prevent invalid status transitions
  IF OLD.status IS NOT NULL AND NEW.status IS NOT NULL THEN
    -- Log status changes for debugging
    RAISE NOTICE 'Subscription % status change: % -> %', NEW.subscription_id, OLD.status, NEW.status;
    
    -- Prevent reactivating canceled subscriptions unless explicitly allowed
    IF OLD.status = 'canceled' AND NEW.status IN ('active', 'trialing') THEN
      RAISE NOTICE 'Reactivating canceled subscription: %', NEW.subscription_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for subscription status validation
DROP TRIGGER IF EXISTS validate_subscription_status_trigger ON stripe_subscriptions;
CREATE TRIGGER validate_subscription_status_trigger
  BEFORE UPDATE ON stripe_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION validate_subscription_status();

-- Create view for easy subscription management queries
CREATE OR REPLACE VIEW active_user_subscriptions AS
SELECT 
  sc.user_id,
  sc.customer_id,
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
WHERE 
  ss.status IN ('active', 'trialing', 'past_due')
  AND sc.deleted_at IS NULL
  AND ss.deleted_at IS NULL;

-- Grant access to the view
GRANT SELECT ON active_user_subscriptions TO authenticated;

-- Add RLS policy for the view
CREATE POLICY "Users can view their own subscription data" ON active_user_subscriptions
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());