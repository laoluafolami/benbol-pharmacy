# Manager Role Debugging Guide

## Issue
Manager role users cannot mark items as read, archive items, or change status.

## Root Cause Analysis

The permission functions in AdminDashboard are correct:
```typescript
const canMarkAsRead = () => {
  return userRole === 'admin' || userRole === 'manager';
};

const canArchive = () => {
  return userRole === 'admin' || userRole === 'manager';
};

const canUpdateStatus = () => {
  return userRole === 'admin' || userRole === 'manager';
};
```

The issue is likely that the manager user's role is not being fetched correctly from the database.

## Debugging Steps

### Step 1: Check Browser Console
1. Log in as the manager user
2. Open browser console (F12)
3. Look for one of these messages:

**If role is fetched correctly:**
```
User role fetched: manager
```

**If user not found in admin_users table:**
```
User not in admin_users table, defaulting to viewer
User ID: [uuid]
```

**If there's an error:**
```
Error fetching user role: [error details]
Defaulting to viewer role due to error
```

### Step 2: Check the Database
If the console shows "User not in admin_users table", the manager user was not added to the admin_users table when created.

**In Supabase Dashboard:**
1. Go to SQL Editor
2. Run this query:
```sql
SELECT id, email, role FROM admin_users WHERE email = 'manager@example.com';
```

**Expected result:**
```
id          | email                | role
------------|----------------------|--------
[uuid]      | manager@example.com  | manager
```

**If no results:** The user was not added to admin_users table

### Step 3: Check auth.users Table
1. Go to SQL Editor
2. Run this query:
```sql
SELECT id, email FROM auth.users WHERE email = 'manager@example.com';
```

**Expected result:**
```
id          | email
------------|----------------------
[uuid]      | manager@example.com
```

If the user exists in auth.users but not in admin_users, they need to be added manually.

## Solutions

### Solution 1: If User Not in admin_users Table
Add the user manually to admin_users:

```sql
INSERT INTO admin_users (id, email, role)
SELECT id, email, 'manager'
FROM auth.users
WHERE email = 'manager@example.com'
AND id NOT IN (SELECT id FROM admin_users);
```

### Solution 2: If Role is Wrong
Update the user's role:

```sql
UPDATE admin_users
SET role = 'manager'
WHERE email = 'manager@example.com';
```

### Solution 3: If There's an Error Fetching Role
Check the RLS policies on admin_users table:

```sql
SELECT * FROM pg_policies WHERE tablename = 'admin_users';
```

Expected policy:
```
Authenticated can do anything with admin users
```

## Verification

After applying the fix:

1. **Log out and log back in** as the manager user
2. **Open browser console** and verify:
   ```
   User role fetched: manager
   ```
3. **Try to mark an item as read** - should work now
4. **Try to archive an item** - should work now
5. **Try to change status** - should work now
6. **Try to delete** - should still be blocked (only admin)

## Expected Behavior After Fix

### Manager Role Permissions
- ✅ Mark items as read/unread
- ✅ Archive/unarchive items
- ✅ Update item status
- ❌ Delete records (admin only)
- ❌ View Analytics (admin only)
- ✅ Manage Users
- ✅ Backup & Restore

## If Still Not Working

1. **Check the console logs** for the exact error
2. **Verify the user's role** in the database
3. **Check RLS policies** on admin_users table
4. **Try creating a new manager user** and test with that
5. **Check if there are any database errors** in Supabase logs

## Quick Checklist

- [ ] Manager user exists in auth.users
- [ ] Manager user exists in admin_users table
- [ ] Manager user's role is set to 'manager' (not 'admin' or 'viewer')
- [ ] Browser console shows "User role fetched: manager"
- [ ] Mark as read button is visible and clickable
- [ ] Archive button is visible and clickable
- [ ] Status dropdown is visible and enabled
- [ ] Delete button is hidden (shows "—")

The issue should be resolved after verifying these steps!
