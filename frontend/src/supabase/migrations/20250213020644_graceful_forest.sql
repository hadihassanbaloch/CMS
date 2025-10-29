-- Drop existing policies
DROP POLICY IF EXISTS "Allow public appointment creation" ON appointments;
DROP POLICY IF EXISTS "Allow admin to read appointments" ON appointments;

-- Create storage bucket for payment proofs if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM storage.buckets WHERE id = 'payment-proofs'
  ) THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('payment-proofs', 'payment-proofs', true);
  END IF;
END $$;

-- Update storage policies for payment proofs
DROP POLICY IF EXISTS "Allow authenticated users to upload payment proofs" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to read payment proofs" ON storage.objects;

-- Allow anyone to upload payment proofs
CREATE POLICY "Allow public to upload payment proofs"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (
  bucket_id = 'payment-proofs'
);

-- Allow anyone to read payment proofs
CREATE POLICY "Allow public to read payment proofs"
ON storage.objects
FOR SELECT
TO public
USING (
  bucket_id = 'payment-proofs'
);

-- Create new appointment policies
CREATE POLICY "Allow public to create appointments"
ON appointments
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Allow public to read their own appointments"
ON appointments
FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow admins to manage appointments"
ON appointments
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