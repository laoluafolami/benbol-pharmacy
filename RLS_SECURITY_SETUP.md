# RLS Security Setup Instructions

This document provides instructions for fixing Row Level Security (RLS) issues in your Supabase database.

## What Was Fixed

### 1. Missing RLS Policies
- Added DELETE policies for all tables to allow authenticated admin users to delete records
- Added proper admin_users table with role-based access control
- Added missing columns (is_read, is_archived, user_name, user_email) to support admin functionality

### 2. Enhanced Error Handling
- Improved error handling in AdminDashboard.tsx with user-friendly error messages
- Added proper error checking for all database operations
- Added fallback mechanisms when operations fail

### 3. Security Improvements
- Role-based access control for admin operations
- Proper RLS policies that allow public form submissions but restrict admin operations to authenticated users
- Secure admin user management system

## How to Apply the Fixes

### Step 1: Run the Migration
1. Navigate to your Supabase dashboard
2. Go to the SQL Editor
3. Copy and paste the contents of `supabase/migrations/20251211120000_fix_rls_policies.sql`
4. Run the migration

### Step 2: Create Your First Admin User
After running the migration, you need to create your first admin user:

```sql
-- Replace with your actual admin email and user ID
-- First, sign up through your app's admin login, then get the user ID from auth.users
INSERT INTO admin_users (id, email, role)
VALUES (
  'your-user-id-from-auth-users', 
  'admin@yourcompany.com', 
  'admin'
);
```

### Step 3: Verify RLS Policies
Check that all tables have proper RLS policies:

```sql
-- Check RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('appointments', 'prescription_refills', 'contact_submissions', 'newsletter_subscribers', 'chat_messages', 'admin_users');

-- Check policies exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public';
```

## Security Features

### Public Access (Anonymous Users)
- ✅ Can submit appointment requests
- ✅ Can submit prescription refill requests  
- ✅ Can submit contact forms
- ✅ Can subscribe to newsletter
- ✅ Can send chat messages
- ❌ Cannot view, update, or delete any records

### Authenticated Admin Users
- ✅ Can view all records
- ✅ Can update record status, read/archive flags
- ✅ Can delete records (admin/manager roles only)
- ✅ Can manage other admin users (admin role only)

### Role-Based Permissions
- **Admin**: Full access to all operations
- **Manager**: Can view, update, and delete records but cannot manage admin users
- **Viewer**: Can only view records, cannot modify or delete

## Testing the Setup

### 1. Test Public Form Submissions
Try submitting forms from your website without being logged in:
- Appointment booking form
- Contact form
- Newsletter subscription
- Chat messages

### 2. Test Admin Operations
Log in to the admin dashboard and verify:
- You can view all records
- You can mark items as read/unread
- You can archive/unarchive items
- You can update status fields
- You can delete records (if you have admin/manager role)

### 3. Test Error Handling
Try operations that should fail:
- Access admin dashboard without authentication
- Try to delete records with viewer role
- Test network failures (disconnect internet briefly)

## Troubleshooting

### Common Issues

1. **"RLS policy violation" errors**
   - Check that the migration ran successfully
   - Verify your user exists in admin_users table
   - Check that RLS policies are properly created

2. **Cannot delete records**
   - Verify your user role is 'admin' or 'manager'
   - Check the canDelete() function is working correctly

3. **Forms not submitting**
   - Check that anonymous INSERT policies exist
   - Verify table structure matches the form data

### Checking Your Setup

```sql
-- Check if you're in admin_users table
SELECT * FROM admin_users WHERE email = 'your-email@domain.com';

-- Check current user permissions
SELECT auth.uid(), auth.email();

-- Test a simple query
SELECT COUNT(*) FROM appointments;
```

## Best Practices

1. **Regular Security Audits**: Periodically review your RLS policies
2. **Principle of Least Privilege**: Give users only the minimum permissions they need
3. **Monitor Access**: Use Supabase logs to monitor database access
4. **Backup Strategy**: Regular backups before making security changes
5. **Test in Staging**: Always test RLS changes in a staging environment first

## Additional Security Considerations

1. **API Keys**: Ensure you're using the correct Supabase keys (anon key for public, service key only server-side)
2. **HTTPS**: Always use HTTPS in production
3. **Input Validation**: Validate all form inputs on both client and server side
4. **Rate Limiting**: Consider implementing rate limiting for form submissions
5. **Audit Logging**: Consider adding audit trails for sensitive operations

## Support

If you encounter issues:
1. Check the Supabase logs in your dashboard
2. Review the browser console for client-side errors
3. Test individual SQL queries in the Supabase SQL editor
4. Verify your table structure matches the expected schema