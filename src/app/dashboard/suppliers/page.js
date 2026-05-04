"use client"

import React, { useState } from 'react'
import { 
    Truck, Search, Plus, Phone, Mail, 
    Globe, MapPin, Package, MoreVertical,
    Edit2, Trash2, ExternalLink, Calendar
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

import { Modal } from '@/components/Modal'

// Mock Data
const initialSuppliers = [
    { id: 1, name: 'Premium Grains Co.', contact: 'Sarah Miller', phone: '+1 (555) 123-4567', email: 'orders@premiumgrains.com', category: 'Ingredients', rating: 4.8 },
    { id: 2, name: 'Eco-Pack Solutions', contact: 'Mark Chen', phone: '+1 (555) 987-6543', email: 'sales@ecopack.io', category: 'Packaging', rating: 4.5 },
    { id: 3, name: 'Dairy Direct', contact: 'Elena Rodriguez', phone: '+1 (555) 000-1111', email: 'supply@dairydirect.net', category: 'Dairy', rating: 4.2 },
]

export default function SuppliersPage() {
    const [suppliers, setSuppliers] = useState(initialSuppliers)
    const [showModal, setShowModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [deletingSupplier, setDeletingSupplier] = useState(null)
    const [formData, setFormData] = useState({ name: '', contact: '', phone: '', email: '', category: 'Ingredients' })

    const handleSave = () => {
        if (!formData.name) return toast.error('Supplier name is required')
        const newSup = {
            id: Date.now(),
            ...formData,
            rating: 5.0
        }
        setSuppliers(prev => [newSup, ...prev])
        setShowModal(false)
        setFormData({ name: '', contact: '', phone: '', email: '', category: 'Ingredients' })
        toast.success('Supplier onboarded successfully')
    }

    const handleDelete = (sup) => {
        setDeletingSupplier(sup)
        setShowDeleteModal(true)
    }

    const confirmDelete = () => {
        if (!deletingSupplier) return
        setSuppliers(prev => prev.filter(s => s.id !== deletingSupplier.id))
        toast.success('Supplier removed')
        setShowDeleteModal(false)
        setDeletingSupplier(null)
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-admin-value uppercase">Supply Partners</h1>
                    <p className="text-admin-label mt-1">Manage your relationships with wholesalers and service providers.</p>
                </div>
                <button 
                    onClick={() => setShowModal(true)}
                    className="w-full sm:w-auto bg-openpos-blue text-white px-5 py-2.5 rounded-xl font-bold text-[13px] flex items-center justify-center gap-2 shadow-lg shadow-openpos-blue/20 hover:scale-[1.02] transition-all"
                >
                    <Plus size={18} />
                    Onboard Supplier
                </button>
            </div>

            {/* Suppliers Table */}
            <div className="bg-card-bg border border-openpos-border rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-openpos-bg-subtle/50 border-b border-openpos-border">
                                <th className="px-6 py-3 text-[10px] font-bold text-admin-dim uppercase tracking-widest">Supplier Name</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-admin-dim uppercase tracking-widest">Category</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-admin-dim uppercase tracking-widest">Primary Contact</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-admin-dim uppercase tracking-widest">Phone / Email</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-admin-dim uppercase tracking-widest text-center">Rating</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-admin-dim uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-openpos-border">
                            {suppliers.map((sup) => (
                                <tr key={sup.id} className="group hover:bg-openpos-bg-subtle transition-colors">
                                    <td className="px-6 py-2.5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-openpos-blue/5 flex items-center justify-center text-openpos-blue shrink-0">
                                                <Truck size={16} />
                                            </div>
                                            <span className="text-[13px] font-bold text-admin-value">{sup.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-2.5">
                                        <span className="px-2 py-0.5 bg-openpos-blue/10 text-openpos-blue text-[9px] font-bold uppercase rounded-md tracking-widest">
                                            {sup.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-2.5 text-[12px] font-medium text-admin-value">
                                        {sup.contact}
                                    </td>
                                    <td className="px-6 py-2.5">
                                        <div className="flex flex-col">
                                            <span className="text-[12px] font-bold text-admin-value">{sup.phone}</span>
                                            <span className="text-[10px] text-admin-dim">{sup.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-2.5 text-center">
                                        <span className="text-[11px] font-bold text-openpos-blue">{sup.rating} / 5.0</span>
                                    </td>
                                    <td className="px-6 py-2.5 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button className="p-1.5 text-admin-dim hover:text-openpos-blue hover:bg-openpos-blue/5 rounded-lg transition-all">
                                                <Edit2 size={14} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(sup)}
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

            {/* Onboard Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="Onboard New Supplier"
                description="Register a new wholesale partner"
                confirmText="Create Supplier"
                onConfirm={handleSave}
                icon={Truck}
                maxWidth="max-w-lg"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2 space-y-1.5">
                        <label className="text-[10px] font-bold text-admin-label uppercase tracking-widest ml-1">Company Name *</label>
                        <input 
                            className="w-full bg-openpos-bg-subtle border-none rounded-2xl px-4 py-3 text-[13px] font-bold outline-none ring-1 ring-openpos-border focus:ring-openpos-blue/30"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-admin-label uppercase tracking-widest ml-1">Contact Person</label>
                        <input 
                            className="w-full bg-openpos-bg-subtle border-none rounded-2xl px-4 py-3 text-[13px] font-bold outline-none ring-1 ring-openpos-border focus:ring-openpos-blue/30"
                            value={formData.contact}
                            onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-admin-label uppercase tracking-widest ml-1">Category</label>
                        <select 
                            className="w-full bg-openpos-bg-subtle border-none rounded-2xl px-4 py-3 text-[13px] font-bold outline-none ring-1 ring-openpos-border focus:ring-openpos-blue/30"
                            value={formData.category}
                            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        >
                            <option>Ingredients</option>
                            <option>Packaging</option>
                            <option>Dairy</option>
                            <option>Equipment</option>
                            <option>Services</option>
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-admin-label uppercase tracking-widest ml-1">Phone Number</label>
                        <input 
                            className="w-full bg-openpos-bg-subtle border-none rounded-2xl px-4 py-3 text-[13px] font-bold outline-none ring-1 ring-openpos-border focus:ring-openpos-blue/30"
                            value={formData.phone}
                            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-admin-label uppercase tracking-widest ml-1">Email Address</label>
                        <input 
                            type="email"
                            className="w-full bg-openpos-bg-subtle border-none rounded-2xl px-4 py-3 text-[13px] font-bold outline-none ring-1 ring-openpos-border focus:ring-openpos-blue/30"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        />
                    </div>
                </div>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="Remove Supplier"
                description={`Terminate relationship with "${deletingSupplier?.name}"?`}
                type="danger"
                icon={Trash2}
                confirmText="Delete"
                confirmCountdown={5}
                onConfirm={confirmDelete}
            >
                <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
                    <p className="text-[12px] text-red-600 font-medium leading-relaxed">
                        This will remove the supplier from your active partners list. Historical purchase records will remain intact.
                    </p>
                </div>
            </Modal>
        </div>
    )
}
