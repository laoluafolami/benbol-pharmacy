# Chat Session Read Status Fix

## Problem
When marking a chat session as read, the code was looping through each message and calling `toggleReadStatus()` for each message individually. This created separate audit log entries for each message, flooding the analytics page with redundant entries.

**Example**: Marking a session with 10 messages as read would create 10 separate audit log entries instead of 1.

## Solution
Created a new dedicated function `markChatSessionAsRead()` that:

1. **Marks all messages in the session as read at once** - Uses a single database update with `.in()` to update all messages in one query
2. **Creates a single audit log entry** - Logs the entire session read action as one entry with:
   - `tableName: 'chat_sessions'` (instead of 'chat_messages')
   - `recordId: sessionId` (the session ID)
   - `recordSummary` includes message count: "Marked chat session as read (X message(s))"
   - `changes` includes both the read status and message count for context

## Changes Made

### File: `src/pages/AdminDashboard.tsx`

#### 1. Added new function `markChatSessionAsRead()` (after `toggleReadStatus()`)
```typescript
const markChatSessionAsRead = async (sessionId: string, messages: ChatMessage[], currentStatus?: boolean) => {
  // Permission check
  // Optimistic UI update for all messages in session
  // Single database update for all messages
  // Single audit log entry for the entire session
}
```

#### 2. Updated read button click handler
**Before:**
```typescript
onClick={() => {
  session.messages.forEach(msg => {
    toggleReadStatus('chat_messages', msg.id, msg.is_read);
  });
}}
```

**After:**
```typescript
onClick={() => {
  markChatSessionAsRead(session.sessionId, session.messages, session.hasUnread ? false : true);
}}
```

## Benefits

1. **Cleaner Audit Trail** - One log entry per session read action instead of N entries
2. **Better Performance** - Single database update instead of N updates
3. **Improved Analytics** - Session-level actions are now properly tracked as session actions
4. **Consistency** - Follows the same pattern as `archiveChatSession()` function

## Audit Log Examples

### Before (10 separate entries for a 10-message session):
- Updated chat_messages record #1: Marked as read
- Updated chat_messages record #2: Marked as read
- Updated chat_messages record #3: Marked as read
- ... (7 more entries)

### After (1 entry):
- Updated chat_sessions session-123: Marked chat session as read (10 message(s))

## Related Functions
This fix follows the same pattern as the `archiveChatSession()` function that was implemented earlier. Both functions now treat chat operations at the session level rather than per-message level.

## Testing
To verify the fix works:
1. Mark a chat session as read
2. Check the analytics page - should see ONE entry for the session read action
3. The entry should show the session ID and message count in the summary
4. Repeat for marking as unread - should also create a single entry

## Database Cleanup
If you have old per-message read entries in the audit logs, you can clean them up using the migration:
`supabase/migrations/20250414000002_delete_old_chat_audit_logs.sql`

This will delete all old `chat_messages` entries while keeping the new `chat_sessions` entries.
