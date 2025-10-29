-- Drop all policies that depend on the materialized view first
DROP POLICY IF EXISTS "allow_admin_delete" ON admin_users;
DROP POLICY IF EXISTS "allow_admin_update" ON admin_users;
DROP POLICY IF EXISTS "allow_admin_insert" ON admin_users;
DROP POLICY IF EXISTS "allow_admin_read" ON admin_users;

-- Now we can safely drop the materialized view and related objects
DROP MATERIALIZED VIEW IF EXISTS admin_permissions CASCADE;
DROP TRIGGER IF EXISTS refresh_admin_permissions_trigger ON admin_users;
DROP FUNCTION IF EXISTS refresh_admin_permissions();

-- Create simple policies for admin access
CREATE POLICY "enable_all_access"
ON admin_users
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Ensure RLS is enabled
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;