-- First, drop all existing policies
DROP POLICY IF EXISTS "allow_initial_admin" ON admin_users;
DROP POLICY IF EXISTS "allow_admin_operations" ON admin_users;
DROP POLICY IF EXISTS "enable_all_access" ON admin_users;

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to insert if no admin exists
CREATE POLICY "bootstrap_admin"
ON admin_users
FOR INSERT
TO authenticated
WITH CHECK (
  NOT EXISTS (
    SELECT 1 FROM admin_users
    WHERE TRUE
  )
);

-- Create a policy that allows admins to read all records
CREATE POLICY "admin_read"
ON admin_users
FOR SELECT
TO authenticated
USING (
  auth.uid() IN (
    SELECT user_id FROM admin_users
  )
);

-- Create a policy that allows admins to insert new records
CREATE POLICY "admin_insert"
ON admin_users
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IN (
    SELECT user_id FROM admin_users
  )
);

-- Create a policy that allows admins to update records
CREATE POLICY "admin_update"
ON admin_users
FOR UPDATE
TO authenticated
USING (
  auth.uid() IN (
    SELECT user_id FROM admin_users
  )
)
WITH CHECK (
  auth.uid() IN (
    SELECT user_id FROM admin_users
  )
);

-- Create a policy that allows admins to delete records
CREATE POLICY "admin_delete"
ON admin_users
FOR DELETE
TO authenticated
USING (
  auth.uid() IN (
    SELECT user_id FROM admin_users
  )
);