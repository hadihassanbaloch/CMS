-- Create storage bucket for payment proofs
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-proofs', 'payment-proofs', false);

-- Allow authenticated users to upload files
CREATE POLICY "Allow authenticated users to upload payment proofs"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'payment-proofs' AND
  auth.role() = 'authenticated'
);

-- Allow authenticated users to read their own files
CREATE POLICY "Allow authenticated users to read payment proofs"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'payment-proofs' AND
  auth.role() = 'authenticated'
);