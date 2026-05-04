"use client"

import React, { useState } from 'react'
import { 
    Search, History, Clock, Printer, 
    Download, Filter, ChevronDown, ShoppingBag,
    Calendar, Eye
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Modal } from '@/components/Modal'
import { toast } from 'sonner'

// Mock Data
const transactions = [
    { id: 'SAL-001', date: 'Today, 10:30 AM', customer: 'Walking Customer', total: 2450, items: 3, payment: 'Cash', status: 'Completed' },
    { id: 'SAL-002', date: 'Today, 11:15 AM', customer: 'John Doe', total: 1500, items: 1, payment: 'M-Pesa', status: 'Completed' },
    { id: 'SAL-003', date: 'Today, 12:45 PM', customer: 'Walking Customer', total: 4275, items: 5, payment: 'Cash', status: 'Completed' },
    { id: 'SAL-004', date: 'Today, 02:20 PM', customer: 'Jane Smith', total: 850, items: 2, payment: 'Card', status: 'Completed' },
    { id: 'SAL-005', date: 'Today, 03:50 PM', customer: 'Walking Customer', total: 3120, items: 4, payment: 'M-Pesa', status: 'Completed' },
    { id: 'SAL-006', date: 'Yesterday, 04:10 PM', customer: 'Michael Chen', total: 12400, items: 8, payment: 'Cash', status: 'Completed' },
    { id: 'SAL-007', date: 'Yesterday, 02:15 PM', customer: 'Sarah Wilson', total: 3200, items: 2, payment: 'M-Pesa', status: 'Completed' },
]

export default function SalesListPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [showCrudModal, setShowCrudModal] = useState(false)
    const [editingSale, setEditingSale] = useState(null)
    const [formData, setFormData] = useState({
        customer: '',
        total: '',
        payment: 'Cash',
        items: '1'
    })

    return (
        <div className="space-y-6 animate-in fade-in duration-500 font-figtree">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-admin-value uppercase">Transactions List</h1>
                    <p className="text-admin-label mt-1 font-medium">Browse and manage all historical sales records.</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button 
                        onClick={() => {
                            setEditingSale(null);
                            setShowCrudModal(true);
                        }}
                        className="flex-1 sm:flex-none bg-openpos-blue text-white px-5 py-2.5 rounded-xl font-bold text-[12px] flex items-center justify-center gap-2 shadow-lg shadow-openpos-blue/20 hover:scale-[1.02] transition-all uppercase tracking-widest"
                    >
                        <ShoppingBag size={16} />
                        New Sale Record
                    </button>
                    <button className="flex-1 sm:flex-none bg-white border border-openpos-border text-admin-value px-5 py-2.5 rounded-xl font-bold text-[12px] flex items-center justify-center gap-2 hover:bg-gray-50 transition-all uppercase tracking-widest shadow-sm">
                        <Download size={16} />
                        Export
                    </button>
                </div>
            </div>

            {/* Main Table Card */}
            <div className="bg-card-bg border border-openpos-border rounded-3xl overflow-hidden shadow-sm">
                <div className="p-6 border-b border-openpos-border flex items-center justify-between bg-openpos-bg-subtle/20">
                    <div className="flex items-center gap-4">
                        <div className="bg-white border border-openpos-border rounded-xl px-4 py-2 flex items-center gap-2 shadow-sm">
                            <Calendar size={14} className="text-openpos-blue" />
                            <span className="text-[11px] font-bold text-admin-value uppercase tracking-widest">Last 30 Days</span>
                            <ChevronDown size={14} className="text-admin-dim" />
                        </div>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-admin-dim" size={16} />
                        <input 
                            placeholder="Search by ID or Customer..." 
                            className="bg-white border border-openpos-border rounded-xl pl-11 pr-4 py-2.5 text-[12px] font-medium outline-none focus:ring-2 focus:ring-openpos-blue/10 w-72 transition-all shadow-sm" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-openpos-bg-subtle/30">
                                <th className="p-5 text-[10px] uppercase font-bold text-admin-dim tracking-widest border-b border-openpos-border">Transaction ID</th>
                                <th className="p-5 text-[10px] uppercase font-bold text-admin-dim tracking-widest border-b border-openpos-border">Date & Time</th>
                                <th className="p-5 text-[10px] uppercase font-bold text-admin-dim tracking-widest border-b border-openpos-border">Customer</th>
                                <th className="p-5 text-[10px] uppercase font-bold text-admin-dim tracking-widest border-b border-openpos-border">Items</th>
                                <th className="p-5 text-[10px] uppercase font-bold text-admin-dim tracking-widest border-b border-openpos-border">Method</th>
                                <th className="p-5 text-[10px] uppercase font-bold text-admin-dim tracking-widest border-b border-openpos-border text-right">Amount</th>
                                <th className="p-5 text-[10px] uppercase font-bold text-admin-dim tracking-widest border-b border-openpos-border"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-openpos-border">
                            {transactions
                                .filter(t => t.id.toLowerCase().includes(searchQuery.toLowerCase()) || t.customer.toLowerCase().includes(searchQuery.toLowerCase()))
                                .map((sale) => (
                                <tr key={sale.id} className="group hover:bg-openpos-bg-subtle/40 transition-colors">
                                    <td className="p-5 text-[13px] font-bold text-admin-value">{sale.id}</td>
                                    <td className="p-5">
                                        <div className="flex flex-col">
                                            <span className="text-[13px] font-bold text-admin-value">{sale.date.split(',')[0]}</span>
                                            <span className="text-[10px] text-admin-dim font-medium uppercase">{sale.date.split(',')[1]}</span>
                                        </div>
                                    </td>
                                    <td className="p-5 text-[13px] font-bold text-admin-value">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-openpos-bg-subtle flex items-center justify-center text-[10px] font-bold text-openpos-blue">
                                                {sale.customer.charAt(0)}
                                            </div>
                                            {sale.customer}
                                        </div>
                                    </td>
                                    <td className="p-5 text-[13px] font-bold text-admin-value">
                                        <span className="px-2 py-0.5 bg-openpos-bg-subtle rounded-md text-[11px]">{sale.items} Items</span>
                                    </td>
                                    <td className="p-5">
                                        <div className={cn(
                                            "inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider",
                                            sale.payment === 'Cash' ? "bg-blue-50 text-openpos-blue" : "bg-indigo-50 text-indigo-600"
                                        )}>
                                            {sale.payment}
                                        </div>
                                    </td>
                                    <td className="p-5 text-right font-bold text-admin-value">KES {sale.total.toLocaleString()}</td>
                                    <td className="p-5 text-right">
                                        <div className="flex items-center justify-end gap-2 transition-opacity">
                                            <button 
                                                onClick={() => {
                                                    setEditingSale(sale);
                                                    setShowCrudModal(true);
                                                }}
                                                className="p-2 text-openpos-blue hover:bg-openpos-blue/10 rounded-lg transition-all"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button className="p-2 text-openpos-blue hover:bg-openpos-blue/10 rounded-lg transition-all">
                                                <Printer size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-6 border-t border-openpos-border flex items-center justify-between bg-openpos-bg-subtle/10">
                    <p className="text-[12px] text-admin-dim font-bold uppercase tracking-widest">Showing 7 of 1,240 transactions</p>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 border border-openpos-border rounded-xl text-[12px] font-bold text-admin-dim hover:bg-white transition-all">Previous</button>
                        <button className="px-4 py-2 bg-openpos-blue text-white rounded-xl text-[12px] font-bold shadow-lg shadow-openpos-blue/20 hover:scale-[1.05] transition-all">Next</button>
                    </div>
                </div>
            </div>

            {/* CRUD Modal */}
            <Modal
                isOpen={showCrudModal}
                onClose={() => setShowCrudModal(false)}
                title={editingSale ? `Edit Record: ${editingSale.id}` : "Create New Sale Record"}
                confirmText={editingSale ? "Update Record" : "Save Record"}
                onConfirm={() => {
                    toast.success(editingSale ? "Record Updated" : "Record Saved Successfully");
                    setShowCrudModal(false);
                }}
            >
                <div className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-admin-value uppercase tracking-widest ml-1">Customer Name</label>
                        <input 
                            type="text"
                            placeholder="Walking Customer"
                            className="w-full bg-openpos-bg-subtle border border-openpos-border rounded-xl px-4 py-3 text-[13px] font-bold outline-none focus:ring-2 focus:ring-openpos-blue/10 focus:border-openpos-blue/30 transition-all"
                            defaultValue={editingSale?.customer || ''}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-admin-value uppercase tracking-widest ml-1">Total Amount (KES)</label>
                            <input 
                                type="number"
                                placeholder="0.00"
                                className="w-full bg-openpos-bg-subtle border border-openpos-border rounded-xl px-4 py-3 text-[13px] font-bold outline-none focus:ring-2 focus:ring-openpos-blue/10 focus:border-openpos-blue/30 transition-all"
                                defaultValue={editingSale?.total || ''}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-admin-value uppercase tracking-widest ml-1">Payment Method</label>
                            <select 
                                className="w-full bg-openpos-bg-subtle border border-openpos-border rounded-xl px-4 py-3 text-[13px] font-bold outline-none focus:ring-2 focus:ring-openpos-blue/10 focus:border-openpos-blue/30 transition-all cursor-pointer"
                                defaultValue={editingSale?.payment || 'Cash'}
                            >
                                <option>Cash</option>
                                <option>M-Pesa</option>
                                <option>Card</option>
                            </select>
                        </div>
                    </div>
                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl">
                        <p className="text-[10px] font-bold text-openpos-blue uppercase tracking-widest mb-1">Notice</p>
                        <p className="text-[11px] text-admin-dim font-medium leading-relaxed">
                            Manually added records will be logged as external transactions and reflected in your daily totals.
                        </p>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
