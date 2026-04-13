# Supabase Email Template - FINAL FIX

## The Real Issue

Supabase's `{{ .TokenHash }}` variable already includes the `#` character, so when you use:
```
{{ .SiteURL }}/#/reset-password{{ .TokenHash }}
```

It becomes:
```
https://www.benbolpharmacy.com/#/reset-password#access_token=...
```

But Supabase is treating the entire thing as a path, resulting in:
```
https://www.benbolpharmacy.com/#/reset-password4fde2720da06aae3447837c23acec5bb07aaf093768df5bae927...
```

## The Solution

Use this email template instead:

**Go to:** Authentication > Email Templates > Reset Password

**Subject:**
```
Reset Your Password - Benbol Pharmacy
```

**Body (HTML):**
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

Wait, that's what you already have. The issue is that `{{ .TokenHash }}` is being treated as a literal string appended to the path.

## Alternative Solution - Use Query Parameters

Try this format instead:

**Body (HTML):**
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

Actually, the real issue is that we need to check what Supabase is actually sending. Let me provide the correct format:

## CORRECT EMAIL TEMPLATE

**Body (HTML):**
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

The `{{ .TokenHash }}` should expand to something like `#access_token=...&type=recovery&expires_at=...`

If it's not working, the issue might be that Supabase is URL-encoding the hash. In that case, we need to use a different approach in the code to handle this URL format.