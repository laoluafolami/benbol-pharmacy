# Password Reset Testing Guide

## 🧪 How to Test the New Implementation

### Step 1: Configure Supabase Dashboard
1. Go to your Supabase Dashboard
2. Navigate to **Authentication > Settings**
3. Update **Redirect URLs** to:
   ```
   http://localhost:5173/reset-password
   https://benbolpharmacy.com/reset-password
   ```
4. Go to **Authentication > Email Templates**
5. Update the "Reset Password" template body to use:
   ```html
   <a href="{{ .SiteURL }}/reset-password{{ .TokenHash }}">Reset Password</a>
   ```

### Step 2: Test Locally
1. Start your dev server: `npm run dev`
2. Go to: `http://localhost:5173/#admin`
3. Click "Forgot Password?"
4. Enter your email and send reset request
5. Check your email for the reset link
6. **IMPORTANT**: Open browser console (F12) before clicking the link
7. Click the reset link from email

### Step 3: What to Look For

**In Browser Console:**
```
=== RESET PASSWORD PAGE LOADED ===
URL Analysis: {pathname: "/reset-password", hash: "#access_token=...", ...}
Tokens from hash: {hasAccessToken: true, tokenType: "recovery", ...}
Session established successfully for user: your-email@example.com
```

**On Screen:**
- Should show "Verifying Reset Link" with debug info
- Then show the password reset form
- Debug info shows URL and token status

### Step 4: Expected URL Formats

The reset link should look like:
```
http://localhost:5173/reset-password#access_token=eyJ...&expires_at=...&refresh_token=...&token_type=bearer&type=recovery
```

Or:
```
http://localhost:5173/reset-password?access_token=eyJ...&expires_at=...&refresh_token=...&token_type=bearer&type=recovery
```

### Step 5: Troubleshooting

**If it still goes to homepage:**
1. Check browser console for error messages
2. Verify Supabase redirect URLs are correct
3. Clear browser cache and try incognito window
4. Check that email template uses `/reset-password{{ .TokenHash }}`

**If "No reset token found":**
1. The URL doesn't contain access_token
2. Check Supabase email template configuration
3. Verify redirect URLs in Supabase dashboard

**If "Invalid token type":**
1. Token type is not 'recovery'
2. Request a new password reset

## 🔧 Debug Information

The new implementation shows debug information to help identify issues:

**During verification:**
- Full URL analysis
- Token extraction methods tried
- Which method found the tokens
- Token validation results

**On error:**
- Specific error messages
- URL components breakdown
- Token presence status

## 🚀 Production Deployment

After local testing works:

1. Deploy to production
2. Update Supabase redirect URL to production domain
3. Test with production URL
4. Monitor browser console for any issues

## 📞 Support

If issues persist:
1. Share the browser console logs
2. Share the exact URL from the email
3. Verify Supabase dashboard configuration matches this guide