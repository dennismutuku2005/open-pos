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

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-openpos-border rounded-xl p-4 shadow-sm hover:border-openpos-blue/20 transition-all">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-openpos-red bg-openpos-red/5 shrink-0">
                            <ArrowDownRight size={18} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-admin-dim uppercase tracking-wider">Total Shrinkage</p>
                            <p className="text-lg font-bold text-admin-value">KES 1,245</p>
                        </div>
                    </div>
                    <div className="mt-3">
                        <span className="text-[9px] font-bold text-admin-dim bg-openpos-bg-subtle px-2 py-0.5 rounded uppercase">Latest 30 Days</span>
                    </div>
                </div>

                <div className="bg-white border border-openpos-border rounded-xl p-4 shadow-sm hover:border-openpos-blue/20 transition-all">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-openpos-blue bg-openpos-blue/5 shrink-0">
                            <History size={18} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-admin-dim uppercase tracking-wider">Audit Accuracy</p>
                            <p className="text-lg font-bold text-admin-value">98.2%</p>
                        </div>
                    </div>
                    <div className="mt-3">
                        <span className="text-[9px] font-bold text-admin-dim bg-openpos-bg-subtle px-2 py-0.5 rounded uppercase">Matched Counts</span>
                    </div>
                </div>

                <div className="bg-white border border-openpos-border rounded-xl p-4 shadow-sm hover:border-openpos-blue/20 transition-all">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-orange-600 bg-orange-50 shrink-0">
                            <ShieldAlert size={18} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-admin-dim uppercase tracking-wider">Recent Issues</p>
                            <p className="text-lg font-bold text-admin-value">5 Audits</p>
                        </div>
                    </div>
                    <div className="mt-3">
                        <span className="text-[9px] font-bold text-admin-dim bg-openpos-bg-subtle px-2 py-0.5 rounded uppercase">Pending Review</span>
                    </div>
                </div>
            </div>

            {/* Adjustment History */}
            <div className="bg-card-bg border border-openpos-border rounded-3xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-openpos-border flex items-center justify-between">
                    <h3 className="text-sm font-bold text-admin-value uppercase tracking-[2px]">Correction History</h3>
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-dim" size={14} />
                        <input placeholder="Search adjustments..." className="w-full bg-openpos-bg-subtle border-none rounded-xl pl-9 pr-4 py-2.5 text-[11px] font-bold outline-none" />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-openpos-bg-subtle/50 border-b border-openpos-border">
                                <th className="px-6 py-3 text-[10px] font-bold text-admin-dim uppercase tracking-widest">Product</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-admin-dim uppercase tracking-widest">Type</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-admin-dim uppercase tracking-widest">Qty</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-admin-dim uppercase tracking-widest">Reason</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-admin-dim uppercase tracking-widest text-right">Staff / Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-openpos-border">
                            {adjustments.map((adj) => (
                                <tr key={adj.id} className="group hover:bg-openpos-bg-subtle/30 transition-colors text-[13px]">
                                    <td className="py-2.5 px-6 font-bold text-admin-value uppercase tracking-tight">{adj.product}</td>
                                    <td className="py-2.5 px-6">
                                        <div className={cn(
                                            "flex items-center gap-1.5 font-bold text-[10px] uppercase tracking-widest",
                                            adj.type === 'Increase' ? "text-openpos-green" : "text-openpos-red"
                                        )}>
                                            {adj.type === 'Increase' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                            {adj.type}
                                        </div>
                                    </td>
                                    <td className="py-2.5 px-6 font-bold text-admin-value">{adj.qty} units</td>
                                    <td className="py-2.5 px-6">
                                        <p className="text-[11px] text-admin-label font-medium line-clamp-1 max-w-[200px]">{adj.reason}</p>
                                    </td>
                                    <td className="py-2.5 px-6 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button className="p-1.5 text-admin-dim hover:text-openpos-blue hover:bg-openpos-blue/5 rounded-lg transition-all">
                                                <Edit2 size={14} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(adj)}
                                                className="p-1.5 text-admin-dim hover:text-openpos-red hover:bg-openpos-red/5 rounded-lg transition-all"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

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
                                        formData.type === 'Increase' ? "bg-openpos-blue text-white shadow-lg shadow-openpos-blue/20" : "text-admin-dim hover:bg-white"
                                    )}
                                >Increase</button>
                                <button 
                                    onClick={() => setFormData(prev => ({ ...prev, type: 'Decrease' }))}
                                    className={cn(
                                        "flex-1 py-2 rounded-xl text-[11px] font-bold uppercase transition-all", 
                                        formData.type === 'Decrease' ? "bg-openpos-red text-white shadow-lg shadow-openpos-red/20" : "text-admin-dim hover:bg-white"
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
                <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
                    <p className="text-[12px] text-red-600 font-medium leading-relaxed">
                        This will permanently remove this record from your adjustment history. Please note that this action will NOT reverse any changes previously made to the stock levels.
                    </p>
                </div>
            </Modal>
        </div>
    )
}
