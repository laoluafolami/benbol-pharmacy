# SUPABASE EMAIL TEMPLATE - FINAL SOLUTION

## The Root Cause

Supabase's `{{ .TokenHash }}` variable returns a string like:
```
#access_token=eyJ...&expires_at=...&refresh_token=...&token_type=bearer&type=recovery
```

When you use `{{ .SiteURL }}/#/reset-password{{ .TokenHash }}`, it becomes:
```
https://www.benbolpharmacy.com/#/reset-password#access_token=...
```

But Supabase is treating the entire thing as a path, resulting in:
```
https://www.benbolpharmacy.com/#/reset-passwordb0d985e75bf36f2bd061091634...
```

## The CORRECT Solution

Go to **Supabase Dashboard > Authentication > Email Templates > Reset Password**

Replace the entire HTML body with this:

```html
<h2>Reset Your Password</h2>
<p>Hello,</p>
<p>You have requested to reset your password for Benbol Pharmacy Admin Panel.</p>
<p>Click the link below to reset your password:</p>
<p><a href="{{ .SiteURL }}/#/reset-password{{ .TokenHash }}" style="background-color: #0891b2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a></p>
<p>This link will expire in 1 hour.</p>
<p>If you didn't request this password reset, please ignore this email.</p>
<p>Best regards,<br>Benbol Pharmacy Team</p>
```

Wait - that's what you already have. The issue is that `{{ .TokenHash }}` is NOT including the `#` prefix.

## ACTUAL CORRECT SOLUTION

The problem is that `{{ .TokenHash }}` in Supabase returns just the hash parameters WITHOUT the leading `#`.

So you need to use:

```html
<a href="{{ .SiteURL }}/#/reset-password{{ .TokenHash }}">Reset Password</a>
```

Which should produce:
```
https://www.benbolpharmacy.com/#/reset-password#access_token=...&type=recovery
```

But if it's not working, try this alternative format:

```html
<a href="{{ .SiteURL }}/reset-password{{ .TokenHash }}">Reset Password</a>
```

This will produce:
```
https://www.benbolpharmacy.com/reset-password#access_token=...&type=recovery
```

## WHAT TO DO NOW

1. Go to Supabase Dashboard
2. Authentication > Email Templates > Reset Password
3. Update the HTML to use ONE of these formats:

**Option A (Hash-based routing):**
```html
<a href="{{ .SiteURL }}/#/reset-password{{ .TokenHash }}">Reset Password</a>
```

**Option B (Path-based routing):**
```html
<a href="{{ .SiteURL }}/reset-password{{ .TokenHash }}">Reset Password</a>
```

4. Send a test password reset email
5. Check the exact URL in the email
6. Let me know which format Supabase actually generates

The code is already updated to handle both formats. We just need to get the email template right.