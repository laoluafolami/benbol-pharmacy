# Exclude Chat Actions from Analytics Page

## Problem
The analytics page was displaying too many chat-related actions (chat_messages and chat_sessions), cluttering the audit log view and making it difficult to see important admin actions on other tables.

## Solution
Updated the AdminAnalyticsPage to automatically filter out all chat-related audit log entries from both the display and statistics calculations.

## Changes Made

### File: `src/pages/AdminAnalyticsPage.tsx`

#### 1. Updated Filter Logic
Added a filter to exclude chat-related tables from the filtered logs:

```typescript
// Exclude chat-related actions
filtered = filtered.filter(log => 
  log.table_name !== 'chat_messages' && log.table_name !== 'chat_sessions'
);
```

This filter is applied before any other filters (admin or action type), ensuring chat actions are never displayed.

#### 2. Updated Statistics Calculation
Modified the stats object to exclude chat actions from all counts:

```typescript
const stats = {
  totalActions: auditLogs.filter(log => log.table_name !== 'chat_messages' && log.table_name !== 'chat_sessions').length,
  creates: auditLogs.filter(log => log.action === 'create' && log.table_name !== 'chat_messages' && log.table_name !== 'chat_sessions').length,
  updates: auditLogs.filter(log => log.action === 'update' && log.table_name !== 'chat_messages' && log.table_name !== 'chat_sessions').length,
  deletes: auditLogs.filter(log => log.action === 'delete' && log.table_name !== 'chat_messages' && log.table_name !== 'chat_sessions').length,
  uniqueAdmins: [...new Set(auditLogs.filter(log => log.table_name !== 'chat_messages' && log.table_name !== 'chat_sessions').map(log => log.admin_email))].length,
};
```

## Impact

### What's Hidden
- All `chat_messages` table actions
- All `chat_sessions` table actions

### What's Still Visible
- Admin user management actions (admin_users table)
- Appointment actions (appointments table)
- Prescription refill actions (prescription_refills table)
- Contact submission actions (contact_submissions table)
- Newsletter subscriber actions (newsletter_subscribers table)

### Statistics Updated
- Total Actions count now excludes chat actions
- Created/Updated/Deleted counts now exclude chat actions
- Active Admins count now based only on non-chat actions

## Benefits

1. **Cleaner Analytics View** - Focus on important admin actions
2. **Better Performance** - Fewer rows to display and filter
3. **Accurate Statistics** - Stats reflect only meaningful admin operations
4. **Automatic Filtering** - No manual configuration needed

## Note
Chat actions are still being logged in the database for audit purposes. They're just hidden from the analytics page display. If you need to view chat actions in the future, you can modify this filter or create a separate chat analytics view.
