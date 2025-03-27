/*
  # Create partner transactions table and sample data

  1. New Tables
    - `partner_transactions`
      - Transaction records for partners
      - Includes amount and commission tracking
    
  2. Changes
    - Create partner transactions table
    - Add RLS policies
    - Insert sample data with proper foreign key handling

  3. Security
    - Enable RLS
    - Add policies for partner access
*/

-- First ensure the partner profile exists
INSERT INTO profiles (
  id,
  role,
  email,
  full_name,
  avatar_url,
  created_at,
  updated_at
)
VALUES (
  'e8cf9d2a-fb1c-4f3b-a270-9b72f15f9e02',
  'partner',
  'partner@demo.com',
  'Luigi Bianchi',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
  now(),
  now()
)
ON CONFLICT (id) DO UPDATE
SET
  role = 'partner',
  email = 'partner@demo.com',
  full_name = 'Luigi Bianchi',
  avatar_url = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e';

-- Then ensure the partner profile exists
INSERT INTO partner_profiles (
  id,
  company_name,
  vat_number,
  business_type,
  commission_rate,
  total_transactions,
  rating
)
VALUES (
  'e8cf9d2a-fb1c-4f3b-a270-9b72f15f9e02',
  'FinTech Solutions',
  'IT12345678901',
  'Financial Services',
  2.5,
  0,
  4.8
)
ON CONFLICT (id) DO UPDATE
SET
  company_name = 'FinTech Solutions',
  vat_number = 'IT12345678901',
  business_type = 'Financial Services',
  commission_rate = 2.5,
  rating = 4.8;

-- Create partner transactions table
CREATE TABLE IF NOT EXISTS partner_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid REFERENCES partner_profiles(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  commission_amount numeric NOT NULL,
  store_id uuid REFERENCES stores(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
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