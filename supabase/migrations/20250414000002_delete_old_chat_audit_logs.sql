-- Delete old chat audit log entries (before per-session fix)
-- This removes the individual chat_messages entries that were logged before
-- the archiveChatSession function was implemented
DELETE FROM admin_audit_logs
WHERE table_name = 'chat_messages'
AND created_at < NOW();

-- Note: Keep chat_sessions entries as they are the new per-session logs
-- Only chat_messages entries are deleted to clean up the old per-message logs
