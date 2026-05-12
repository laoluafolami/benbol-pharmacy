# Safe Fix for Manager Role Permissions

## Problem
Manager users see greyed-out icons for:
- Mark as read/unread
- Archive/unarchive
- Change status

This means the manager user's role is not being recognized.

## Root Cause
The manager user is either:
1. Not in the `admin_users` table at all
2. In the `admin_users` table but with role='viewer' instead of role='manager'

## Safe Fix (No Code Changes)

### Step 1: Check Current State
Go to Supabase Dashboard → SQL Editor and run:

```sql
SELECT id, email, role FROM admin_users WHERE email = 'manager@example.com';
```

Replace `manager@example.com` with the actual manager email.

**Expected result:**
```
id          | email                | role
------------|----------------------|--------
[uuid]      | manager@example.com  | manager
```

### Step 2: If User Not Found
If the query returns no results, add the manager to admin_users:

```sql
INSERT INTO admin_users (id, email, role)
SELECT id, email, 'manager'
FROM auth.users
WHERE email = 'manager@example.com'
AND id NOT IN (SELECT id FROM admin_users);
```

### Step 3: If User Found But Wrong Role
If the query shows role='viewer' or role='admin', update it:

```sql
UPDATE admin_users
SET role = 'manager'
WHERE email = 'manager@example.com';
```

### Step 4: Verify Fix
Run this to confirm:

```sql
SELECT id, email, role FROM admin_users WHERE email = 'manager@example.com';
```

Should show: `role = manager`

## Test the Fix

1. **Log out** the manager user completely
2. **Log back in** as manager
3. **Refresh the page** (F5)
4. **Check the icons** - they should now be colored (not greyed out)
5. **Try to mark an item as read** - should work now

## Why This Happens

When you created the manager user through the "Add User" form, the system:
1. Created the user in `auth.users` (Supabase Auth)
2. Should have created an entry in `admin_users` with the selected role

If step 2 didn't happen, the user defaults to 'viewer' role.

## Verification Checklist

After applying the fix:

- [ ] Manager user is in admin_users table
- [ ] Manager user's role is 'manager' (not 'viewer' or 'admin')
- [ ] Manager has logged out and logged back in
- [ ] Page has been refreshed
- [ ] Mark as read icon is colored (not greyed out)
- [ ] Archive icon is colored (not greyed out)
- [ ] Status dropdown is enabled (not greyed out)
- [ ] Delete button is still hidden (greyed out) - this is correct
- [ ] Manager can successfully mark items as read
- [ ] Manager can successfully archive items
- [ ] Manager can successfully change status

## If Still Not Working

1. **Check browser console** (F12):
   - Look for: `User role fetched: manager`
   - If you see: `User not in admin_users table, defaulting to viewer` → User not in database
   - If you see: `Error fetching user role:` → Database error

2. **Try creating a new manager user** and test with that

3. **Check if there are any database errors** in Supabase logs

## Important Notes

- ✅ This fix is SAFE - it only updates the admin_users table
- ✅ No code changes needed
- ✅ No application restart needed
- ✅ Manager will need to log out and log back in
- ✅ All other users are unaffected

The fix should work immediately after the manager logs back in!
