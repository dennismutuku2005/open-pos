"use client"

import React, { useState } from'react'
import { 
 Plus, Search, ShoppingBag, Calendar, 
 ChevronRight, MoreVertical, Edit2, Trash2,
 CheckCircle2, Clock, X, Package, DollarSign
} from'lucide-react'
import { cn } from'@/lib/utils'
import { toast } from'sonner'
import { Card, StatCard } from'@/components/Card'
import { Modal } from'@/components/Modal'

// Mock Data
const initialPurchases = [
 { id: 1, reference:'PUR-001', supplier:'Artisan Flour Co.', date:'2024-05-01', total: 45000, status:'Received'},
 { id: 2, reference:'PUR-002', supplier:'Sugar & Spice Wholesale', date:'2024-05-02', total: 28050, status:'Pending'},
 { id: 3, reference:'PUR-003', supplier:'Dairy Fresh Ltd', date:'2024-05-03', total: 12500, status:'Ordered'},
]

export default function PurchasesPage() {
 const [purchases, setPurchases] = useState(initialPurchases)
 const [showAddModal, setShowAddModal] = useState(false)
 const [showDeleteModal, setShowDeleteModal] = useState(false)
 const [editingPurchase, setEditingPurchase] = useState(null)
 const [deletingPurchase, setDeletingPurchase] = useState(null)
 
 const [formData, setFormData] = useState({
 supplier:'',
 date: new Date().toISOString().split('T')[0],
 items: [{ product:'', quantity: 1, price: 0 }],
 })

 const resetForm = () => {
 setFormData({
 supplier:'',
 date: new Date().toISOString().split('T')[0],
 items: [{ product:'', quantity: 1, price: 0 }],
 })
 setEditingPurchase(null)
 }

 const addItem = () => {
 setFormData(prev => ({
 ...prev,
 items: [...prev.items, { product:'', quantity: 1, price: 0 }]
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
 
 if (editingPurchase) {
 setPurchases(prev => prev.map(p => p.id === editingPurchase.id ? { ...formData, id: p.id, reference: p.reference, total, status: p.status } : p))
 toast.success('Purchase record updated')
 } else {
 const newPurchase = {
 id: Date.now(),
 reference:`PUR-${Math.floor(Math.random() * 1000).toString().padStart(3,'0')}`,
 supplier: formData.supplier,
 date: formData.date,
 total: total,
 status:'Ordered'
 }
 setPurchases(prev => [newPurchase, ...prev])
 toast.success('Procurement order initialized')
 }
 
 setShowAddModal(false)
 resetForm()
 }

 const handleEdit = (purchase) => {
 setEditingPurchase(purchase)
 setFormData({
 supplier: purchase.supplier,
 date: purchase.date,
 items: [{ product:'Batch Supply', quantity: 1, price: purchase.total }]
 })
 setShowAddModal(true)
 }

 const handleDelete = (purchase) => {
 setDeletingPurchase(purchase)
 setShowDeleteModal(true)
 }

 const confirmDelete = () => {
 setPurchases(prev => prev.filter(p => p.id !== deletingPurchase.id))
 setShowDeleteModal(false)
 setDeletingPurchase(null)
 toast.success('Procurement record decommissioned')
 }

 return (
 <div className="space-y-6 animate-in fade-in duration-500 font-figtree pb-10">
 {/* Header */}
 <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
 <div>
 <h1 className="text-xl font-bold tracking-tight text-admin-value uppercase">Purchases & Procurement</h1>
 <p className="text-[13px] font-medium text-admin-label mt-1">Manage vendor relations and inventory supply chain records.</p>
 </div>
 <button 
 onClick={() => { resetForm(); setShowAddModal(true); }}
 className="w-full sm:w-auto bg-openpos-blue text-white px-5 py-2.5 rounded-xl font-bold text-[11px] flex items-center justify-center gap-2 shadow-lg shadow-openpos-blue/20 transition-all uppercase tracking-widest"
 >
 <Plus size={18} />
 New Order
 </button>
 </div>

 {/* Procurement Metrics */}
 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
 <StatCard 
 title="Procurement Volume"
 value="KES 854,200"
 change="+15% vs last month"
 isPositive={true} 
 icon={ShoppingBag} 
 color="blue"
 subtitle="TOTAL LIQUIDITY OUT"
 />
 <StatCard 
 title="Active Orders"
 value="12 Orders"
 change="5 Pending Delivery"
 isPositive={true} 
 icon={Clock} 
 color="blue"
 subtitle="SUPPLY CHAIN STATUS"
 />
 <StatCard 
 title="Inventory Inflow"
 value="2,450 Units"
 change="Received this week"
 isPositive={true} 
 icon={Package} 
 color="blue"
 subtitle="STOCK REPLENISHMENT"
 />
 </div>

 {/* Purchases Registry */}
 <Card 
 noPadding
 title="Purchase Orders Ledger"
 subtitle="Centralized management of supply chain procurement"
 headerAction={
 <div className="flex items-center gap-3">
 <div className="relative group">
 <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-admin-dim group-focus-within:text-openpos-blue transition-colors"size={14} />
 <input 
 placeholder="Search orders..."
 className="bg-openpos-bg-subtle border border-openpos-border rounded-xl pl-10 pr-4 py-2 text-[11px] font-bold text-admin-value outline-none w-64 transition-all"
 />
 </div>
 </div>
 }
 >
 <div className="overflow-x-auto custom-scrollbar">
 <table className="w-full text-left whitespace-nowrap border-collapse text-[11px]">
 <thead>
 <tr className="bg-openpos-bg-subtle/50 border-b border-openpos-border text-[9px] font-bold text-admin-dim uppercase tracking-widest">
 <th className="px-6 py-4">Transaction ID</th>
 <th className="px-6 py-4">Vendor Entity</th>
 <th className="px-6 py-4 text-center">Temporal Signature</th>
 <th className="px-6 py-4 text-center">Procurement Status</th>
 <th className="px-6 py-4 text-right">Settlement Total</th>
 <th className="px-6 py-4 text-right">Management</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-openpos-border">
 {purchases.length === 0 ? (
 <tr>
 <td colSpan={6} className="py-20 text-center text-gray-400 font-bold text-[10px] uppercase tracking-widest bg-openpos-bg-subtle/20">
 No purchase records indexed in ledger
 </td>
 </tr>
 ) : (
 purchases.map((pur) => (
 <tr key={pur.id} className="group transition-colors cursor-default">
 <td className="px-6 py-4">
 <div className="flex items-center gap-3">
 <div className="w-8 h-8 rounded-lg bg-openpos-bg-subtle border border-openpos-border flex items-center justify-center text-openpos-blue transition-transform">
 <ShoppingBag size={16} />
 </div>
 <span className="font-bold text-admin-value uppercase tracking-tight transition-colors">{pur.reference}</span>
 </div>
 </td>
 <td className="px-6 py-4">
 <span className="text-admin-value font-bold uppercase tracking-tight">{pur.supplier}</span>
 </td>
 <td className="px-6 py-4 text-center">
 <div className="flex items-center justify-center gap-2 text-admin-dim font-bold">
 <Calendar size={12} className="text-openpos-blue"/>
 <span className="uppercase">{pur.date}</span>
 </div>
 </td>
 <td className="px-6 py-4 text-center">
 <span className={cn(
"inline-flex items-center px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest border",
 pur.status ==='Received'?"bg-emerald-500/5 text-emerald-500 border-emerald-500/10": 
 pur.status ==='Pending'?"bg-amber-500/5 text-amber-500 border-amber-500/10":"bg-openpos-blue/5 text-openpos-blue border-openpos-blue/10"
 )}>
 {pur.status}
 </span>
 </td>
 <td className="px-6 py-4 text-right">
 <span className="text-[13px] font-bold text-admin-value">KES {pur.total.toLocaleString()}</span>
 </td>
 <td className="px-6 py-4 text-right">
 <div className="flex items-center justify-end gap-1.5">
 <button 
 onClick={() => handleEdit(pur)}
 className="p-2 bg-card-bg border border-openpos-border rounded-lg text-admin-dim transition-all"
 >
 <Edit2 size={12} />
 </button>
 <button 
 onClick={() => handleDelete(pur)}
 className="p-2 bg-card-bg border border-openpos-border rounded-lg text-admin-dim transition-all"
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

 {/* Procurement Order Modal */}
 <Modal
 isOpen={showAddModal}
 onClose={() => { setShowAddModal(false); resetForm(); }}
 title={editingPurchase ?"Modify Purchase Order":"Initialize Procurement Order"}
 description="Create or update inventory supply chain requests"
 confirmText={editingPurchase ?"Update Transaction":"Authorize Order"}
 onConfirm={handleSave}
 icon={ShoppingBag}
 maxWidth="max-w-2xl"
 >
 <div className="space-y-6">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
 <div className="space-y-1.5">
 <label className="text-[10px] font-bold text-admin-label uppercase tracking-widest ml-1">Vendor Identity</label>
 <input 
 value={formData.supplier}
 onChange={(e) => setFormData(prev => ({ ...prev, supplier: e.target.value }))}
 className="w-full bg-openpos-bg-subtle border-none rounded-2xl px-4 py-3 text-[13px] font-bold text-admin-value outline-none ring-1 ring-openpos-border"
 placeholder="e.g. Flour Suppliers Ltd"
 />
 </div>
 <div className="space-y-1.5">
 <label className="text-[10px] font-bold text-admin-label uppercase tracking-widest ml-1">Temporal signature</label>
 <input 
 type="date"
 value={formData.date}
 onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
 className="w-full bg-openpos-bg-subtle border-none rounded-2xl px-4 py-3 text-[13px] font-bold text-admin-value outline-none ring-1 ring-openpos-border"
 />
 </div>
 </div>

 <div className="space-y-4">
 <div className="flex items-center justify-between border-b border-openpos-border pb-2">
 <div className="flex items-center gap-2">
 <Package size={14} className="text-openpos-blue"/>
 <h3 className="text-[10px] font-bold text-admin-label uppercase tracking-widest">Inventory Line Items</h3>
 </div>
 <button onClick={addItem} className="text-openpos-blue font-bold text-[10px] flex items-center gap-1.5 bg-openpos-blue/5 px-3 py-1.5 rounded-lg border border-openpos-blue/10 transition-all uppercase tracking-widest">
 <Plus size={14} /> Add Vector
 </button>
 </div>
 <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
 {formData.items.map((item, index) => (
 <div key={index} className="grid grid-cols-12 gap-3 items-center group">
 <div className="col-span-6">
 <input 
 placeholder="SKU / Product Vector"
 className="w-full bg-openpos-bg-subtle border-none rounded-xl px-4 py-2.5 text-[12px] font-bold text-admin-value outline-none ring-1 ring-openpos-border group-focus-within:ring-openpos-blue/30 transition-all"
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
 className="w-full bg-openpos-bg-subtle border-none rounded-xl px-3 py-2.5 text-[12px] font-bold text-admin-value outline-none ring-1 ring-openpos-border"
 value={item.quantity}
 onChange={(e) => {
 const newItems = [...formData.items]
 newItems[index].quantity = parseInt(e.target.value) || 0
 setFormData(prev => ({ ...prev, items: newItems }))
 }}
 />
 </div>
 <div className="col-span-3">
 <div className="relative">
 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-admin-dim">KES</span>
 <input 
 type="number"
 placeholder="0.00"
 className="w-full bg-openpos-bg-subtle border-none rounded-xl pl-10 pr-3 py-2.5 text-[12px] font-bold text-admin-value outline-none ring-1 ring-openpos-border"
 value={item.price}
 onChange={(e) => {
 const newItems = [...formData.items]
 newItems[index].price = parseFloat(e.target.value) || 0
 setFormData(prev => ({ ...prev, items: newItems }))
 }}
 />
 </div>
 </div>
 <div className="col-span-1">
 <button onClick={() => removeItem(index)} className="text-admin-dim p-2 rounded-lg transition-all">
 <X size={16} />
 </button>
 </div>
 </div>
 ))}
 </div>
 </div>

 <div className="p-5 bg-openpos-bg-subtle border border-openpos-border rounded-2xl flex items-center justify-between">
 <div className="flex flex-col">
 <span className="text-[10px] font-bold text-admin-dim uppercase tracking-widest">Aggregate Settlement Total</span>
 <span className="text-2xl font-bold text-openpos-blue mt-1">KES {formData.items.reduce((sum, item) => sum + (item.quantity * item.price), 0).toLocaleString()}</span>
 </div>
 <div className="flex items-center gap-2">
 <div className="w-10 h-10 rounded-full bg-openpos-blue/10 flex items-center justify-center text-openpos-blue">
 <DollarSign size={20} />
 </div>
 </div>
 </div>
 </div>
 </Modal>

 {/* Decommission Confirmation Modal */}
 <Modal
 isOpen={showDeleteModal}
 onClose={() => setShowDeleteModal(false)}
 title="Decommission Order Record"
 description={`Are you sure you want to remove procurement reference"${deletingPurchase?.reference}"?`}
 type="danger"
 icon={Trash2}
 confirmText="Delete"
 confirmCountdown={5}
 onConfirm={confirmDelete}
 >
 <div className="p-4 bg-openpos-red/5 rounded-2xl border border-openpos-red/10">
 <p className="text-[12px] text-openpos-red font-bold uppercase tracking-tight leading-relaxed opacity-80">
 This action will permanently purge this procurement record from the financial ledger. This operation cannot be reversed.
 </p>
 </div>
 </Modal>
 </div>
 )
}
