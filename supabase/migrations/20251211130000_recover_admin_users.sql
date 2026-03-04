/*
  # Recover Admin Users Migration
  
  This migration adds all existing auth.users to the admin_users table
  so they can access the admin dashboard again.
*/

-- Add all existing authenticated users to admin_users table
-- This will restore access for users who were created before the RLS migration
INSERT INTO admin_users (id, email, role)
SELECT 
  au.id,
  au.email,
  'admin' as role  -- You can change this to 'manager' or 'viewer' if needed
FROM auth.users au
WHERE au.email IS NOT NULL
  AND au.email_confirmed_at IS NOT NULL  -- Only confirmed users
  AND NOT EXISTS (
    -- Don't duplicate if already exists
    SELECT 1 FROM admin_users WHERE id = au.id
  );

-- Optional: Update the role for specific users
-- Uncomment and modify as needed:
-- UPDATE admin_users SET role = 'manager' WHERE email = 'manager@yourcompany.com';
-- UPDATE admin_users SET role = 'viewer' WHERE email = 'viewer@yourcompany.com';