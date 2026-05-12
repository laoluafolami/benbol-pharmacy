-- Admin action audit logs table
CREATE TABLE admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  admin_email TEXT NOT NULL,
  action TEXT NOT NULL, -- 'create', 'update', 'delete', 'view', 'export'
  table_name TEXT NOT NULL, -- 'appointments', 'refills', 'users', etc.
  record_id TEXT, -- Changed from UUID to TEXT to support numeric IDs
  record_summary TEXT, -- Brief description of what was affected
  changes JSONB, -- Before/after values for updates
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'success' -- 'success', 'failed', 'unauthorized'
);

-- Create indexes for performance
CREATE INDEX idx_audit_logs_admin_id ON admin_audit_logs(admin_id);
CREATE INDEX idx_audit_logs_created_at ON admin_audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_action ON admin_audit_logs(action);
CREATE INDEX idx_audit_logs_table_name ON admin_audit_logs(table_name);

-- Enable RLS
ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for audit logs
-- Allow anyone to insert audit logs (system-generated)
CREATE POLICY "Allow inserting audit logs" ON admin_audit_logs
  FOR INSERT WITH CHECK (true);

-- Only admins can view audit logs
CREATE POLICY "Only admins can view audit logs" ON admin_audit_logs
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM admin_users WHERE role = 'admin')
  );
