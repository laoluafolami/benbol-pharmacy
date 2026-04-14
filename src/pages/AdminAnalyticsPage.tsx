import { useState, useEffect } from 'react';
import { BarChart3, Activity, Users, AlertCircle, Filter, ArrowLeft, X } from 'lucide-react';
import { fetchAuditLogs } from '../lib/auditLog';

interface AuditLog {
  id: string;
  admin_id: string;
  admin_email: string;
  action: string;
  table_name: string;
  record_id: string;
  record_summary: string;
  changes: any;
  ip_address: string;
  user_agent: string;
  created_at: string;
  status: string;
}

interface AdminAnalyticsPageProps {
  onNavigate?: () => void;
}

export default function AdminAnalyticsPage({ onNavigate }: AdminAnalyticsPageProps) {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'admin' | 'action'>('all');
  const [selectedAdmin, setSelectedAdmin] = useState<string>('');
  const [selectedAction, setSelectedAction] = useState<string>('');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  // Get unique admins and actions for filters
  const uniqueAdmins = [...new Set(auditLogs.map(log => log.admin_email))];
  const uniqueActions = [...new Set(auditLogs.map(log => log.action))];

  // Load audit logs
  useEffect(() => {
    loadAuditLogs();
  }, []);

  const loadAuditLogs = async () => {
    setLoading(true);
    const logs = await fetchAuditLogs(500);
    console.log('Loaded audit logs:', logs);
    setAuditLogs(logs);
    setFilteredLogs(logs);
    setLoading(false);
  };

  // Apply filters
  useEffect(() => {
    let filtered = auditLogs;

    if (filterType === 'admin' && selectedAdmin) {
      filtered = filtered.filter(log => log.admin_email === selectedAdmin);
    } else if (filterType === 'action' && selectedAction) {
      filtered = filtered.filter(log => log.action === selectedAction);
    }

    setFilteredLogs(filtered);
  }, [filterType, selectedAdmin, selectedAction, auditLogs]);

  // Calculate statistics
  const stats = {
    totalActions: auditLogs.length,
    creates: auditLogs.filter(log => log.action === 'create').length,
    updates: auditLogs.filter(log => log.action === 'update').length,
    deletes: auditLogs.filter(log => log.action === 'delete').length,
    uniqueAdmins: uniqueAdmins.length,
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'create':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'update':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'delete':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'view':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getTableColor = (tableName: string) => {
    switch (tableName) {
      case 'admin_users':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'appointments':
        return 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200';
      case 'prescription_refills':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const selectedLog = filteredLogs.find(log => log.id === expandedLogId);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => onNavigate?.()}
          className="flex items-center space-x-2 text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 mb-6 font-medium transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <BarChart3 className="w-8 h-8 text-teal-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Analytics</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Track all admin actions and system activity</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Total Actions</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalActions}</p>
              </div>
              <Activity className="w-10 h-10 text-teal-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Created</p>
                <p className="text-3xl font-bold text-green-600">{stats.creates}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <span className="text-green-600 font-bold">+</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Updated</p>
                <p className="text-3xl font-bold text-blue-600">{stats.updates}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-bold">✎</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Deleted</p>
                <p className="text-3xl font-bold text-red-600">{stats.deletes}</p>
              </div>
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                <span className="text-red-600 font-bold">−</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Active Admins</p>
                <p className="text-3xl font-bold text-purple-600">{stats.uniqueAdmins}</p>
              </div>
              <Users className="w-10 h-10 text-purple-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Filter Type
              </label>
              <select
                value={filterType}
                onChange={(e) => {
                  setFilterType(e.target.value as any);
                  setSelectedAdmin('');
                  setSelectedAction('');
                }}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Actions</option>
                <option value="admin">By Admin</option>
                <option value="action">By Action Type</option>
              </select>
            </div>

            {filterType === 'admin' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Admin
                </label>
                <select
                  value={selectedAdmin}
                  onChange={(e) => setSelectedAdmin(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">All Admins</option>
                  {uniqueAdmins.map((admin) => (
                    <option key={admin} value={admin}>
                      {admin}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {filterType === 'action' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Action
                </label>
                <select
                  value={selectedAction}
                  onChange={(e) => setSelectedAction(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">All Actions</option>
                  {uniqueActions.map((action) => (
                    <option key={action} value={action}>
                      {action.charAt(0).toUpperCase() + action.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex items-end">
              <button
                onClick={loadAuditLogs}
                className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Audit Logs Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Audit Logs ({filteredLogs.length})
            </h2>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <p className="text-gray-600 dark:text-gray-400">Loading audit logs...</p>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="p-8 text-center">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 dark:text-gray-400">No audit logs found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Admin
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Action
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Table
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Summary
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredLogs.map((log) => (
                    <tr
                      key={log.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {log.admin_email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getActionColor(log.action)}`}>
                          {log.action.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTableColor(log.table_name)}`}>
                          {log.table_name.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-white max-w-xs truncate">
                          {log.record_summary}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(log.created_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => setExpandedLogId(expandedLogId === log.id ? null : log.id)}
                          className="text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 text-sm font-medium"
                        >
                          {expandedLogId === log.id ? 'Hide' : 'View'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Details Modal */}
      {expandedLogId && selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Action Details</h2>
              <button
                onClick={() => setExpandedLogId(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Admin Info */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Admin</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{selectedLog.admin_email}</p>
              </div>

              {/* Action Info */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Action</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getActionColor(selectedLog.action)}`}>
                  {selectedLog.action.toUpperCase()}
                </span>
              </div>

              {/* Summary */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Summary</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{selectedLog.record_summary}</p>
              </div>

              {/* Time */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Time</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{formatDate(selectedLog.created_at)}</p>
              </div>

              {/* IP Address */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">IP Address</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">{selectedLog.ip_address}</p>
              </div>

              {/* Changes */}
              {selectedLog.changes && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Changes</h3>
                  <pre className="text-xs bg-gray-900 dark:bg-gray-900 text-gray-100 p-3 rounded overflow-auto max-h-48">
                    {JSON.stringify(selectedLog.changes, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
