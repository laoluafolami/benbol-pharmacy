/*
  # Fix Select Policies for Admin Dashboard
  
  This migration ensures that authenticated admin users can view all data
  in the admin dashboard.
*/

-- Drop existing select policies that might be blocking access
DROP POLICY IF EXISTS "Authenticated users can view all contacts" ON contact_submissions;
DROP POLICY IF EXISTS "Authenticated users can view all appointments" ON appointments;
DROP POLICY IF EXISTS "Authenticated users can view all refills" ON prescription_refills;
DROP POLICY IF EXISTS "Authenticated users can view subscribers" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Authenticated users can view all chat messages" ON chat_messages;

-- Recreate select policies for authenticated users
CREATE POLICY "Authenticated users can view all contacts"
  ON contact_submissions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can view all appointments"
  ON appointments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can view all refills"
  ON prescription_refills FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can view subscribers"
  ON newsletter_subscribers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can view all chat messages"
  ON chat_messages FOR SELECT
  TO authenticated
  USING (true);
