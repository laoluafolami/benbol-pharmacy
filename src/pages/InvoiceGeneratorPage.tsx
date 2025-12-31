import { useState } from 'react';
import { FileText, Download, Eye, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { downloadInvoice, previewInvoice } from '../utils/generateInvoice';

interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface InvoiceGeneratorPageProps {
  onNavigateBack?: () => void;
}

export default function InvoiceGeneratorPage({ onNavigateBack }: InvoiceGeneratorPageProps) {
  const today = new Date().toISOString().split('T')[0];
  const invoiceNum = `INV-${Date.now().toString().slice(-8)}`;

  const defaultItems: InvoiceItem[] = [
    {
      description: 'Website Design & Development - Custom Pharmacy Website',
      quantity: 1,
      rate: 850000,
      amount: 850000
    },
    {
      description: 'Frontend Development (React + TypeScript + Tailwind CSS)',
      quantity: 1,
      rate: 400000,
      amount: 400000
    },
    {
      description: 'Backend Development & Database Integration (Supabase)',
      quantity: 1,
      rate: 350000,
      amount: 350000
    },
    {
      description: 'Admin Dashboard with User Management System',
      quantity: 1,
      rate: 250000,
      amount: 250000
    },
    {
      description: 'Appointment Booking System with Database',
      quantity: 1,
      rate: 180000,
      amount: 180000
    },
    {
      description: 'Prescription Refill Request System',
      quantity: 1,
      rate: 150000,
      amount: 150000
    },
    {
      description: 'Contact Form with Email Integration',
      quantity: 1,
      rate: 80000,
      amount: 80000
    },
    {
      description: 'Newsletter Subscription System',
      quantity: 1,
      rate: 70000,
      amount: 70000
    },
    {
      description: 'Responsive Design (Mobile, Tablet, Desktop)',
      quantity: 1,
      rate: 200000,
      amount: 200000
    },
    {
      description: 'Dark Mode Implementation Across All Pages',
      quantity: 1,
      rate: 120000,
      amount: 120000
    },
    {
      description: 'Interactive Chatbot Widget',
      quantity: 1,
      rate: 150000,
      amount: 150000
    },
    {
      description: 'SEO Optimization & Meta Tags',
      quantity: 1,
      rate: 100000,
      amount: 100000
    },
    {
      description: 'Legal Pages (Privacy Policy, Terms of Use, Cookie Policy)',
      quantity: 1,
      rate: 90000,
      amount: 90000
    },
    {
      description: 'Blog/Health Resources Section',
      quantity: 1,
      rate: 130000,
      amount: 130000
    },
    {
      description: 'FAQ Section with Expandable Questions',
      quantity: 1,
      rate: 80000,
      amount: 80000
    },
    {
      description: 'Services Showcase Page (12+ Services)',
      quantity: 1,
      rate: 120000,
      amount: 120000
    },
    {
      description: 'About Page with Team Profiles',
      quantity: 1,
      rate: 90000,
      amount: 90000
    },
    {
      description: 'Custom Logo Integration',
      quantity: 1,
      rate: 50000,
      amount: 50000
    },
    {
      description: 'Social Media Integration',
      quantity: 1,
      rate: 60000,
      amount: 60000
    },
    {
      description: 'Form Validation & Error Handling',
      quantity: 1,
      rate: 80000,
      amount: 80000
    },
    {
      description: 'Performance Optimization & Code Splitting',
      quantity: 1,
      rate: 100000,
      amount: 100000
    },
    {
      description: 'Security Implementation (RLS, Authentication)',
      quantity: 1,
      rate: 150000,
      amount: 150000
    },
    {
      description: 'Testing & Quality Assurance',
      quantity: 1,
      rate: 120000,
      amount: 120000
    },
    {
      description: 'Deployment & Hosting Setup (Netlify)',
      quantity: 1,
      rate: 80000,
      amount: 80000
    },
    {
      description: 'Documentation & Handover',
      quantity: 1,
      rate: 70000,
      amount: 70000
    },
    {
      description: 'Post-Launch Support (30 days)',
      quantity: 1,
      rate: 150000,
      amount: 150000
    }
  ];

  const [invoiceNumber, setInvoiceNumber] = useState(invoiceNum);
  const [date, setDate] = useState(today);
  const [clientName, setClientName] = useState('Benbol Pharmacy');
  const [clientAddress, setClientAddress] = useState(
    'Vickie\'s Plaza, Lekki-Epe Expressway\nSun View 2nd gate Bus stop\nOpposite Peace Garden & Crown Estates\nSangotedo, Lagos, Nigeria'
  );
  const [items, setItems] = useState<InvoiceItem[]>(defaultItems);
  const [notes, setNotes] = useState(
    'Payment Terms: 50% upfront, 50% upon completion.\n\nThis invoice includes all website development, design, database setup, admin systems, and 30 days of post-launch support. Additional features or maintenance beyond 30 days will be quoted separately.\n\nBank Details:\nAccount Name: Benbol Pharmacy\nBank: [Bank Name]\nAccount Number: [Account Number]'
  );

  const handleAddItem = () => {
    setItems([
      ...items,
      { description: '', quantity: 1, rate: 0, amount: 0 }
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };

    if (field === 'quantity' || field === 'rate') {
      newItems[index].amount = newItems[index].quantity * newItems[index].rate;
    }

    setItems(newItems);
  };

  const handlePreview = () => {
    previewInvoice({
      invoiceNumber,
      date,
      clientName,
      clientAddress,
      items,
      notes
    });
  };

  const handleDownload = () => {
    downloadInvoice(
      {
        invoiceNumber,
        date,
        clientName,
        clientAddress,
        items,
        notes
      },
      `Benbol_Pharmacy_Invoice_${invoiceNumber}.pdf`
    );
  };

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const tax = subtotal * 0.075;
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {onNavigateBack && (
          <button
            onClick={onNavigateBack}
            className="flex items-center space-x-2 mb-4 text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Back to Admin Dashboard</span>
          </button>
        )}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="bg-teal-100 dark:bg-teal-900 p-3 rounded-lg">
                <FileText className="w-8 h-8 text-teal-600 dark:text-teal-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Invoice Generator</h1>
                <p className="text-gray-600 dark:text-gray-300">Create professional invoices for your clients</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handlePreview}
                className="flex items-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Eye className="w-5 h-5" />
                <span>Preview</span>
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center space-x-2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                <Download className="w-5 h-5" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Invoice Number
              </label>
              <input
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Client Name
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Client Address
              </label>
              <textarea
                value={clientAddress}
                onChange={(e) => setClientAddress(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Invoice Items</h2>
              <button
                onClick={handleAddItem}
                className="flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Description</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">Qty</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">Rate (₦)</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">Amount (₦)</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                          className="w-full px-2 py-1 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                          className="w-20 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm text-center"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={item.rate}
                          onChange={(e) => handleItemChange(index, 'rate', parseFloat(e.target.value) || 0)}
                          className="w-32 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm text-right"
                        />
                      </td>
                      <td className="px-4 py-3 text-right text-gray-900 dark:text-white font-semibold">
                        ₦{item.amount.toLocaleString('en-NG')}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleRemoveItem(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end mb-8">
            <div className="w-80 space-y-3">
              <div className="flex justify-between text-gray-700 dark:text-gray-300">
                <span>Subtotal:</span>
                <span className="font-semibold">₦{subtotal.toLocaleString('en-NG')}</span>
              </div>
              <div className="flex justify-between text-gray-700 dark:text-gray-300">
                <span>VAT (7.5%):</span>
                <span className="font-semibold">₦{tax.toLocaleString('en-NG', { maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-teal-600 dark:text-teal-400 pt-3 border-t-2 border-gray-300 dark:border-gray-600">
                <span>TOTAL:</span>
                <span>₦{total.toLocaleString('en-NG', { maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Notes / Payment Terms
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={6}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
