/*
  # Fix profile constraints and data insertion

  1. Changes
    - Ensure proper order of data insertion
    - Create missing profiles
    - Update existing data

  2. Security
    - Maintain existing RLS policies
*/

-- First ensure the base profile exists
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

-- Ensure the auth user exists with proper email confirmation
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
)
VALUES (
  'e8cf9d2a-fb1c-4f3b-a270-9b72f15f9e02',
  'partner@demo.com',
  crypt('1234', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  false,
  'authenticated'
)
ON CONFLICT (id) DO UPDATE
SET
  email = 'partner@demo.com',
  encrypted_password = crypt('1234', gen_salt('bf')),
  email_confirmed_at = now(),
  updated_at = now();