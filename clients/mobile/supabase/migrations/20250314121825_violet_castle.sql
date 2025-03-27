/*
  # Create stores and store owners tables

  1. New Tables
    - `stores`
      - `id` (uuid, primary key)
      - `name` (text, store name)
      - `category` (text, store category)
      - `rating` (numeric, store rating)
      - `latitude` (numeric, store location)
      - `longitude` (numeric, store location)
      - `image_url` (text, store image)
      - `created_at` (timestamp with timezone)
      - `updated_at` (timestamp with timezone)
    
    - `store_owners`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `store_id` (uuid, references stores)
      - `created_at` (timestamp with timezone)

  2. Security
    - Enable RLS on both tables
    - Add policies for:
      - Public read access to stores
      - Authenticated store owners can update their stores
*/

-- Create stores table
CREATE TABLE IF NOT EXISTS stores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  rating numeric DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create store_owners table
CREATE TABLE IF NOT EXISTS store_owners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  store_id uuid NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, store_id)
);

-- Enable RLS
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_owners ENABLE ROW LEVEL SECURITY;

-- Create policies for stores
CREATE POLICY "Stores are viewable by everyone"
  ON stores
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Store owners can update their own stores"
  ON stores
  FOR UPDATE
  TO authenticated
  USING (auth.uid() IN (
    SELECT user_id 
    FROM store_owners 
    WHERE store_id = id
  ));

-- Create policies for store_owners
CREATE POLICY "Store owners can view their own relationships"
  ON store_owners
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_stores_updated_at
  BEFORE UPDATE
  ON stores
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO stores (name, category, rating, latitude, longitude, image_url) VALUES
  ('Style Hub', 'Abbigliamento', 4.8, 45.4642, 9.1900, 'https://images.unsplash.com/photo-1441986300917-64674bd600d8'),
  ('Time Elegance', 'Orologeria', 4.9, 45.4646, 9.1904, 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49'),
  ('Fast Repair', 'Automotive', 4.7, 45.4639, 9.1895, 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3');