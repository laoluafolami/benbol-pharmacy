import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface InvoiceData {
  invoiceNumber: string;
  date: string;
  clientName: string;
  clientAddress?: string;
  items: InvoiceItem[];
  notes?: string;
}

export function generateInvoice(data: InvoiceData) {
  const doc = new jsPDF();

  const primaryColor = [0, 128, 128];
  const lightGray = [240, 240, 240];
  const darkGray = [60, 60, 60];

  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 40, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE', 20, 25);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Benbol Pharmacy & Digital Services', 20, 32);

  doc.setTextColor(...darkGray);
  doc.setFontSize(10);
  doc.text(`Invoice #: ${data.invoiceNumber}`, 150, 25);
  doc.text(`Date: ${data.date}`, 150, 31);

  doc.setFillColor(...lightGray);
  doc.rect(20, 50, 170, 25, 'F');

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('BILL TO:', 25, 58);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(data.clientName, 25, 65);
  if (data.clientAddress) {
    const addressLines = doc.splitTextToSize(data.clientAddress, 160);
    doc.text(addressLines, 25, 71);
  }

  const tableStartY = data.clientAddress ? 85 : 80;

  (doc as any).autoTable({
    startY: tableStartY,
    head: [['Description', 'Qty', 'Rate (₦)', 'Amount (₦)']],
    body: data.items.map(item => [
      item.description,
      item.quantity.toString(),
      item.rate.toLocaleString('en-NG'),
      item.amount.toLocaleString('en-NG')
    ]),
    theme: 'striped',
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 11
    },
    bodyStyles: {
      fontSize: 10,
      textColor: darkGray
    },
    alternateRowStyles: {
      fillColor: [250, 250, 250]
    },
    columnStyles: {
      0: { cellWidth: 100 },
      1: { cellWidth: 20, halign: 'center' },
      2: { cellWidth: 30, halign: 'right' },
      3: { cellWidth: 30, halign: 'right' }
    },
    margin: { left: 20, right: 20 }
  });

  const finalY = (doc as any).lastAutoTable.finalY || tableStartY + 100;

  const subtotal = data.items.reduce((sum, item) => sum + item.amount, 0);
  const tax = subtotal * 0.075;
  const total = subtotal + tax;

  const summaryX = 130;
  let summaryY = finalY + 10;

  doc.setFillColor(...lightGray);
  doc.rect(summaryX - 5, summaryY - 5, 60, 30, 'F');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Subtotal:', summaryX, summaryY);
  doc.text(`₦${subtotal.toLocaleString('en-NG')}`, 185, summaryY, { align: 'right' });

  summaryY += 7;
  doc.text('VAT (7.5%):', summaryX, summaryY);
  doc.text(`₦${tax.toLocaleString('en-NG', { maximumFractionDigits: 2 })}`, 185, summaryY, { align: 'right' });

  summaryY += 10;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...primaryColor);
  doc.text('TOTAL:', summaryX, summaryY);
  doc.text(`₦${total.toLocaleString('en-NG', { maximumFractionDigits: 2 })}`, 185, summaryY, { align: 'right' });

  if (data.notes) {
    doc.setTextColor(...darkGray);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Notes:', 20, summaryY + 15);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const notesLines = doc.splitTextToSize(data.notes, 170);
    doc.text(notesLines, 20, summaryY + 22);
  }

  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.line(20, 280, 190, 280);

  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.setFont('helvetica', 'italic');
  doc.text('Thank you for your business!', 105, 285, { align: 'center' });
  doc.text('Benbol Pharmacy | Vickie\'s Plaza, Lekki-Epe Expressway, Sangotedo, Lagos', 105, 290, { align: 'center' });
  doc.text('Phone: 09167858304 | Email: benbolglobal@gmail.com', 105, 295, { align: 'center' });

  return doc;
}

export function downloadInvoice(data: InvoiceData, filename?: string) {
  const doc = generateInvoice(data);
  doc.save(filename || `Invoice_${data.invoiceNumber}.pdf`);
}

export function previewInvoice(data: InvoiceData) {
  const doc = generateInvoice(data);
  const blob = doc.output('blob');
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
}
