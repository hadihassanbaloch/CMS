-- Remove password-related columns from admin_users
ALTER TABLE admin_users 
DROP COLUMN IF EXISTS password_hash,
DROP COLUMN IF EXISTS last_password_change,
DROP COLUMN IF EXISTS password_reset_required;

-- Drop the password constraint if it exists
DO $$ 
BEGIN
  ALTER TABLE admin_users 
  DROP CONSTRAINT IF EXISTS password_hash_not_empty;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Ensure we have the correct columns
ALTER TABLE admin_users 
ADD COLUMN IF NOT EXISTS name text,
ADD COLUMN IF NOT EXISTS email text,
ADD COLUMN IF NOT EXISTS last_login timestamptz,
ADD COLUMN IF NOT EXISTS status text DEFAULT 'active';

-- Add status check constraint if it doesn't exist
DO $$ 
BEGIN
  ALTER TABLE admin_users 
  ADD CONSTRAINT valid_status_check 
  CHECK (status IN ('active', 'inactive'));
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;