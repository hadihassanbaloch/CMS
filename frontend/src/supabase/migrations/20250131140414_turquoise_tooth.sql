/*
  # Add password field to admin_users table

  1. Changes
    - Add password field to admin_users table
    - Add password hash validation check
    - Add last_password_change timestamp
  
  2. Security
    - Password field is required and must be hashed
    - Track password change history
*/

-- Add password-related columns
ALTER TABLE admin_users 
ADD COLUMN IF NOT EXISTS password_hash text NOT NULL,
ADD COLUMN IF NOT EXISTS last_password_change timestamptz DEFAULT now(),
ADD COLUMN IF NOT EXISTS password_reset_required boolean DEFAULT true;

-- Add constraint to ensure password_hash is not empty
ALTER TABLE admin_users 
ADD CONSTRAINT password_hash_not_empty 
CHECK (password_hash != '');