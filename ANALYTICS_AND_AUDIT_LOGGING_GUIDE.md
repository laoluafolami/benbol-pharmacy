# Analytics & Audit Logging Implementation Guide

## Overview
This guide covers two separate tracking systems:
1. **Website Analytics** - Track visitor behavior (visits, location, IP, duration)
2. **Admin Audit Logs** - Track admin panel actions (who did what, when)

---

## Part 1: Website Analytics

### Option 1: Google Analytics 4 (Recommended for Most Users)

**Pros:**
- ✅ Free tier (up to 10M hits/month)
- ✅ No database storage needed
- ✅ Beautiful dashboards and reports
- ✅ Location tracking built-in
- ✅ Session duration tracking
- ✅ Easy to implement

**Cons:**
- ❌ Data stored on Google servers
- ❌ Privacy policy must disclose Google Analytics
- ❌ Limited real-time data (24-hour delay)

**Implementation:**
1. Create Google Analytics account at https://analytics.google.com
2. Add tracking code to your app (one-time setup)
3. View reports in GA4 dashboard

**Cost:** Free

---

### Option 2: Supabase + Custom Analytics (Recommended for Privacy)

**Pros:**
- ✅ Full data ownership (stored in your Supabase)
- ✅ Real-time analytics
- ✅ IP address tracking
- ✅ Complete control over data
- ✅ GDPR compliant (you control the data)

**Cons:**
- ❌ Requires database setup
- ❌ Need to build custom dashboard
- ❌ More development work

**Implementation:**
1. Create analytics tables in Supabase
2. Track visits on app load
3. Build custom analytics dashboard

**Cost:** Free (uses your existing Supabase)

---

### Option 3: Plausible Analytics (Privacy-Focused)

**Pros:**
- ✅ GDPR compliant (no cookies)
- ✅ Simple, clean interface
- ✅ Real-time analytics
- ✅ No data selling

**Cons:**
- ❌ Paid service ($9-20/month)
- ❌ Limited free trial

**Cost:** $9-20/month

---

## Part 2: Admin Audit Logs

### Implementation Strategy

Track all admin actions in Supabase with:
- **Who** - Admin user ID and name
- **What** - Action performed (create, edit, delete, view)
- **When** - Timestamp
- **Where** - Which page/table
- **Details** - What changed (before/after values)

---

## Recommended Combined Solution

**For Website Analytics:** Google Analytics 4 (easiest, free)
**For Admin Audit Logs:** Supabase custom tables (full control)

---

# Implementation Plan

## Step 1: Website Analytics with Google Analytics 4

### 1.1 Create GA4 Account
1. Go to https://analytics.google.com
2. Click "Start measuring"
3. Create new property for "benbolpharmacy"
4. Get your **Measurement ID** (format: G-XXXXXXXXXX)

### 1.2 Add GA4 to Your App

Create file: `src/lib/analytics.ts`

```typescript
// Initialize Google Analytics
export function initializeAnalytics() {
  // Load GA4 script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${import.meta.env.VITE_GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    window.dataLayer.push(arguments);
  }
  gtag('js', new Date());
  gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID);
}

// Track page views
export function trackPageView(pageName: string) {
  if (window.gtag) {
    window.gtag('event', 'page_view', {
      page_title: pageName,
      page_path: window.location.pathname,
    });
  }
}

// Track custom events
export function trackEvent(eventName: string, eventData?: Record<string, any>) {
  if (window.gtag) {
    window.gtag('event', eventName, eventData);
  }
}
```

### 1.3 Add to App.tsx

```typescript
import { initializeAnalytics, trackPageView } from './lib/analytics';

// In useEffect on app load
useEffect(() => {
  initializeAnalytics();
}, []);

// Track page changes
useEffect(() => {
  trackPageView(currentPage);
}, [currentPage]);
```

### 1.4 Add Environment Variable

Add to `.env`:
```
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Result:** GA4 now tracks all visits, location, duration, and user behavior.

---

## Step 2: Admin Audit Logs with Supabase

### 2.1 Create Audit Log Tables

Create migration file: `supabase/migrations/20250414000000_create_audit_logs.sql`

```sql
-- Admin action audit logs
CREATE TABLE admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  admin_email TEXT NOT NULL,
  action TEXT NOT NULL, -- 'create', 'update', 'delete', 'view', 'export'
  table_name TEXT NOT NULL, -- 'appointments', 'refills', 'users', etc.
  record_id UUID,
  record_summary TEXT, -- Brief description of what was affected
  changes JSONB, -- Before/after values for updates
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'success' -- 'success', 'failed', 'unauthorized'
);

-- Website visitor analytics
CREATE TABLE website_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id TEXT NOT NULL, -- Anonymous visitor ID
  page_visited TEXT NOT NULL,
  referrer TEXT,
  session_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_end TIMESTAMP WITH TIME ZONE,
  duration_seconds INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_audit_logs_admin_id ON admin_audit_logs(admin_id);
CREATE INDEX idx_audit_logs_created_at ON admin_audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_action ON admin_audit_logs(action);
CREATE INDEX idx_analytics_visitor_id ON website_analytics(visitor_id);
CREATE INDEX idx_analytics_created_at ON website_analytics(created_at DESC);

-- Enable RLS
ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for audit logs (only admins can view)
CREATE POLICY "Admins can view audit logs" ON admin_audit_logs
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM admin_users WHERE role = 'admin')
  );

CREATE POLICY "System can insert audit logs" ON admin_audit_logs
  FOR INSERT WITH CHECK (true);

-- RLS Policies for analytics (only admins can view)
CREATE POLICY "Admins can view analytics" ON website_analytics
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM admin_users WHERE role = 'admin')
  );

CREATE POLICY "System can insert analytics" ON website_analytics
  FOR INSERT WITH CHECK (true);
```

### 2.2 Create Audit Logging Utility

Create file: `src/lib/auditLog.ts`

```typescript
import { supabase } from './supabase';

interface AuditLogEntry {
  action: 'create' | 'update' | 'delete' | 'view' | 'export';
  tableName: string;
  recordId?: string;
  recordSummary?: string;
  changes?: Record<string, any>;
  status?: 'success' | 'failed' | 'unauthorized';
}

export async function logAdminAction(
  adminId: string,
  adminEmail: string,
  entry: AuditLogEntry
) {
  try {
    // Get IP address and user agent
    const ipAddress = await getClientIpAddress();
    const userAgent = navigator.userAgent;

    const { error } = await supabase
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
    }
  } catch (err) {
    console.error('Error logging admin action:', err);
  }
}

async function getClientIpAddress(): Promise<string> {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch {
    return 'unknown';
  }
}

// Example usage in AdminDashboard.tsx
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
```

### 2.3 Integrate Audit Logging into Admin Actions

Example in `AdminUsersPage.tsx`:

```typescript
import { logUserCreation, logUserUpdate, logUserDeletion } from '../lib/auditLog';

// When creating a user
const handleCreateUser = async (userData: any) => {
  try {
    // ... existing user creation code ...
    
    // Log the action
    await logUserCreation(currentAdmin.id, currentAdmin.email, userData);
  } catch (error) {
    console.error('Error creating user:', error);
  }
};

// When updating a user
const handleUpdateUser = async (userId: string, oldData: any, newData: any) => {
  try {
    // ... existing update code ...
    
    // Log the action
    await logUserUpdate(currentAdmin.id, currentAdmin.email, userId, oldData, newData);
  } catch (error) {
    console.error('Error updating user:', error);
  }
};

// When deleting a user
const handleDeleteUser = async (userId: string, userData: any) => {
  try {
    // ... existing delete code ...
    
    // Log the action
    await logUserDeletion(currentAdmin.id, currentAdmin.email, userId, userData);
  } catch (error) {
    console.error('Error deleting user:', error);
  }
};
```

---

## Step 3: Create Admin Analytics Dashboard

Add new tab in AdminDashboard.tsx to view:
- Recent admin actions
- User activity timeline
- Who accessed what and when
- Changes made to records

---

## Summary of Solutions

| Feature | Solution | Cost | Effort |
|---------|----------|------|--------|
| Website visits | Google Analytics 4 | Free | Low |
| Location tracking | Google Analytics 4 | Free | Low |
| IP address | Google Analytics 4 | Free | Low |
| Visit duration | Google Analytics 4 | Free | Low |
| Admin action tracking | Supabase custom tables | Free | Medium |
| Who did what | Supabase custom tables | Free | Medium |
| When actions occurred | Supabase custom tables | Free | Medium |
| Before/after changes | Supabase custom tables | Free | Medium |

---

## Privacy & Compliance

⚠️ **Important Considerations:**

1. **GDPR Compliance**
   - Disclose analytics in Privacy Policy
   - Get user consent for tracking
   - Allow users to opt-out

2. **Data Retention**
   - Set retention policy (e.g., delete after 90 days)
   - Archive old logs periodically

3. **Admin Audit Logs**
   - Keep indefinitely for compliance
   - Restrict access to admins only
   - Never share with third parties

---

## Recommended Implementation Order

1. **Week 1**: Set up Google Analytics 4 (easiest, immediate value)
2. **Week 2**: Create Supabase audit log tables
3. **Week 3**: Integrate audit logging into admin actions
4. **Week 4**: Build admin analytics dashboard

---

## Next Steps

Would you like me to:
1. Set up Google Analytics 4 integration in your code?
2. Create the Supabase migration for audit logs?
3. Build the audit logging utility functions?
4. Create an admin analytics dashboard page?

Let me know which you'd like to implement first!

---

**Created**: April 14, 2026
**Status**: Ready for implementation
**Recommended Start**: Google Analytics 4 (simplest, immediate results)
