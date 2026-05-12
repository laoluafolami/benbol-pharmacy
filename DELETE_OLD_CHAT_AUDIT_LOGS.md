# Delete Old Chat Audit Log Entries

## Problem
Before implementing the per-session chat archive logging fix, individual chat message actions were being logged separately. This created many redundant entries in the audit logs. Now that we've switched to per-session logging, we want to clean up those old individual message entries.

## Solution
Created a SQL migration to delete all old `chat_messages` table entries from the audit logs while keeping the new `chat_sessions` entries.

## What Gets Deleted
- All audit log entries where `table_name = 'chat_messages'`
- These are the old per-message logs from before the per-session fix

## What Gets Kept
- All audit log entries where `table_name = 'chat_sessions'`
- These are the new per-session logs created after the fix
- All other table entries (admin_users, appointments, etc.)

## How to Apply

### Option 1: Using Supabase Dashboard
1. Go to your Supabase project
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase/migrations/20250414000002_delete_old_chat_audit_logs.sql`
4. Click "Run"

### Option 2: Using Supabase CLI
```bash
supabase migration up
```

### Option 3: Manual SQL
```sql
DELETE FROM admin_audit_logs
WHERE table_name = 'chat_messages'
AND created_at < NOW();
```

## Impact
- **Before**: Analytics page shows many individual chat message actions
- **After**: Analytics page shows only the new per-session chat actions
- **Result**: Much cleaner audit trail focused on meaningful session-level operations

## Verification
After running the migration, check the analytics page:
1. The number of total actions should decrease significantly
2. Chat entries should now only show session-level actions (e.g., "Archived chat session with 5 message(s)")
3. Individual message actions should no longer appear

## Rollback
If you need to restore the deleted entries, you would need to restore from a database backup. The migration itself cannot be rolled back without a backup.

## Notes
- This is a one-time cleanup operation
- Future chat actions will use the per-session logging (via `archiveChatSession()` function)
- The deletion is permanent - ensure you're ready before running this migration
