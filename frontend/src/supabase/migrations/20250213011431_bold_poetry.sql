/*
  # Add email notifications table

  1. New Tables
    - `email_notifications`
      - `id` (uuid, primary key)
      - `type` (text) - Type of notification (e.g., 'new_appointment')
      - `recipient` (text) - Email recipient
      - `data` (jsonb) - Notification data
      - `status` (text) - Processing status
      - `created_at` (timestamp)
      - `processed_at` (timestamp)

  2. Security
    - Enable RLS on `email_notifications` table
    - Add policy for authenticated users to create notifications
*/

CREATE TABLE email_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  recipient text NOT NULL,
  data jsonb NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  processed_at timestamptz,
  CONSTRAINT valid_status CHECK (status IN ('pending', 'sent', 'failed'))
);

-- Enable RLS
ALTER TABLE email_notifications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow insert email notifications"
ON email_notifications
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow read email notifications"
ON email_notifications
FOR SELECT
TO authenticated
USING (true);