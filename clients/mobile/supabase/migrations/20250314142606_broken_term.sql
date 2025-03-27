/*
  # Fix authentication setup

  1. Changes
    - Reset and properly set up demo user accounts with correct passwords
*/

-- First, delete existing demo users to avoid conflicts
DELETE FROM auth.users 
WHERE email IN ('cliente@demo.com', 'partner@demo.com', 'negozio@demo.com');

-- Create new demo users with proper password hashing
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
) VALUES 
(
  'd7bed83c-44a0-4a4f-8947-1aa6f19bd901',
  'cliente@demo.com',
  crypt('1234', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  false,
  'authenticated'
),
(
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
),
(
  'f9de0b4c-6e2d-4a5f-bc38-8c93f6a7df03',
  'negozio@demo.com',
  crypt('1234', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  false,
  'authenticated'
);