/*
  # Add clinics management

  1. New Tables
    - `clinics`
      - `id` (uuid, primary key)
      - `name` (text)
      - `address` (text)
      - `phone` (text)
      - `schedule` (jsonb) - Weekly schedule
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `status` (text) - active/inactive

  2. Changes
    - Add clinic_id to appointments table
    - Add RLS policies for clinic management

  3. Security
    - Enable RLS
    - Add policies for admin access
*/

-- Create clinics table
CREATE TABLE clinics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  phone text,
  schedule jsonb NOT NULL DEFAULT '{
    "monday": {"open": "09:00", "close": "17:00"},
    "tuesday": {"open": "09:00", "close": "17:00"},
    "wednesday": {"open": "09:00", "close": "17:00"},
    "thursday": {"open": "09:00", "close": "17:00"},
    "friday": {"open": "09:00", "close": "17:00"},
    "saturday": null,
    "sunday": null
  }'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  status text NOT NULL DEFAULT 'active',
  CONSTRAINT valid_status CHECK (status IN ('active', 'inactive'))
);

-- Add clinic_id to appointments
ALTER TABLE appointments
ADD COLUMN clinic_id uuid REFERENCES clinics(id);

-- Enable RLS
ALTER TABLE clinics ENABLE ROW LEVEL SECURITY;

-- Create policies for clinic management
CREATE POLICY "Admins can manage clinics"
ON clinics
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE user_id = auth.uid()
  )
);

-- Create policy for public to view active clinics
CREATE POLICY "Public can view active clinics"
ON clinics
FOR SELECT
TO public
USING (status = 'active');

-- Create updated_at trigger
CREATE TRIGGER clinics_updated_at
  BEFORE UPDATE ON clinics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();