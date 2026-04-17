-- SAFE FIX FOR MANAGER ROLE PERMISSIONS
-- This script will fix the manager user's role without breaking anything

-- Step 1: First, check if the manager user exists in admin_users
-- Run this to see the current state:
SELECT id, email, role FROM admin_users WHERE role = 'manager';

-- Step 2: If the manager user is NOT in admin_users table, add them:
-- Replace 'manager@example.com' with the actual manager email
INSERT INTO admin_users (id, email, role)
SELECT id, email, 'manager'
FROM auth.users
WHERE email = 'manager@example.com'
AND id NOT IN (SELECT id FROM admin_users);

-- Step 3: If the manager user IS in admin_users but with wrong role, update it:
-- Replace 'manager@example.com' with the actual manager email
UPDATE admin_users
SET role = 'manager'
WHERE email = 'manager@example.com'
AND role != 'manager';

-- Step 4: Verify the fix worked:
SELECT id, email, role FROM admin_users WHERE email = 'manager@example.com';

-- Expected result:
-- id          | email                | role
-- ------------|----------------------|--------
-- [uuid]      | manager@example.com  | manager
