-- First, drop all existing policies
DROP POLICY IF EXISTS "Allow first admin" ON admin_users;
DROP POLICY IF EXISTS "Allow admin read" ON admin_users;
DROP POLICY IF EXISTS "Allow admin write" ON admin_users;
DROP POLICY IF EXISTS "Allow admin update" ON admin_users;
DROP POLICY IF EXISTS "Allow admin delete" ON admin_users;

-- Create a single, simple policy for the first admin
CREATE POLICY "bootstrap_admin"
ON admin_users
FOR INSERT
TO authenticated
WITH CHECK (
  NOT EXISTS (SELECT 1 FROM admin_users)
);

-- Create a single, simple policy for admin access
CREATE POLICY "admin_access"
ON admin_users
FOR ALL
TO authenticated
USING (auth.uid() IN (SELECT user_id FROM admin_users))
WITH CHECK (auth.uid() IN (SELECT user_id FROM admin_users));

-- Ensure RLS is enabled
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Reset the admin_users table to start fresh
TRUNCATE admin_users;