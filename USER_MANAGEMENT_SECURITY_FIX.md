# User Management Security Fix

## Issues Found

### Issue 1: Insecure Default Role in AdminUsersPage
The `checkAuth()` function defaulted to 'admin' role if:
- There was an error fetching the user's role
- The user wasn't found in admin_users table
- Any exception occurred

This is the same security vulnerability that was fixed in AdminDashboard.

### Issue 2: No Backend Validation for Role Changes
The following functions had NO backend validation:
- `createAdminUser()` - Any authenticated user could create new users
- `updateAdminRole()` - Any authenticated user could change user roles
- `deleteAdminUser()` - Any authenticated user could delete users

A manager could bypass the frontend UI checks and call these functions directly via API.

## Solutions Applied

### Fix 1: Secure Default Role
Changed all default fallbacks from 'admin' to 'viewer' in AdminUsersPage.

**Before (Insecure):**
```typescript
if (adminUserData) {
  setUserRole(adminUserData.role);
} else {
  setUserRole('admin');  // ❌ Grants admin on error
}
```

**After (Secure):**
```typescript
if (adminUserData) {
  setUserRole(adminUserData.role);
} else {
  setUserRole('viewer');  // ✅ Restricts to viewer on error
}
```

### Fix 2: Backend Role Validation
Added backend validation to all user management functions. Each function now:
1. Gets the current user
2. Checks if the current user is an admin
3. Only proceeds if the user is an admin
4. Returns an error if the user is not an admin

**Example - updateAdminRole():**
```typescript
export const updateAdminRole = async (userId: string, role: 'admin' | 'manager' | 'viewer') => {
  try {
    // Get current user
    const { user: currentUser } = await getCurrentUser();
    if (!currentUser) {
      throw new Error('Not authenticated');
    }

    // Check if current user is admin
    const { data: currentUserData } = await supabase
      .from('admin_users')
      .select('role')
      .eq('id', currentUser.id)
      .maybeSingle();

    if (!currentUserData || currentUserData.role !== 'admin') {
      throw new Error('Only admins can update user roles');  // ✅ Backend check
    }

    // Update the role
    const { data, error } = await supabase
      .from('admin_users')
      .update({ role })
      .eq('id', userId);

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};
```

## Protected Functions

### createAdminUser()
- **Frontend Check**: Only admins see the "Add User" button
- **Backend Check**: ✅ NEW - Verifies user is admin before creating
- **Permission**: Admin only

### updateAdminRole()
- **Frontend Check**: Role dropdown disabled for non-admins
- **Backend Check**: ✅ NEW - Verifies user is admin before updating
- **Permission**: Admin only

### deleteAdminUser()
- **Frontend Check**: Delete button hidden for non-admins
- **Backend Check**: ✅ NEW - Verifies user is admin before deleting
- **Permission**: Admin only

## Testing the Fix

### Test 1: Manager Cannot Change Roles
1. Create a user with 'manager' role
2. Log in as manager
3. Go to Admin Users Management
4. Try to change another user's role
5. Expected: Role dropdown is disabled (grayed out)
6. If you try via browser console: Error "Only admins can update user roles"

### Test 2: Manager Cannot Create Users
1. Log in as manager
2. Go to Admin Users Management
3. Try to click "Add User" button
4. Expected: Button is disabled (grayed out)
5. If you try via API: Error "Only admins can create new users"

### Test 3: Manager Cannot Delete Users
1. Log in as manager
2. Go to Admin Users Management
3. Try to delete a user
4. Expected: Delete button is hidden (shows "—")
5. If you try via API: Error "Only admins can delete users"

### Test 4: Admin Can Do Everything
1. Log in as admin
2. Go to Admin Users Management
3. Expected: All buttons are enabled and functional
4. Can create, update roles, and delete users

### Test 5: Viewer Cannot Access User Management
1. Create a user with 'viewer' role
2. Log in as viewer
3. Try to navigate to Admin Users Management
4. Expected: All buttons are disabled
5. Cannot perform any user management actions

## Browser Console Verification

When logging in as a manager, check the browser console (F12) for:
```
User role: manager
```

When trying to change a role, you should see:
```
Error updating role: Error: Only admins can update user roles
```

## Files Modified

1. **src/lib/auth.ts**
   - Added backend role validation to `createAdminUser()`
   - Added backend role validation to `updateAdminRole()`
   - Added backend role validation to `deleteAdminUser()`

2. **src/pages/AdminUsersPage.tsx**
   - Changed default role fallback from 'admin' to 'viewer'
   - Removed unused `getAdminUsers` import

## Security Best Practices Applied

1. **Defense in Depth**: Both frontend UI checks AND backend validation
2. **Principle of Least Privilege**: Default to most restrictive role
3. **Fail Secure**: If role check fails, deny access
4. **Explicit Authorization**: Every sensitive operation requires explicit admin check
5. **No Trust in Frontend**: Backend doesn't rely on frontend checks

## Verification Checklist

- [ ] Manager cannot see role change dropdown
- [ ] Manager cannot create new users
- [ ] Manager cannot delete users
- [ ] Admin can perform all user management actions
- [ ] Viewer cannot access user management page
- [ ] Browser console shows correct role on login
- [ ] Error messages appear when trying to bypass restrictions

## Next Steps

1. Test with a manager user to confirm they cannot change roles
2. Test with a viewer user to confirm they have no access
3. Verify admin user still has full access
4. Check browser console for role information and error messages

The fix is ready to deploy!
