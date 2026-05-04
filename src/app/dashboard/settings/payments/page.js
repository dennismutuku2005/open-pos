"use client"

import React, { useState } from 'react'
import { Plus, Edit2, Trash2, Search, CreditCard, Banknote, Smartphone, CheckCircle2, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Modal } from '@/components/Modal'
import { toast } from 'sonner'
import { Card } from '@/components/Card'

export default function PaymentTypesPage() {
    const [payments, setPayments] = useState([
        { id: 1, name: 'Cash', type: 'cash', status: 'Active', icon: Banknote },
        { id: 2, name: 'M-Pesa STK', type: 'mobile', status: 'Active', icon: Smartphone },
        { id: 3, name: 'Credit Card', type: 'card', status: 'Inactive', icon: CreditCard },
        { id: 4, name: 'Store Credit', type: 'credit', status: 'Active', icon: CreditCard }
    ])

    const [searchQuery, setSearchQuery] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [editingMethod, setEditingMethod] = useState(null)
    const [methodToDelete, setMethodToDelete] = useState(null)
    
    const [formData, setFormData] = useState({
        name: '',
        type: 'cash',
        status: 'Active'
    })

    const handleAdd = () => {
        setEditingMethod(null)
        setFormData({ name: '', type: 'cash', status: 'Active' })
        setIsModalOpen(true)
    }

    const handleEdit = (method) => {
        setEditingMethod(method)
        setFormData({
            name: method.name,
            type: method.type,
            status: method.status
        })
        setIsModalOpen(true)
    }

    const handleSave = () => {
        if (!formData.name) {
            toast.error("Method name is required")
            return
        }

        if (editingMethod) {
            setPayments(payments.map(p => 
                p.id === editingMethod.id ? { ...p, ...formData } : p
            ))
            toast.success("Payment method updated")
        } else {
            const newMethod = {
                id: Date.now(),
                ...formData,
                icon: formData.type === 'cash' ? Banknote : formData.type === 'mobile' ? Smartphone : CreditCard
            }
            setPayments([...payments, newMethod])
            toast.success("New payment method added")
        }
        setIsModalOpen(false)
    }

    const confirmDelete = (method) => {
        setMethodToDelete(method)
        setIsDeleteModalOpen(true)
    }

    const handleDelete = () => {
        setPayments(payments.filter(p => p.id !== methodToDelete.id))
        toast.success("Payment method deleted")
        setIsDeleteModalOpen(false)
    }

    const filteredPayments = payments.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.type.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="space-y-6 animate-in fade-in duration-500 font-figtree pb-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-admin-value uppercase">Payment Methods</h1>
                    <p className="text-[13px] font-medium text-admin-label mt-1">Configure accepted settlement channels for your terminal.</p>
                </div>
                <button 
                    onClick={handleAdd}
                    className="bg-openpos-blue text-white px-5 py-2.5 rounded-xl font-bold text-[12px] flex items-center gap-2 shadow-lg shadow-openpos-blue/20 hover:scale-[1.02] transition-all uppercase tracking-widest"
                >
                    <Plus size={16} />
                    Add Method
                </button>
            </div>

            {/* Main Table Card */}
            <Card 
                noPadding 
                title="Active Channels"
                subtitle="Manage checkout integration types"
                headerAction={
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-dim" size={14} />
                        <input 
                            type="text" 
                            placeholder="Search methods..." 
                            className="bg-openpos-bg-subtle border border-openpos-border rounded-xl pl-9 pr-4 py-1.5 text-[11px] font-bold outline-none focus:ring-2 focus:ring-openpos-blue/10 w-64 transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                }
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-openpos-bg-subtle/30">
                                <th className="p-5 text-[10px] uppercase font-bold text-admin-dim tracking-widest border-b border-openpos-border">Method Name</th>
                                <th className="p-5 text-[10px] uppercase font-bold text-admin-dim tracking-widest border-b border-openpos-border text-center">Category</th>
                                <th className="p-5 text-[10px] uppercase font-bold text-admin-dim tracking-widest border-b border-openpos-border text-center">Status</th>
                                <th className="p-5 text-[10px] uppercase font-bold text-admin-dim tracking-widest border-b border-openpos-border text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-openpos-border">
                            {filteredPayments.map(method => {
                                const Icon = method.icon || CreditCard;
                                return (
                                    <tr key={method.id} className="group hover:bg-openpos-bg-subtle/40 transition-colors cursor-default">
                                        <td className="p-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-lg bg-openpos-blue/10 flex items-center justify-center text-openpos-blue border border-openpos-blue/10">
                                                    <Icon size={18} />
                                                </div>
                                                <span className="font-bold text-[13px] text-admin-value">{method.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-5 text-center">
                                            <span className="text-[11px] text-admin-dim font-bold uppercase tracking-tight">{method.type}</span>
                                        </td>
                                        <td className="p-5 text-center">
                                            <div className={cn(
                                                "inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest",
                                                method.status === 'Active' ? "bg-openpos-blue/10 text-openpos-blue" : "bg-openpos-red/10 text-openpos-red"
                                            )}>
                                                {method.status}
                                            </div>
                                        </td>
                                        <td className="p-5 text-right">
                                            <div className="flex justify-end gap-1.5">
                                                <button 
                                                    onClick={() => handleEdit(method)}
                                                    className="p-1.5 text-admin-dim hover:text-openpos-blue hover:bg-openpos-blue/5 rounded-lg transition-all"
                                                >
                                                    <Edit2 size={14} />
                                                </button>
                                                <button 
                                                    onClick={() => confirmDelete(method)}
                                                    className="p-1.5 text-admin-dim hover:text-openpos-red hover:bg-openpos-red/5 rounded-lg transition-all"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Save/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingMethod ? "Update Payment Method" : "Add New Payment Method"}
                description="Configure the details for this settlement channel."
                confirmText={editingMethod ? "Save Changes" : "Create Method"}
                onConfirm={handleSave}
            >
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-admin-dim uppercase tracking-widest ml-1">Method Display Name</label>
                        <input 
                            type="text"
                            placeholder="e.g. PayPal, M-Pesa Business"
                            className="w-full bg-openpos-bg-subtle border border-openpos-border rounded-xl px-4 py-3 text-[12px] font-bold outline-none focus:ring-2 focus:ring-openpos-blue/10 transition-all"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-admin-dim uppercase tracking-widest ml-1">Channel Type</label>
                            <select 
                                className="w-full bg-openpos-bg-subtle border border-openpos-border rounded-xl px-4 py-3 text-[12px] font-bold outline-none cursor-pointer"
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option value="cash">Cash / Liquid</option>
                                <option value="mobile">Mobile Money</option>
                                <option value="card">Bank Card / POS</option>
                                <option value="credit">Store Credit</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-admin-dim uppercase tracking-widest ml-1">Initial Status</label>
                            <select 
                                className="w-full bg-openpos-bg-subtle border border-openpos-border rounded-xl px-4 py-3 text-[12px] font-bold outline-none cursor-pointer"
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                    </div>

                    <div className="p-4 bg-openpos-blue/5 border border-openpos-blue/10 rounded-2xl flex items-start gap-3 mt-4">
                        <div className="w-8 h-8 rounded-full bg-openpos-blue/10 flex items-center justify-center text-openpos-blue shrink-0">
                            <CheckCircle2 size={14} />
                        </div>
                        <div>
                            <p className="text-[9px] font-bold text-openpos-blue uppercase tracking-widest">Integration Notice</p>
                            <p className="text-[10px] text-admin-dim font-bold uppercase tracking-tight leading-relaxed mt-1">
                                Enabling a new channel will allow it to appear as a selectable option in the POS terminal checkout screen.
                            </p>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Delete Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Remove Method"
                description="Are you sure you want to delete this payment method?"
                type="danger"
                confirmText="Delete Method"
                onConfirm={handleDelete}
            >
                <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-2xl flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
                        <XCircle size={14} />
                    </div>
                    <div>
                        <p className="text-[9px] font-bold text-red-500 uppercase tracking-widest">Warning</p>
                        <p className="text-[10px] text-admin-dim font-bold uppercase tracking-tight leading-relaxed mt-1">
                            Deleting this method will prevent future transactions from using it. Existing records will remain unaffected.
                        </p>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
