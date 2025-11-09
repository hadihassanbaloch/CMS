-- First, ensure we have the correct table structure
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  role text DEFAULT 'admin',
  name text,
  email text,
  last_login timestamptz DEFAULT now(),
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_role CHECK (role IN ('admin', 'staff')),
  CONSTRAINT valid_status CHECK (status IN ('active', 'inactive'))
);

-- Drop all existing policies
DROP POLICY IF EXISTS "enable_all_access" ON admin_users;
DROP POLICY IF EXISTS "allow_admin_read" ON admin_users;
DROP POLICY IF EXISTS "allow_admin_write" ON admin_users;
DROP POLICY IF EXISTS "allow_admin_update" ON admin_users;
DROP POLICY IF EXISTS "allow_admin_delete" ON admin_users;

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create a simple policy for the first admin
CREATE POLICY "allow_initial_admin"
ON admin_users
FOR INSERT
TO authenticated
WITH CHECK (
  NOT EXISTS (
    SELECT 1 FROM admin_users
  )
);

-- Create a policy for admin operations
CREATE POLICY "allow_admin_operations"
ON admin_users
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users WHERE user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM admin_users WHERE user_id = auth.uid()
  )
);