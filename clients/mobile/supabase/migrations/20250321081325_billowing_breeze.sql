/*
  # Add partner statistics and transactions

  1. Changes
    - Add monthly statistics columns to partner_profiles
    - Create view for monthly statistics
    - Add triggers for automatic updates
    - Add performance indexes
    
  2. Security
    - Maintain existing RLS policies
*/

-- Add missing fields to partner_profiles if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'partner_profiles' AND column_name = 'monthly_transactions'
  ) THEN
    ALTER TABLE partner_profiles 
    ADD COLUMN monthly_transactions numeric DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'partner_profiles' AND column_name = 'monthly_commissions'
  ) THEN
    ALTER TABLE partner_profiles 
    ADD COLUMN monthly_commissions numeric DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'partner_profiles' AND column_name = 'active_stores'
  ) THEN
    ALTER TABLE partner_profiles 
    ADD COLUMN active_stores integer DEFAULT 0;
  END IF;
END $$;

-- Create or replace view for monthly statistics
CREATE OR REPLACE VIEW partner_monthly_stats AS
WITH monthly_data AS (
  SELECT 
    partner_id,
    COUNT(*) as transaction_count,
    SUM(amount) as total_amount,
    SUM(commission_amount) as total_commission
  FROM partner_transactions
  WHERE created_at >= date_trunc('month', CURRENT_DATE)
  GROUP BY partner_id
)
SELECT 
  p.id,
  COALESCE(md.transaction_count, 0) as monthly_transactions,
  COALESCE(md.total_commission, 0) as monthly_commissions,
  (
    SELECT COUNT(DISTINCT store_id)
    FROM partner_transactions
    WHERE partner_id = p.id
    AND created_at >= date_trunc('month', CURRENT_DATE)
  ) as active_stores
FROM partner_profiles p
LEFT JOIN monthly_data md ON p.id = md.partner_id;

-- Create function to update partner statistics
CREATE OR REPLACE FUNCTION update_partner_stats()
RETURNS trigger AS $$
BEGIN
  -- Update partner profile with new statistics
  UPDATE partner_profiles
  SET 
    monthly_transactions = (
      SELECT COUNT(*)
      FROM partner_transactions
      WHERE partner_id = NEW.partner_id
      AND created_at >= date_trunc('month', CURRENT_DATE)
    ),
    monthly_commissions = (
      SELECT SUM(commission_amount)
      FROM partner_transactions
      WHERE partner_id = NEW.partner_id
      AND created_at >= date_trunc('month', CURRENT_DATE)
    ),
    active_stores = (
      SELECT COUNT(DISTINCT store_id)
      FROM partner_transactions
      WHERE partner_id = NEW.partner_id
      AND created_at >= date_trunc('month', CURRENT_DATE)
    )
  WHERE id = NEW.partner_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating partner statistics
DROP TRIGGER IF EXISTS update_partner_stats_trigger ON partner_transactions;
CREATE TRIGGER update_partner_stats_trigger
AFTER INSERT OR UPDATE OR DELETE ON partner_transactions
FOR EACH ROW EXECUTE FUNCTION update_partner_stats();

-- Create trigger for updated_at
CREATE TRIGGER update_partner_transactions_updated_at
  BEFORE UPDATE ON partner_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_partner_transactions_created_at 
ON partner_transactions(created_at);

CREATE INDEX IF NOT EXISTS idx_partner_transactions_partner_id 
ON partner_transactions(partner_id);

-- Insert sample transactions for the demo partner
WITH dates AS (
  SELECT generate_series(
    now() - interval '6 months',
    now(),
    interval '1 day'
  ) AS transaction_date
),
amounts AS (
  SELECT 
    transaction_date,
    (random() * 900 + 100)::numeric(10,2) as amount
  FROM dates
  WHERE random() < 0.7  -- 70% chance of having a transaction on any given day
)
INSERT INTO partner_transactions (
  partner_id,
  amount,
  commission_amount,
  store_id,
  created_at
)
SELECT
  'e8cf9d2a-fb1c-4f3b-a270-9b72f15f9e02' as partner_id,
  amount,
  (amount * 0.025)::numeric(10,2) as commission_amount,
  (
    SELECT id 
    FROM stores 
    ORDER BY random() 
    LIMIT 1
  ) as store_id,
  transaction_date as created_at
FROM amounts;

-- Update partner profile total transactions
UPDATE partner_profiles
SET 
  total_transactions = (
    SELECT sum(amount)
    FROM partner_transactions
    WHERE partner_id = 'e8cf9d2a-fb1c-4f3b-a270-9b72f15f9e02'
  )
WHERE id = 'e8cf9d2a-fb1c-4f3b-a270-9b72f15f9e02';