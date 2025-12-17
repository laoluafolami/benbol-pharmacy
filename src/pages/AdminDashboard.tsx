import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Download, Trash2, LogOut, Mail, MessageSquare, Users } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Papa from 'papaparse';
import { signOutAdmin, getCurrentUser } from '../lib/auth';
import AdminLogin from './AdminLogin';

interface ContactSubmission {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  created_at: string;
}

interface NewsletterSubscriber {
  id: number;
  email: string;
  full_name: string;
  created_at: string;
}

interface ChatMessage {
  id: number;
  message: string;
  sender: string;
  session_id: string;
  user_name?: string;
  user_email?: string;
  created_at: string;
}

interface AdminDashboardProps {
  onNavigateToUsers: () => void;
}

export default function AdminDashboard({ onNavigateToUsers }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('contacts');
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [expandedMessageId, setExpandedMessageId] = useState<number | null>(null);
  const [expandedContactId, setExpandedContactId] = useState<number | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<'admin' | 'manager' | 'viewer' | null>(null);

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
        const { data: adminUserData, error } = await supabase
          .from('admin_users')
          .select('role')
          .eq('id', user.id)
          .maybeSingle();
        
        if (error) {
          console.error('Error fetching user role:', error);
          // Default to admin if there's an error (for backward compatibility)
          setUserRole('admin');
        } else if (adminUserData) {
          console.log('User role:', adminUserData.role);
          setUserRole(adminUserData.role);
        } else {
          // User not found in admin_users table, default to admin
          console.log('User not in admin_users table, defaulting to admin');
          setUserRole('admin');
        }
      } catch (err) {
        console.error('Exception fetching user role:', err);
        setUserRole('admin');
      }
      
      fetchData();
    } else {
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'contacts') {
        const { data } = await supabase.from('contact_submissions').select('*').order('created_at', { ascending: false });
        setContacts(data || []);
      } else if (activeTab === 'subscribers') {
        const { data } = await supabase.from('newsletter_subscribers').select('*').order('created_at', { ascending: false });
        setSubscribers(data || []);
      } else if (activeTab === 'messages') {
        const { data } = await supabase.from('chat_messages').select('*').order('created_at', { ascending: false });
        setMessages(data || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const canDelete = () => {
    const hasPermission = userRole === 'admin' || userRole === 'manager';
    console.log('canDelete check - userRole:', userRole, 'hasPermission:', hasPermission);
    return hasPermission;
  };

  const deleteRecord = async (table: string, id: number) => {
    if (!canDelete()) {
      alert('You do not have permission to delete records. Only Admins and Managers can delete.');
      return;
    }
    
    if (!confirm('Are you sure you want to delete this record?')) return;
    try {
      await supabase.from(table).delete().eq('id', id);
      fetchData();
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };

  const exportToCSV = (data: any[], filename: string) => {
    const csv = Papa.unparse(data);
    const link = document.createElement('a');
    link.href = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const exportToPDF = (data: any[], filename: string) => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let yPosition = 20;

      doc.setFontSize(16);
      doc.text(`${filename} Report`, 20, yPosition);
      yPosition += 15;

      doc.setFontSize(10);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 20, yPosition);
      yPosition += 10;

      if (data.length === 0) {
        doc.text('No data available', 20, yPosition);
        doc.save(`${filename}_${new Date().toISOString().split('T')[0]}.pdf`);
        return;
      }

      const columns = Object.keys(data[0] || {});
      const rows = data.map(item => 
        columns.map(col => {
          const value = item[col];
          if (value === null || value === undefined) return '';
          if (typeof value === 'object') return JSON.stringify(value);
          return String(value).substring(0, 100); // Limit cell content
        })
      );

      (doc as any).autoTable({
        head: [columns.map(col => col.charAt(0).toUpperCase() + col.slice(1).replace(/_/g, ' '))],
        body: rows,
        startY: yPosition,
        margin: 10,
        styles: {
          fontSize: 9,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [20, 184, 166], // teal-600
          textColor: [255, 255, 255],
          fontStyle: 'bold',
        },
        alternateRowStyles: {
          fillColor: [240, 253, 250], // teal-50
        },
        didDrawPage: () => {
          const pageCount = (doc as any).internal.getPages().length;
          doc.setFontSize(8);
          doc.text(
            `Page ${pageCount}`,
            pageWidth - 20,
            pageHeight - 10
          );
        },
      });

      doc.save(`${filename}_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
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
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Logged in as: {currentUser?.email}</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onNavigateToUsers}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              <Users className="w-5 h-5" />
              <span>Manage Users</span>
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

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8 overflow-x-auto">
            {[
              { id: 'contacts', label: 'Contact Submissions', icon: Mail, count: contacts.length },
              { id: 'subscribers', label: 'Newsletter Subscribers', icon: Mail, count: subscribers.length },
              { id: 'messages', label: 'Chat Messages', icon: MessageSquare, count: messages.length },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-4 border-b-2 font-semibold transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-teal-600 text-teal-600 dark:text-teal-400'
                      : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                  <span className="bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 px-2 py-1 rounded-full text-xs font-bold">
                    {tab.count}
                  </span>
                </button>
              );
            })}
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
            {/* Export Buttons */}
            <div className="flex gap-4 mb-6">
              {activeTab === 'contacts' && contacts.length > 0 && (
                <>
                  <button
                    onClick={() => exportToCSV(contacts, 'contact_submissions')}
                    className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Download className="w-5 h-5" />
                    <span>Export CSV</span>
                  </button>
                  <button
                    onClick={() => exportToPDF(contacts, 'Contact Submissions')}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Download className="w-5 h-5" />
                    <span>Export PDF</span>
                  </button>
                </>
              )}
              {activeTab === 'subscribers' && subscribers.length > 0 && (
                <>
                  <button
                    onClick={() => exportToCSV(subscribers, 'newsletter_subscribers')}
                    className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Download className="w-5 h-5" />
                    <span>Export CSV</span>
                  </button>
                  <button
                    onClick={() => exportToPDF(subscribers, 'Newsletter Subscribers')}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Download className="w-5 h-5" />
                    <span>Export PDF</span>
                  </button>
                </>
              )}
              {activeTab === 'messages' && messages.length > 0 && (
                <>
                  <button
                    onClick={() => exportToCSV(messages, 'chat_messages')}
                    className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Download className="w-5 h-5" />
                    <span>Export CSV</span>
                  </button>
                  <button
                    onClick={() => exportToPDF(messages, 'Chat Messages')}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Download className="w-5 h-5" />
                    <span>Export PDF</span>
                  </button>
                </>
              )}
            </div>

            {/* Contact Submissions Table */}
            {activeTab === 'contacts' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                {contacts.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                    <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No contact submissions yet</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-100 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Name</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Email</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Phone</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Subject</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Message</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Date</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {contacts.map((contact, index) => (
                          <tr key={contact.id} className={`hover:bg-opacity-75 transition-colors ${
                            index % 2 === 0 
                              ? 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700' 
                              : 'bg-teal-50 dark:bg-teal-900/20 hover:bg-teal-100 dark:hover:bg-teal-900/30'
                          }`}>
                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">{contact.full_name}</td>
                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{contact.email}</td>
                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{contact.phone}</td>
                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{contact.subject}</td>
                            <td className={`px-6 py-4 text-sm text-gray-600 dark:text-gray-400 ${expandedContactId === contact.id ? 'max-w-none' : 'max-w-xs'}`}>
                              <button
                                onClick={() => setExpandedContactId(expandedContactId === contact.id ? null : contact.id)}
                                className={`text-left hover:text-teal-600 dark:hover:text-teal-400 transition-colors ${expandedContactId === contact.id ? 'whitespace-normal break-words' : 'truncate'}`}
                              >
                                {expandedContactId === contact.id ? contact.message : contact.message.substring(0, 50) + (contact.message.length > 50 ? '...' : '')}
                              </button>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{new Date(contact.created_at).toLocaleDateString()}</td>
                            <td className="px-6 py-4 text-sm">
                              {canDelete() ? (
                                <button
                                  onClick={() => deleteRecord('contact_submissions', contact.id)}
                                  className="text-red-600 hover:text-red-800 dark:hover:text-red-400 transition-colors"
                                >
                                  <Trash2 className="w-5 h-5" />
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
            )}

            {/* Newsletter Subscribers Table */}
            {activeTab === 'subscribers' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                {subscribers.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                    <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No newsletter subscribers yet</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-100 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Email</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Name</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Subscribed Date</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {subscribers.map((subscriber, index) => (
                          <tr key={subscriber.id} className={`hover:bg-opacity-75 transition-colors ${
                            index % 2 === 0 
                              ? 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700' 
                              : 'bg-teal-50 dark:bg-teal-900/20 hover:bg-teal-100 dark:hover:bg-teal-900/30'
                          }`}>
                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">{subscriber.email}</td>
                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{subscriber.full_name || '-'}</td>
                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{new Date(subscriber.created_at).toLocaleDateString()}</td>
                            <td className="px-6 py-4 text-sm">
                              {canDelete() ? (
                                <button
                                  onClick={() => deleteRecord('newsletter_subscribers', subscriber.id)}
                                  className="text-red-600 hover:text-red-800 dark:hover:text-red-400 transition-colors"
                                >
                                  <Trash2 className="w-5 h-5" />
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
            )}

            {/* Chat Messages Table */}
            {activeTab === 'messages' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                {messages.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No chat messages yet</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-100 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Name</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Email</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Sender</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Message</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Session ID</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Date</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {messages.map((msg, index) => (
                          <tr key={msg.id} className={`hover:bg-opacity-75 transition-colors ${
                            index % 2 === 0 
                              ? 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700' 
                              : 'bg-teal-50 dark:bg-teal-900/20 hover:bg-teal-100 dark:hover:bg-teal-900/30'
                          }`}>
                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">{msg.user_name || '-'}</td>
                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{msg.user_email || '-'}</td>
                            <td className="px-6 py-4 text-sm">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                msg.sender === 'user'
                                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                                  : 'bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300'
                              }`}>
                                {msg.sender}
                              </span>
                            </td>
                            <td className={`px-6 py-4 text-sm text-gray-600 dark:text-gray-400 ${expandedMessageId === msg.id ? 'max-w-none' : 'max-w-xs'}`}>
                              <button
                                onClick={() => setExpandedMessageId(expandedMessageId === msg.id ? null : msg.id)}
                                className={`text-left hover:text-teal-600 dark:hover:text-teal-400 transition-colors ${expandedMessageId === msg.id ? 'whitespace-normal break-words' : 'truncate'}`}
                              >
                                {expandedMessageId === msg.id ? msg.message : msg.message.substring(0, 50) + (msg.message.length > 50 ? '...' : '')}
                              </button>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 font-mono text-xs">{msg.session_id?.substring(0, 12)}...</td>
                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{new Date(msg.created_at).toLocaleDateString()}</td>
                            <td className="px-6 py-4 text-sm">
                              {canDelete() ? (
                                <button
                                  onClick={() => deleteRecord('chat_messages', msg.id)}
                                  className="text-red-600 hover:text-red-800 dark:hover:text-red-400 transition-colors"
                                >
                                  <Trash2 className="w-5 h-5" />
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
            )}


          </>
        )}
      </div>
    </div>
  );
}
