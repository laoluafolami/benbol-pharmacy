# Role Change Logging

## Overview
Added audit logging for admin role changes. Now whenever an admin changes a user's role, the action is captured in the analytics dashboard.

## What Gets Logged

When an admin changes a user's role:
- **Admin**: The admin who made the change
- **Action**: UPDATE
- **Table**: admin_users
- **Summary**: "Updated user role to [new_role] for [user_email]"
- **Changes**: Shows the new role assigned
- **Timestamp**: When the change was made
- **IP Address**: Admin's IP address

## Example Log Entry

```
Admin: admin@example.com
Action: UPDATE
Table: admin_users
Summary: Updated user role to manager for user@example.com
Time: 2025-04-14 10:30:45
IP Address: 192.168.1.100
Changes: {
  "role_changed_to": "manager"
}
```

## Viewing Role Changes in Analytics

1. Go to Admin Analytics page
2. Use the "By Table" filter
3. Select "admin_users" table
4. View all role changes
5. Optionally filter by:
   - **Date Range**: See role changes within a specific period
   - **By Admin**: See all role changes made by a specific admin

## Implementation Details

### File Modified
`src/lib/auth.ts` - Updated `updateAdminRole()` function

### Safe Error Handling
- Role change logging is wrapped in try-catch
- If logging fails, the role change still completes successfully
- Errors are logged to console but don't affect the operation
- Application continues to function normally

### What's Captured
- User ID being updated
- New role assigned
- Admin who made the change
- Timestamp and IP address (via auditLog)

## Security Benefits

1. **Audit Trail**: Complete record of who changed what role and when
2. **Accountability**: Track which admin made role changes
3. **Compliance**: Maintain audit logs for security compliance
4. **Investigation**: Quickly find role changes for specific users or admins

## Testing

To verify role change logging:

1. Log in as admin
2. Go to Admin Users Management
3. Change a user's role (e.g., from Viewer to Manager)
4. Go to Admin Analytics
5. Filter by "admin_users" table
6. Verify the role change appears in the logs

## Related Features

This logging works alongside:
- **User Creation Logging**: Logs when new admin users are created
- **User Deletion Logging**: Logs when admin users are deleted
- **Authentication Logging**: Logs logins, logouts, and password changes
- **Data Action Logging**: Logs all data modifications (create, update, delete)

## Future Enhancements

Potential improvements:
- Alert on suspicious role changes (e.g., viewer to admin)
- Track role change history per user
- Generate reports on role changes
- Notify users when their role changes
