import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Download, Upload, ArrowLeft, Database, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { getCurrentUser } from '../lib/auth';

interface BackupRestorePageProps {
  onNavigateBack: () => void;
}

interface BackupData {
  timestamp: string;
  version: string;
  tables: {
    appointments: any[];
    prescription_refills: any[];
    contact_submissions: any[];
    newsletter_subscribers: any[];
    chat_messages: any[];
  };
}

export default function BackupRestorePage({ onNavigateBack }: BackupRestorePageProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [userRole, setUserRole] = useState<'admin' | 'manager' | 'viewer' | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    checkAuthorization();
  }, []);

  const checkAuthorization = async () => {
    const { user } = await getCurrentUser();
    if (!user) {
      setMessage({ type: 'error', text: 'You must be logged in to access this page.' });
      return;
    }

    try {
      const { data: adminUserData, error } = await supabase
        .from('admin_users')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

      if (error || !adminUserData) {
        setUserRole('admin'); // Default for backward compatibility
        setIsAuthorized(true);
      } else {
        setUserRole(adminUserData.role);
        setIsAuthorized(adminUserData.role === 'admin' || adminUserData.role === 'manager');
      }

      if (!isAuthorized && adminUserData && adminUserData.role !== 'admin' && adminUserData.role !== 'manager') {
        setMessage({ type: 'error', text: 'Access denied. Only Admin and Manager accounts can backup/restore the database.' });
      }
    } catch (err) {
      console.error('Error checking authorization:', err);
      setUserRole('admin');
      setIsAuthorized(true);
    }
  };

  const handleBackup = async () => {
    if (!isAuthorized) {
      setMessage({ type: 'error', text: 'You do not have permission to create backups.' });
      return;
    }

    setLoading(true);
    setMessage({ type: 'info', text: 'Creating backup...' });

    try {
      // Fetch all data from all tables (excluding admin_users to avoid login issues)
      const [appointmentsRes, refillsRes, contactsRes, subscribersRes, messagesRes] = await Promise.all([
        supabase.from('appointments').select('*').order('created_at', { ascending: false }),
        supabase.from('prescription_refills').select('*').order('created_at', { ascending: false }),
        supabase.from('contact_submissions').select('*').order('created_at', { ascending: false }),
        supabase.from('newsletter_subscribers').select('*').order('created_at', { ascending: false }),
        supabase.from('chat_messages').select('*').order('created_at', { ascending: false }),
      ]);

      // Check for errors
      if (appointmentsRes.error) throw appointmentsRes.error;
      if (refillsRes.error) throw refillsRes.error;
      if (contactsRes.error) throw contactsRes.error;
      if (subscribersRes.error) throw subscribersRes.error;
      if (messagesRes.error) throw messagesRes.error;

      // Create backup object
      const backup: BackupData = {
        timestamp: new Date().toISOString(),
        version: '1.0',
        tables: {
          appointments: appointmentsRes.data || [],
          prescription_refills: refillsRes.data || [],
          contact_submissions: contactsRes.data || [],
          newsletter_subscribers: subscribersRes.data || [],
          chat_messages: messagesRes.data || [],
        },
      };

      // Calculate total records
      const totalRecords = Object.values(backup.tables).reduce((sum, table) => sum + table.length, 0);

      // Convert to JSON and download
      const jsonString = JSON.stringify(backup, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `benbol-pharmacy-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setMessage({ 
        type: 'success', 
        text: `Backup created successfully! Downloaded ${totalRecords} records from 5 tables.` 
      });
    } catch (error) {
      console.error('Error creating backup:', error);
      setMessage({ 
        type: 'error', 
        text: `Failed to create backup: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (userRole !== 'admin') {
      setMessage({ type: 'error', text: 'Access denied. Only Admin accounts can restore backups.' });
      event.target.value = ''; // Reset file input
      return;
    }

    const file = event.target.files?.[0];
    if (!file) return;

    // Confirm restore action
    if (!confirm('⚠️ WARNING: Restoring will REPLACE all current data with the backup data. This action cannot be undone. Are you sure you want to continue?')) {
      event.target.value = ''; // Reset file input
      return;
    }

    setLoading(true);
    setMessage({ type: 'info', text: 'Reading backup file...' });

    try {
      // Read file
      const fileContent = await file.text();
      const backup: BackupData = JSON.parse(fileContent);

      // Validate backup structure
      if (!backup.tables || !backup.timestamp) {
        throw new Error('Invalid backup file format');
      }

      setMessage({ type: 'info', text: 'Restoring data...' });

      // Delete existing data and insert backup data for each table
      let totalRestored = 0;
      const restoredTables: string[] = [];
      const failedTables: string[] = [];

      for (const [tableName, records] of Object.entries(backup.tables)) {
        try {
          setMessage({ type: 'info', text: `Processing ${tableName}... (${records.length} records)` });

          // Skip if no records to restore
          if (records.length === 0) {
            console.log(`Skipping ${tableName} - no records in backup`);
            continue;
          }

          // Clear existing data using RPC function (bypasses RLS)
          console.log(`Clearing existing data from ${tableName}`);
          const { data: deletedCount, error: clearError } = await supabase
            .rpc('clear_table_data', { table_name: tableName });

          if (clearError) {
            console.error(`Error clearing ${tableName}:`, clearError);
            throw new Error(`Failed to clear ${tableName}: ${clearError.message}`);
          }

          console.log(`Deleted ${deletedCount} records from ${tableName}`);

          // Restore data using RPC function (bypasses RLS)
          console.log(`Restoring ${records.length} records to ${tableName}`);
          const { data: insertedCount, error: restoreError } = await supabase
            .rpc('restore_table_data', { 
              table_name: tableName, 
              data_json: records 
            });

          if (restoreError) {
            console.error(`Error restoring ${tableName}:`, restoreError);
            console.error('Restore error details:', JSON.stringify(restoreError, null, 2));
            throw new Error(`Failed to restore ${tableName}: ${restoreError.message}`);
          }

          console.log(`Successfully restored ${insertedCount} records to ${tableName}`);
          totalRestored += insertedCount || 0;
          restoredTables.push(`${tableName} (${insertedCount})`);
        } catch (error) {
          console.error(`Failed to restore ${tableName}:`, error);
          failedTables.push(tableName);
          throw error; // Re-throw to stop the restore process
        }
      }

      if (failedTables.length > 0) {
        setMessage({ 
          type: 'error', 
          text: `Restore partially failed. Successfully restored: ${restoredTables.join(', ')}. Failed: ${failedTables.join(', ')}` 
        });
      } else {
        setMessage({ 
          type: 'success', 
          text: `Restore completed successfully! Restored ${totalRestored} records from backup dated ${new Date(backup.timestamp).toLocaleString()}. Tables: ${restoredTables.join(', ')}` 
        });
      }
    } catch (error) {
      console.error('Error restoring backup:', error);
      setMessage({ 
        type: 'error', 
        text: `Failed to restore backup: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
    } finally {
      setLoading(false);
      event.target.value = ''; // Reset file input
    }
  };

  if (!isAuthorized && userRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-4">Access Denied</h2>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
            Only Admin and Manager accounts can access the backup and restore functionality.
          </p>
          <button
            onClick={onNavigateBack}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-lg border-b border-white/20 dark:border-gray-700/50">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={onNavigateBack}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Database Backup & Restore
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Create backups of your database or restore from a previous backup
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Status Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl backdrop-blur-xl border ${
            message.type === 'success' 
              ? 'bg-green-50/80 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
              : message.type === 'error'
              ? 'bg-red-50/80 dark:bg-red-900/20 border-red-200 dark:border-red-800'
              : 'bg-blue-50/80 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
          }`}>
            <div className="flex items-start space-x-3">
              {message.type === 'success' && <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />}
              {message.type === 'error' && <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />}
              {message.type === 'info' && <Loader className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5 animate-spin" />}
              <p className={`text-sm font-medium ${
                message.type === 'success' 
                  ? 'text-green-800 dark:text-green-300' 
                  : message.type === 'error'
                  ? 'text-red-800 dark:text-red-300'
                  : 'text-blue-800 dark:text-blue-300'
              }`}>
                {message.text}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Backup Card */}
          <div className="relative backdrop-blur-xl bg-white/20 dark:bg-gray-800/20 rounded-2xl shadow-2xl overflow-hidden border border-white/20 dark:border-gray-700/50 p-8">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 pointer-events-none"></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg">
                  <Download className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create Backup</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Download all database data</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="bg-white/50 dark:bg-gray-700/50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">What gets backed up:</h3>
                  <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <li>• All appointments</li>
                    <li>• All prescription refills</li>
                    <li>• All contact submissions</li>
                    <li>• All newsletter subscribers</li>
                    <li>• All chat messages</li>
                  </ul>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                    Note: Admin user accounts are NOT included in backups for security.
                  </p>
                </div>

                <div className="bg-blue-50/50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    <strong>Note:</strong> The backup file will be downloaded to your computer as a JSON file. Store it securely.
                  </p>
                </div>
              </div>

              <button
                onClick={handleBackup}
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Creating Backup...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    <span>Download Backup</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Restore Card */}
          <div className="relative backdrop-blur-xl bg-white/20 dark:bg-gray-800/20 rounded-2xl shadow-2xl overflow-hidden border border-white/20 dark:border-gray-700/50 p-8">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 pointer-events-none"></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 shadow-lg">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Restore Backup</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Upload a backup file to restore</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="bg-red-50/50 dark:bg-red-900/20 rounded-xl p-4 border border-red-200 dark:border-red-800">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-red-800 dark:text-red-300 mb-1">⚠️ Warning</p>
                      <p className="text-sm text-red-700 dark:text-red-400">
                        Restoring will <strong>DELETE ALL CURRENT DATA</strong> and replace it with the backup data. This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/50 dark:bg-gray-700/50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Before restoring:</h3>
                  <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <li>• Create a current backup first</li>
                    <li>• Verify the backup file is correct</li>
                    <li>• Ensure no one is using the system</li>
                    <li>• Have a rollback plan ready</li>
                    <li>• Check browser console (F12) for detailed logs</li>
                  </ul>
                </div>
              </div>

              <label className="block">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleRestore}
                  disabled={loading || userRole !== 'admin'}
                  className="hidden"
                  id="restore-file-input"
                />
                <div className={`w-full flex items-center justify-center space-x-2 px-6 py-4 rounded-xl transition-all duration-300 shadow-lg font-semibold ${
                  userRole !== 'admin'
                    ? 'bg-gray-400 cursor-not-allowed opacity-50'
                    : 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white hover:shadow-xl cursor-pointer'
                }`}>
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>Restoring...</span>
                    </>
                  ) : userRole !== 'admin' ? (
                    <>
                      <Upload className="w-5 h-5" />
                      <span>Admin Only</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      <span>Upload & Restore Backup</span>
                    </>
                  )}
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Information Section */}
        <div className="mt-8 relative backdrop-blur-xl bg-white/20 dark:bg-gray-800/20 rounded-2xl shadow-2xl overflow-hidden border border-white/20 dark:border-gray-700/50 p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 pointer-events-none"></div>
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-4">
              <Database className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Backup & Restore Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Best Practices:</h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>• Create regular backups (daily or weekly)</li>
                  <li>• Store backups in multiple secure locations</li>
                  <li>• Test restore process periodically</li>
                  <li>• Label backup files with clear dates</li>
                  <li>• Keep backups for at least 30 days</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Security Notes:</h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>• Backup files contain sensitive customer data</li>
                  <li>• Encrypt backup files before cloud storage</li>
                  <li>• Only authorized personnel should access backups</li>
                  <li>• Delete old backups securely</li>
                  <li>• Never share backup files via email</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
