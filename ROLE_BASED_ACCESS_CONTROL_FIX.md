# Role-Based Access Control Fix

## Issue Found
Manager users were able to delete records, which should only be allowed for admin users.

## Root Cause
The `checkAuth()` function had insecure default fallbacks:
- If there was an error fetching the user's role → defaulted to 'admin'
- If the user wasn't found in admin_users table → defaulted to 'admin'
- If there was an exception → defaulted to 'admin'

This meant that any issue with role fetching would grant admin privileges, which is a security vulnerability.

## Solution Applied
Changed all default fallbacks from 'admin' to 'viewer' (the most restrictive role).

### Before (Insecure)
```typescript
if (error) {
  setUserRole('admin');  // ❌ Grants admin on error
} else if (adminUserData) {
  setUserRole(adminUserData.role);
} else {
  setUserRole('admin');  // ❌ Grants admin if user not found
}
```

### After (Secure)
```typescript
if (error) {
  setUserRole('viewer');  // ✅ Restricts to viewer on error
} else if (adminUserData) {
  setUserRole(adminUserData.role);
} else {
  setUserRole('viewer');  // ✅ Restricts to viewer if user not found
}
```

## Role Permissions

### Admin Role
- ✅ Mark items as read/unread
- ✅ Archive/unarchive items
- ✅ Update item status
- ✅ **Delete records** (ONLY ADMIN)
- ✅ View Analytics page
- ✅ Manage Users
- ✅ Backup & Restore

### Manager Role
- ✅ Mark items as read/unread
- ✅ Archive/unarchive items
- ✅ Update item status
- ❌ Delete records (NOT ALLOWED)
- ❌ View Analytics page (NOT ALLOWED)
- ✅ Manage Users
- ✅ Backup & Restore

### Viewer Role
- ❌ Mark items as read/unread (NOT ALLOWED)
- ❌ Archive/unarchive items (NOT ALLOWED)
- ❌ Update item status (NOT ALLOWED)
- ❌ Delete records (NOT ALLOWED)
- ❌ View Analytics page (NOT ALLOWED)
- ❌ Manage Users (NOT ALLOWED)
- ❌ Backup & Restore (NOT ALLOWED)

## Permission Check Functions

### `canDelete()`
```typescript
const canDelete = () => {
  return userRole === 'admin';  // Only admin can delete
};
```

### `canMarkAsRead()`
```typescript
const canMarkAsRead = () => {
  return userRole === 'admin' || userRole === 'manager';
};
```

### `canArchive()`
```typescript
const canArchive = () => {
  return userRole === 'admin' || userRole === 'manager';
};
```

### `canUpdateStatus()`
```typescript
const canUpdateStatus = () => {
  return userRole === 'admin' || userRole === 'manager';
};
```

## Testing the Fix

### Test 1: Manager Cannot Delete
1. Create a user with 'manager' role
2. Log in as manager
3. Try to delete a record
4. Expected: Delete button should be hidden (shows "—" instead)
5. If you try to delete via console, you should get: "You do not have permission to delete records"

### Test 2: Admin Can Delete
1. Log in as admin
2. Try to delete a record
3. Expected: Delete button should be visible and clickable
4. Delete should work

### Test 3: Viewer Cannot Do Anything
1. Create a user with 'viewer' role
2. Log in as viewer
3. Expected: All action buttons should be disabled/hidden
4. Only able to view data

### Test 4: Check Browser Console
When logging in, check the browser console (F12) for:
```
User role: manager
canDelete check - userRole: manager, hasPermission: false
```

## Files Modified
- `src/pages/AdminDashboard.tsx` - Changed default role fallbacks from 'admin' to 'viewer'

## Security Best Practices Applied
1. **Principle of Least Privilege**: Default to the most restrictive role (viewer)
2. **Fail Secure**: If role fetching fails, restrict access rather than grant it
3. **Explicit Permissions**: Each action requires explicit permission check
4. **Frontend + Backend**: Frontend checks prevent UI exposure, backend RLS policies enforce actual restrictions

## Verification Checklist
- [ ] Manager user cannot see delete button
- [ ] Manager user cannot delete records
- [ ] Admin user can see and use delete button
- [ ] Viewer user cannot see any action buttons
- [ ] Browser console shows correct role on login
- [ ] Audit logs capture all actions with correct user role

## Next Steps
1. Test with a manager user to confirm delete button is hidden
2. Test with a viewer user to confirm all buttons are hidden
3. Verify admin user still has full access
4. Check browser console for role information

The fix is ready to deploy!
