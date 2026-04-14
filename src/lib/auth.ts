import { supabase } from './supabase';

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'manager' | 'viewer';
  created_at: string;
}

// Sign up a new admin user
export const signUpAdmin = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Sign in admin user
export const signInAdmin = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Sign out
export const signOutAdmin = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error };
  }
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return { user, error: null };
  } catch (error) {
    return { user: null, error };
  }
};

// Reset password
export const resetPassword = async (email: string) => {
  try {
    // Use the site origin - Supabase will append the tokens to the URL
    const redirectUrl = window.location.origin;
    console.log('Password reset redirect URL:', redirectUrl);

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Reset password error:', error);
    return { data: null, error };
  }
};

// Update password
export const updatePassword = async (newPassword: string) => {
  try {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Create admin user with password (only admins can do this)
export const createAdminUser = async (email: string, password: string, role: 'admin' | 'manager' | 'viewer' = 'viewer') => {
  try {
    // Get current user
    const { user: currentUser } = await getCurrentUser();
    if (!currentUser) {
      throw new Error('Not authenticated');
    }

    // Check if current user is admin
    const { data: currentUserData, error: roleCheckError } = await supabase
      .from('admin_users')
      .select('role')
      .eq('id', currentUser.id)
      .maybeSingle();

    if (roleCheckError) throw roleCheckError;

    if (!currentUserData || currentUserData.role !== 'admin') {
      throw new Error('Only admins can create new users');
    }

    // Sign up the user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;

    if (!authData.user?.id) {
      throw new Error('Failed to create user');
    }

    // Add them to admin_users table
    const { data, error } = await supabase
      .from('admin_users')
      .insert([{ 
        id: authData.user.id,
        email, 
        role 
      }]);

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Get admin users
export const getAdminUsers = async () => {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Update admin user role (only admins can do this)
export const updateAdminRole = async (userId: string, role: 'admin' | 'manager' | 'viewer') => {
  try {
    // Get current user
    const { user: currentUser } = await getCurrentUser();
    if (!currentUser) {
      throw new Error('Not authenticated');
    }

    // Check if current user is admin
    const { data: currentUserData, error: roleCheckError } = await supabase
      .from('admin_users')
      .select('role')
      .eq('id', currentUser.id)
      .maybeSingle();

    if (roleCheckError) throw roleCheckError;

    if (!currentUserData || currentUserData.role !== 'admin') {
      throw new Error('Only admins can update user roles');
    }

    // Update the role
    const { data, error } = await supabase
      .from('admin_users')
      .update({ role })
      .eq('id', userId);

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Delete admin user (only admins can do this)
export const deleteAdminUser = async (userId: string) => {
  try {
    // Get current user
    const { user: currentUser } = await getCurrentUser();
    if (!currentUser) {
      throw new Error('Not authenticated');
    }

    // Check if current user is admin
    const { data: currentUserData, error: roleCheckError } = await supabase
      .from('admin_users')
      .select('role')
      .eq('id', currentUser.id)
      .maybeSingle();

    if (roleCheckError) throw roleCheckError;

    if (!currentUserData || currentUserData.role !== 'admin') {
      throw new Error('Only admins can delete users');
    }

    // Delete the user
    const { data, error } = await supabase
      .from('admin_users')
      .delete()
      .eq('id', userId);

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};
