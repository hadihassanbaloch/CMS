/*
  # Update admin_users table structure

  1. Changes
    - Add name column
    - Add email column
    - Add last_login column
    - Add status column
  
  2. Security
    - Maintain existing RLS policies
*/

-- Add new columns to admin_users table
ALTER TABLE admin_users 
ADD COLUMN IF NOT EXISTS name text,
ADD COLUMN IF NOT EXISTS email text,
ADD COLUMN IF NOT EXISTS last_login timestamptz,
ADD COLUMN IF NOT EXISTS status text DEFAULT 'active' CHECK (status IN ('active', 'inactive'));

-- Update existing records with default values
UPDATE admin_users 
SET 
  status = 'active',
  last_login = now()
WHERE status IS NULL;