import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { Download, Trash2, LogOut, Mail, MessageSquare, Users, Calendar, Pill, Archive } from 'lucide-react';
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
  is_read?: boolean;
  is_archived?: boolean;
  status?: string;
}

interface NewsletterSubscriber {
  id: number;
  email: string;
  full_name: string;
  created_at: string;
  is_read?: boolean;
  is_archived?: boolean;
}

interface ChatMessage {
  id: number;
  message: string;
  sender: string;
  session_id: string;
  user_name?: string;
  user_email?: string;
  created_at: string;
  is_read?: boolean;
  is_archived?: boolean;
}

interface Appointment {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  service_type: string;
  preferred_date: string;
  preferred_time: string;
  message: string;
  created_at: string;
  is_read?: boolean;
  is_archived?: boolean;
  status?: string;
}

interface PrescriptionRefill {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  prescription_number: string;
  medication_name: string;
  prescribing_doctor: string;
  additional_notes: string;
  created_at: string;
  is_read?: boolean;
  is_archived?: boolean;
  status?: string;
}

interface AdminDashboardProps {
  onNavigateToUsers: () => void;
}

export default function AdminDashboard({ onNavigateToUsers }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('contacts');
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [refills, setRefills] = useState<PrescriptionRefill[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [expandedMessageId, setExpandedMessageId] = useState<number | null>(null);
  const [expandedContactId, setExpandedContactId] = useState<number | null>(null);
  const [expandedAppointmentId, setExpandedAppointmentId] = useState<number | null>(null);
  const [expandedRefillId, setExpandedRefillId] = useState<number | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<'admin' | 'manager' | 'viewer' | null>(null);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [updateTrigger, setUpdateTrigger] = useState(0); // Force re-render trigger

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
      fetchAllData();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && activeTab) {
      fetchData();
    }
  }, [activeTab]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Fetch all data in parallel for counts
      const [contactsRes, subscribersRes, messagesRes, appointmentsRes, refillsRes] = await Promise.all([
        supabase.from('contact_submissions').select('*').order('created_at', { ascending: false }),
        supabase.from('newsletter_subscribers').select('*').order('created_at', { ascending: false }),
        supabase.from('chat_messages').select('*').order('created_at', { ascending: false }),
        supabase.from('appointments').select('*').order('created_at', { ascending: false }),
        supabase.from('prescription_refills').select('*').order('created_at', { ascending: false }),
      ]);

      setContacts(contactsRes.data || []);
      setSubscribers(subscribersRes.data || []);
      setMessages(messagesRes.data || []);
      setAppointments(appointmentsRes.data || []);
      setRefills(refillsRes.data || []);
    } catch (error) {
      console.error('Error fetching all data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      // Fetch all data in parallel for counts without showing loading spinner
      const [contactsRes, subscribersRes, messagesRes, appointmentsRes, refillsRes] = await Promise.all([
        supabase.from('contact_submissions').select('*').order('created_at', { ascending: false }),
        supabase.from('newsletter_subscribers').select('*').order('created_at', { ascending: false }),
        supabase.from('chat_messages').select('*').order('created_at', { ascending: false }),
        supabase.from('appointments').select('*').order('created_at', { ascending: false }),
        supabase.from('prescription_refills').select('*').order('created_at', { ascending: false }),
      ]);

      setContacts(contactsRes.data || []);
      setSubscribers(subscribersRes.data || []);
      setMessages(messagesRes.data || []);
      setAppointments(appointmentsRes.data || []);
      setRefills(refillsRes.data || []);
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };

  const fetchData = async () => {
    // Data is already loaded, no need to fetch again
    // This function is kept for compatibility but doesn't do anything
    // since all data is loaded on mount
  };

  const canDelete = () => {
    const hasPermission = userRole === 'admin';
    console.log('canDelete check - userRole:', userRole, 'hasPermission:', hasPermission);
    return hasPermission;
  };

  const canMarkAsRead = () => {
    return userRole === 'admin' || userRole === 'manager';
  };

  const canArchive = () => {
    return userRole === 'admin' || userRole === 'manager';
  };

  const canUpdateStatus = () => {
    return userRole === 'admin' || userRole === 'manager';
  };

  // Status management functions
  const toggleReadStatus = async (table: string, id: number, currentStatus?: boolean) => {
    if (!canMarkAsRead()) {
      alert('You do not have permission to mark items as read/unread. Only Admins and Managers can perform this action.');
      return;
    }

    try {
      // Optimistic update - update local state immediately
      const newReadStatus = !currentStatus;
      
      if (table === 'contact_submissions') {
        setContacts(prev => prev.map(item => 
          item.id === id ? { ...item, is_read: newReadStatus } : item
        ));
      } else if (table === 'newsletter_subscribers') {
        setSubscribers(prev => prev.map(item => 
          item.id === id ? { ...item, is_read: newReadStatus } : item
        ));
      } else if (table === 'chat_messages') {
        setMessages(prev => prev.map(item => 
          item.id === id ? { ...item, is_read: newReadStatus } : item
        ));
      } else if (table === 'appointments') {
        setAppointments(prev => prev.map(item => 
          item.id === id ? { ...item, is_read: newReadStatus } : item
        ));
      } else if (table === 'prescription_refills') {
        setRefills(prev => prev.map(item => 
          item.id === id ? { ...item, is_read: newReadStatus } : item
        ));
      }

      // Force re-render of stats cards
      setUpdateTrigger(prev => prev + 1);

      // Then update the database
      const { error } = await supabase
        .from(table)
        .update({ is_read: newReadStatus })
        .eq('id', id);

      if (error) {
        console.error('Error updating read status:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error toggling read status:', error);
      // If database update fails, refresh from server to revert optimistic update
      refreshData();
      // Show user-friendly error message
      alert('Failed to update read status. Please check your permissions and try again.');
    }
  };

  const toggleArchiveStatus = async (table: string, id: number, currentStatus?: boolean) => {
    if (!canArchive()) {
      alert('You do not have permission to archive/unarchive items. Only Admins and Managers can perform this action.');
      return;
    }

    try {
      // Optimistic update - update local state immediately
      const newArchivedStatus = !currentStatus;
      
      if (table === 'contact_submissions') {
        setContacts(prev => prev.map(item => 
          item.id === id ? { ...item, is_archived: newArchivedStatus } : item
        ));
      } else if (table === 'newsletter_subscribers') {
        setSubscribers(prev => prev.map(item => 
          item.id === id ? { ...item, is_archived: newArchivedStatus } : item
        ));
      } else if (table === 'chat_messages') {
        setMessages(prev => prev.map(item => 
          item.id === id ? { ...item, is_archived: newArchivedStatus } : item
        ));
      } else if (table === 'appointments') {
        setAppointments(prev => prev.map(item => 
          item.id === id ? { ...item, is_archived: newArchivedStatus } : item
        ));
      } else if (table === 'prescription_refills') {
        setRefills(prev => prev.map(item => 
          item.id === id ? { ...item, is_archived: newArchivedStatus } : item
        ));
      }

      // Force re-render of stats cards
      setUpdateTrigger(prev => prev + 1);

      // Then update the database
      const { error } = await supabase
        .from(table)
        .update({ is_archived: newArchivedStatus })
        .eq('id', id);

      if (error) {
        console.error('Error updating archive status:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error toggling archive status:', error);
      // If database update fails, refresh from server to revert optimistic update
      refreshData();
      // Show user-friendly error message
      alert('Failed to update archive status. Please check your permissions and try again.');
    }
  };

  const updateStatus = async (table: string, id: number, newStatus: string) => {
    if (!canUpdateStatus()) {
      alert('You do not have permission to update status. Only Admins and Managers can perform this action.');
      return;
    }

    try {
      // Optimistic update - update local state immediately
      if (table === 'contact_submissions') {
        setContacts(prev => prev.map(item => 
          item.id === id ? { ...item, status: newStatus } : item
        ));
      } else if (table === 'appointments') {
        setAppointments(prev => prev.map(item => 
          item.id === id ? { ...item, status: newStatus } : item
        ));
      } else if (table === 'prescription_refills') {
        setRefills(prev => prev.map(item => 
          item.id === id ? { ...item, status: newStatus } : item
        ));
      }

      // Force re-render of stats cards
      setUpdateTrigger(prev => prev + 1);

      // Then update the database
      const { error } = await supabase
        .from(table)
        .update({ status: newStatus })
        .eq('id', id);

      if (error) {
        console.error('Error updating status:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error updating status:', error);
      // If database update fails, refresh from server to revert optimistic update
      refreshData();
      // Show user-friendly error message
      alert('Failed to update status. Please check your permissions and try again.');
    }
  };

  const getFilteredData = <T extends { is_read?: boolean; is_archived?: boolean }>(data: T[]): T[] => {
    let filtered = [...data];
    
    if (showUnreadOnly) {
      filtered = filtered.filter(item => !item.is_read);
    }
    
    if (!showArchived) {
      filtered = filtered.filter(item => !item.is_archived);
    } else {
      filtered = filtered.filter(item => item.is_archived);
    }
    
    return filtered;
  };

  const getStatusBadgeColor = (status?: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300';
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300';
      case 'in-progress':
        return 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300';
      case 'completed':
        return 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300';
      case 'cancelled':
        return 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    }
  };

  // Helper function to check if an item is "active" (needs attention)
  const isActiveItem = (item: any): boolean => {
    if (!item.status) return true; // Items without status are considered active
    return !['completed', 'cancelled'].includes(item.status.toLowerCase());
  };

  const getUnreadCount = <T extends { is_read?: boolean; is_archived?: boolean }>(data: T[]): number => {
    return data.filter(item => !item.is_read && !item.is_archived).length;
  };

  const getActiveUnreadCount = <T extends { is_read?: boolean; is_archived?: boolean; status?: string }>(data: T[]): number => {
    return data.filter(item => !item.is_read && !item.is_archived && isActiveItem(item)).length;
  };

  // Memoized stats calculations to ensure they update when data changes
  const statsData = useMemo(() => {
    return {
      contacts: {
        total: contacts.filter(item => !item.is_archived && isActiveItem(item)).length,
        allTotal: contacts.length, // Keep track of all items for reference
        unread: getActiveUnreadCount(contacts),
        viewed: contacts.filter(item => item.is_read && !item.is_archived && isActiveItem(item)).length,
        archived: contacts.filter(item => item.is_archived).length,
        completed: contacts.filter(item => item.status === 'completed').length,
        cancelled: contacts.filter(item => item.status === 'cancelled').length,
      },
      appointments: {
        total: appointments.filter(item => !item.is_archived && isActiveItem(item)).length,
        allTotal: appointments.length,
        unread: getActiveUnreadCount(appointments),
        viewed: appointments.filter(item => item.is_read && !item.is_archived && isActiveItem(item)).length,
        archived: appointments.filter(item => item.is_archived).length,
        completed: appointments.filter(item => item.status === 'completed').length,
        cancelled: appointments.filter(item => item.status === 'cancelled').length,
      },
      refills: {
        total: refills.filter(item => !item.is_archived && isActiveItem(item)).length,
        allTotal: refills.length,
        unread: getActiveUnreadCount(refills),
        viewed: refills.filter(item => item.is_read && !item.is_archived && isActiveItem(item)).length,
        archived: refills.filter(item => item.is_archived).length,
        completed: refills.filter(item => item.status === 'completed').length,
        cancelled: refills.filter(item => item.status === 'cancelled').length,
      },
      subscribers: {
        total: subscribers.filter(item => !item.is_archived).length, // Subscribers don't have status
        allTotal: subscribers.length,
        unread: getUnreadCount(subscribers),
        viewed: subscribers.filter(item => item.is_read && !item.is_archived).length,
        archived: subscribers.filter(item => item.is_archived).length,
        completed: 0,
        cancelled: 0,
      },
      messages: {
        total: messages.filter(item => !item.is_archived).length, // Messages don't have status
        allTotal: messages.length,
        unread: getUnreadCount(messages),
        viewed: messages.filter(item => item.is_read && !item.is_archived).length,
        archived: messages.filter(item => item.is_archived).length,
        completed: 0,
        cancelled: 0,
      },
    };
  }, [contacts, appointments, refills, subscribers, messages]);

  const deleteRecord = async (table: string, id: number) => {
    if (!canDelete()) {
      alert('You do not have permission to delete records. Only Admins can delete records from the database.');
      return;
    }
    
    if (!confirm('Are you sure you want to delete this record?')) return;
    
    try {
      const { error } = await supabase.from(table).delete().eq('id', id);
      
      if (error) {
        console.error('Error deleting record:', error);
        throw error;
      }
      
      refreshData(); // Refresh all data after deletion
    } catch (error) {
      console.error('Error deleting record:', error);
      // Show user-friendly error message
      alert('Failed to delete record. Please check your permissions and try again.');
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

      // Use autoTable if available
      if ((doc as any).autoTable) {
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
        });
      } else {
        // Fallback: simple text-based table
        doc.setFontSize(9);
        const columnWidth = (doc.internal.pageSize.getWidth() - 40) / columns.length;
        
        // Header
        columns.forEach((col, idx) => {
          doc.text(
            col.charAt(0).toUpperCase() + col.slice(1).replace(/_/g, ' '),
            20 + idx * columnWidth,
            yPosition
          );
        });
        yPosition += 7;
        
        // Rows
        rows.forEach(row => {
          row.forEach((cell, idx) => {
            doc.text(String(cell).substring(0, 30), 20 + idx * columnWidth, yPosition);
          });
          yPosition += 7;
          if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
          }
        });
      }

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      {/* Header */}
      <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-lg sticky top-0 z-40 border-b border-white/20 dark:border-gray-700/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Logged in as: {currentUser?.email}</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onNavigateToUsers}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold backdrop-blur-sm"
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
              className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Glass Morphism Stats Cards */}
      <div className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 py-8">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-pink-400/10 backdrop-blur-3xl"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8" key={updateTrigger}>
            {[
              { 
                id: 'contacts', 
                label: 'Contact Submissions', 
                icon: Mail, 
                count: statsData.contacts.total,
                gradient: 'from-blue-500 to-cyan-500',
                bgGradient: 'from-blue-500/20 to-cyan-500/20',
                description: 'Customer inquiries and support requests'
              },
              { 
                id: 'appointments', 
                label: 'Appointments', 
                icon: Calendar, 
                count: statsData.appointments.total,
                gradient: 'from-green-500 to-emerald-500',
                bgGradient: 'from-green-500/20 to-emerald-500/20',
                description: 'Scheduled consultations and meetings'
              },
              { 
                id: 'refills', 
                label: 'Prescription Refills', 
                icon: Pill, 
                count: statsData.refills.total,
                gradient: 'from-purple-500 to-violet-500',
                bgGradient: 'from-purple-500/20 to-violet-500/20',
                description: 'Medication refill requests'
              },
              { 
                id: 'subscribers', 
                label: 'Newsletter Subscribers', 
                icon: Mail, 
                count: statsData.subscribers.total,
                gradient: 'from-orange-500 to-red-500',
                bgGradient: 'from-orange-500/20 to-red-500/20',
                description: 'Active newsletter subscriptions'
              },
              { 
                id: 'messages', 
                label: 'Chat Messages', 
                icon: MessageSquare, 
                count: statsData.messages.total,
                gradient: 'from-pink-500 to-rose-500',
                bgGradient: 'from-pink-500/20 to-rose-500/20',
                description: 'Live chat conversations'
              },
            ].map((card) => {
              const Icon = card.icon;
              const stats = statsData[card.id as keyof typeof statsData];
              
              return (
                <button
                  key={card.id}
                  onClick={() => setActiveTab(card.id)}
                  className={`group relative overflow-hidden rounded-2xl backdrop-blur-xl border border-white/20 dark:border-gray-700/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                    activeTab === card.id
                      ? 'shadow-2xl ring-2 ring-white/30 dark:ring-gray-600/50'
                      : 'hover:shadow-xl'
                  }`}
                >
                  {/* Glass morphism background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.bgGradient} opacity-80`}></div>
                  <div className="absolute inset-0 bg-white/10 dark:bg-gray-800/20 backdrop-blur-xl"></div>
                  
                  {/* Content */}
                  <div className="relative z-10 p-6">
                    {/* Icon and unread badge */}
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${card.gradient} shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      {stats.unread > 0 && (
                        <div className="relative">
                          <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                          <span className="relative bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                            {stats.unread} new
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Main count */}
                    <div className="mb-2">
                      <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                        {card.count.toLocaleString()}
                      </div>
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {card.label}
                        {(card.id === 'contacts' || card.id === 'appointments' || card.id === 'refills') && (
                          <div className="text-xs text-gray-500 dark:text-gray-500 font-normal">
                            Active Items
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Description */}
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
                      {card.description}
                      {stats.allTotal > stats.total && (
                        <div className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                          ({stats.allTotal - stats.total} completed/cancelled)
                        </div>
                      )}
                    </div>
                    
                    {/* Stats breakdown */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-600 dark:text-gray-400">Active & Viewed</span>
                        <span className="font-semibold text-green-600 dark:text-green-400">
                          {stats.viewed} ({stats.total > 0 ? Math.round((stats.viewed / stats.total) * 100) : 0}%)
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-600 dark:text-gray-400">Active & Unread</span>
                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                          {stats.unread} ({stats.total > 0 ? Math.round((stats.unread / stats.total) * 100) : 0}%)
                        </span>
                      </div>
                      {(stats.completed > 0 || stats.cancelled > 0) && (
                        <>
                          {stats.completed > 0 && (
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-gray-600 dark:text-gray-400">Completed</span>
                              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                {stats.completed}
                              </span>
                            </div>
                          )}
                          {stats.cancelled > 0 && (
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-gray-600 dark:text-gray-400">Cancelled</span>
                              <span className="font-semibold text-red-600 dark:text-red-400">
                                {stats.cancelled}
                              </span>
                            </div>
                          )}
                        </>
                      )}
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-600 dark:text-gray-400">Archived</span>
                        <span className="font-semibold text-yellow-600 dark:text-yellow-400">
                          {stats.archived}
                        </span>
                      </div>
                      
                      {/* Progress bar */}
                      <div className="mt-3">
                        <div className="flex text-xs text-gray-600 dark:text-gray-400 mb-1">
                          <span>Active Items Progress</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                          <div className="h-full flex">
                            <div 
                              className="bg-gradient-to-r from-green-400 to-green-500 transition-all duration-500"
                              style={{ width: `${stats.total > 0 ? (stats.viewed / stats.total) * 100 : 0}%` }}
                              title={`${stats.viewed} viewed items`}
                            ></div>
                            <div 
                              className="bg-gradient-to-r from-blue-400 to-blue-500 transition-all duration-500"
                              style={{ width: `${stats.total > 0 ? (stats.unread / stats.total) * 100 : 0}%` }}
                              title={`${stats.unread} unread items`}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 z-30 shadow-lg">
        <div 
          className="w-full overflow-x-auto overflow-y-hidden scrollbar-hide"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          <div className="flex w-max px-4 py-2">
            {[
              { id: 'contacts', label: 'Contact Submissions', icon: Mail, color: 'from-blue-500 to-cyan-500' },
              { id: 'appointments', label: 'Appointments', icon: Calendar, color: 'from-green-500 to-emerald-500' },
              { id: 'refills', label: 'Prescription Refills', icon: Pill, color: 'from-purple-500 to-violet-500' },
              { id: 'subscribers', label: 'Newsletter Subscribers', icon: Mail, color: 'from-orange-500 to-red-500' },
              { id: 'messages', label: 'Chat Messages', icon: MessageSquare, color: 'from-pink-500 to-rose-500' },
            ].map((tab, index) => {
              const Icon = tab.icon;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group relative flex items-center space-x-3 px-6 py-3 mx-1 rounded-2xl font-bold text-sm transition-all duration-300 whitespace-nowrap flex-shrink-0 overflow-hidden ${
                    activeTab === tab.id
                      ? 'text-white shadow-2xl transform scale-105'
                      : 'text-gray-600 dark:text-gray-400 hover:text-white hover:scale-105 hover:shadow-xl'
                  }`}
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  {/* Animated Background */}
                  <div className={`absolute inset-0 transition-all duration-500 ${
                    activeTab === tab.id
                      ? `bg-gradient-to-r ${tab.color} opacity-100`
                      : `bg-gradient-to-r ${tab.color} opacity-0 group-hover:opacity-100`
                  }`}></div>
                  
                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  
                  {/* Floating Particles */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute top-1 left-2 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: '0ms' }}></div>
                    <div className="absolute top-2 right-3 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: '200ms' }}></div>
                    <div className="absolute bottom-2 left-4 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: '400ms' }}></div>
                  </div>
                  
                  {/* Glass Morphism Overlay */}
                  <div className={`absolute inset-0 backdrop-blur-sm border border-white/20 rounded-2xl transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-white/10 shadow-inner'
                      : 'bg-white/5 group-hover:bg-white/10'
                  }`}></div>
                  
                  {/* Icon with Pulse Effect */}
                  <div className={`relative z-10 p-2 rounded-lg transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-white/20 shadow-lg'
                      : 'bg-white/10 group-hover:bg-white/20'
                  }`}>
                    <Icon className={`w-5 h-5 transition-all duration-300 ${
                      activeTab === tab.id ? 'animate-pulse' : 'group-hover:scale-110'
                    }`} />
                  </div>
                  
                  {/* Text Content */}
                  <span className="relative z-10 flex items-center space-x-2">
                    <span>{tab.label}</span>
                    {activeTab === tab.id && (
                      <div className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
                    )}
                  </span>
                  
                  {/* Bottom Glow */}
                  {activeTab === tab.id && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-yellow-300 to-transparent rounded-full animate-pulse"></div>
                  )}
                  
                  {/* Hover Glow */}
                  <div className={`absolute -inset-1 bg-gradient-to-r ${tab.color} rounded-2xl opacity-0 group-hover:opacity-30 blur-sm transition-all duration-300 -z-10`}></div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 relative z-10">
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-transparent bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-transparent bg-gradient-to-r from-blue-500 to-purple-500 rounded-full absolute top-0 left-0 border-t-transparent animate-reverse-spin"></div>
            </div>
          </div>
        ) : (
          <>
            {/* Filter Buttons */}
            <div className="flex gap-3 mb-6 flex-wrap">
              <button
                onClick={() => setShowUnreadOnly(!showUnreadOnly)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold transition-all duration-300 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 ${
                  showUnreadOnly
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                    : 'bg-white/20 dark:bg-gray-800/20 text-gray-700 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-gray-700/30'
                }`}
              >
                <Mail className="w-4 h-4" />
                <span>Unread Only</span>
              </button>
              <button
                onClick={() => setShowArchived(!showArchived)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold transition-all duration-300 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 ${
                  showArchived
                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg'
                    : 'bg-white/20 dark:bg-gray-800/20 text-gray-700 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-gray-700/30'
                }`}
              >
                <Archive className="w-4 h-4" />
                <span>{showArchived ? 'Hide Archived' : 'Show Archived'}</span>
              </button>
              {(showUnreadOnly || showArchived) && (
                <button
                  onClick={() => {
                    setShowUnreadOnly(false);
                    setShowArchived(false);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg backdrop-blur-sm"
                >
                  <span>Clear Filters</span>
                </button>
              )}
            </div>

            {/* Export Buttons */}
            <div className="flex gap-4 mb-6">
              {activeTab === 'contacts' && contacts.length > 0 && (
                <>
                  <button
                    onClick={() => exportToCSV(getFilteredData(contacts), 'contact_submissions')}
                    className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg backdrop-blur-sm"
                  >
                    <Download className="w-5 h-5" />
                    <span>Export CSV</span>
                  </button>
                  <button
                    onClick={() => exportToPDF(getFilteredData(contacts), 'Contact Submissions')}
                    className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg backdrop-blur-sm"
                  >
                    <Download className="w-5 h-5" />
                    <span>Export PDF</span>
                  </button>
                </>
              )}
              {activeTab === 'appointments' && appointments.length > 0 && (
                <>
                  <button
                    onClick={() => exportToCSV(getFilteredData(appointments), 'appointments')}
                    className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg backdrop-blur-sm"
                  >
                    <Download className="w-5 h-5" />
                    <span>Export CSV</span>
                  </button>
                  <button
                    onClick={() => exportToPDF(getFilteredData(appointments), 'Appointments')}
                    className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg backdrop-blur-sm"
                  >
                    <Download className="w-5 h-5" />
                    <span>Export PDF</span>
                  </button>
                </>
              )}
              {activeTab === 'refills' && refills.length > 0 && (
                <>
                  <button
                    onClick={() => exportToCSV(getFilteredData(refills), 'prescription_refills')}
                    className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg backdrop-blur-sm"
                  >
                    <Download className="w-5 h-5" />
                    <span>Export CSV</span>
                  </button>
                  <button
                    onClick={() => exportToPDF(getFilteredData(refills), 'Prescription Refills')}
                    className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg backdrop-blur-sm"
                  >
                    <Download className="w-5 h-5" />
                    <span>Export PDF</span>
                  </button>
                </>
              )}
              {activeTab === 'subscribers' && subscribers.length > 0 && (
                <>
                  <button
                    onClick={() => exportToCSV(getFilteredData(subscribers), 'newsletter_subscribers')}
                    className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg backdrop-blur-sm"
                  >
                    <Download className="w-5 h-5" />
                    <span>Export CSV</span>
                  </button>
                  <button
                    onClick={() => exportToPDF(getFilteredData(subscribers), 'Newsletter Subscribers')}
                    className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg backdrop-blur-sm"
                  >
                    <Download className="w-5 h-5" />
                    <span>Export PDF</span>
                  </button>
                </>
              )}
              {activeTab === 'messages' && messages.length > 0 && (
                <>
                  <button
                    onClick={() => exportToCSV(getFilteredData(messages), 'chat_messages')}
                    className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg backdrop-blur-sm"
                  >
                    <Download className="w-5 h-5" />
                    <span>Export CSV</span>
                  </button>
                  <button
                    onClick={() => exportToPDF(getFilteredData(messages), 'Chat Messages')}
                    className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg backdrop-blur-sm"
                  >
                    <Download className="w-5 h-5" />
                    <span>Export PDF</span>
                  </button>
                </>
              )}
            </div>

            {/* Contact Submissions Table */}
            {activeTab === 'contacts' && (
              <div className="relative backdrop-blur-xl bg-white/20 dark:bg-gray-800/20 rounded-2xl shadow-2xl overflow-hidden border border-white/20 dark:border-gray-700/50">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent dark:from-gray-800/10 pointer-events-none"></div>
                {contacts.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                    <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No contact submissions yet</p>
                  </div>
                ) : (
                  <div className="w-full overflow-x-auto relative z-10" style={{ WebkitOverflowScrolling: 'touch', maxHeight: '70vh', overflowY: 'auto' }}>
                    <table className="table-auto" style={{ minWidth: '1400px', width: 'max-content' }}>
                      <thead className="bg-gradient-to-r from-teal-500 to-blue-600 sticky top-0 z-40">
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-white whitespace-nowrap min-w-32">Name</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-white whitespace-nowrap min-w-48">Email</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-white whitespace-nowrap min-w-32">Phone</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-white whitespace-nowrap min-w-40">Subject</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-white whitespace-nowrap min-w-64">Message</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-white whitespace-nowrap min-w-24">Status</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-white whitespace-nowrap min-w-24">Date</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-white whitespace-nowrap min-w-40">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {getFilteredData(contacts).map((contact, index) => (
                          <tr key={contact.id} className={`hover:bg-opacity-75 transition-colors ${
                            !contact.is_read ? 'bg-blue-50 dark:bg-blue-900/10 border-l-4 border-l-blue-500' : ''
                          } ${
                            index % 2 === 0 
                              ? 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700' 
                              : 'bg-teal-50 dark:bg-teal-900/20 hover:bg-teal-100 dark:hover:bg-teal-900/30'
                          }`}>
                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium whitespace-nowrap">{contact.full_name}</td>
                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 break-words">{contact.email}</td>
                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">{contact.phone}</td>
                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 break-words max-w-xs">{contact.subject}</td>
                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                              <div className="max-w-xs">
                                <button
                                  onClick={() => setExpandedContactId(expandedContactId === contact.id ? null : contact.id)}
                                  className="text-left hover:text-teal-600 dark:hover:text-teal-400 transition-colors w-full p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
                                  title="Click to expand/collapse message"
                                >
                                  <div className={`${expandedContactId === contact.id ? 'whitespace-normal break-words' : 'truncate'}`}>
                                    {expandedContactId === contact.id ? contact.message : contact.message.substring(0, 50) + (contact.message.length > 50 ? '...' : '')}
                                  </div>
                                  {contact.message.length > 50 && (
                                    <span className="ml-2 text-xs text-gray-400">
                                      {expandedContactId === contact.id ? '▼' : '▶'}
                                    </span>
                                  )}
                                </button>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm whitespace-nowrap">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(contact.status)}`}>
                                {contact.status || 'new'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">{new Date(contact.created_at).toLocaleDateString()}</td>
                            <td className="px-6 py-4 text-sm whitespace-nowrap">
                              <div className="flex items-center space-x-2">
                                {canMarkAsRead() ? (
                                  <button
                                    onClick={() => toggleReadStatus('contact_submissions', contact.id, contact.is_read)}
                                    className={`p-2 rounded-lg transition-colors ${
                                      contact.is_read
                                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
                                        : 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 hover:bg-blue-200'
                                    }`}
                                    title={contact.is_read ? 'Mark as unread' : 'Mark as read'}
                                  >
                                    <Mail className="w-4 h-4" />
                                  </button>
                                ) : (
                                  <div className="p-2 rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-400 cursor-not-allowed" title="View-only access">
                                    <Mail className="w-4 h-4" />
                                  </div>
                                )}
                                {canArchive() ? (
                                  <button
                                    onClick={() => toggleArchiveStatus('contact_submissions', contact.id, contact.is_archived)}
                                    className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300 hover:bg-yellow-200 transition-colors"
                                    title={contact.is_archived ? 'Unarchive' : 'Archive'}
                                  >
                                    <Archive className="w-4 h-4" />
                                  </button>
                                ) : (
                                  <div className="p-2 rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-400 cursor-not-allowed" title="View-only access">
                                    <Archive className="w-4 h-4" />
                                  </div>
                                )}
                                {canUpdateStatus() ? (
                                  <select
                                    value={contact.status || 'new'}
                                    onChange={(e) => updateStatus('contact_submissions', contact.id, e.target.value)}
                                    className="px-2 py-1 rounded-lg text-xs font-medium border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                                  >
                                    <option value="new">New</option>
                                    <option value="pending">Pending</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                  </select>
                                ) : (
                                  <span className="px-2 py-1 rounded-lg text-xs font-medium bg-gray-200 dark:bg-gray-600 text-gray-500 cursor-not-allowed">
                                    {contact.status || 'new'}
                                  </span>
                                )}
                                {canDelete() ? (
                                  <button
                                    onClick={() => deleteRecord('contact_submissions', contact.id)}
                                    className="p-2 rounded-lg bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 hover:bg-red-200 transition-colors"
                                  >
                                    <Trash2 className="w-4 h-5" />
                                  </button>
                                ) : (
                                  <span className="text-gray-400 dark:text-gray-600">—</span>
                                )}
                              </div>
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
              <div className="relative backdrop-blur-xl bg-white/20 dark:bg-gray-800/20 rounded-2xl shadow-2xl overflow-hidden border border-white/20 dark:border-gray-700/50">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent dark:from-gray-800/10 pointer-events-none"></div>
                {subscribers.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                    <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No newsletter subscribers yet</p>
                  </div>
                ) : (
                  <div className="w-full overflow-x-auto relative z-10" style={{ WebkitOverflowScrolling: 'touch', maxHeight: '70vh', overflowY: 'auto' }}>
                    <table className="table-auto" style={{ minWidth: '800px', width: 'max-content' }}>
                      <thead className="bg-gradient-to-r from-teal-500 to-blue-600 sticky top-0 z-40">
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-white whitespace-nowrap min-w-48">Email</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-white whitespace-nowrap min-w-32">Name</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-white whitespace-nowrap min-w-32">Subscribed Date</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-white whitespace-nowrap min-w-40">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {getFilteredData(subscribers).map((subscriber, index) => (
                          <tr key={subscriber.id} className={`hover:bg-opacity-75 transition-colors ${
                            !subscriber.is_read ? 'bg-blue-50 dark:bg-blue-900/10 border-l-4 border-l-blue-500' : ''
                          } ${
                            index % 2 === 0 
                              ? 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700' 
                              : 'bg-teal-50 dark:bg-teal-900/20 hover:bg-teal-100 dark:hover:bg-teal-900/30'
                          }`}>
                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium break-words">{subscriber.email}</td>
                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                              {subscriber.full_name && subscriber.full_name.trim() ? subscriber.full_name : 'No name provided'}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">{new Date(subscriber.created_at).toLocaleDateString()}</td>
                            <td className="px-6 py-4 text-sm whitespace-nowrap">
                              <div className="flex items-center space-x-2">
                                {canMarkAsRead() ? (
                                  <button
                                    onClick={() => toggleReadStatus('newsletter_subscribers', subscriber.id, subscriber.is_read)}
                                    className={`p-2 rounded-lg transition-colors ${
                                      subscriber.is_read
                                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
                                        : 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 hover:bg-blue-200'
                                    }`}
                                    title={subscriber.is_read ? 'Mark as unread' : 'Mark as read'}
                                  >
                                    <Mail className="w-4 h-4" />
                                  </button>
                                ) : (
                                  <div className="p-2 rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-400 cursor-not-allowed" title="View-only access">
                                    <Mail className="w-4 h-4" />
                                  </div>
                                )}
                                {canArchive() ? (
                                  <button
                                    onClick={() => toggleArchiveStatus('newsletter_subscribers', subscriber.id, subscriber.is_archived)}
                                    className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300 hover:bg-yellow-200 transition-colors"
                                    title={subscriber.is_archived ? 'Unarchive' : 'Archive'}
                                  >
                                    <Archive className="w-4 h-4" />
                                  </button>
                                ) : (
                                  <div className="p-2 rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-400 cursor-not-allowed" title="View-only access">
                                    <Archive className="w-4 h-4" />
                                  </div>
                                )}
                                {canDelete() ? (
                                  <button
                                    onClick={() => deleteRecord('newsletter_subscribers', subscriber.id)}
                                    className="p-2 rounded-lg bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 hover:bg-red-200 transition-colors"
                                  >
                                    <Trash2 className="w-4 h-5" />
                                  </button>
                                ) : (
                                  <span className="text-gray-400 dark:text-gray-600">—</span>
                                )}
                              </div>
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
              <div className="relative backdrop-blur-xl bg-white/20 dark:bg-gray-800/20 rounded-2xl shadow-2xl overflow-hidden border border-white/20 dark:border-gray-700/50">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent dark:from-gray-800/10 pointer-events-none"></div>
                {messages.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No chat messages yet</p>
                  </div>
                ) : (
                  <div className="w-full overflow-x-auto relative z-10" style={{ WebkitOverflowScrolling: 'touch', maxHeight: '70vh', overflowY: 'auto' }}>
                    <table className="table-auto" style={{ minWidth: '1200px', width: 'max-content' }}>
                      <thead className="bg-gradient-to-r from-teal-500 to-blue-600 sticky top-0 z-40">
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-white whitespace-nowrap min-w-32">Name</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-white whitespace-nowrap min-w-48">Email</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-white whitespace-nowrap min-w-24">Sender</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-white whitespace-nowrap min-w-64">Message</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-white whitespace-nowrap min-w-32">Session ID</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-white whitespace-nowrap min-w-24">Date</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-white whitespace-nowrap min-w-40">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {getFilteredData(messages).map((msg, index) => (
                          <tr key={msg.id} className={`hover:bg-opacity-75 transition-colors ${
                            !msg.is_read ? 'bg-blue-50 dark:bg-blue-900/10 border-l-4 border-l-blue-500' : ''
                          } ${
                            index % 2 === 0 
                              ? 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700' 
                              : 'bg-teal-50 dark:bg-teal-900/20 hover:bg-teal-100 dark:hover:bg-teal-900/30'
                          }`}>
                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium whitespace-nowrap">{msg.user_name || '-'}</td>
                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 break-words">{msg.user_email || '-'}</td>
                            <td className="px-6 py-4 text-sm whitespace-nowrap">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                msg.sender === 'user'
                                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                                  : 'bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300'
                              }`}>
                                {msg.sender}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                              <div className="max-w-xs">
                                <button
                                  onClick={() => setExpandedMessageId(expandedMessageId === msg.id ? null : msg.id)}
                                  className="text-left hover:text-teal-600 dark:hover:text-teal-400 transition-colors w-full p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
                                  title="Click to expand/collapse message"
                                >
                                  <div className={`${expandedMessageId === msg.id ? 'whitespace-normal break-words' : 'truncate'}`}>
                                    {expandedMessageId === msg.id ? msg.message : msg.message.substring(0, 50) + (msg.message.length > 50 ? '...' : '')}
                                  </div>
                                  {msg.message.length > 50 && (
                                    <span className="ml-2 text-xs text-gray-400">
                                      {expandedMessageId === msg.id ? '▼' : '▶'}
                                    </span>
                                  )}
                                </button>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 font-mono text-xs whitespace-nowrap">{msg.session_id?.substring(0, 12)}...</td>
                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">{new Date(msg.created_at).toLocaleDateString()}</td>
                            <td className="px-6 py-4 text-sm whitespace-nowrap">
                              <div className="flex items-center space-x-2">
                                {canMarkAsRead() ? (
                                  <button
                                    onClick={() => toggleReadStatus('chat_messages', msg.id, msg.is_read)}
                                    className={`p-2 rounded-lg transition-colors ${
                                      msg.is_read
                                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
                                        : 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 hover:bg-blue-200'
                                    }`}
                                    title={msg.is_read ? 'Mark as unread' : 'Mark as read'}
                                  >
                                    <Mail className="w-4 h-4" />
                                  </button>
                                ) : (
                                  <div className="p-2 rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-400 cursor-not-allowed" title="View-only access">
                                    <Mail className="w-4 h-4" />
                                  </div>
                                )}
                                {canArchive() ? (
                                  <button
                                    onClick={() => toggleArchiveStatus('chat_messages', msg.id, msg.is_archived)}
                                    className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300 hover:bg-yellow-200 transition-colors"
                                    title={msg.is_archived ? 'Unarchive' : 'Archive'}
                                  >
                                    <Archive className="w-4 h-4" />
                                  </button>
                                ) : (
                                  <div className="p-2 rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-400 cursor-not-allowed" title="View-only access">
                                    <Archive className="w-4 h-4" />
                                  </div>
                                )}
                                {canDelete() ? (
                                  <button
                                    onClick={() => deleteRecord('chat_messages', msg.id)}
                                    className="p-2 rounded-lg bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 hover:bg-red-200 transition-colors"
                                  >
                                    <Trash2 className="w-4 h-5" />
                                  </button>
                                ) : (
                                  <span className="text-gray-400 dark:text-gray-600">—</span>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Appointments Table */}
            {activeTab === 'appointments' && (
              <div className="relative backdrop-blur-xl bg-white/20 dark:bg-gray-800/20 rounded-2xl shadow-2xl overflow-hidden border border-white/20 dark:border-gray-700/50">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent dark:from-gray-800/10 pointer-events-none"></div>
                {appointments.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                    <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No appointments yet</p>
                  </div>
                ) : (
                  <div className="w-full overflow-x-auto relative z-10" style={{ WebkitOverflowScrolling: 'touch', maxHeight: '70vh', overflowY: 'auto' }}>
                    <table className="table-auto" style={{ minWidth: '1600px', width: 'max-content' }}>
                      <thead className="bg-gradient-to-r from-teal-500 to-blue-600 sticky top-0 z-40">
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-white whitespace-nowrap min-w-32">Name</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-white whitespace-nowrap min-w-48">Email</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-white whitespace-nowrap min-w-32">Phone</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-white whitespace-nowrap min-w-32">Service Type</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-white whitespace-nowrap min-w-32">Preferred Date</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-white whitespace-nowrap min-w-32">Preferred Time</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-white whitespace-nowrap min-w-64">Message</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-white whitespace-nowrap min-w-24">Status</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-white whitespace-nowrap min-w-24">Date</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-white whitespace-nowrap min-w-40">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {getFilteredData(appointments).map((appointment, index) => (
                          <tr key={appointment.id} className={`hover:bg-opacity-75 transition-colors ${
                            !appointment.is_read ? 'bg-blue-50 dark:bg-blue-900/10 border-l-4 border-l-blue-500' : ''
                          } ${
                            index % 2 === 0 
                              ? 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700' 
                              : 'bg-teal-50 dark:bg-teal-900/20 hover:bg-teal-100 dark:hover:bg-teal-900/30'
                          }`}>
                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium whitespace-nowrap">{appointment.full_name}</td>
                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 break-words">{appointment.email}</td>
                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">{appointment.phone}</td>
                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 break-words max-w-xs">{appointment.service_type}</td>
                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">{new Date(appointment.preferred_date).toLocaleDateString()}</td>
                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">{appointment.preferred_time}</td>
                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                              <div className="max-w-xs">
                                <button
                                  onClick={() => setExpandedAppointmentId(expandedAppointmentId === appointment.id ? null : appointment.id)}
                                  className="text-left hover:text-teal-600 dark:hover:text-teal-400 transition-colors w-full p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
                                  title="Click to expand/collapse message"
                                >
                                  <div className={`${expandedAppointmentId === appointment.id ? 'whitespace-normal break-words' : 'truncate'}`}>
                                    {expandedAppointmentId === appointment.id ? appointment.message : appointment.message.substring(0, 50) + (appointment.message.length > 50 ? '...' : '')}
                                  </div>
                                  {appointment.message.length > 50 && (
                                    <span className="ml-2 text-xs text-gray-400">
                                      {expandedAppointmentId === appointment.id ? '▼' : '▶'}
                                    </span>
                                  )}
                                </button>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm whitespace-nowrap">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(appointment.status)}`}>
                                {appointment.status || 'pending'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">{new Date(appointment.created_at).toLocaleDateString()}</td>
                            <td className="px-6 py-4 text-sm whitespace-nowrap">
                              <div className="flex items-center space-x-2">
                                {canMarkAsRead() ? (
                                  <button
                                    onClick={() => toggleReadStatus('appointments', appointment.id, appointment.is_read)}
                                    className={`p-2 rounded-lg transition-colors ${
                                      appointment.is_read
                                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
                                        : 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 hover:bg-blue-200'
                                    }`}
                                    title={appointment.is_read ? 'Mark as unread' : 'Mark as read'}
                                  >
                                    <Mail className="w-4 h-4" />
                                  </button>
                                ) : (
                                  <div className="p-2 rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-400 cursor-not-allowed" title="View-only access">
                                    <Mail className="w-4 h-4" />
                                  </div>
                                )}
                                {canArchive() ? (
                                  <button
                                    onClick={() => toggleArchiveStatus('appointments', appointment.id, appointment.is_archived)}
                                    className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300 hover:bg-yellow-200 transition-colors"
                                    title={appointment.is_archived ? 'Unarchive' : 'Archive'}
                                  >
                                    <Archive className="w-4 h-4" />
                                  </button>
                                ) : (
                                  <div className="p-2 rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-400 cursor-not-allowed" title="View-only access">
                                    <Archive className="w-4 h-4" />
                                  </div>
                                )}
                                {canUpdateStatus() ? (
                                  <select
                                    value={appointment.status || 'pending'}
                                    onChange={(e) => updateStatus('appointments', appointment.id, e.target.value)}
                                    className="px-2 py-1 rounded-lg text-xs font-medium border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                                  >
                                    <option value="pending">Pending</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                  </select>
                                ) : (
                                  <span className="px-2 py-1 rounded-lg text-xs font-medium bg-gray-200 dark:bg-gray-600 text-gray-500 cursor-not-allowed">
                                    {appointment.status || 'pending'}
                                  </span>
                                )}
                                {canDelete() ? (
                                  <button
                                    onClick={() => deleteRecord('appointments', appointment.id)}
                                    className="p-2 rounded-lg bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 hover:bg-red-200 transition-colors"
                                  >
                                    <Trash2 className="w-4 h-5" />
                                  </button>
                                ) : (
                                  <span className="text-gray-400 dark:text-gray-600">—</span>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Prescription Refills Table */}
            {activeTab === 'refills' && (
              <div className="relative backdrop-blur-xl bg-white/20 dark:bg-gray-800/20 rounded-2xl shadow-2xl overflow-hidden border border-white/20 dark:border-gray-700/50">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent dark:from-gray-800/10 pointer-events-none"></div>
                {refills.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                    <Pill className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No prescription refills yet</p>
                  </div>
                ) : (
                  <div className="w-full overflow-x-auto relative z-10" style={{ WebkitOverflowScrolling: 'touch', maxHeight: '70vh', overflowY: 'auto' }}>
                    <table className="table-auto" style={{ minWidth: '1600px', width: 'max-content' }}>
                      <thead className="bg-gradient-to-r from-teal-500 to-blue-600 sticky top-0 z-40">
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-white whitespace-nowrap min-w-32">Name</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-white whitespace-nowrap min-w-48">Email</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-white whitespace-nowrap min-w-32">Phone</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-white whitespace-nowrap min-w-32">Prescription #</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-white whitespace-nowrap min-w-40">Medication</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-white whitespace-nowrap min-w-32">Doctor</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-white whitespace-nowrap min-w-64">Notes</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-white whitespace-nowrap min-w-24">Status</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-white whitespace-nowrap min-w-24">Date</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-white whitespace-nowrap min-w-40">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {getFilteredData(refills).map((refill, index) => (
                          <tr key={refill.id} className={`hover:bg-opacity-75 transition-colors ${
                            !refill.is_read ? 'bg-blue-50 dark:bg-blue-900/10 border-l-4 border-l-blue-500' : ''
                          } ${
                            index % 2 === 0 
                              ? 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700' 
                              : 'bg-teal-50 dark:bg-teal-900/20 hover:bg-teal-100 dark:hover:bg-teal-900/30'
                          }`}>
                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium whitespace-nowrap">{refill.full_name}</td>
                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 break-words">{refill.email}</td>
                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">{refill.phone}</td>
                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">{refill.prescription_number || '-'}</td>
                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 break-words max-w-xs">{refill.medication_name}</td>
                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 break-words max-w-xs">{refill.prescribing_doctor || '-'}</td>
                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                              <div className="max-w-xs">
                                <button
                                  onClick={() => setExpandedRefillId(expandedRefillId === refill.id ? null : refill.id)}
                                  className="text-left hover:text-teal-600 dark:hover:text-teal-400 transition-colors w-full p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
                                  title="Click to expand/collapse notes"
                                >
                                  <div className={`${expandedRefillId === refill.id ? 'whitespace-normal break-words' : 'truncate'}`}>
                                    {expandedRefillId === refill.id ? refill.additional_notes : refill.additional_notes.substring(0, 50) + (refill.additional_notes.length > 50 ? '...' : '')}
                                  </div>
                                  {refill.additional_notes.length > 50 && (
                                    <span className="ml-2 text-xs text-gray-400">
                                      {expandedRefillId === refill.id ? '▼' : '▶'}
                                    </span>
                                  )}
                                </button>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm whitespace-nowrap">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(refill.status)}`}>
                                {refill.status || 'pending'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">{new Date(refill.created_at).toLocaleDateString()}</td>
                            <td className="px-6 py-4 text-sm whitespace-nowrap">
                              <div className="flex items-center space-x-2">
                                {canMarkAsRead() ? (
                                  <button
                                    onClick={() => toggleReadStatus('prescription_refills', refill.id, refill.is_read)}
                                    className={`p-2 rounded-lg transition-colors ${
                                      refill.is_read
                                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
                                        : 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 hover:bg-blue-200'
                                    }`}
                                    title={refill.is_read ? 'Mark as unread' : 'Mark as read'}
                                  >
                                    <Mail className="w-4 h-4" />
                                  </button>
                                ) : (
                                  <div className="p-2 rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-400 cursor-not-allowed" title="View-only access">
                                    <Mail className="w-4 h-4" />
                                  </div>
                                )}
                                {canArchive() ? (
                                  <button
                                    onClick={() => toggleArchiveStatus('prescription_refills', refill.id, refill.is_archived)}
                                    className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300 hover:bg-yellow-200 transition-colors"
                                    title={refill.is_archived ? 'Unarchive' : 'Archive'}
                                  >
                                    <Archive className="w-4 h-4" />
                                  </button>
                                ) : (
                                  <div className="p-2 rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-400 cursor-not-allowed" title="View-only access">
                                    <Archive className="w-4 h-4" />
                                  </div>
                                )}
                                {canUpdateStatus() ? (
                                  <select
                                    value={refill.status || 'pending'}
                                    onChange={(e) => updateStatus('prescription_refills', refill.id, e.target.value)}
                                    className="px-2 py-1 rounded-lg text-xs font-medium border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                                  >
                                    <option value="pending">Pending</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                  </select>
                                ) : (
                                  <span className="px-2 py-1 rounded-lg text-xs font-medium bg-gray-200 dark:bg-gray-600 text-gray-500 cursor-not-allowed">
                                    {refill.status || 'pending'}
                                  </span>
                                )}
                                {canDelete() ? (
                                  <button
                                    onClick={() => deleteRecord('prescription_refills', refill.id)}
                                    className="p-2 rounded-lg bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 hover:bg-red-200 transition-colors"
                                  >
                                    <Trash2 className="w-4 h-5" />
                                  </button>
                                ) : (
                                  <span className="text-gray-400 dark:text-gray-600">—</span>
                                )}
                              </div>
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
