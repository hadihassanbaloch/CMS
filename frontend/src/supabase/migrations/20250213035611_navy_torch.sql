-- First, drop all existing policies
DROP POLICY IF EXISTS "allow_first_admin" ON admin_users;
DROP POLICY IF EXISTS "admin_access" ON admin_users;

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create a single policy for all operations
CREATE POLICY "admin_policy"
ON admin_users
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Reset the admin_users table to start fresh
TRUNCATE admin_users;