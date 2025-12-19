# Database Setup Instructions for Appointments and Prescription Refills

## Overview
I've added support for "Book a Consultation" (Appointments) and "Refill Prescription" forms to save data to the database and display in the admin dashboard.

## Changes Made

### 1. Admin Dashboard Updates (`src/pages/AdminDashboard.tsx`)
- Added two new tabs: "Appointments" and "Prescription Refills"
- Added data tables to display appointment and refill submissions
- Added CSV and PDF export functionality for both new tables
- Added delete functionality (for admin and manager roles only)
- Added expandable message/notes fields

### 2. Database Tables Required
Two new tables need to be created in your Supabase database:

#### `appointments` table
- id (bigserial, primary key)
- full_name (text)
- email (text)
- phone (text)
- service_type (text)
- preferred_date (date)
- preferred_time (text)
- message (text)
- created_at (timestamp with time zone)

#### `prescription_refills` table
- id (bigserial, primary key)
- full_name (text)
- email (text)
- phone (text)
- prescription_number (text)
- medication_name (text)
- prescribing_doctor (text)
- additional_notes (text)
- created_at (timestamp with time zone)

## Setup Instructions

### Option 1: Using Supabase SQL Editor (Recommended)

1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy and paste the contents of `supabase/migrations/20241219_add_appointments_and_refills.sql`
5. Click "Run" to execute the SQL

### Option 2: Using Supabase CLI

If you have the Supabase CLI installed:

```bash
# Make sure you're in your project directory
cd /path/to/your/project

# Run the migration
supabase db push
```

### Option 3: Manual Table Creation

If you prefer to create tables manually through the Supabase UI:

1. Go to your Supabase project dashboard
2. Click on "Table Editor" in the left sidebar
3. Click "New Table"
4. Create the `appointments` table with the columns listed above
5. Repeat for the `prescription_refills` table
6. Set up Row Level Security (RLS) policies:
   - Allow INSERT for all users (so forms can submit)
   - Allow SELECT for authenticated users (so admin can view)
   - Allow DELETE for authenticated users (so admin can delete)

## Testing

After setting up the database:

1. **Test Appointment Form:**
   - Go to your website
   - Click "Book a Consultation" or navigate to the appointment form
   - Fill out and submit the form
   - Check the admin dashboard under "Appointments" tab

2. **Test Refill Form:**
   - Go to your website
   - Navigate to the "Refill Prescription" form
   - Fill out and submit the form
   - Check the admin dashboard under "Prescription Refills" tab

3. **Test Admin Dashboard:**
   - Log in to the admin dashboard
   - Click on the "Appointments" tab - you should see submitted appointments
   - Click on the "Prescription Refills" tab - you should see submitted refills
   - Test the export CSV and PDF buttons
   - Test the delete functionality (if you have admin/manager role)

## Features

### For Users:
- Submit appointment requests with preferred date/time
- Submit prescription refill requests
- Receive confirmation messages after submission

### For Admins:
- View all appointments and refills in organized tables
- Export data to CSV or PDF
- Delete records (admin and manager roles only)
- Expand long messages/notes to read full content
- See submission dates and contact information

## Troubleshooting

### Forms not submitting:
- Check browser console for errors
- Verify Supabase URL and anon key are set in Netlify environment variables
- Verify tables exist in Supabase

### Data not showing in dashboard:
- Verify you're logged in to the admin dashboard
- Check that RLS policies allow authenticated users to SELECT
- Check browser console for errors

### Export not working:
- The PDF export should now work with the fixes applied
- If CSV export fails, check browser console for errors

## Database Migration File

The SQL migration file is located at:
`supabase/migrations/20241219_add_appointments_and_refills.sql`

This file contains all the necessary SQL commands to:
- Create both tables
- Set up Row Level Security (RLS)
- Create appropriate policies
- Add indexes for better performance

## Next Steps

1. Run the SQL migration in Supabase
2. Test both forms on your website
3. Verify data appears in the admin dashboard
4. Test export functionality
5. Deploy changes to Netlify (if not already deployed)

## Support

If you encounter any issues:
1. Check the browser console for error messages
2. Check the Supabase logs in your dashboard
3. Verify all environment variables are set correctly in Netlify
4. Ensure the database tables were created successfully
