/*
  # Update admin policies

  1. Changes
    - Add policy to allow initial admin user creation
    - Add policy for admin management
  
  2. Security
    - Maintains existing RLS
    - Adds specific policy for admin creation
*/

-- Add policy to allow initial admin creation when no admins exist
CREATE POLICY "Allow initial admin creation"
ON admin_users
FOR INSERT
TO authenticated
WITH CHECK (
  NOT EXISTS (
    SELECT 1 FROM admin_users
  )
);

-- Add policy for admin management by existing admins
CREATE POLICY "Admins can manage other admins"
ON admin_users
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