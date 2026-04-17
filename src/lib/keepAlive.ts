import { supabase } from './supabase';

/**
 * Keep-alive function to prevent Supabase free tier database from sleeping
 * This performs a minimal query to establish a connection without heavy load
 * Should be called periodically (e.g., on app load or via external monitoring service)
 */
export async function keepDatabaseAlive() {
  try {
    // Perform a minimal query to establish connection
    // This resets the inactivity timer on Supabase free tier
    const { error } = await supabase
      .from('admin_users')
      .select('id')
      .limit(1);
    
    if (error) {
      console.warn('Keep-alive check failed:', error.message);
      return false;
    }
    
    console.log('[Keep-Alive] Database connection check successful at', new Date().toISOString());
    return true;
  } catch (err) {
    console.error('[Keep-Alive] Unexpected error:', err);
    return false;
  }
}
