# Password Reset - Production Deployment Checklist

## ✅ Code Changes Completed

All code has been updated and deployed. The following files have been modified:

- ✅ `src/App.tsx` - Smart URL detection for reset password
- ✅ `src/pages/ResetPasswordPage.tsx` - Enhanced token extraction with debugging
- ✅ `src/lib/auth.ts` - Updated to use `https://www.benbolpharmacy.com/reset-password`

## 🔧 REQUIRED: Supabase Dashboard Configuration

You MUST configure these settings in your Supabase dashboard for password reset to work:

### 1. Site URL
**Path:** Authentication > Settings > Site URL
```
https://www.benbolpharmacy.com
```

### 2. Redirect URLs
**Path:** Authentication > Settings > Redirect URLs
```
https://www.benbolpharmacy.com/reset-password
```

⚠️ **IMPORTANT**: Include the `www` subdomain

### 3. Email Template
**Path:** Authentication > Email Templates > Reset Password

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
<p><a href="{{ .SiteURL }}/reset-password{{ .TokenHash }}" style="background-color: #0891b2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a></p>
<p>This link will expire in 1 hour.</p>
<p>If you didn't request this password reset, please ignore this email.</p>
<p>Best regards,<br>Benbol Pharmacy Team</p>
```

## 🚀 Deployment Steps

1. **Deploy code to production** (www.benbolpharmacy.com)
2. **Configure Supabase** using the settings above
3. **Test password reset** on production
4. **Monitor browser console** for debug logs

## 🧪 Testing

1. Go to: `https://www.benbolpharmacy.com/#admin`
2. Click "Forgot Password?"
3. Enter your email
4. Click "Send Reset Email"
5. Check email for reset link
6. Click the link
7. Should show password reset form
8. Enter new password and confirm
9. Should redirect to admin login

## 🔍 Debug Information

If issues occur, open browser console (F12) and look for:
- `=== RESET PASSWORD PAGE LOADED ===`
- URL Analysis showing pathname and tokens
- Token extraction method used
- Session establishment confirmation

## ⚠️ Common Issues

**Still redirects to homepage:**
- Verify Supabase Site URL is `https://www.benbolpharmacy.com`
- Verify Redirect URL is `https://www.benbolpharmacy.com/reset-password`
- Clear browser cache

**"No reset token found":**
- Check email template uses `/reset-password{{ .TokenHash }}`
- Resend password reset email

**Email not received:**
- Check spam folder
- Verify email address in admin_users table
- Wait 5-10 minutes for delivery

## 📋 Final Checklist

- [ ] Code deployed to production
- [ ] Supabase Site URL configured
- [ ] Supabase Redirect URL configured
- [ ] Email template updated
- [ ] Password reset tested successfully
- [ ] Browser console shows success logs
- [ ] Tested with multiple email addresses