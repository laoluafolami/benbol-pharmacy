# Admin Analytics - Date Filters and Enhanced Filtering

## Overview
Added comprehensive filtering capabilities to the Admin Analytics page, including date range filters and table-based filtering for better audit log analysis.

## New Features

### 1. Date Range Filters
- **Start Date**: Filter logs from a specific date onwards
- **End Date**: Filter logs up to a specific date
- Both filters work together to create a date range
- Dates are inclusive (start date includes 00:00:00, end date includes 23:59:59)

### 2. Table Filter
- New filter type: "By Table"
- Filter audit logs by the table they were performed on
- Available tables:
  - admin_users
  - appointments
  - prescription_refills
  - contact_submissions
  - newsletter_subscribers
  - chat_messages
  - chat_sessions

### 3. Clear Filters Button
- Quickly reset all filters to default state
- Clears date range, filter type, and all selections
- Useful for starting a new analysis

## Filter Types

| Filter Type | Purpose | Options |
|------------|---------|---------|
| All Actions | Show all audit logs | N/A |
| By Admin | Filter by admin user | List of all admins |
| By Action Type | Filter by action (create, update, delete) | create, update, delete, view |
| By Table | Filter by affected table | List of all tables |

## How to Use

### Filter by Date Range
1. Click on "Start Date" field and select a date
2. Click on "End Date" field and select a date
3. Logs will automatically filter to show only entries within that range

### Filter by Admin
1. Select "By Admin" from Filter Type dropdown
2. Select an admin from the "Select Admin" dropdown
3. View logs for that specific admin

### Filter by Action Type
1. Select "By Action Type" from Filter Type dropdown
2. Select an action (Create, Update, Delete) from the dropdown
3. View logs for that specific action type

### Filter by Table
1. Select "By Table" from Filter Type dropdown
2. Select a table from the "Select Table" dropdown
3. View logs for that specific table

### Combine Filters
- Date filters work independently and can be combined with any filter type
- For example: View all "Update" actions by a specific admin between two dates

### Clear All Filters
- Click the "Clear" button to reset all filters and view all logs

## Statistics Update
The statistics cards at the top automatically update based on the current filters:
- Total Actions
- Created
- Updated
- Deleted
- Active Admins

## Use Cases

### Audit Specific User Actions
1. Select "By Admin" filter
2. Choose the admin user
3. View all actions performed by that user

### Track Changes to Specific Table
1. Select "By Table" filter
2. Choose the table (e.g., "admin_users")
3. See all modifications to that table

### Investigate Recent Activity
1. Set Start Date to today
2. View all actions from today

### Find Specific Action Type
1. Select "By Action Type" filter
2. Choose "Delete" to see all deletions
3. Useful for tracking data removal

## Technical Details

### Date Filtering Logic
- Start date: Includes the entire start date (00:00:00 to 23:59:59)
- End date: Includes the entire end date (00:00:00 to 23:59:59)
- Both filters are optional and can be used independently

### Filter Combination
- Date filters apply first
- Then the selected filter type (admin, action, or table) applies
- Results show logs matching all active filters

### Performance
- Filters are applied client-side on the loaded logs
- For large datasets, consider using date filters to narrow results first
- Refresh button reloads logs from the server

## Future Enhancements
Potential improvements:
- Export filtered results to CSV/PDF
- Save filter presets
- Advanced search with multiple criteria
- IP address filtering
- Status filtering (success/failed)
