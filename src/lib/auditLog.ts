import { supabase } from './supabase';

interface AuditLogEntry {
  action: 'create' | 'update' | 'delete' | 'view' | 'export';
  tableName: string;
  recordId?: string;
  recordSummary?: string;
  changes?: Record<string, any>;
  status?: 'success' | 'failed' | 'unauthorized';
}

/**
 * Log admin actions to the audit log table
 */
export async function logAdminAction(
  adminId: string,
  adminEmail: string,
  entry: AuditLogEntry
) {
  try {
    const ipAddress = await getClientIpAddress();
    const userAgent = navigator.userAgent;

    console.log('Logging admin action:', { adminId, adminEmail, entry });

    const { data, error } = await supabase
      .from('admin_audit_logs')
      .insert({
        admin_id: adminId,
        admin_email: adminEmail,
        action: entry.action,
        table_name: entry.tableName,
        record_id: entry.recordId,
        record_summary: entry.recordSummary,
        changes: entry.changes,
        ip_address: ipAddress,
        user_agent: userAgent,
        status: entry.status || 'success',
      });

    if (error) {
      console.error('Failed to log admin action:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
    } else {
      console.log('Admin action logged successfully', data);
    }
  } catch (err) {
    console.error('Error logging admin action:', err);
  }
}

/**
 * Get client IP address from ipify API
 */
async function getClientIpAddress(): Promise<string> {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch {
    return 'unknown';
  }
}

/**
 * Log user creation
 */
export async function logUserCreation(
  adminId: string,
  adminEmail: string,
  userData: any
) {
  await logAdminAction(adminId, adminEmail, {
    action: 'create',
    tableName: 'admin_users',
    recordSummary: `Created user: ${userData.email}`,
    changes: { created: userData },
    status: 'success',
  });
}

/**
 * Log user update
 */
export async function logUserUpdate(
  adminId: string,
  adminEmail: string,
  userId: string,
  oldData: any,
  newData: any
) {
  await logAdminAction(adminId, adminEmail, {
    action: 'update',
    tableName: 'admin_users',
    recordId: userId,
    recordSummary: `Updated user: ${newData.email}`,
    changes: { before: oldData, after: newData },
    status: 'success',
  });
}

/**
 * Log user deletion
 */
export async function logUserDeletion(
  adminId: string,
  adminEmail: string,
  userId: string,
  userData: any
) {
  await logAdminAction(adminId, adminEmail, {
    action: 'delete',
    tableName: 'admin_users',
    recordId: userId,
    recordSummary: `Deleted user: ${userData.email}`,
    changes: { deleted: userData },
    status: 'success',
  });
}

/**
 * Log appointment action
 */
export async function logAppointmentAction(
  adminId: string,
  adminEmail: string,
  action: 'create' | 'update' | 'delete' | 'view',
  appointmentId: string,
  summary: string,
  changes?: Record<string, any>
) {
  await logAdminAction(adminId, adminEmail, {
    action,
    tableName: 'appointments',
    recordId: appointmentId,
    recordSummary: summary,
    changes,
    status: 'success',
  });
}

/**
 * Log refill action
 */
export async function logRefillAction(
  adminId: string,
  adminEmail: string,
  action: 'create' | 'update' | 'delete' | 'view',
  refillId: string,
  summary: string,
  changes?: Record<string, any>
) {
  await logAdminAction(adminId, adminEmail, {
    action,
    tableName: 'prescription_refills',
    recordId: refillId,
    recordSummary: summary,
    changes,
    status: 'success',
  });
}

/**
 * Fetch audit logs (admin only)
 */
export async function fetchAuditLogs(limit: number = 100, offset: number = 0) {
  try {
    const { data, error } = await supabase
      .from('admin_audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Failed to fetch audit logs:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Error fetching audit logs:', err);
    return [];
  }
}

/**
 * Fetch audit logs by admin
 */
export async function fetchAuditLogsByAdmin(adminId: string, limit: number = 50) {
  try {
    const { data, error } = await supabase
      .from('admin_audit_logs')
      .select('*')
      .eq('admin_id', adminId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Failed to fetch audit logs:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Error fetching audit logs:', err);
    return [];
  }
}

/**
 * Fetch audit logs by action type
 */
export async function fetchAuditLogsByAction(action: string, limit: number = 50) {
  try {
    const { data, error } = await supabase
      .from('admin_audit_logs')
      .select('*')
      .eq('action', action)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Failed to fetch audit logs:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Error fetching audit logs:', err);
    return [];
  }
}

/**
 * Get audit log statistics
 */
export async function getAuditLogStats() {
  try {
    const { data, error } = await supabase
      .from('admin_audit_logs')
      .select('*');

    if (error) {
      console.error('Failed to fetch audit stats:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Error fetching audit stats:', err);
    return null;
  }
}


/**
 * Log admin login
 */
export async function logAdminLogin(
  adminId: string,
  adminEmail: string,
  success: boolean,
  failureReason?: string
) {
  try {
    await logAdminAction(adminId, adminEmail, {
      action: 'view',
      tableName: 'admin_auth',
      recordSummary: success ? `Admin login successful` : `Admin login failed: ${failureReason || 'Unknown reason'}`,
      changes: { login_success: success, failure_reason: failureReason },
      status: success ? 'success' : 'failed',
    });
  } catch (err) {
    console.error('Error logging admin login:', err);
  }
}

/**
 * Log admin password change
 */
export async function logPasswordChange(
  adminId: string,
  adminEmail: string,
  success: boolean,
  reason?: string
) {
  try {
    await logAdminAction(adminId, adminEmail, {
      action: 'update',
      tableName: 'admin_auth',
      recordId: adminId,
      recordSummary: success ? `Password changed` : `Password change failed: ${reason || 'Unknown reason'}`,
      changes: { password_changed: success },
      status: success ? 'success' : 'failed',
    });
  } catch (err) {
    console.error('Error logging password change:', err);
  }
}

/**
 * Log admin logout
 */
export async function logAdminLogout(
  adminId: string,
  adminEmail: string
) {
  try {
    await logAdminAction(adminId, adminEmail, {
      action: 'view',
      tableName: 'admin_auth',
      recordSummary: `Admin logout`,
      status: 'success',
    });
  } catch (err) {
    console.error('Error logging admin logout:', err);
  }
}
