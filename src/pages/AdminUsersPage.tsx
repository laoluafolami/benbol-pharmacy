import { useState, useEffect } from 'react';
import { LogOut, Mail, Plus, Trash2, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { signOutAdmin, getCurrentUser, createAdminUser, getAdminUsers, updateAdminRole, deleteAdminUser } from '../lib/auth';
import AdminLogin from './AdminLogin';

interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'manager' | 'viewer';
  created_at: string;
}

interface AdminUsersPageProps {
  onNavigateBack: () => void;
}

export default function AdminUsersPage({ onNavigateBack }: AdminUsersPageProps) {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<'admin' | 'manager' | 'viewer' | null>(null);
  const [showCreateUserForm, setShowCreateUserForm] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [newUserRole, setNewUserRole] = useState<'admin' | 'manager' | 'viewer'>('viewer');
  const [createUserMessage, setCreateUserMessage] = useState('');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { user } = await getCurrentUser();
    if (user) {
      setIsAuthenticated(true);
      setCurrentUser(user);
      
      // Fetch user's role from admin_users table
      try {
        const { data: adminUserData } = await supabase
          .from('admin_users')
          .select('role')
          .eq('id', user.id)
          .maybeSingle();
        
        if (adminUserData) {
          setUserRole(adminUserData.role);
        } else {
          // Default to admin if not found
          setUserRole('admin');
        }
      } catch (err) {
        console.error('Error fetching user role:', err);
        setUserRole('admin');
      }
      
      fetchAdminUsers();
    } else {
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  const fetchAdminUsers = async () => {
    setLoading(true);
    console.log('Fetching admin users...');
    
    // Temporary workaround: fetch from auth.users via RPC
    try {
      const { data: authUsers, error: authError } = await supabase.rpc('get_auth_users');
      console.log('Auth users result:', { authUsers, authError });
      
      if (authUsers && !authError) {
        // Convert auth users to admin user format
        const formattedUsers = authUsers.map((user: any) => ({
          id: user.id,
          email: user.email,
          role: 'admin', // Default role for now
          created_at: user.created_at
        }));
        setAdminUsers(formattedUsers);
        setLoading(false);
        return;
      }
    } catch (err) {
      console.log('RPC not available, trying direct admin_users query');
    }
    
    // Try direct query
    try {
      const { data: directData, error: directError } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: false });
      
      console.log('Direct query result:', { directData, directError });
      
      if (directError) {
        console.error('Direct query error:', directError);
        // Show empty state if table doesn't work
        setAdminUsers([]);
      } else {
        setAdminUsers(directData || []);
      }
    } catch (err) {
      console.error('Direct query exception:', err);
      setAdminUsers([]);
    }
    
    setLoading(false);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateUserMessage('');

    // Check if user is admin
    if (userRole !== 'admin') {
      setCreateUserMessage('Only admins can create new users.');
      return;
    }

    if (!newUserEmail.trim()) {
      setCreateUserMessage('Please enter an email address');
      return;
    }

    if (!newUserPassword.trim()) {
      setCreateUserMessage('Please enter a password');
      return;
    }

    if (newUserPassword.length < 6) {
      setCreateUserMessage('Password must be at least 6 characters');
      return;
    }

    const { error } = await createAdminUser(newUserEmail, newUserPassword, newUserRole);

    if (error) {
      const errorMsg = typeof error === 'object' && error !== null && 'message' in error 
        ? (error as any).message 
        : 'Error creating user. Email may already exist.';
      setCreateUserMessage(errorMsg);
    } else {
      setCreateUserMessage(`User created successfully! A confirmation email has been sent to ${newUserEmail}. The user must verify their email before they can log in.`);
      setNewUserEmail('');
      setNewUserPassword('');
      setNewUserRole('viewer');
      setTimeout(() => {
        setShowCreateUserForm(false);
        fetchAdminUsers();
      }, 3000);
    }
  };

  const handleUpdateRole = async (userId: string, newRole: 'admin' | 'manager' | 'viewer') => {
    if (userRole !== 'admin') {
      alert('Only admins can update user roles.');
      return;
    }
    
    const { error } = await updateAdminRole(userId, newRole);
    if (error) {
      console.error('Error updating role:', error);
    } else {
      fetchAdminUsers();
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (userRole !== 'admin') {
      alert('Only admins can delete users.');
      return;
    }
    
    if (!confirm('Are you sure you want to delete this user?')) return;
    const { error } = await deleteAdminUser(userId);
    if (error) {
      console.error('Error deleting user:', error);
    } else {
      fetchAdminUsers();
    }
  };

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={checkAuth} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onNavigateBack}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Users Management</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Logged in as: {currentUser?.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                if (userRole === 'admin') {
                  setShowCreateUserForm(!showCreateUserForm);
                } else {
                  alert('Only admins can create new users.');
                }
              }}
              disabled={userRole !== 'admin'}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors font-semibold ${
                userRole === 'admin'
                  ? 'bg-teal-600 text-white hover:bg-teal-700'
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              }`}
              title={userRole !== 'admin' ? 'Only admins can create users' : ''}
            >
              <Plus className="w-5 h-5" />
              <span>{showCreateUserForm ? 'Cancel' : 'Add User'}</span>
            </button>
            <button
              onClick={async () => {
                await signOutAdmin();
                setIsAuthenticated(false);
                setCurrentUser(null);
              }}
              className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
          </div>
        ) : (
          <>
            {/* Create User Form */}
            {showCreateUserForm && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8">
                <div className="p-6 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Create New Admin User</h3>
                  <form onSubmit={handleCreateUser} className="space-y-4 max-w-md">
                    {createUserMessage && (
                      <div className={`px-4 py-3 rounded-lg text-sm ${
                        createUserMessage.includes('successfully')
                          ? 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300'
                          : 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
                      }`}>
                        {createUserMessage}
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={newUserEmail}
                        onChange={(e) => setNewUserEmail(e.target.value)}
                        placeholder="user@example.com"
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={newUserPassword}
                          onChange={(e) => setNewUserPassword(e.target.value)}
                          placeholder="Enter password (min 6 characters)"
                          required
                          className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Role
                      </label>
                      <select
                        value={newUserRole}
                        onChange={(e) => setNewUserRole(e.target.value as 'admin' | 'manager' | 'viewer')}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="viewer">Viewer (Read-only)</option>
                        <option value="manager">Manager (Edit & Delete)</option>
                        <option value="admin">Admin (Full Access)</option>
                      </select>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-teal-600 text-white py-2 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
                    >
                      Create User
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Admin Users List */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Admin Users ({adminUsers.length})
                </h3>
              </div>
              {adminUsers.length === 0 ? (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No admin users yet. Click "Add User" to create one.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Email</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Role</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Created</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {adminUsers.map((user, index) => (
                        <tr
                          key={user.id}
                          className={`hover:bg-opacity-75 transition-colors ${
                            index % 2 === 0
                              ? 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
                              : 'bg-teal-50 dark:bg-teal-900/20 hover:bg-teal-100 dark:hover:bg-teal-900/30'
                          }`}
                        >
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">{user.email}</td>
                          <td className="px-6 py-4 text-sm">
                            <select
                              value={user.role}
                              onChange={(e) => handleUpdateRole(user.id, e.target.value as 'admin' | 'manager' | 'viewer')}
                              disabled={userRole !== 'admin'}
                              className={`px-3 py-1 rounded-lg border text-sm font-semibold ${
                                userRole === 'admin'
                                  ? 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white cursor-pointer'
                                  : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed opacity-60'
                              }`}
                            >
                              <option value="viewer">Viewer</option>
                              <option value="manager">Manager</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                            {new Date(user.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {userRole === 'admin' ? (
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="flex items-center space-x-1 text-red-600 hover:text-red-800 dark:hover:text-red-400 transition-colors font-semibold"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span>Delete</span>
                              </button>
                            ) : (
                              <span className="text-gray-400 dark:text-gray-600">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
