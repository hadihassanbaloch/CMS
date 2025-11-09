-- Drop existing policies to start fresh
DROP POLICY IF EXISTS "Bootstrap first admin" ON admin_users;
DROP POLICY IF EXISTS "Admin access" ON admin_users;

-- Create a simple policy for the first admin
CREATE POLICY "Allow first admin"
ON admin_users
FOR INSERT
TO authenticated
WITH CHECK (
  NOT EXISTS (
    SELECT 1 FROM admin_users
  )
);

-- Create a simple read policy
CREATE POLICY "Allow admin read"
ON admin_users
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users a
    WHERE a.user_id = auth.uid()
  )
);

-- Create a simple write policy
CREATE POLICY "Allow admin write"
ON admin_users
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM admin_users a
    WHERE a.user_id = auth.uid()
  )
);

-- Create a simple update policy
CREATE POLICY "Allow admin update"
ON admin_users
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users a
    WHERE a.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM admin_users a
    WHERE a.user_id = auth.uid()
  )
);

-- Create a simple delete policy
CREATE POLICY "Allow admin delete"
ON admin_users
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users a
    WHERE a.user_id = auth.uid()
  )
);