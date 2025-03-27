/*
  # Create user profiles tables

  1. New Tables
    - `profiles` (base table with common fields)
    - `customer_profiles` (specific fields for customers)
    - `partner_profiles` (specific fields for partners)
    - `store_profiles` (specific fields for store owners)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create profiles table with common fields
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('customer', 'partner', 'store')),
  email text NOT NULL,
  full_name text,
  avatar_url text,
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create customer profiles table
CREATE TABLE IF NOT EXISTS customer_profiles (
  id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  shipping_address text,
  billing_address text,
  preferred_payment_method text,
  total_purchases numeric DEFAULT 0,
  loyalty_points integer DEFAULT 0
);

-- Create partner profiles table
CREATE TABLE IF NOT EXISTS partner_profiles (
  id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  company_name text,
  vat_number text,
  business_type text,
  commission_rate numeric DEFAULT 2.5,
  total_transactions numeric DEFAULT 0,
  rating numeric DEFAULT 0 CHECK (rating >= 0 AND rating <= 5)
);

-- Create store profiles table
CREATE TABLE IF NOT EXISTS store_profiles (
  id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  store_name text NOT NULL,
  store_type text,
  vat_number text,
  business_address text,
  opening_hours jsonb,
  website text,
  social_media jsonb
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Repeat similar policies for other profile tables
CREATE POLICY "Customers can view their own profile"
  ON customer_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Partners can view their own profile"
  ON partner_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Store owners can view their own profile"
  ON store_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Create trigger for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert demo users
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at)
VALUES 
  ('d7bed83c-44a0-4a4f-8947-1aa6f19bd901', 'cliente@demo.com', '$2a$10$AbCdEfGhIjKlMnOpQrStUv1234567890', now()),
  ('e8cf9d2a-fb1c-4f3b-a270-9b72f15f9e02', 'partner@demo.com', '$2a$10$AbCdEfGhIjKlMnOpQrStUv1234567890', now()),
  ('f9de0b4c-6e2d-4a5f-bc38-8c93f6a7df03', 'negozio@demo.com', '$2a$10$AbCdEfGhIjKlMnOpQrStUv1234567890', now());

-- Insert demo profiles
INSERT INTO profiles (id, role, email, full_name, avatar_url)
VALUES
  ('d7bed83c-44a0-4a4f-8947-1aa6f19bd901', 'customer', 'cliente@demo.com', 'Marco Rossi', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde'),
  ('e8cf9d2a-fb1c-4f3b-a270-9b72f15f9e02', 'partner', 'partner@demo.com', 'Luigi Bianchi', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e'),
  ('f9de0b4c-6e2d-4a5f-bc38-8c93f6a7df03', 'store', 'negozio@demo.com', 'Giuseppe Verdi', 'https://images.unsplash.com/photo-1560250097-0b93528c311a');

-- Insert demo customer profile
INSERT INTO customer_profiles (id, shipping_address, billing_address, preferred_payment_method, total_purchases, loyalty_points)
VALUES
  ('d7bed83c-44a0-4a4f-8947-1aa6f19bd901', 'Via Roma 123, Milano', 'Via Roma 123, Milano', 'credit_card', 1500.00, 150);

-- Insert demo partner profile
INSERT INTO partner_profiles (id, company_name, vat_number, business_type, commission_rate, total_transactions, rating)
VALUES
  ('e8cf9d2a-fb1c-4f3b-a270-9b72f15f9e02', 'FinTech Solutions', 'IT12345678901', 'Financial Services', 2.5, 50000.00, 4.8);

-- Insert demo store profile
INSERT INTO store_profiles (id, store_name, store_type, vat_number, business_address, opening_hours, website, social_media)
VALUES
  ('f9de0b4c-6e2d-4a5f-bc38-8c93f6a7df03', 'Style Hub', 'Abbigliamento', 'IT98765432109', 'Corso Buenos Aires 456, Milano',
  '{"monday": "9:00-20:00", "tuesday": "9:00-20:00", "wednesday": "9:00-20:00", "thursday": "9:00-20:00", "friday": "9:00-20:00", "saturday": "9:00-20:00", "sunday": "closed"}',
  'https://stylehub.com',
  '{"instagram": "@stylehub", "facebook": "StyleHubOfficial"}');