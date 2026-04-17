# Uptime Robot Keep-Alive Setup Guide

## Overview
This guide explains how to set up Uptime Robot to keep your Supabase database from sleeping on the free tier. The implementation is now complete in your codebase.

## What Was Implemented

### 1. Keep-Alive Function (`src/lib/keepAlive.ts`)
- Created a lightweight database connection check
- Performs a minimal query to `admin_users` table (just fetches 1 ID)
- Resets the Supabase inactivity timer without heavy load
- Includes error handling and logging

### 2. HomePage Integration (`src/pages/HomePage.tsx`)
- Keep-alive function is called when HomePage loads
- Runs silently in the background (no UI changes)
- Works alongside existing carousel functionality
- Non-blocking - doesn't affect page performance

## How It Works

1. **User visits your site** → HomePage loads
2. **Keep-alive function triggers** → Establishes Supabase connection
3. **Inactivity timer resets** → Database stays awake
4. **Uptime Robot pings periodically** → Keeps the cycle going

## Uptime Robot Setup Instructions

### Step 1: Create Uptime Robot Account
- Go to https://uptimerobot.com
- Sign up for a free account
- Verify your email

### Step 2: Create a New Monitor
1. Click "Add New Monitor"
2. Configure as follows:
   - **Monitor Type**: HTTP(s)
   - **Friendly Name**: "Benbol Pharmacy Keep-Alive"
   - **URL**: `https://www.benbolpharmacy.com`
   - **Monitoring Interval**: Every 24 hours (1440 minutes) - **Maximum available interval**
   - **Alert Contacts**: Add your email

### Step 3: Activate Monitor
- Click "Create Monitor"
- Monitor will start pinging your site every 24 hours
- Each ping triggers the keep-alive check automatically
- This is well within safe limits for both Supabase and Uptime Robot

## Why This Works with Hostinger

✅ **Hostinger Business Web Hosting** supports:
- External HTTP requests (Uptime Robot pings)
- Supabase client-side connections
- React/Vite applications
- Environment variables for Supabase credentials

The keep-alive function runs on the client-side (in the browser), so it doesn't require any backend changes on Hostinger.

## Monitoring

### Check if It's Working
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for messages like: `[Keep-Alive] Database connection check successful at [timestamp]`
4. This confirms the function is running

### Uptime Robot Dashboard
- Monitor your site's uptime status
- View ping history
- Get alerts if your site goes down

## Important Notes

⚠️ **Database Sleep Behavior**:
- Supabase free tier sleeps after **7 days of inactivity**
- "Inactivity" = no database connections established
- Uptime Robot pinging every 24 hours keeps it awake (well before the 7-day threshold)
- The keep-alive function establishes a connection, resetting the timer

⚠️ **Rate Limits - NO CONCERNS**:
- **Uptime Robot**: 1 ping per 24 hours = 30 pings/month (well within limits)
- **Supabase Free Tier**: Allows thousands of requests/month
- **Your app**: One lightweight query per day is negligible
- **Result**: Zero risk of rate limiting with this setup

## Troubleshooting

### If Database Still Sleeps
1. Verify Uptime Robot monitor is active (check dashboard)
2. Check browser console for keep-alive errors
3. Ensure Supabase credentials are correct in `.env`
4. Try pinging manually: Visit `https://www.benbolpharmacy.com` in browser

### If You See Errors in Console
- "Keep-alive check failed" = Supabase connection issue
- Check your Supabase project status
- Verify RLS policies allow reading from `admin_users` table

## Cost
- **Uptime Robot**: Free tier available (up to 50 monitors)
- **Supabase**: Free tier (with database sleep)
- **Total Cost**: $0 additional

## Next Steps
1. Deploy this code to production
2. Set up Uptime Robot monitor
3. Wait 7 days to confirm database stays awake
4. Monitor console logs for keep-alive confirmations

---

**Implementation Date**: April 13, 2026
**Status**: Ready for deployment
**Risk Level**: Low (non-breaking, background operation)
