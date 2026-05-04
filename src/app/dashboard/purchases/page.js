"use client"

import React, { useState } from 'react'
import { 
    Plus, Search, ShoppingBag, Calendar, 
    ChevronRight, MoreVertical, Edit2, Trash2,
    CheckCircle2, Clock, X, Package, DollarSign
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

// Mock Data
const initialPurchases = [
    { id: 1, reference: 'PUR-001', supplier: 'Artisan Flour Co.', date: '2024-05-01', total: 450.00, status: 'Received' },
    { id: 2, reference: 'PUR-002', supplier: 'Sugar & Spice Wholesale', date: '2024-05-02', total: 280.50, status: 'Pending' },
    { id: 3, reference: 'PUR-003', supplier: 'Dairy Fresh Ltd', date: '2024-05-03', total: 125.00, status: 'Ordered' },
]

export default function PurchasesPage() {
    const [purchases, setPurchases] = useState(initialPurchases)
    const [showAddModal, setShowAddModal] = useState(false)
    const [formData, setFormData] = useState({
        supplier: '',
        date: new Date().toISOString().split('T')[0],
        items: [{ product: '', quantity: 1, price: 0 }],
    })

    const addItem = () => {
        setFormData(prev => ({
            ...prev,
            items: [...prev.items, { product: '', quantity: 1, price: 0 }]
        }))
    }

    const removeItem = (index) => {
        setFormData(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index)
        }))
    }

    const handleSave = () => {
        if (!formData.supplier) return toast.error('Supplier is required')
        
        const total = formData.items.reduce((sum, item) => sum + (item.quantity * item.price), 0)
        const newPurchase = {
            id: Date.now(),
            reference: `PUR-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
            supplier: formData.supplier,
            date: formData.date,
            total: total,
            status: 'Ordered'
        }
        
        setPurchases(prev => [newPurchase, ...prev])
        setShowAddModal(false)
        toast.success('Purchase order created')
    }

    return (
        <div className="sopenpos-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-admin-value">Purchases</h1>
                    <p className="text-admin-label mt-1">Track and manage your inventory supply orders.</p>
                </div>
                <button 
                    onClick={() => setShowAddModal(true)}
                    className="w-full sm:w-auto bg-openpos-blue text-white px-5 py-2.5 rounded-xl font-bold text-[13px] flex items-center justify-center gap-2 shadow-lg shadow-openpos-blue/20 hover:scale-[1.02] transition-all"
                >
                    <Plus size={18} />
                    New Purchase Order
                </button>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 gap-4">
                {purchases.map((pur) => (
                    <div key={pur.id} className="bg-card-bg border border-openpos-border rounded-2xl p-5 hover:border-openpos-blue/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className={cn(
                                "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                                pur.status === 'Received' ? "bg-openpos-green-light text-openpos-green" : 
                                pur.status === 'Pending' ? "bg-yellow-100 text-yellow-600" : "bg-openpos-blue-light text-openpos-blue"
                            )}>
                                <ShoppingBag size={24} />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-[14px] font-bold text-admin-value">{pur.reference}</h3>
                                    <span className={cn(
                                        "text-[9px] font-bold uppercase px-2 py-0.5 rounded-lg",
                                        pur.status === 'Received' ? "bg-openpos-green-light text-openpos-green" : 
                                        pur.status === 'Pending' ? "bg-yellow-100 text-yellow-600" : "bg-openpos-blue-light text-openpos-blue"
                                    )}>
                                        {pur.status}
                                    </span>
                                </div>
                                <p className="text-[12px] text-admin-label font-medium mt-0.5">{pur.supplier}</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-8 md:gap-16">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-admin-dim uppercase tracking-widest">Date</span>
                                <span className="text-[12px] font-bold text-admin-value flex items-center gap-2 mt-1">
                                    <Calendar size={14} className="text-openpos-blue" />
                                    {pur.date}
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-admin-dim uppercase tracking-widest">Total Amount</span>
                                <span className="text-[15px] font-bold text-admin-value mt-1">${pur.total.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 self-end md:self-center">
                            <button className="p-2.5 bg-openpos-bg-subtle rounded-xl text-admin-dim hover:text-openpos-blue transition-colors">
                                <Edit2 size={16} />
                            </button>
                            <button className="p-2.5 bg-openpos-bg-subtle rounded-xl text-admin-dim hover:text-openpos-red transition-colors">
                                <Trash2 size={16} />
                            </button>
                            <button className="p-2.5 bg-openpos-blue text-white rounded-xl shadow-lg shadow-openpos-blue/10">
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
                    <div className="bg-card-bg border border-openpos-border rounded-3xl w-full max-w-2xl overflow-hidden relative shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="p-6 border-b border-openpos-border flex items-center justify-between">
                            <h2 className="text-xl font-bold text-admin-value">New Purchase Order</h2>
                            <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-openpos-bg-subtle rounded-xl text-admin-dim transition-colors"><X size={20} /></button>
                        </div>
                        <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                                <div className="sopenpos-y-1.5">
                                    <label className="text-[11px] font-bold text-admin-label uppercase tracking-widest">Supplier Name</label>
                                    <input 
                                        value={formData.supplier}
                                        onChange={(e) => setFormData(prev => ({ ...prev, supplier: e.target.value }))}
                                        className="w-full bg-openpos-bg-subtle border-none rounded-xl px-4 py-3 text-[13px] outline-none"
                                        placeholder="e.g. Flour Suppliers Ltd"
                                    />
                                </div>
                                <div className="sopenpos-y-1.5">
                                    <label className="text-[11px] font-bold text-admin-label uppercase tracking-widest">Order Date</label>
                                    <input 
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                                        className="w-full bg-openpos-bg-subtle border-none rounded-xl px-4 py-3 text-[13px] outline-none"
                                    />
                                </div>
                            </div>

                            <div className="sopenpos-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-[11px] font-bold text-admin-label uppercase tracking-widest">Items Order</h3>
                                    <button onClick={addItem} className="text-openpos-blue font-bold text-[11px] flex items-center gap-1 hover:underline">
                                        <Plus size={14} /> Add Item
                                    </button>
                                </div>
                                <div className="sopenpos-y-3">
                                    {formData.items.map((item, index) => (
                                        <div key={index} className="grid grid-cols-12 gap-3 items-center">
                                            <div className="col-span-6">
                                                <input 
                                                    placeholder="Product Name"
                                                    className="w-full bg-openpos-bg-subtle border-none rounded-xl px-4 py-2.5 text-[12px] outline-none"
                                                    value={item.product}
                                                    onChange={(e) => {
                                                        const newItems = [...formData.items]
                                                        newItems[index].product = e.target.value
                                                        setFormData(prev => ({ ...prev, items: newItems }))
                                                    }}
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <input 
                                                    type="number"
                                                    placeholder="Qty"
                                                    className="w-full bg-openpos-bg-subtle border-none rounded-xl px-3 py-2.5 text-[12px] outline-none"
                                                    value={item.quantity}
                                                    onChange={(e) => {
                                                        const newItems = [...formData.items]
                                                        newItems[index].quantity = parseInt(e.target.value) || 0
                                                        setFormData(prev => ({ ...prev, items: newItems }))
                                                    }}
                                                />
                                            </div>
                                            <div className="col-span-3">
                                                <input 
                                                    type="number"
                                                    placeholder="Price"
                                                    className="w-full bg-openpos-bg-subtle border-none rounded-xl px-3 py-2.5 text-[12px] outline-none"
                                                    value={item.price}
                                                    onChange={(e) => {
                                                        const newItems = [...formData.items]
                                                        newItems[index].price = parseFloat(e.target.value) || 0
                                                        setFormData(prev => ({ ...prev, items: newItems }))
                                                    }}
                                                />
                                            </div>
                                            <div className="col-span-1">
                                                <button onClick={() => removeItem(index)} className="text-openpos-red p-2 hover:bg-openpos-red/10 rounded-lg transition-all">
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-openpos-border flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-admin-dim uppercase tracking-widest">Estimated Total</span>
                                <span className="text-xl font-bold text-admin-value">${formData.items.reduce((sum, item) => sum + (item.quantity * item.price), 0).toFixed(2)}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <button onClick={() => setShowAddModal(false)} className="px-6 py-2.5 rounded-xl font-bold text-[13px] text-admin-label hover:bg-openpos-bg-subtle transition-all">Cancel</button>
                                <button onClick={handleSave} className="px-8 py-2.5 bg-openpos-blue text-white rounded-xl font-bold text-[13px] shadow-lg shadow-openpos-blue/20 transition-all">Create Order</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
