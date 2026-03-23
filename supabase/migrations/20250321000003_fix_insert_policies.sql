/*
  # Fix Insert Policies for Public Forms
  
  This migration ensures that anonymous users can submit data through public forms
  (contact submissions, appointments, prescription refills, newsletter subscriptions, chat messages)
  while authenticated admin users can still manage the data.
*/

-- Drop existing policies that might be blocking inserts
DROP POLICY IF EXISTS "Anyone can submit contact forms" ON contact_submissions;
DROP POLICY IF EXISTS "Anyone can submit appointments" ON appointments;
DROP POLICY IF EXISTS "Anyone can submit prescription refills" ON prescription_refills;
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Anyone can insert chat messages" ON chat_messages;

-- Recreate insert policies for anonymous users (public forms)
CREATE POLICY "Anyone can submit contact forms"
  ON contact_submissions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can submit appointments"
  ON appointments FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can submit prescription refills"
  ON prescription_refills FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscribers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can insert chat messages"
  ON chat_messages FOR INSERT
  WITH CHECK (true);

-- Ensure authenticated users can also insert (for restore functionality)
CREATE POLICY "Authenticated users can insert contact forms"
  ON contact_submissions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert appointments"
  ON appointments FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert prescription refills"
  ON prescription_refills FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert newsletter subscribers"
  ON newsletter_subscribers FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert chat messages"
  ON chat_messages FOR INSERT
  TO authenticated
  WITH CHECK (true);
