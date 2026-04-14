# Chat Session Archive Logging Fix

## Problem
When archiving a chat session, the code was looping through each message and calling `toggleArchiveStatus()` for each message individually. This created separate audit log entries for each message instead of a single entry for the entire session.

**Example**: Archiving a session with 5 messages would create 5 separate audit log entries, making it difficult to track session-level actions.

## Solution
Created a new dedicated function `archiveChatSession()` that:

1. **Archives all messages in the session at once** - Uses a single database update with `.in()` to update all messages in one query
2. **Creates a single audit log entry** - Logs the entire session archive as one action with:
   - `tableName: 'chat_sessions'` (instead of 'chat_messages')
   - `recordId: sessionId` (the session ID)
   - `recordSummary` includes message count: "Archived chat session with X message(s)"
   - `changes` includes both the archive status and message count for context

## Changes Made

### File: `src/pages/AdminDashboard.tsx`

#### 1. Added new function `archiveChatSession()` (after `toggleArchiveStatus()`)
```typescript
const archiveChatSession = async (sessionId: string, messages: ChatMessage[], currentStatus?: boolean) => {
  // Permission check
  // Optimistic UI update for all messages in session
  // Single database update for all messages
  // Single audit log entry for the entire session
}
```

#### 2. Updated archive button click handler
**Before:**
```typescript
onClick={() => {
  session.messages.forEach(msg => {
    toggleArchiveStatus('chat_messages', msg.id, msg.is_archived);
  });
}}
```

**After:**
```typescript
onClick={() => {
  archiveChatSession(session.sessionId, session.messages, session.isArchived);
}}
```

## Benefits

1. **Cleaner Audit Trail** - One log entry per session archive instead of multiple entries
2. **Better Performance** - Single database update instead of N updates
3. **Improved Analytics** - Session-level actions are now properly tracked as session actions
4. **Consistency** - Follows the same pattern as other session-level operations

## Audit Log Example

**Before (5 separate entries):**
- Updated chat_messages record #1: Archived
- Updated chat_messages record #2: Archived
- Updated chat_messages record #3: Archived
- Updated chat_messages record #4: Archived
- Updated chat_messages record #5: Archived

**After (1 entry):**
- Updated chat_sessions session-123: Archived chat session with 5 message(s)

## Testing
To verify the fix works:
1. Archive a chat session with multiple messages
2. Check the analytics page - should see ONE entry for the session archive
3. The entry should show the session ID and message count in the summary
