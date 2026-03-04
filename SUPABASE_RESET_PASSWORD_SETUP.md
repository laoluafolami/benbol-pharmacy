# Supabase Password Reset Setup Guide

## Issue
Password reset works on localhost but not on Netlify deployment.

## Solution Steps

### 1. Update Supabase Project Settings

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **URL Configuration**
3. Update the following settings:

**Site URL:**
```
https://your-netlify-domain.netlify.app
```

**Redirect URLs:**
```
https://your-netlify-domain.netlify.app/reset-password
https://your-netlify-domain.netlify.app/**
http://localhost:5173/reset-password (for development)
http://localhost:5173/**
```

### 2. Verify Email Templates

1. Go to **Authentication** → **Email Templates**
2. Click on **Reset Password**
3. Ensure the redirect URL in the template uses: `{{ .SiteURL }}/reset-password`

### 3. Test the Flow

1. Deploy your latest changes to Netlify
2. Go to your admin login page
3. Click "Forgot Password?"
4. Enter your email
5. Check the email and click the reset link
6. It should now redirect to your Netlify domain's reset password page

### 4. Debugging

If it still doesn't work, check the browser console for:
- "Password reset redirect URL" log message
- "Detected password reset flow" log message
- Any error messages from Supabase

### 5. Common Issues

**Issue:** Email links still point to localhost
**Solution:** Clear your browser cache and ensure Supabase Site URL is set correctly

**Issue:** "Invalid session" error
**Solution:** Check that the redirect URLs in Supabase include your Netlify domain

**Issue:** Blank page on Netlify
**Solution:** Ensure netlify.toml has the redirect rule (already configured in your project)

## Current Configuration

Your project is already configured with:
- ✅ Dynamic redirect URL detection
- ✅ Enhanced session handling for URL tokens
- ✅ Proper error handling and logging
- ✅ Netlify redirect rules in netlify.toml

The main issue is likely the Supabase project configuration needing your production domain.