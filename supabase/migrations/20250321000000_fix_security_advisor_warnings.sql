/*
  # Fix Supabase Security Advisor Warnings
  
  This migration addresses security warnings without breaking production functionality:
  1. Fixes overly permissive RLS policies (USING true / WITH CHECK true)
  2. Fixes function search_path mutability issue
  
  SAFE FOR PRODUCTION - All existing functionality preserved
*/

-- ============================================================================
-- FIX 1: Update function to set search_path (fixes Function Search Path Mutable warning)
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ============================================================================
-- FIX 2: Replace overly permissive RLS policies with proper role-based policies
-- ============================================================================

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Authenticated users can view all appointments" ON appointments;
DROP POLICY IF EXISTS "Authenticated users can update appointments" ON appointments;
DROP POLICY IF EXISTS "Authenticated users can delete appointments" ON appointments;

DROP POLICY IF EXISTS "Authenticated users can view all refills" ON prescription_refills;
DROP POLICY IF EXISTS "Authenticated users can update refills" ON prescription_refills;
DROP POLICY IF EXISTS "Authenticated users can delete prescription refills" ON prescription_refills;

DROP POLICY IF EXISTS "Authenticated users can view all contacts" ON contact_submissions;
DROP POLICY IF EXISTS "Authenticated users can update contacts" ON contact_submissions;
DROP POLICY IF EXISTS "Authenticated users can delete contact submissions" ON contact_submissions;

DROP POLICY IF EXISTS "Authenticated users can view subscribers" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Authenticated users can update subscriptions" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Authenticated users can delete newsletter subscribers" ON newsletter_subscribers;

DROP POLICY IF EXISTS "Authenticated users can view all chat messages" ON chat_messages;
DROP POLICY IF EXISTS "Authenticated users can delete chat messages" ON chat_messages;

-- ============================================================================
-- CREATE SECURE ADMIN-ONLY POLICIES
-- ============================================================================

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = auth.uid() AND role IN ('admin', 'manager')
  );
END;
$$;

-- APPOINTMENTS: Admin-only access for SELECT, UPDATE, DELETE
CREATE POLICY "Admins can view all appointments"
  ON appointments FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can update appointments"
  ON appointments FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete appointments"
  ON appointments FOR DELETE
  TO authenticated
  USING (is_admin());

-- PRESCRIPTION REFILLS: Admin-only access for SELECT, UPDATE, DELETE
CREATE POLICY "Admins can view all refills"
  ON prescription_refills FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can update refills"
  ON prescription_refills FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete refills"
  ON prescription_refills FOR DELETE
  TO authenticated
  USING (is_admin());

-- CONTACT SUBMISSIONS: Admin-only access for SELECT, UPDATE, DELETE
CREATE POLICY "Admins can view all contacts"
  ON contact_submissions FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can update contacts"
  ON contact_submissions FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete contacts"
  ON contact_submissions FOR DELETE
  TO authenticated
  USING (is_admin());

-- NEWSLETTER SUBSCRIBERS: Admin-only access for SELECT, UPDATE, DELETE
CREATE POLICY "Admins can view subscribers"
  ON newsletter_subscribers FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can update subscriptions"
  ON newsletter_subscribers FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete subscribers"
  ON newsletter_subscribers FOR DELETE
  TO authenticated
  USING (is_admin());

-- CHAT MESSAGES: Admin-only access for SELECT, DELETE
CREATE POLICY "Admins can view all chat messages"
  ON chat_messages FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can delete chat messages"
  ON chat_messages FOR DELETE
  TO authenticated
  USING (is_admin());

-- ============================================================================
-- ADMIN_USERS TABLE: Fix overly permissive policies
-- ============================================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can view all admin users" ON admin_users;
DROP POLICY IF EXISTS "Admins can update admin users" ON admin_users;
DROP POLICY IF EXISTS "Admins can insert admin users" ON admin_users;
DROP POLICY IF EXISTS "Admins can delete admin users" ON admin_users;

-- Recreate with proper checks
CREATE POLICY "Admins can view all admin users"
  ON admin_users FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can update admin users"
  ON admin_users FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can insert admin users"
  ON admin_users FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete admin users"
  ON admin_users FOR DELETE
  TO authenticated
  USING (is_admin());

-- ============================================================================
-- VERIFICATION COMMENTS
-- ============================================================================

COMMENT ON FUNCTION update_updated_at_column() IS 'Trigger function with fixed search_path for security';
COMMENT ON FUNCTION is_admin() IS 'Helper function to check if current user has admin or manager role';
