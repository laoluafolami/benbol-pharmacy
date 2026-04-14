# Authentication Logging

## Overview
Added comprehensive authentication event logging to track admin logins, logouts, and password changes. All logging is non-blocking and won't break the application if logging fails.

## Events Tracked

### 1. Admin Login
- **When**: When an admin attempts to log in
- **Logged**: Success or failure with reason
- **Details**:
  - Admin email
  - Login success/failure status
  - Failure reason (if applicable)
  - Timestamp and IP address (via auditLog)

### 2. Admin Logout
- **When**: When an admin logs out
- **Logged**: Logout event
- **Details**:
  - Admin email
  - Logout timestamp
  - IP address

### 3. Password Change
- **When**: When an admin changes their password
- **Logged**: Success or failure
- **Details**:
  - Admin email
  - Password change success/failure
  - Failure reason (if applicable)
  - Timestamp

## Implementation Details

### Safe Error Handling
All authentication logging is wrapped in try-catch blocks to ensure:
- Login/logout/password change operations are never blocked by logging failures
- Errors are logged to console but don't affect user experience
- Application continues to function normally even if logging fails

### Files Modified

#### 1. `src/lib/auditLog.ts`
Added three new functions:
- `logAdminLogin(adminId, adminEmail, success, failureReason?)` - Logs login attempts
- `logAdminLogout(adminId, adminEmail)` - Logs logout events
- `logPasswordChange(adminId, adminEmail, success, reason?)` - Logs password changes

#### 2. `src/lib/auth.ts`
Updated functions:
- `signOutAdmin()` - Now logs logout before signing out
- `updatePassword()` - Now logs password change attempts (success and failure)

#### 3. `src/pages/AdminLogin.tsx`
Updated function:
- `handleLogin()` - Now logs both successful and failed login attempts

## Viewing Authentication Logs

### In Analytics Dashboard
1. Go to Admin Analytics page
2. Use the "By Table" filter
3. Select "admin_auth" table
4. View all authentication events

### Filter by Date
- Use the date range filters to see authentication events within a specific period
- Example: View all login attempts from today

### Filter by Admin
- Use the "By Admin" filter to see all authentication events for a specific admin

## Log Details

### Login Success
```
Admin: user@example.com
Action: VIEW
Table: admin_auth
Summary: Admin login successful
Time: [timestamp]
IP Address: [IP]
```

### Login Failure
```
Admin: user@example.com
Action: VIEW
Table: admin_auth
Summary: Admin login failed: Invalid credentials
Time: [timestamp]
IP Address: [IP]
Changes: {
  "login_success": false,
  "failure_reason": "Invalid credentials"
}
```

### Logout
```
Admin: user@example.com
Action: VIEW
Table: admin_auth
Summary: Admin logout
Time: [timestamp]
IP Address: [IP]
```

### Password Change
```
Admin: user@example.com
Action: UPDATE
Table: admin_auth
Summary: Password changed
Time: [timestamp]
IP Address: [IP]
Changes: {
  "password_changed": true
}
```

## Security Considerations

1. **Non-Breaking**: Logging failures don't affect authentication
2. **IP Tracking**: All events include IP address for security auditing
3. **Failure Tracking**: Failed login attempts are logged for security monitoring
4. **Timestamp**: All events include precise timestamps for audit trail

## Testing

To verify authentication logging is working:

1. **Test Login Success**:
   - Log in with valid credentials
   - Check analytics for successful login entry

2. **Test Login Failure**:
   - Try logging in with wrong password
   - Check analytics for failed login entry with reason

3. **Test Logout**:
   - Log in successfully
   - Click logout
   - Check analytics for logout entry

4. **Test Password Change**:
   - Log in as admin
   - Go to password reset page
   - Change password
   - Check analytics for password change entry

## Future Enhancements

Potential improvements:
- Track failed login attempts per IP (for brute force detection)
- Alert on suspicious login patterns
- Track password change history
- Track admin role changes
- Track user creation/deletion by admin
