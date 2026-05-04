"use client"

import React, { useState } from'react'
import { BookOpen, Plus, Calendar, ArrowRightLeft, DollarSign, ArrowUpRight, ArrowDownRight, Trash2, Search, Clock, Activity } from'lucide-react'
import { cn } from'@/lib/utils'
import { Modal } from'@/components/Modal'
import { toast } from'sonner'
import { Card, StatCard } from'@/components/Card'

const mockDaybook = [
 { id:'DB-001', time:'09:00 AM', category:'Opening Balance', amount: 50000, type:'Credit', note:'Till Opening'},
 { id:'DB-002', time:'11:30 AM', category:'Sales', amount: 15500, type:'Credit', note:'Morning Sales'},
 { id:'DB-003', time:'02:15 PM', category:'Personal Withdrawal', amount: 2000, type:'Debit', note:'Lunch expenses'},
 { id:'DB-004', time:'04:00 PM', category:'Supplier Payment', amount: 8000, type:'Debit', note:'Paid fresh produce supplier'},
]

export default function DaybooksPage() {
 const [entries, setEntries] = useState(mockDaybook)
 const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
 const [showModal, setShowModal] = useState(false)
 const [showDeleteModal, setShowDeleteModal] = useState(false)
 const [deletingEntry, setDeletingEntry] = useState(null)
 const [formData, setFormData] = useState({ category:'Sales', amount:'', type:'Credit', note:''})

 const handleSave = () => {
 if (!formData.amount) return toast.error('Amount is required')
 const newEntry = {
 id:`DB-${Date.now().toString().slice(-3)}`,
 time: new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit'}),
 ...formData,
 amount: Number(formData.amount)
 }
 setEntries(prev => [newEntry, ...prev])
 setShowModal(false)
 setFormData({ category:'Sales', amount:'', type:'Credit', note:''})
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

 const totalIn = entries.filter(e => e.type ==='Credit').reduce((acc, curr) => acc + curr.amount, 0)
 const totalOut = entries.filter(e => e.type ==='Debit').reduce((acc, curr) => acc + curr.amount, 0)
 const closing = 50000 + totalIn - totalOut

 return (
 <div className="space-y-6 animate-in fade-in duration-500 font-figtree pb-10">
 {/* Header */}
 <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
 <div>
 <h1 className="text-xl font-bold tracking-tight text-admin-value uppercase">Daybook Ledger</h1>
 <p className="text-[13px] font-medium text-admin-label mt-1">Daily register for real-time cash flow monitoring and petty cash tracking.</p>
 </div>
 <div className="flex gap-3 w-full sm:w-auto">
 <div className="relative group">
 <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-openpos-blue transition-colors"size={16} />
 <input 
 type="date"
 value={selectedDate}
 onChange={(e) => setSelectedDate(e.target.value)}
 className="bg-card-bg border border-openpos-border text-admin-value pl-11 pr-5 py-2.5 rounded-xl font-bold text-[11px] transition-all uppercase tracking-widest shadow-sm outline-none"
 />
 </div>
 <button 
 onClick={() => setShowModal(true)}
 className="flex-1 sm:flex-none bg-openpos-blue text-white px-5 py-2.5 rounded-xl font-bold text-[11px] flex items-center justify-center gap-2 shadow-lg shadow-openpos-blue/20 transition-all uppercase tracking-widest"
 >
 <Plus size={18} />
 New Entry
 </button>
 </div>
 </div>

 {/* Daily Summary */}
 <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
 <StatCard title="Opening balance"value="KES 50,000"change="Till status: Verified"isPositive={true} icon={BookOpen} color="blue"subtitle="AUDIT BASE"/>
 <StatCard title="Aggregate Inflow"value={`KES ${totalIn.toLocaleString()}`} change="Real-time revenue"isPositive={true} icon={ArrowUpRight} color="blue"subtitle="CASH IN"/>
 <StatCard title="Aggregate Outflow"value={`KES ${totalOut.toLocaleString()}`} change="Operational costs"isPositive={false} icon={ArrowDownRight} color="blue"subtitle="CASH OUT"/>
 <StatCard title="Projected Closing"value={`KES ${closing.toLocaleString()}`} change="Est. daily settlement"isPositive={true} icon={DollarSign} color="blue"subtitle="NET LIQUIDITY"/>
 </div>

 {/* Entries Table */}
 <Card 
 noPadding
 title="Daily Transaction Register"
 subtitle="Temporal audit of cash flows and register adjustments"
 headerAction={
 <div className="flex items-center gap-3">
 <div className="relative group">
 <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-admin-dim group-focus-within:text-openpos-blue transition-colors"size={14} />
 <input 
 placeholder="Search registry..."
 className="bg-openpos-bg-subtle border border-openpos-border rounded-xl pl-10 pr-4 py-1.5 text-[11px] font-bold text-admin-value outline-none w-64 transition-all"
 />
 </div>
 <div className="flex items-center gap-2 px-3 py-1 bg-openpos-blue/5 border border-openpos-blue/10 rounded-lg text-openpos-blue">
 <Activity size={12} className="animate-pulse"/>
 <span className="text-[9px] font-bold uppercase tracking-widest">Live Sync</span>
 </div>
 </div>
 }
 >
 <div className="overflow-x-auto custom-scrollbar">
 <table className="w-full text-left whitespace-nowrap border-collapse text-[11px]">
 <thead>
 <tr className="bg-openpos-bg-subtle/50 border-b border-openpos-border text-[9px] font-bold text-admin-dim uppercase tracking-widest">
 <th className="px-6 py-4">Temporal Signature</th>
 <th className="px-6 py-4">Transaction Identity</th>
 <th className="px-6 py-4">Financial Category</th>
 <th className="px-6 py-4 text-center">Flow Type</th>
 <th className="px-6 py-4 text-right">Settlement Amount</th>
 <th className="px-6 py-4 text-right">Ledger</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-openpos-border">
 {entries.map((entry) => (
 <tr key={entry.id} className="group transition-colors cursor-default">
 <td className="px-6 py-4">
 <div className="flex items-center gap-3">
 <div className="w-8 h-8 rounded-lg bg-openpos-bg-subtle border border-openpos-border flex items-center justify-center text-admin-dim transition-transform">
 <Clock size={14} />
 </div>
 <span className="font-bold text-admin-value uppercase tracking-tighter">{entry.time}</span>
 </div>
 </td>
 <td className="px-6 py-4">
 <div className="flex flex-col">
 <span className="font-bold text-admin-value uppercase tracking-tight transition-colors">{entry.id}</span>
 <span className="text-[9px] text-admin-dim font-bold uppercase tracking-widest mt-0.5">{entry.note}</span>
 </div>
 </td>
 <td className="px-6 py-4">
 <span className="text-admin-value font-bold uppercase tracking-tight">{entry.category}</span>
 </td>
 <td className="px-6 py-4 text-center">
 <span className={cn(
"inline-flex items-center px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest border",
 entry.type ==='Credit'?"bg-openpos-blue/5 text-openpos-blue border-openpos-blue/10":"bg-openpos-red/5 text-openpos-red border-openpos-red/10"
 )}>
 {entry.type ==='Credit'?'Cash In':'Cash Out'}
 </span>
 </td>
 <td className="px-6 py-4 text-right font-bold text-[13px] text-admin-value">
 KES {entry.amount.toLocaleString()}
 </td>
 <td className="px-6 py-4 text-right">
 <button 
 onClick={() => handleDelete(entry)}
 className="p-2 bg-card-bg border border-openpos-border rounded-lg text-admin-dim transition-all"
 >
 <Trash2 size={12} />
 </button>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </Card>

 {/* Entry Modal */}
 <Modal
 isOpen={showModal}
 onClose={() => setShowModal(false)}
 title="Register Transaction"
 description="Initialize a new cash flow entry in the daily register"
 confirmText="Authorize Entry"
 onConfirm={handleSave}
 icon={Plus}
 maxWidth="max-w-md"
 >
 <div className="space-y-6">
 <div className="space-y-1.5">
 <label className="text-[10px] font-bold text-admin-label uppercase tracking-widest ml-1">Flow Direction</label>
 <div className="flex bg-openpos-bg-subtle rounded-2xl p-1 ring-1 ring-openpos-border">
 <button 
 onClick={() => setFormData(prev => ({ ...prev, type:'Credit'}))}
 className={cn(
"flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all", 
 formData.type ==='Credit'?"bg-openpos-blue text-white shadow-lg":"text-admin-dim"
 )}
 >Cash Inflow</button>
 <button 
 onClick={() => setFormData(prev => ({ ...prev, type:'Debit'}))}
 className={cn(
"flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all", 
 formData.type ==='Debit'?"bg-openpos-red text-white shadow-lg":"text-admin-dim"
 )}
 >Cash Outflow</button>
 </div>
 </div>

 <div className="grid grid-cols-1 gap-5">
 <div className="space-y-1.5">
 <label className="text-[10px] font-bold text-admin-label uppercase tracking-widest ml-1">Financial Category</label>
 <select 
 className="w-full bg-openpos-bg-subtle border-none rounded-2xl px-4 py-3 text-[13px] font-bold text-admin-value outline-none ring-1 ring-openpos-border"
 value={formData.category}
 onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
 >
 <option>Sales</option>
 <option>Personal Withdrawal</option>
 <option>Supplier Payment</option>
 <option>Opening Balance</option>
 <option>Operational Expense</option>
 </select>
 </div>

 <div className="space-y-1.5">
 <label className="text-[10px] font-bold text-admin-label uppercase tracking-widest ml-1">Settlement Amount (KES)</label>
 <input 
 type="number"
 placeholder="0.00"
 className="w-full bg-openpos-bg-subtle border-none rounded-2xl px-4 py-3 text-[13px] font-bold text-admin-value outline-none ring-1 ring-openpos-border"
 value={formData.amount}
 onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
 />
 </div>

 <div className="space-y-1.5">
 <label className="text-[10px] font-bold text-admin-label uppercase tracking-widest ml-1">Audit Narration</label>
 <textarea 
 rows="2"
 placeholder="Describe the transaction for the audit trail..."
 className="w-full bg-openpos-bg-subtle border-none rounded-2xl px-4 py-3 text-[13px] font-bold text-admin-value outline-none ring-1 ring-openpos-border resize-none"
 value={formData.note}
 onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
 />
 </div>
 </div>
 </div>
 </Modal>

 {/* Delete Confirmation Modal */}
 <Modal
 isOpen={showDeleteModal}
 onClose={() => setShowDeleteModal(false)}
 title="Decommission Entry"
 description={`Are you sure you want to remove register entry"${deletingEntry?.id}"?`}
 type="danger"
 icon={Trash2}
 confirmText="Delete"
 confirmCountdown={5}
 onConfirm={confirmDelete}
 >
 <div className="p-4 bg-openpos-red/5 rounded-2xl border border-openpos-red/10">
 <p className="text-[12px] text-openpos-red font-bold uppercase tracking-tight leading-relaxed opacity-80">
 This action will permanently purge this entry from today's financial register. This may cause discrepancies in the end-of-day closing balance.
 </p>
 </div>
 </Modal>
 </div>
 )
}
