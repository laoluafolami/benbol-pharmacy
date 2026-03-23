/*
  # Enable RLS on Missing Tables
  
  Fixes Security Advisor errors:
  - Policy Exists RLS Disabled
  - RLS Disabled in Public
  
  This migration enables RLS on tables that have policies but RLS was disabled.
  SAFE FOR PRODUCTION - Only enables security, doesn't change access.
*/

-- Enable RLS on tables that are missing it
ALTER TABLE IF EXISTS chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Verify RLS is enabled on all main tables
ALTER TABLE IF EXISTS appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS prescription_refills ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS admin_users ENABLE ROW LEVEL SECURITY;

-- Add comment for tracking
COMMENT ON TABLE chat_messages IS 'RLS enabled - Security Advisor fix applied';
COMMENT ON TABLE contact_submissions IS 'RLS enabled - Security Advisor fix applied';
COMMENT ON TABLE newsletter_subscribers IS 'RLS enabled - Security Advisor fix applied';
