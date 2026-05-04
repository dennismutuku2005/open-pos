import React, { useRef, useEffect } from'react';
import * as htmlToImage from'html-to-image';
import { jsPDF } from'jspdf';
import { CheckCircle2 } from'lucide-react';

export default function InvoicePDFGenerator({ invoice, account, mode ='invoice', onComplete }) {
 const invoiceRef = useRef(null);

 useEffect(() => {
 if (!invoice) return;

 const generatePdf = async () => {
 try {
 // Short delay to ensure it renders offscreen properly
 await new Promise(r => setTimeout(r, 500));
 const element = invoiceRef.current;
 if (!element) return;

 const dataUrl = await htmlToImage.toPng(element, {
 quality: 1.0,
 pixelRatio: 2,
 backgroundColor:'#ffffff',
 });

 const pdf = new jsPDF({
 orientation:'portrait',
 unit:'px',
 format: [element.offsetWidth * 1.5, element.offsetHeight * 1.5]
 });

 pdf.addImage(dataUrl,'PNG', 0, 0, element.offsetWidth * 1.5, element.offsetHeight * 1.5);
 pdf.save(`${mode ==='receipt'?'Receipt':'Invoice'}-${invoice.invoice_number}.pdf`);
 } catch (error) {
 console.error('Error generating PDF:', error);
 } finally {
 onComplete();
 }
 };

 generatePdf();
 }, [invoice, account, onComplete, mode]);

 if (!invoice) return null;

 const docType = mode ==='receipt'?'Receipt':'Invoice';
 const amount = parseFloat(invoice.amount) || 0;
 const date = new Date(invoice.created_at || new Date()).toISOString().split('T')[0];
 const dueDate = new Date(invoice.due_date || new Date()).toISOString().split('T')[0];
 const paidAt = invoice.paid_at ? new Date(invoice.paid_at).toLocaleDateString() : null;
 
 // Breakdown calculations
 const baseFee = 1499;
 const extraAmount = Math.max(0, amount - baseFee);
 const extraUsers = extraAmount / 5;
 
 return (
 <div style={{ position:'fixed', top:'-9999px', left:'-9999px', opacity: 0, pointerEvents:'none', zIndex: -1 }}>
 <div 
 ref={invoiceRef} 
 id="invoice-paper"
 className="p-8 space-y-4 min-h-[792px] flex flex-col bg-white"
 style={{ width:'560px', color:'#111827', fontFamily:'sans-serif'}}
 >
 {/* Header Section */}
 <div className="flex justify-between items-start pt-6 border-b border-[#F3F4F6] pb-10">
 <div className="space-y-4">
 <h3 className="text-[11px] font-black text-[#9CA3AF] uppercase tracking-widest mb-2">Issued By</h3>
 <div className="space-y-2">
 <div className="w-24 h-10">
 <img src="/logoc.png"alt="Open POS"className="w-full h-full object-contain object-left"/>
 </div>
 <div className="space-y-0.5 text-[11px]">
 <p className="text-purple-700 font-black uppercase tracking-tight">Open POS Services</p>
 <p className="text-[#374151] font-bold">Contact: 0741390949</p>
 </div>
 </div>
 </div>
 <div className="text-right space-y-1">
 <h1 className="text-2xl font-black text-[#111827] tracking-tight mb-1 uppercase">{docType}</h1>
 <p className="text-[10px] text-[#6B7280] font-bold">#{invoice.invoice_number}</p>
 <p className="text-[10px] text-[#6B7280] font-bold">{new Date(date).toLocaleDateString('en-GB', { day:'2-digit', month:'long', year:'numeric'})}</p>
 </div>
 </div>

 {/* Bill To Section */}
 <div className="grid grid-cols-2 gap-12 mt-12">
 <div className="space-y-4"></div>
 <div className="space-y-4">
 <h3 className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest text-right mb-2">{mode ==='receipt'?'Received From':'Bill To'}</h3>
 <div className="space-y-0.5 text-sm text-right">
 <p className="font-extrabold text-[#111827] text-lg leading-tight">{account?.name ||'Customer'}</p>
 <p className="text-[#374151] font-black">{account?.phone ||''}</p>
 </div>
 </div>
 </div>

 <div className="flex-1 pt-10">
 <div className="w-full border-t-[1.5px] border-[#111827] mb-6"></div>
 
 <div className="space-y-8">
 {/* Default Headers */}
 <div className="flex justify-between items-end border-b pb-2">
 <h4 className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest mb-1">Description</h4>
 <h4 className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest mb-1">Price</h4>
 </div>
 
 {/* Base Package */}
 <div className="flex justify-between items-end mt-1">
 <div className="space-y-1 max-w-[70%]">
 <p className="text-sm font-bold text-[#111827]">Billing Service Monthly Subscription</p>
 </div>
 <div className="text-right">
 <p className="text-lg font-black text-[#111827] tracking-tight">KES {baseFee.toLocaleString()}</p>
 </div>
 </div>

 {/* Extra Users Items if any */}
 {extraUsers > 0 && (
 <div className="flex justify-between items-end mt-2">
 <div className="space-y-1 max-w-[70%]">
 <p className="text-sm font-bold text-[#111827]">Extra Users ({extraUsers} users @ KES 5/ea)</p>
 </div>
 <div className="text-right">
 <p className="text-lg font-black text-[#111827] tracking-tight">KES {extraAmount.toLocaleString()}</p>
 </div>
 </div>
 )}

 {/* Total Row */}
 <div className="w-full border-t border-[#E5E7EB] mt-4 pt-4 flex justify-between items-end">
 <div className="space-y-1 max-w-[70%]">
 <p className="text-lg font-black text-purple-700 tracking-tight uppercase">{mode ==='receipt'?'Amount Received':'Total Amount'}</p>
 </div>
 <div className="text-right">
 <p className="text-2xl font-black text-purple-700 tracking-tight">KES {amount.toLocaleString()}</p>
 </div>
 </div>

 <div className="py-4 overflow-hidden select-none opacity-20 text-[#6B7280] text-xs tracking-[0.5em] whitespace-nowrap">
 ----------------------------------------------------------------------------------------------------------------------------------------------------------------
 </div>

 <div className="grid grid-cols-3 gap-6">
 <div className="py-2">
 <p className="text-[9px] font-black text-[#9CA3AF] uppercase tracking-widest mb-1">Payment Method</p>
 <div className="space-y-0.5">
 <p className="text-xs font-bold text-[#111827]">MPESA Till: 3018584</p>
 {mode ==='receipt'&& invoice.mpesa_receipt_number && (
 <p className="text-[9px] font-bold text-admin-dim">Ref: {invoice.mpesa_receipt_number}</p>
 )}
 </div>
 </div>
 <div className="py-2">
 <p className="text-[9px] font-black text-[#9CA3AF] uppercase tracking-widest mb-1">Status</p>
 {invoice.status ==='paid'? (
 <p className="text-[11px] font-bold text-openpos-blue flex items-center gap-1.5 uppercase transition-all">
 <CheckCircle2 className="w-3.5 h-3.5"/> Verified & Paid
 </p>
 ) : (
 <p className="text-[11px] font-bold text-yellow-600 flex items-center gap-1.5 uppercase transition-all">
 Pending / Unpaid
 </p>
 )}
 </div>
 <div className="py-2">
 <p className="text-[9px] font-black text-[#9CA3AF] uppercase tracking-widest mb-1">{mode ==='receipt'?'Payment Date':'Due Date'}</p>
 <p className="text-[11px] font-bold text-[#111827]">{mode ==='receipt'? (paidAt ||'N/A') : new Date(dueDate).toLocaleDateString()}</p>
 </div>
 </div>
 </div>
 </div>

 {/* Footer Section */}
 <div className="pt-6 border-t border-[#F3F4F6] mt-auto">
 <div className="pt-4 border-t border-[#F3F4F6]">
 <p className="text-[9px] font-bold text-[#6B7280] mb-0.5 uppercase tracking-wider">Terms and Policy:</p>
 <p className="text-[9px] text-[#9CA3AF] leading-snug">
 This is an electronically generated {mode}. Payment is non-refundable once service is activated.
 </p>
 </div>
 <div className="flex justify-between items-center opacity-60 mt-4">
 <p className="text-[8px] font-medium text-[#9CA3AF]">PacePapers Systems • VERIFY: <span className="font-mono font-bold">WISP-{invoice.invoice_number}</span></p>
 </div>
 </div>
 </div>
 </div>
 );
}
