-- First, drop all existing policies
DROP POLICY IF EXISTS "bootstrap_admin" ON admin_users;
DROP POLICY IF EXISTS "admin_read" ON admin_users;
DROP POLICY IF EXISTS "admin_insert" ON admin_users;
DROP POLICY IF EXISTS "admin_update" ON admin_users;
DROP POLICY IF EXISTS "admin_delete" ON admin_users;

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create a single policy for initial admin creation
CREATE POLICY "allow_first_admin"
ON admin_users
FOR INSERT
TO authenticated
WITH CHECK (
  NOT EXISTS (
    SELECT 1 FROM admin_users
  )
);

-- Create a single policy for admin access
CREATE POLICY "admin_access"
ON admin_users
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users a
    WHERE a.user_id = auth.uid()
  )
);

-- Reset the admin_users table to start fresh
TRUNCATE admin_users;