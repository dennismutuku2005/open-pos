"use client"

import React, { useState, useRef } from 'react'
import { BookOpen, Plus, Calendar, ArrowRightLeft, DollarSign, ArrowUpRight, ArrowDownRight, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Modal } from '@/components/Modal'
import { toast } from 'sonner'

const mockDaybook = [
    { id: 'DB-001', time: '09:00 AM', category: 'Opening Balance', amount: 50000, type: 'Credit', note: 'Till Opening' },
    { id: 'DB-002', time: '11:30 AM', category: 'Sales', amount: 15500, type: 'Credit', note: 'Morning Sales' },
    { id: 'DB-003', time: '02:15 PM', category: 'Personal Withdrawal', amount: 2000, type: 'Debit', note: 'Lunch expenses' },
    { id: 'DB-004', time: '04:00 PM', category: 'Supplier Payment', amount: 8000, type: 'Debit', note: 'Paid fresh produce supplier' },
]

export default function DaybooksPage() {
    const [entries, setEntries] = useState(mockDaybook)
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
    const [showModal, setShowModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [deletingEntry, setDeletingEntry] = useState(null)
    const [formData, setFormData] = useState({ category: 'Sales', amount: '', type: 'Credit', note: '' })
    const dateInputRef = useRef(null)

    const handleSave = () => {
        if (!formData.amount) return toast.error('Amount is required')
        const newEntry = {
            id: `DB-${Date.now().toString().slice(-3)}`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            ...formData,
            amount: Number(formData.amount)
        }
        setEntries(prev => [newEntry, ...prev])
        setShowModal(false)
        setFormData({ category: 'Sales', amount: '', type: 'Credit', note: '' })
        toast.success('Entry recorded successfully')
    }

    const handleDelete = (entry) => {
        setDeletingEntry(entry)
        setShowDeleteModal(true)
    }

    const confirmDelete = () => {
        if (!deletingEntry) return
        setEntries(prev => prev.filter(e => e.id !== deletingEntry.id))
        toast.success('Entry removed')
        setShowDeleteModal(false)
        setDeletingEntry(null)
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 font-figtree">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-admin-value uppercase">Daybooks</h1>
                    <p className="text-admin-label mt-1 font-medium text-[13px]">Daily register for cash flows and personal withdrawals.</p>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-none">
                        <input 
                            type="date"
                            ref={dateInputRef}
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        />
                        <button className="w-full h-full bg-white border border-openpos-border text-admin-value px-5 py-2.5 rounded-xl font-bold text-[12px] flex items-center justify-center gap-2 hover:bg-gray-50 transition-all uppercase tracking-widest shadow-sm">
                            <Calendar size={16} />
                            {new Date(selectedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </button>
                    </div>
                    <button 
                        onClick={() => setShowModal(true)}
                        className="flex-1 sm:flex-none bg-openpos-blue text-white px-5 py-2.5 rounded-xl font-bold text-[12px] flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] transition-all uppercase tracking-widest"
                    >
                        <Plus size={18} />
                        New Entry
                    </button>
                </div>
            </div>

            {/* Daily Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white border border-openpos-border rounded-xl p-4 shadow-sm hover:border-openpos-blue/20 transition-all">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-admin-dim bg-openpos-bg-subtle shrink-0">
                            <BookOpen size={18} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-admin-dim uppercase tracking-wider">Opening</p>
                            <p className="text-lg font-bold text-admin-value">KES 50,000</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white border border-openpos-border rounded-xl p-4 shadow-sm hover:border-openpos-blue/20 transition-all">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-openpos-blue bg-openpos-blue/5 shrink-0">
                            <ArrowUpRight size={18} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-admin-dim uppercase tracking-wider">Total In</p>
                            <p className="text-lg font-bold text-admin-value">KES {entries.filter(e => e.type === 'Credit').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white border border-openpos-border rounded-xl p-4 shadow-sm hover:border-openpos-blue/20 transition-all">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-openpos-red bg-openpos-red/5 shrink-0">
                            <ArrowDownRight size={18} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-admin-dim uppercase tracking-wider">Total Out</p>
                            <p className="text-lg font-bold text-admin-value">KES {entries.filter(e => e.type === 'Debit').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white border border-openpos-border rounded-xl p-4 shadow-sm hover:border-openpos-blue/20 transition-all">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-openpos-blue bg-openpos-blue/5 shrink-0">
                            <DollarSign size={18} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-admin-dim uppercase tracking-wider">Closing</p>
                            <p className="text-lg font-bold text-admin-value">KES {(50000 + entries.filter(e => e.type === 'Credit').reduce((acc, curr) => acc + curr.amount, 0) - entries.filter(e => e.type === 'Debit').reduce((acc, curr) => acc + curr.amount, 0)).toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Entries Table */}
            <div className="bg-card-bg border border-openpos-border rounded-3xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-openpos-border flex items-center justify-between bg-openpos-bg-subtle/30">
                    <h3 className="text-[11px] font-bold text-admin-value uppercase tracking-[2px]">Daily Register Entries</h3>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-admin-dim uppercase tracking-widest">Live Updates</span>
                        <div className="w-2 h-2 rounded-full bg-openpos-blue animate-pulse" />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-openpos-bg-subtle/50 border-b border-openpos-border">
                                <th className="px-6 py-3 text-[10px] font-bold text-admin-dim uppercase tracking-widest">Entry Detail</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-admin-dim uppercase tracking-widest">Category</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-admin-dim uppercase tracking-widest text-center">Type</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-admin-dim uppercase tracking-widest text-right">Amount</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-admin-dim uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-openpos-border">
                            {entries.map((entry) => (
                                <tr key={entry.id} className="group hover:bg-openpos-bg-subtle transition-colors">
                                    <td className="px-6 py-2.5">
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "w-1.5 h-10 rounded-full",
                                                entry.type === 'Credit' ? "bg-openpos-blue" : "bg-openpos-red"
                                            )} />
                                            <div>
                                                <p className="text-[13px] font-bold text-admin-value leading-none">{entry.id}</p>
                                                <p className="text-[10px] text-admin-dim mt-1 font-medium">{entry.time} • {entry.note}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-2.5">
                                        <span className="text-[11px] font-bold text-admin-label uppercase tracking-widest bg-openpos-bg-subtle px-2 py-0.5 rounded">{entry.category}</span>
                                    </td>
                                    <td className="px-6 py-2.5">
                                        <div className="flex justify-center">
                                            <span className={cn(
                                                "px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest",
                                                entry.type === 'Credit' ? "bg-openpos-blue/10 text-openpos-blue" : "bg-openpos-red/10 text-openpos-red"
                                            )}>
                                                {entry.type}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-2.5 text-right font-bold text-[14px] text-admin-value">
                                        KES {entry.amount.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-2.5 text-right">
                                        <button 
                                            onClick={() => handleDelete(entry)}
                                            className="p-2 text-admin-dim hover:text-openpos-red hover:bg-openpos-red/5 rounded-xl transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Entry Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="New Daybook Entry"
                description="Record a cash transaction in the daily register"
                confirmText="Create Entry"
                onConfirm={handleSave}
                icon={Plus}
                maxWidth="max-w-md"
            >
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-admin-label uppercase tracking-widest ml-1">Transaction Type</label>
                        <div className="flex bg-openpos-bg-subtle rounded-2xl p-1 ring-1 ring-openpos-border">
                            <button 
                                onClick={() => setFormData(prev => ({ ...prev, type: 'Credit' }))}
                                className={cn(
                                    "flex-1 py-2.5 rounded-xl text-[10px] font-bold uppercase transition-all", 
                                    formData.type === 'Credit' ? "bg-openpos-blue text-white shadow-lg" : "text-admin-dim hover:bg-white"
                                )}
                            >Cash In (Credit)</button>
                            <button 
                                onClick={() => setFormData(prev => ({ ...prev, type: 'Debit' }))}
                                className={cn(
                                    "flex-1 py-2.5 rounded-xl text-[10px] font-bold uppercase transition-all", 
                                    formData.type === 'Debit' ? "bg-openpos-red text-white shadow-lg" : "text-admin-dim hover:bg-white"
                                )}
                            >Cash Out (Debit)</button>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-admin-label uppercase tracking-widest ml-1">Category</label>
                        <select 
                            className="w-full bg-openpos-bg-subtle border-none rounded-2xl px-4 py-3 text-[13px] font-bold outline-none ring-1 ring-openpos-border focus:ring-openpos-blue/30"
                            value={formData.category}
                            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        >
                            <option>Sales</option>
                            <option>Personal Withdrawal</option>
                            <option>Supplier Payment</option>
                            <option>Opening Balance</option>
                            <option>Other</option>
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-admin-label uppercase tracking-widest ml-1">Amount (KES) *</label>
                        <input 
                            type="number"
                            placeholder="0.00"
                            className="w-full bg-openpos-bg-subtle border-none rounded-2xl px-4 py-3 text-[13px] font-bold outline-none ring-1 ring-openpos-border focus:ring-openpos-blue/30"
                            value={formData.amount}
                            onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-admin-label uppercase tracking-widest ml-1">Notes / Narration</label>
                        <textarea 
                            rows="2"
                            placeholder="Transaction details..."
                            className="w-full bg-openpos-bg-subtle border-none rounded-2xl px-4 py-3 text-[13px] font-bold outline-none ring-1 ring-openpos-border focus:ring-openpos-blue/30 resize-none"
                            value={formData.note}
                            onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
                        />
                    </div>
                </div>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="Delete Entry"
                description={`Remove transaction ${deletingEntry?.id}?`}
                type="danger"
                icon={Trash2}
                confirmText="Delete"
                confirmCountdown={5}
                onConfirm={confirmDelete}
            >
                <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
                    <p className="text-[12px] text-red-600 font-medium leading-relaxed">
                        This action will remove the entry from today's register. This may affect your closing balance calculations.
                    </p>
                </div>
            </Modal>
        </div>
    )
}
