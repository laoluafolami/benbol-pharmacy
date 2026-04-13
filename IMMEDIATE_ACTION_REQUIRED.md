# 🚨 IMMEDIATE ACTION REQUIRED - Password Reset Fix

## The Problem
Your email template is sending URLs like:
```
https://www.benbolpharmacy.com/reset-password2097eb9247a7505e1bff87e007b8e3663024e34fa584650d5041857c
```

It should be sending:
```
https://www.benbolpharmacy.com/#/reset-password#access_token=...&type=recovery
```

## The Solution - DO THIS NOW

### Step 1: Go to Supabase Dashboard
1. Open your Supabase project
2. Go to **Authentication > Email Templates**
3. Click on **Reset Password**

### Step 2: Update the Email Template
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

**KEY PART:** `{{ .SiteURL }}/#/reset-password{{ .TokenHash }}`

### Step 3: Save and Test
1. Click Save
2. Request a new password reset
3. Check the email for the reset link
4. Verify it contains: `/#/reset-password#access_token=`
5. Click the link - it should now work!

## What Changed in Code
- ✅ `src/App.tsx` - Updated to detect hash-based reset URLs
- ✅ `src/lib/auth.ts` - Updated to use `/#/reset-password` redirect
- ✅ `src/pages/ResetPasswordPage.tsx` - Already handles hash-based tokens

## Verification Checklist
- [ ] Updated Supabase email template
- [ ] Email template uses `{{ .SiteURL }}/#/reset-password{{ .TokenHash }}`
- [ ] Requested new password reset
- [ ] Verified email URL contains `/#/reset-password#access_token=`
- [ ] Clicked reset link and saw password form
- [ ] Successfully reset password
- [ ] Redirected to admin login

That's it! The code is already deployed and ready. Just update the email template in Supabase.