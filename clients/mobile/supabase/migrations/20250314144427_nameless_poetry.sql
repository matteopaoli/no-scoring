/*
  # Create Partner Transactions Table and Related Fields

  1. New Tables
    - `partner_transactions`
      - `id` (uuid, primary key)
      - `partner_id` (uuid, references partner_profiles)
      - `amount` (numeric, transaction amount)
      - `commission_amount` (numeric, commission earned)
      - `store_id` (uuid, references stores)
      - `created_at` (timestamp with timezone)

  2. Security
    - Enable RLS
    - Add policy for partners to view their own transactions
*/

-- Create partner transactions table
CREATE TABLE IF NOT EXISTS partner_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL,
  amount numeric NOT NULL,
  commission_amount numeric NOT NULL,
  store_id uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  FOREIGN KEY (partner_id) REFERENCES profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE partner_transactions ENABLE ROW LEVEL SECURITY;

-- Create policy for partners to view their transactions
CREATE POLICY "Partners can view their own transactions"
  ON partner_transactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = partner_id);

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