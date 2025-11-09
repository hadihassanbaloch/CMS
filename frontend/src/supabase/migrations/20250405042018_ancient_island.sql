/*
  # Add consultation notes and patient history

  1. New Tables
    - `consultation_notes`
      - `id` (uuid, primary key)
      - `appointment_id` (uuid, references appointments)
      - `notes` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `created_by` (uuid, references admin_users)

  2. Security
    - Enable RLS
    - Add policies for admin access
*/

CREATE TABLE consultation_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id uuid REFERENCES appointments(id) NOT NULL,
  notes text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES admin_users(id) NOT NULL
);

-- Enable RLS
ALTER TABLE consultation_notes ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access
CREATE POLICY "Admins can manage consultation notes"
ON consultation_notes
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

-- Create updated_at trigger
CREATE TRIGGER consultation_notes_updated_at
  BEFORE UPDATE ON consultation_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();