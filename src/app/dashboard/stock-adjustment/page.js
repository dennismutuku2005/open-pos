"use client"

import React, { useState } from 'react'
import { 
    MoveVertical, Search, Plus, ArrowUpRight, 
    ArrowDownRight, Package, AlertCircle, History,
    Trash2, Edit2, ShieldAlert, CheckCircle2, X,
    Settings, PackageCheck
} from 'lucide-react'
import { Modal } from '@/components/Modal'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

// Mock Data
const initialAdjustments = [
    { id: 1, product: 'Classic Baguette', type: 'Decrease', qty: 5, reason: 'Damaged during baking', date: '2024-05-03 14:20', staff: 'Sarah' },
    { id: 2, product: 'Blueberry Muffin', type: 'Increase', qty: 12, reason: 'Manual stock count correction', date: '2024-05-03 09:15', staff: 'John' },
    { id: 3, product: 'Sourdough Loaf', type: 'Decrease', qty: 2, reason: 'Expired', date: '2024-05-02 18:45', staff: 'Sarah' },
]

export default function StockAdjustmentPage() {
    const [adjustments, setAdjustments] = useState(initialAdjustments)
    const [showModal, setShowModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [deletingAdjustment, setDeletingAdjustment] = useState(null)
    const [formData, setFormData] = useState({ product: '', qty: 0, type: 'Decrease', reason: '' })

    const handleSave = () => {
        if (!formData.product || !formData.qty) return toast.error('Please fill all fields')
        const newAdj = {
            id: Date.now(),
            ...formData,
            date: new Date().toLocaleString(),
            staff: 'Demo Admin'
        }
        setAdjustments(prev => [newAdj, ...prev])
        setShowModal(false)
        toast.success('Inventory adjustment recorded')
    }

    const handleDelete = (adj) => {
        setDeletingAdjustment(adj)
        setShowDeleteModal(true)
    }

    const confirmDelete = () => {
        if (!deletingAdjustment) return
        setAdjustments(prev => prev.filter(a => a.id !== deletingAdjustment.id))
        toast.success('Adjustment record removed')
        setShowDeleteModal(false)
        setDeletingAdjustment(null)
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-admin-value uppercase">Inventory Corrections</h1>
                    <p className="text-admin-label mt-1">Manual stock adjustments for damages, loss, or audits.</p>
                </div>
                <button 
                    onClick={() => setShowModal(true)}
                    className="w-full sm:w-auto bg-openpos-blue text-white px-5 py-2.5 rounded-xl font-bold text-[13px] flex items-center justify-center gap-2 shadow-lg shadow-openpos-blue/20 hover:scale-[1.02] transition-all"
                >
                    <Plus size={18} />
                    New Adjustment
                </button>
            </div>

            {/* Inventory Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard 
                    title="Financial Shrinkage" 
                    value="KES 1,245" 
                    change="-12% vs last month" 
                    isPositive={true} 
                    icon={ArrowDownRight} 
                    color="red" 
                    subtitle="LATEST 30 DAYS"
                />
                <StatCard 
                    title="Audit Integrity" 
                    value="98.2%" 
                    change="+0.5%" 
                    isPositive={true} 
                    icon={History} 
                    color="blue" 
                    subtitle="MATCHED COUNTS"
                />
                <StatCard 
                    title="System Anomalies" 
                    value="5 Audits" 
                    change="Requires Attention" 
                    isPositive={false} 
                    icon={ShieldAlert} 
                    color="red" 
                    subtitle="PENDING REVIEW"
                />
            </div>

            {/* Adjustment History Registry */}
            <Card 
                noPadding
                title="Correction History"
                subtitle="Manual inventory adjustment audit trail"
                headerAction={
                    <div className="flex items-center gap-3">
                        <div className="relative group">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-admin-dim group-focus-within:text-openpos-blue transition-colors" size={14} />
                            <input 
                                placeholder="Search adjustments..." 
                                className="bg-openpos-bg-subtle border border-openpos-border rounded-xl pl-10 pr-4 py-2 text-[11px] font-bold text-admin-value outline-none focus:ring-2 focus:ring-openpos-blue/10 focus:border-openpos-blue w-64 transition-all"
                            />
                        </div>
                    </div>
                }
            >
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left whitespace-nowrap border-collapse text-[11px]">
                        <thead>
                            <tr className="bg-openpos-bg-subtle/50 border-b border-openpos-border text-[9px] font-bold text-admin-dim uppercase tracking-widest">
                                <th className="px-6 py-4">Inventory Item</th>
                                <th className="px-6 py-4 text-center">Vector Type</th>
                                <th className="px-6 py-4 text-center">Density Shift</th>
                                <th className="px-6 py-4">Internal Justification</th>
                                <th className="px-6 py-4 text-right">Auditor / Timestamp</th>
                                <th className="px-6 py-4 text-right">Management</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-openpos-border">
                            {adjustments.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-20 text-center text-gray-400 font-bold text-[10px] uppercase tracking-widest bg-openpos-bg-subtle/20">
                                        No adjustment records found in registry
                                    </td>
                                </tr>
                            ) : (
                                adjustments.map((adj) => (
                                    <tr key={adj.id} className="group hover:bg-openpos-bg-subtle/40 transition-colors cursor-default">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-openpos-bg-subtle border border-openpos-border flex items-center justify-center text-openpos-blue group-hover:scale-105 transition-transform">
                                                    <Package size={16} />
                                                </div>
                                                <span className="font-bold text-admin-value uppercase tracking-tight group-hover:text-openpos-blue transition-colors">{adj.product}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className={cn(
                                                "inline-flex items-center gap-1.5 font-bold text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-md border",
                                                adj.type === 'Increase' ? "bg-openpos-blue/5 text-openpos-blue border-openpos-blue/10" : "bg-openpos-red/5 text-openpos-red border-openpos-red/10"
                                            )}>
                                                {adj.type === 'Increase' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                                {adj.type}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center font-bold text-admin-value">
                                            {adj.type === 'Increase' ? '+' : '-'}{adj.qty} <span className="text-[9px] text-admin-dim">UNITS</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-[10px] text-admin-dim font-bold uppercase tracking-tight line-clamp-1 max-w-[200px] opacity-80">{adj.reason}</p>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex flex-col items-end">
                                                <span className="text-[11px] font-bold text-admin-value">{adj.staff}</span>
                                                <span className="text-[8px] font-bold text-admin-dim uppercase tracking-tighter mt-1">{adj.date}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <button className="p-2 bg-card-bg border border-openpos-border rounded-lg text-admin-dim hover:text-openpos-blue hover:border-openpos-blue/30 hover:bg-openpos-blue/5 transition-all">
                                                    <Edit2 size={12} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(adj)}
                                                    className="p-2 bg-card-bg border border-openpos-border rounded-lg text-admin-dim hover:text-red-400 hover:border-red-400/30 hover:bg-red-400/5 transition-all"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Standardized Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="Record Inventory Adjustment"
                description="Manually correct stock levels for damages or audits"
                confirmText="Commit Adjustment"
                onConfirm={handleSave}
                icon={PackageCheck}
                maxWidth="max-w-lg"
            >
                <div className="space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-admin-label uppercase tracking-widest ml-1">Select Product</label>
                        <select 
                            className="w-full bg-openpos-bg-subtle border-none rounded-2xl px-4 py-3 text-[13px] font-bold outline-none ring-1 ring-openpos-border focus:ring-openpos-blue/30"
                            value={formData.product}
                            onChange={(e) => setFormData(prev => ({ ...prev, product: e.target.value }))}
                        >
                            <option value="">Choose a product...</option>
                            <option>Classic Baguette</option>
                            <option>Blueberry Muffin</option>
                            <option>Sourdough Loaf</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-admin-label uppercase tracking-widest ml-1">Adjustment Type</label>
                            <div className="flex bg-openpos-bg-subtle rounded-2xl p-1 ring-1 ring-openpos-border">
                                <button 
                                    onClick={() => setFormData(prev => ({ ...prev, type: 'Increase' }))}
                                    className={cn(
                                        "flex-1 py-2 rounded-xl text-[11px] font-bold uppercase transition-all", 
                                        formData.type === 'Increase' ? "bg-openpos-blue text-white shadow-lg shadow-openpos-blue/20" : "text-admin-dim hover:bg-card-bg"
                                    )}
                                >Increase</button>
                                <button 
                                    onClick={() => setFormData(prev => ({ ...prev, type: 'Decrease' }))}
                                    className={cn(
                                        "flex-1 py-2 rounded-xl text-[11px] font-bold uppercase transition-all", 
                                        formData.type === 'Decrease' ? "bg-openpos-red text-white shadow-lg shadow-openpos-red/20" : "text-admin-dim hover:bg-card-bg"
                                    )}
                                >Decrease</button>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-admin-label uppercase tracking-widest ml-1">Quantity</label>
                            <input 
                                type="number"
                                className="w-full bg-openpos-bg-subtle border-none rounded-2xl px-4 py-3 text-[13px] font-bold outline-none ring-1 ring-openpos-border focus:ring-openpos-blue/30"
                                placeholder="0"
                                value={formData.qty}
                                onChange={(e) => setFormData(prev => ({ ...prev, qty: parseInt(e.target.value) || 0 }))}
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-admin-label uppercase tracking-widest ml-1">Reason / Detail</label>
                        <textarea 
                            className="w-full bg-openpos-bg-subtle border-none rounded-2xl px-4 py-3 text-[13px] font-bold outline-none ring-1 ring-openpos-border focus:ring-openpos-blue/30 resize-none"
                            rows="3"
                            placeholder="Explain the reason for adjustment..."
                            value={formData.reason}
                            onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                        />
                    </div>
                </div>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="Delete Adjustment Record"
                description={`Are you sure you want to remove the record for "${deletingAdjustment?.product}"?`}
                type="danger"
                icon={Trash2}
                confirmText="Delete"
                confirmCountdown={5}
                onConfirm={confirmDelete}
            >
                <div className="p-4 bg-openpos-red/5 rounded-2xl border border-openpos-red/10">
                    <p className="text-[12px] text-openpos-red font-medium leading-relaxed">
                        This will permanently remove this record from your adjustment history. Please note that this action will NOT reverse any changes previously made to the stock levels.
                    </p>
                </div>
            </Modal>
        </div>
    )
}
