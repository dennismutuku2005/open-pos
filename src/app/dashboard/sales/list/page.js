"use client"

import React, { useState } from 'react'
import { 
    Search, History, Clock, Printer, 
    Download, Filter, ChevronDown, ShoppingBag,
    Calendar, Eye, TrendingUp, DollarSign,
    ArrowUpRight, ArrowDownRight, CreditCard
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Modal } from '@/components/Modal'
import { toast } from 'sonner'
import { Card, StatCard } from '@/components/Card'

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
        <div className="space-y-6 animate-in fade-in duration-500 font-figtree pb-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-admin-value uppercase">Transactions Log</h1>
                    <p className="text-admin-label mt-1 text-[13px] font-medium">Browse and manage all historical sales records.</p>
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
                    <button className="flex-1 sm:flex-none bg-card-bg border border-openpos-border text-admin-value px-5 py-2.5 rounded-xl font-bold text-[12px] flex items-center justify-center gap-2 hover:bg-openpos-bg-subtle transition-all uppercase tracking-widest shadow-sm">
                        <Download size={16} />
                        Export
                    </button>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard 
                    title="Gross Sales (Today)" 
                    value="KES 24,650" 
                    change="+15.2%" 
                    isPositive={true} 
                    icon={DollarSign} 
                    color="blue" 
                />
                <StatCard 
                    title="Transaction Count" 
                    value="128" 
                    change="+8 since last hour" 
                    isPositive={true} 
                    icon={History} 
                    color="blue" 
                />
                <StatCard 
                    title="Average Order" 
                    value="KES 1,240" 
                    change="-2.5%" 
                    isPositive={false} 
                    icon={TrendingUp} 
                    color="red" 
                />
                <StatCard 
                    title="Cash on Hand" 
                    value="KES 42,000" 
                    change="Register Locked" 
                    isPositive={true} 
                    icon={CreditCard} 
                    color="blue" 
                />
            </div>

            {/* Main Table Card */}
            <Card 
                noPadding 
                title="Historical Directory"
                subtitle="Live stream of all system transactions"
                headerAction={
                    <div className="flex items-center gap-3">
                        <div className="hidden md:flex bg-openpos-bg-subtle border border-openpos-border rounded-xl px-3 py-1.5 items-center gap-2">
                            <Calendar size={12} className="text-openpos-blue" />
                            <span className="text-[10px] font-bold text-admin-value uppercase">Last 30 Days</span>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-dim" size={14} />
                            <input 
                                placeholder="Search records..." 
                                className="bg-openpos-bg-subtle border border-openpos-border rounded-xl pl-9 pr-4 py-1.5 text-[11px] font-bold outline-none focus:ring-2 focus:ring-openpos-blue/10 w-64 transition-all" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                }
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-openpos-bg-subtle/30">
                                <th className="p-5 text-[10px] uppercase font-bold text-admin-dim tracking-widest border-b border-openpos-border">Transaction ID</th>
                                <th className="p-5 text-[10px] uppercase font-bold text-admin-dim tracking-widest border-b border-openpos-border">Date & Time</th>
                                <th className="p-5 text-[10px] uppercase font-bold text-admin-dim tracking-widest border-b border-openpos-border">Customer</th>
                                <th className="p-5 text-[10px] uppercase font-bold text-admin-dim tracking-widest border-b border-openpos-border text-center">Method</th>
                                <th className="p-5 text-[10px] uppercase font-bold text-admin-dim tracking-widest border-b border-openpos-border text-right">Amount</th>
                                <th className="p-5 text-[10px] uppercase font-bold text-admin-dim tracking-widest border-b border-openpos-border"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-openpos-border">
                            {transactions
                                .filter(t => t.id.toLowerCase().includes(searchQuery.toLowerCase()) || t.customer.toLowerCase().includes(searchQuery.toLowerCase()))
                                .map((sale) => (
                                <tr key={sale.id} className="group hover:bg-openpos-bg-subtle/40 transition-colors cursor-default">
                                    <td className="p-5 text-[12px] font-bold text-admin-value">{sale.id}</td>
                                    <td className="p-5">
                                        <div className="flex flex-col">
                                            <span className="text-[12px] font-bold text-admin-value">{sale.date.split(',')[0]}</span>
                                            <span className="text-[9px] text-admin-dim font-bold uppercase tracking-tight mt-0.5">{sale.date.split(',')[1]}</span>
                                        </div>
                                    </td>
                                    <td className="p-5 text-[12px] font-bold text-admin-value">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-openpos-blue/10 flex items-center justify-center text-[9px] font-bold text-openpos-blue">
                                                {sale.customer.charAt(0)}
                                            </div>
                                            {sale.customer}
                                        </div>
                                    </td>
                                    <td className="p-5 text-center">
                                        <div className={cn(
                                            "inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest",
                                            sale.payment === 'Cash' ? "bg-openpos-blue/10 text-openpos-blue" : "bg-openpos-blue/10 text-openpos-blue"
                                        )}>
                                            {sale.payment}
                                        </div>
                                    </td>
                                    <td className="p-5 text-right font-bold text-admin-value text-[13px]">KES {sale.total.toLocaleString()}</td>
                                    <td className="p-5 text-right">
                                        <div className="flex items-center justify-end gap-1.5">
                                            <button 
                                                onClick={() => {
                                                    setEditingSale(sale);
                                                    setShowCrudModal(true);
                                                }}
                                                className="p-1.5 text-admin-dim hover:text-openpos-blue hover:bg-openpos-blue/5 rounded-lg transition-all"
                                                title="View Details"
                                            >
                                                <Eye size={14} />
                                            </button>
                                            <button className="p-1.5 text-admin-dim hover:text-openpos-blue hover:bg-openpos-blue/5 rounded-lg transition-all" title="Print Receipt">
                                                <Printer size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-5 border-t border-openpos-border flex items-center justify-between bg-openpos-bg-subtle/10">
                    <p className="text-[10px] text-admin-dim font-bold uppercase tracking-widest">Showing 7 of 1,240 records</p>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 border border-openpos-border rounded-xl text-[10px] font-bold text-admin-dim hover:bg-card-bg transition-all uppercase tracking-widest">Previous</button>
                        <button className="px-4 py-2 bg-openpos-blue text-white rounded-xl text-[10px] font-bold shadow-lg shadow-openpos-blue/20 hover:scale-[1.05] transition-all uppercase tracking-widest">Next Page</button>
                    </div>
                </div>
            </Card>

            {/* CRUD Modal */}
            <Modal
                isOpen={showCrudModal}
                onClose={() => setShowCrudModal(false)}
                title={editingSale ? `Audit Trail: ${editingSale.id}` : "Provision New Transaction"}
                confirmText={editingSale ? "Update Entry" : "Commit Transaction"}
                onConfirm={() => {
                    toast.success(editingSale ? "Audit Record Updated" : "Transaction Committed Successfully");
                    setShowCrudModal(false);
                }}
            >
                <div className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-admin-value uppercase tracking-widest ml-1">Responsible Entity / Customer</label>
                        <input 
                            type="text"
                            placeholder="Walking Customer"
                            className="w-full bg-openpos-bg-subtle border border-openpos-border rounded-xl px-4 py-3 text-[12px] font-bold outline-none focus:ring-2 focus:ring-openpos-blue/10 focus:border-openpos-blue/30 transition-all"
                            defaultValue={editingSale?.customer || ''}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-admin-value uppercase tracking-widest ml-1">Total Transaction Value (KES)</label>
                            <input 
                                type="number"
                                placeholder="0.00"
                                className="w-full bg-openpos-bg-subtle border border-openpos-border rounded-xl px-4 py-3 text-[12px] font-bold outline-none focus:ring-2 focus:ring-openpos-blue/10 focus:border-openpos-blue/30 transition-all"
                                defaultValue={editingSale?.total || ''}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-admin-value uppercase tracking-widest ml-1">Settlement Method</label>
                            <select 
                                className="w-full bg-openpos-bg-subtle border border-openpos-border rounded-xl px-4 py-3 text-[12px] font-bold outline-none focus:ring-2 focus:ring-openpos-blue/10 focus:border-openpos-blue/30 transition-all cursor-pointer"
                                defaultValue={editingSale?.payment || 'Cash'}
                            >
                                <option>Cash</option>
                                <option>M-Pesa</option>
                                <option>Bank Card</option>
                            </select>
                        </div>
                    </div>
                    <div className="p-4 bg-openpos-blue/5 border border-openpos-blue/10 rounded-2xl">
                        <p className="text-[9px] font-bold text-openpos-blue uppercase tracking-widest mb-1 flex items-center gap-2">
                            <ShoppingBag size={10} />
                            Administrative Notice
                        </p>
                        <p className="text-[10px] text-admin-dim font-bold uppercase tracking-tight leading-relaxed">
                            MANUAL ENTRIES ARE LOGGED AS EXTERNAL RECONCILIATIONS AND WILL BE AUDITED BY THE SUPERVISOR.
                        </p>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
