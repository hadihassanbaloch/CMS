/*
  # Admin Access Policies Update
  
  1. Changes
    - Update RLS policies for admin users
    - Add admin management policies for appointments
  
  2. Security
    - Enhance access control for admin users
    - Add comprehensive appointment management policies
*/

-- Update admin_users policies
DROP POLICY IF EXISTS "Admins can view admin users" ON admin_users;

CREATE POLICY "Admins can view admin users"
ON admin_users
FOR SELECT
TO authenticated
USING (
  auth.uid() IN (
    SELECT user_id FROM admin_users
  )
);

-- Add comprehensive policy for admin operations on appointments
DROP POLICY IF EXISTS "Admins can manage appointments" ON appointments;

CREATE POLICY "Admins can manage appointments"
ON appointments
FOR ALL
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

-- Ensure RLS is enabled
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;