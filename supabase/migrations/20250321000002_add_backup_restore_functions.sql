/*
  # Add Backup and Restore Functions
  
  This migration creates database functions that allow admin users to restore data
  by bypassing RLS policies. This is necessary because the existing RLS policies
  only allow anonymous users to insert data, but authenticated admins need to
  restore backups.
*/

-- Function to restore data to a table (bypasses RLS)
CREATE OR REPLACE FUNCTION restore_table_data(
  table_name text,
  data_json jsonb
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER -- This allows the function to bypass RLS
SET search_path = public
AS $$
DECLARE
  record_count integer;
  user_role text;
BEGIN
  -- Check if user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Access denied. You must be logged in.';
  END IF;

  -- Get user role (default to admin if not found for backward compatibility)
  SELECT role INTO user_role
  FROM admin_users 
  WHERE id = auth.uid();
  
  -- If user not in admin_users table, default to admin for backward compatibility
  IF user_role IS NULL THEN
    user_role := 'admin';
  END IF;

  -- Only allow admin or manager users
  IF user_role NOT IN ('admin', 'manager') THEN
    RAISE EXCEPTION 'Access denied. Only admin and manager users can restore data. Your role: %', user_role;
  END IF;

  -- Insert data based on table name
  CASE table_name
    WHEN 'appointments' THEN
      INSERT INTO appointments
      SELECT * FROM jsonb_populate_recordset(null::appointments, data_json);
      
    WHEN 'prescription_refills' THEN
      INSERT INTO prescription_refills
      SELECT * FROM jsonb_populate_recordset(null::prescription_refills, data_json);
      
    WHEN 'contact_submissions' THEN
      INSERT INTO contact_submissions
      SELECT * FROM jsonb_populate_recordset(null::contact_submissions, data_json);
      
    WHEN 'newsletter_subscribers' THEN
      INSERT INTO newsletter_subscribers
      SELECT * FROM jsonb_populate_recordset(null::newsletter_subscribers, data_json);
      
    WHEN 'chat_messages' THEN
      INSERT INTO chat_messages
      SELECT * FROM jsonb_populate_recordset(null::chat_messages, data_json);
      
    ELSE
      RAISE EXCEPTION 'Invalid table name: %. Admin users table is not allowed for restore.', table_name;
  END CASE;

  GET DIAGNOSTICS record_count = ROW_COUNT;
  RETURN record_count;
END;
$$;

-- Function to clear all data from a table (bypasses RLS)
CREATE OR REPLACE FUNCTION clear_table_data(table_name text)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER -- This allows the function to bypass RLS
SET search_path = public
AS $$
DECLARE
  record_count integer;
  user_role text;
BEGIN
  -- Check if user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Access denied. You must be logged in.';
  END IF;

  -- Get user role (default to admin if not found for backward compatibility)
  SELECT role INTO user_role
  FROM admin_users 
  WHERE id = auth.uid();
  
  -- If user not in admin_users table, default to admin for backward compatibility
  IF user_role IS NULL THEN
    user_role := 'admin';
  END IF;

  -- Only allow admin or manager users
  IF user_role NOT IN ('admin', 'manager') THEN
    RAISE EXCEPTION 'Access denied. Only admin and manager users can clear data. Your role: %', user_role;
  END IF;

  -- Delete data based on table name
  CASE table_name
    WHEN 'appointments' THEN
      DELETE FROM appointments WHERE true;
      
    WHEN 'prescription_refills' THEN
      DELETE FROM prescription_refills WHERE true;
      
    WHEN 'contact_submissions' THEN
      DELETE FROM contact_submissions WHERE true;
      
    WHEN 'newsletter_subscribers' THEN
      DELETE FROM newsletter_subscribers WHERE true;
      
    WHEN 'chat_messages' THEN
      DELETE FROM chat_messages WHERE true;
      
    ELSE
      RAISE EXCEPTION 'Invalid table name: %. Admin users table is not allowed for clearing.', table_name;
  END CASE;

  GET DIAGNOSTICS record_count = ROW_COUNT;
  RETURN record_count;
END;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION restore_table_data(text, jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION clear_table_data(text) TO authenticated;
