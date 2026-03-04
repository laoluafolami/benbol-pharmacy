/*
  # Fix RLS Policies for Admin Operations

  This migration adds missing RLS policies to ensure proper security
  while allowing admin operations to function correctly.
*/

-- Add missing DELETE policies for authenticated users (admins)
CREATE POLICY "Authenticated users can delete appointments"
  ON appointments FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete prescription refills"
  ON prescription_refills FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete contact submissions"
  ON contact_submissions FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete newsletter subscribers"
  ON newsletter_subscribers FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete chat messages"
  ON chat_messages FOR DELETE
  TO authenticated
  USING (true);

-- Add missing columns for admin tracking (if they don't exist)
DO $$ 
BEGIN
  -- Add is_read column to appointments if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'appointments' AND column_name = 'is_read') THEN
    ALTER TABLE appointments ADD COLUMN is_read boolean DEFAULT false;
  END IF;

  -- Add is_archived column to appointments if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'appointments' AND column_name = 'is_archived') THEN
    ALTER TABLE appointments ADD COLUMN is_archived boolean DEFAULT false;
  END IF;

  -- Add is_read column to prescription_refills if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'prescription_refills' AND column_name = 'is_read') THEN
    ALTER TABLE prescription_refills ADD COLUMN is_read boolean DEFAULT false;
  END IF;

  -- Add is_archived column to prescription_refills if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'prescription_refills' AND column_name = 'is_archived') THEN
    ALTER TABLE prescription_refills ADD COLUMN is_archived boolean DEFAULT false;
  END IF;

  -- Add is_read column to contact_submissions if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contact_submissions' AND column_name = 'is_read') THEN
    ALTER TABLE contact_submissions ADD COLUMN is_read boolean DEFAULT false;
  END IF;

  -- Add is_archived column to contact_submissions if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contact_submissions' AND column_name = 'is_archived') THEN
    ALTER TABLE contact_submissions ADD COLUMN is_archived boolean DEFAULT false;
  END IF;

  -- Add is_read column to newsletter_subscribers if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'newsletter_subscribers' AND column_name = 'is_read') THEN
    ALTER TABLE newsletter_subscribers ADD COLUMN is_read boolean DEFAULT false;
  END IF;

  -- Add is_archived column to newsletter_subscribers if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'newsletter_subscribers' AND column_name = 'is_archived') THEN
    ALTER TABLE newsletter_subscribers ADD COLUMN is_archived boolean DEFAULT false;
  END IF;

  -- Add is_read column to chat_messages if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'chat_messages' AND column_name = 'is_read') THEN
    ALTER TABLE chat_messages ADD COLUMN is_read boolean DEFAULT false;
  END IF;

  -- Add is_archived column to chat_messages if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'chat_messages' AND column_name = 'is_archived') THEN
    ALTER TABLE chat_messages ADD COLUMN is_archived boolean DEFAULT false;
  END IF;

  -- Add user_name and user_email columns to chat_messages if they don't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'chat_messages' AND column_name = 'user_name') THEN
    ALTER TABLE chat_messages ADD COLUMN user_name text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'chat_messages' AND column_name = 'user_email') THEN
    ALTER TABLE chat_messages ADD COLUMN user_email text;
  END IF;
END $$;

-- Create admin_users table if it doesn't exist (for role-based access)
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin', 'manager', 'viewer')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on admin_users table
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Policies for admin_users table
CREATE POLICY "Users can view their own admin profile"
  ON admin_users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all admin users"
  ON admin_users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update admin users"
  ON admin_users FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can insert admin users"
  ON admin_users FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete admin users"
  ON admin_users FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for admin_users updated_at
DROP TRIGGER IF EXISTS update_admin_users_updated_at ON admin_users;
CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();