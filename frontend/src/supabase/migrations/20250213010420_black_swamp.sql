/*
  # Add payment information to appointments

  1. Changes
    - Add payment_proof column to appointments table
    - Add payment_reference column to appointments table

  2. Security
    - Update RLS policies to include new columns
*/

ALTER TABLE appointments
ADD COLUMN payment_proof text,
ADD COLUMN payment_reference text;