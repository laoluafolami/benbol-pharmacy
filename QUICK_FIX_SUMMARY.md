# Quick Fix Summary - Audit Logging Not Capturing

## Root Cause
The `record_id` field in the database was UUID type, but we were passing numeric IDs from tables with numeric primary keys.

## Solution
1. Change `record_id` from UUID to TEXT in the database
2. Run the new migration file

## Action Required

### In Supabase Dashboard:
1. Go to **SQL Editor**
2. Copy and run this SQL:

```sql
-- Drop the old table and recreate it with the correct schema
DROP TABLE IF EXISTS admin_audit_logs CASCADE;

-- Recreate the table with TEXT record_id
CREATE TABLE admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  admin_email TEXT NOT NULL,
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id TEXT,
  record_summary TEXT,
  changes JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'success'
);

CREATE INDEX idx_audit_logs_admin_id ON admin_audit_logs(admin_id);
CREATE INDEX idx_audit_logs_created_at ON admin_audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_action ON admin_audit_logs(action);
CREATE INDEX idx_audit_logs_table_name ON admin_audit_logs(table_name);

ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow inserting audit logs" ON admin_audit_logs
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Only admins can view audit logs" ON admin_audit_logs
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM admin_users WHERE role = 'admin')
  );
```

3. Click **Execute**

## Test It
1. Go to Admin Dashboard
2. Mark a contact as read
3. Open browser console (F12)
4. Look for: `"Admin action logged successfully"`
5. Go to Analytics page
6. Refresh and check if dropdowns now show data

## Files Changed
- `supabase/migrations/20250414000000_create_audit_logs.sql` - Updated
- `supabase/migrations/20250414000001_fix_audit_logs_record_id.sql` - New migration
- `src/lib/auditLog.ts` - Better error logging

That's it! The audit logging should work after running the SQL.
