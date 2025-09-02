/*
  # Add payment issue tracking to subscriptions

  1. Schema Changes
    - Add `payment_issue_since` column to track when payment issues started
    - Add `grace_period_end` column to track when grace period expires
  
  2. Updates
    - Update existing past_due subscriptions to set payment issue tracking
  
  3. Security
    - No RLS changes needed (existing policies cover new columns)
*/

-- Add payment issue tracking columns
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'stripe_subscriptions' AND column_name = 'payment_issue_since'
  ) THEN
    ALTER TABLE stripe_subscriptions ADD COLUMN payment_issue_since timestamptz;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'stripe_subscriptions' AND column_name = 'grace_period_end'
  ) THEN
    ALTER TABLE stripe_subscriptions ADD COLUMN grace_period_end timestamptz;
  END IF;
END $$;

-- Update existing past_due subscriptions to set payment issue tracking
UPDATE stripe_subscriptions 
SET 
  payment_issue_since = updated_at,
  grace_period_end = updated_at + INTERVAL '30 days'
WHERE 
  status = 'past_due' 
  AND payment_issue_since IS NULL;

-- Create function to automatically set grace period when payment fails
CREATE OR REPLACE FUNCTION set_payment_issue_tracking()
RETURNS TRIGGER AS $$
BEGIN
  -- If status changed to past_due and payment_issue_since is not set
  IF NEW.status = 'past_due' AND OLD.status != 'past_due' AND NEW.payment_issue_since IS NULL THEN
    NEW.payment_issue_since = NOW();
    NEW.grace_period_end = NOW() + INTERVAL '30 days';
  END IF;
  
  -- If status changed from past_due to active, clear payment issue tracking
  IF NEW.status = 'active' AND OLD.status = 'past_due' THEN
    NEW.payment_issue_since = NULL;
    NEW.grace_period_end = NULL;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically manage payment issue tracking
DROP TRIGGER IF EXISTS payment_issue_tracking_trigger ON stripe_subscriptions;
CREATE TRIGGER payment_issue_tracking_trigger
  BEFORE UPDATE ON stripe_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION set_payment_issue_tracking();