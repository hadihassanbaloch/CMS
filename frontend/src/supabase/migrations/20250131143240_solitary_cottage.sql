-- First, drop all existing policies
DROP POLICY IF EXISTS "bootstrap_admin" ON admin_users;
DROP POLICY IF EXISTS "admin_access" ON admin_users;

-- Create a simple enable-all policy for authenticated users
CREATE POLICY "authenticated_access"
ON admin_users
FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);

-- Ensure RLS is enabled
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Reset the admin_users table to start fresh
TRUNCATE admin_users;