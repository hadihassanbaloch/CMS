/*
  # Fix Admin Policies with Materialized Permissions

  This migration fixes the infinite recursion issue by:
  1. Creating a materialized view for admin permissions
  2. Using this view in policies to avoid recursion
  3. Implementing simple but secure policies
*/

-- First, drop all existing policies and start fresh
DROP POLICY IF EXISTS "authenticated_access" ON admin_users;
DROP POLICY IF EXISTS "bootstrap_admin" ON admin_users;
DROP POLICY IF EXISTS "admin_access" ON admin_users;

-- Create a materialized view for admin permissions
CREATE MATERIALIZED VIEW admin_permissions AS
SELECT DISTINCT user_id
FROM admin_users;

-- Create index for better performance
CREATE UNIQUE INDEX admin_permissions_user_id_idx ON admin_permissions (user_id);

-- Create function to refresh admin permissions
CREATE OR REPLACE FUNCTION refresh_admin_permissions()
RETURNS TRIGGER AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY admin_permissions;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to refresh permissions
CREATE TRIGGER refresh_admin_permissions_trigger
AFTER INSERT OR UPDATE OR DELETE ON admin_users
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_admin_permissions();

-- Create policies using the materialized view
CREATE POLICY "allow_admin_read"
ON admin_users
FOR SELECT
TO authenticated
USING (
  auth.uid() IN (SELECT user_id FROM admin_permissions)
);

CREATE POLICY "allow_admin_insert"
ON admin_users
FOR INSERT
TO authenticated
WITH CHECK (
  -- Allow insert if no admins exist or if user is an admin
  NOT EXISTS (SELECT 1 FROM admin_permissions)
  OR
  auth.uid() IN (SELECT user_id FROM admin_permissions)
);

CREATE POLICY "allow_admin_update"
ON admin_users
FOR UPDATE
TO authenticated
USING (
  auth.uid() IN (SELECT user_id FROM admin_permissions)
)
WITH CHECK (
  auth.uid() IN (SELECT user_id FROM admin_permissions)
);

CREATE POLICY "allow_admin_delete"
ON admin_users
FOR DELETE
TO authenticated
USING (
  auth.uid() IN (SELECT user_id FROM admin_permissions)
);

-- Ensure RLS is enabled
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Initial refresh of the materialized view
REFRESH MATERIALIZED VIEW admin_permissions;