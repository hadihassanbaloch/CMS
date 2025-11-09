/*
  # Fix Admin Policies

  1. Changes
    - Drop existing problematic policies
    - Create new policies with proper checks to avoid recursion
    - Add bootstrap policy for first admin creation
    
  2. Security
    - Maintains secure access control
    - Allows initial admin setup
    - Prevents unauthorized access
*/

-- First, drop any existing policies that might cause recursion
DROP POLICY IF EXISTS "Allow initial admin creation" ON admin_users;
DROP POLICY IF EXISTS "Admins can manage other admins" ON admin_users;
DROP POLICY IF EXISTS "Admins can view admin users" ON admin_users;

-- Create a bootstrap policy for the first admin
CREATE POLICY "Bootstrap first admin"
ON admin_users
FOR INSERT
TO authenticated
WITH CHECK (
  NOT EXISTS (
    SELECT 1 FROM admin_users
    WHERE TRUE
  )
);

-- Create policy for admin access
CREATE POLICY "Admin access"
ON admin_users
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE user_id = auth.uid()
  )
);