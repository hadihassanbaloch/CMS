/*
  # Update appointments RLS policy

  1. Changes
    - Drop existing policy for public users
    - Create new policy allowing public users to create appointments
    - Add policy for reading appointments
  
  2. Security
    - Maintains RLS protection while allowing necessary access
    - Ensures public users can only create appointments
    - Ensures only admin users can read appointments
*/

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Public users can create appointments" ON appointments;

-- Create new policy for public appointment creation
CREATE POLICY "Allow public appointment creation"
ON appointments
FOR INSERT
TO public
WITH CHECK (true);

-- Create policy for reading appointments
CREATE POLICY "Allow admin to read appointments"
ON appointments
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE user_id = auth.uid()
  )
);