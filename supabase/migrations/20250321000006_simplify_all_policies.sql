/*
  # Simplify All RLS Policies
  
  This migration simplifies all RLS policies to allow authenticated users
  full access to all tables. This is a simpler approach that avoids circular
  dependencies with the admin_users table.
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "Anyone can submit contact forms" ON contact_submissions;
DROP POLICY IF EXISTS "Authenticated users can insert contact forms" ON contact_submissions;
DROP POLICY IF EXISTS "Authenticated users can view all contacts" ON contact_submissions;
DROP POLICY IF EXISTS "Authenticated users can update contacts" ON contact_submissions;
DROP POLICY IF EXISTS "Admins can delete contacts" ON contact_submissions;

DROP POLICY IF EXISTS "Anyone can submit appointments" ON appointments;
DROP POLICY IF EXISTS "Authenticated users can insert appointments" ON appointments;
DROP POLICY IF EXISTS "Authenticated users can view all appointments" ON appointments;
DROP POLICY IF EXISTS "Authenticated users can update appointments" ON appointments;
DROP POLICY IF EXISTS "Admins can delete appointments" ON appointments;

DROP POLICY IF EXISTS "Anyone can submit prescription refills" ON prescription_refills;
DROP POLICY IF EXISTS "Authenticated users can insert prescription refills" ON prescription_refills;
DROP POLICY IF EXISTS "Authenticated users can view all refills" ON prescription_refills;
DROP POLICY IF EXISTS "Authenticated users can update refills" ON prescription_refills;
DROP POLICY IF EXISTS "Admins can delete refills" ON prescription_refills;

DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Authenticated users can insert newsletter subscribers" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Authenticated users can view subscribers" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Authenticated users can update subscriptions" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Admins can delete subscribers" ON newsletter_subscribers;

DROP POLICY IF EXISTS "Anyone can insert chat messages" ON chat_messages;
DROP POLICY IF EXISTS "Authenticated users can insert chat messages" ON chat_messages;
DROP POLICY IF EXISTS "Anyone can view their own chat messages" ON chat_messages;
DROP POLICY IF EXISTS "Authenticated users can view all chat messages" ON chat_messages;
DROP POLICY IF EXISTS "Admins can delete chat messages" ON chat_messages;

DROP POLICY IF EXISTS "Users can view their own admin profile" ON admin_users;
DROP POLICY IF EXISTS "Admins can view all admin users" ON admin_users;
DROP POLICY IF EXISTS "Admins can insert admin users" ON admin_users;
DROP POLICY IF EXISTS "Admins can update admin users" ON admin_users;
DROP POLICY IF EXISTS "Admins can delete admin users" ON admin_users;

-- Create simple policies for contact_submissions
CREATE POLICY "Public can insert contacts" ON contact_submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated can do anything with contacts" ON contact_submissions
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Create simple policies for appointments
CREATE POLICY "Public can insert appointments" ON appointments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated can do anything with appointments" ON appointments
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Create simple policies for prescription_refills
CREATE POLICY "Public can insert refills" ON prescription_refills
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated can do anything with refills" ON prescription_refills
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Create simple policies for newsletter_subscribers
CREATE POLICY "Public can insert subscribers" ON newsletter_subscribers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated can do anything with subscribers" ON newsletter_subscribers
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Create simple policies for chat_messages
CREATE POLICY "Public can insert and view chat messages" ON chat_messages
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated can do anything with chat messages" ON chat_messages
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Create simple policies for admin_users
CREATE POLICY "Authenticated can do anything with admin users" ON admin_users
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
