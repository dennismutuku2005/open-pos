import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';

/**
 * Generates a POS thermal receipt PDF
 * @param {Object} saleData 
 * @param {String} action 'download' | 'print'
 */
export const generateReceipt = (saleData, action = 'download') => {
    // 80mm thermal paper width, height adjusts to content
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [80, 200] // Base height
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    let currentY = 10;

    // Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('OPEN POS', pageWidth / 2, currentY, { align: 'center' });
    
    currentY += 5;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('123 Retail Avenue, Nairobi', pageWidth / 2, currentY, { align: 'center' });
    currentY += 4;
    doc.text('Tel: +254 700 000 000', pageWidth / 2, currentY, { align: 'center' });
    
    currentY += 6;
    doc.setLineWidth(0.5);
    doc.setLineDashPattern([1, 1], 0);
    doc.line(5, currentY, pageWidth - 5, currentY);

    // Meta Data
    currentY += 5;
    doc.setFontSize(9);
    doc.text(`Receipt #: ${saleData.id || 'SL-' + Math.floor(1000 + Math.random() * 9000)}`, 5, currentY);
    currentY += 4;
    doc.text(`Date: ${format(new Date(), 'dd MMM yyyy, hh:mm a')}`, 5, currentY);
    currentY += 4;
    doc.text(`Cashier: Admin`, 5, currentY);
    if (saleData.paymentMethod) {
        currentY += 4;
        doc.text(`Pay Method: ${saleData.paymentMethod.toUpperCase()}`, 5, currentY);
    }

    currentY += 4;
    doc.line(5, currentY, pageWidth - 5, currentY);

    // Items
    currentY += 5;
    doc.setFont('helvetica', 'bold');
    doc.text('Item', 5, currentY);
    doc.text('Qty', 45, currentY, { align: 'center' });
    doc.text('Amount', pageWidth - 5, currentY, { align: 'right' });
    
    currentY += 2;
    doc.line(5, currentY, pageWidth - 5, currentY);

    currentY += 5;
    doc.setFont('helvetica', 'normal');
    
    let totalItems = 0;
    
    if (saleData.items && saleData.items.length > 0) {
        saleData.items.forEach(item => {
            const itemTotal = item.price * item.quantity;
            totalItems += item.quantity;
            
            // Item Name (wrapped)
            const splitName = doc.splitTextToSize(item.name, 35);
            doc.text(splitName, 5, currentY);
            
            // Qty & Amount on first line
            doc.text(item.quantity.toString(), 45, currentY, { align: 'center' });
            doc.text(itemTotal.toFixed(0), pageWidth - 5, currentY, { align: 'right' });
            
            currentY += (splitName.length * 4) + 2;
        });
    }

    currentY += 2;
    doc.line(5, currentY, pageWidth - 5, currentY);

    // Totals
    currentY += 6;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL:', 5, currentY);
    doc.text(`KES ${saleData.total?.toFixed(0) || '0'}`, pageWidth - 5, currentY, { align: 'right' });

    currentY += 6;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total Items: ${totalItems}`, 5, currentY);

    currentY += 6;
    doc.line(5, currentY, pageWidth - 5, currentY);

    // Footer
    currentY += 6;
    doc.setFont('helvetica', 'normal');
    doc.text('Thank you for your business!', pageWidth / 2, currentY, { align: 'center' });
    currentY += 4;
    doc.text('Powered by Open POS', pageWidth / 2, currentY, { align: 'center' });

    if (action === 'download') {
        doc.save(`Receipt_${saleData.id || 'Order'}.pdf`);
    } else if (action === 'print') {
        doc.autoPrint();
        window.open(doc.output('bloburl'), '_blank');
    }
};

/**
 * Generates an A4 Report PDF
 */
export const generateReport = (title, columns, data) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('OPEN POS', 14, 22);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(title, 14, 30);
    doc.text(`Date Generated: ${format(new Date(), 'dd MMM yyyy, hh:mm a')}`, 14, 36);

    // Table
    autoTable(doc, {
        startY: 45,
        head: [columns],
        body: data,
        theme: 'striped',
        headStyles: {
            fillColor: [24, 114, 246], // Pace Blue
            textColor: 255,
            fontStyle: 'bold',
        },
        styles: {
            font: 'helvetica',
            fontSize: 9,
        },
    });

    doc.save(`${title.replace(/\s+/g, '_')}_${format(new Date(), 'yyyyMMdd')}.pdf`);
};

/**
 * Generates an Excel Report
 */
export const generateExcelReport = (title, columns, data) => {
    const ws = XLSX.utils.aoa_to_sheet([columns, ...data]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, `${title.replace(/\s+/g, '_')}_${format(new Date(), 'yyyyMMdd')}.xlsx`);
};
