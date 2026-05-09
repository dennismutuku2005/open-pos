"use client"

import React, { useState } from'react'
import { 
 Plus, Search, Edit2, Trash2, Layers, 
 ImageIcon, X, LayoutGrid, List,
 Download, Upload, Tag
} from'lucide-react'
import Image from'next/image'
import { cn } from'@/lib/utils'
import { toast } from'sonner'
import { Modal } from'@/components/Modal'
import { generateReport, generateExcelReport } from'@/lib/pdf'

import { Card } from'@/components/Card'

// Mock Data
const initialCategories = [
 { id: 1, name:'Breads', type:'Product', count: 45, image:'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80', desc:'Freshly baked artisan breads.'},
 { id: 2, name:'Cakes', type:'Product', count: 12, image:'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&q=80', desc:'Custom and ready-made cakes for all occasions.'},
 { id: 3, name:'Delivery', type:'Service', count: 0, image:'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=400&q=80', desc:'Logistics and delivery services.'},
]

export default function CategoriesPage() {
 const [categories, setCategories] = useState(initialCategories)
 const [showAddModal, setShowAddModal] = useState(false)
 const [showDeleteModal, setShowDeleteModal] = useState(false)
 const [editingCategory, setEditingCategory] = useState(null)
 const [deletingCategory, setDeletingCategory] = useState(null)
 const [formData, setFormData] = useState({
 name:'',
 type:'Product',
 desc:'',
 image:''
 })

 const handleInputChange = (e) => {
 const { name, value } = e.target
 setFormData(prev => ({ ...prev, [name]: value }))
 }

 const handleImageUpload = (e) => {
 const file = e.target.files[0]
 if (file) {
 if (!file.type.startsWith('image/')) {
 return toast.error('Only image files are allowed!')
 }
 
 const reader = new FileReader()
 reader.onloadend = () => {
 setFormData(prev => ({ ...prev, image: reader.result }))
 toast.success('Image uploaded successfully')
 }
 reader.readAsDataURL(file)
 }
 }

 const handleSave = () => {
 if (!formData.name) return toast.error('Category name is required')
 
 if (editingCategory) {
 setCategories(prev => prev.map(c => c.id === editingCategory.id ? { ...formData, id: c.id, count: c.count } : c))
 toast.success('Category updated')
 } else {
 setCategories(prev => [{ ...formData, id: Date.now(), count: 0 }, ...prev])
 toast.success('Category created')
 }
 setShowAddModal(false)
 resetForm()
 }

 const resetForm = () => {
 setFormData({ name:'', type:'Product', desc:'', image:''})
 setEditingCategory(null)
 }

 const handleEdit = (cat) => {
 setEditingCategory(cat)
 setFormData(cat)
 setShowAddModal(true)
 }

 const handleDelete = (cat) => {
 setDeletingCategory(cat)
 setShowDeleteModal(true)
 }

 const confirmDelete = () => {
 if (!deletingCategory) return
 setCategories(prev => prev.filter(c => c.id !== deletingCategory.id))
 toast.success('Category deleted successfully')
 setShowDeleteModal(false)
 setDeletingCategory(null)
 }

 const exportCategories = (format) => {
 const columns = ["Category Name","Type","Product Count","Description"]
 const rows = categories.map(c => [c.name, c.type, c.count, c.desc])
 
 if (format ==='PDF') {
 generateReport('Category List', columns, rows)
 toast.success('Categories exported as PDF')
 } else {
 generateExcelReport('Category List', columns, rows)
 toast.success('Categories exported as Excel')
 }
 }

 return (
 <div className="space-y-6 animate-in fade-in duration-500 pb-10">
 {/* Header */}
 <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
 <div>
 <h1 className="text-xl font-bold tracking-tight text-admin-value uppercase">Categories</h1>
 <p className="text-[13px] font-medium text-admin-label mt-1">Organize your products and services into groups.</p>
 </div>
 <div className="flex items-center gap-3 w-full sm:w-auto">
 <div className="flex items-center bg-card-bg border border-openpos-border rounded-lg overflow-hidden shadow-sm">
 <button 
 onClick={() => exportCategories('PDF')}
 className="px-4 py-2.5 text-admin-dim transition-all flex items-center gap-2 border-r border-openpos-border"
 >
 <Download size={16} />
 <span className="text-[10px] font-bold uppercase tracking-widest">PDF</span>
 </button>
 <button 
 onClick={() => exportCategories('Excel')}
 className="px-4 py-2.5 text-admin-dim transition-all flex items-center gap-2"
 >
 <Upload size={16} />
 <span className="text-[10px] font-bold uppercase tracking-widest">Excel</span>
 </button>
 </div>
 <button 
 onClick={() => { resetForm(); setShowAddModal(true); }}
 className="flex-1 sm:flex-none bg-openpos-blue text-white px-5 py-2.5 rounded-lg font-bold text-[13px] flex items-center justify-center gap-2 shadow-lg shadow-openpos-blue/20 transition-all"
 >
 <Plus size={18} />
 New Category
 </button>
 </div>
 </div>

 {/* Organizational Ledger */}
 <Card 
 noPadding
 title="Management Console"
 subtitle="Active grouping of services and products inventory"
 headerAction={
 <div className="flex items-center gap-3">
 <div className="relative group">
 <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-admin-dim group-focus-within:text-openpos-blue transition-colors"size={14} />
 <input 
 placeholder="Search categories..."
 className="bg-openpos-bg-subtle border border-openpos-border rounded-lg pl-10 pr-4 py-2 text-[11px] font-bold text-admin-value outline-none w-64 transition-all"
 />
 </div>
 </div>
 }
 >
 <div className="overflow-x-auto custom-scrollbar">
 <table className="w-full text-left whitespace-nowrap border-collapse text-[11px]">
 <thead>
 <tr className="bg-openpos-bg-subtle/50 border-b border-openpos-border text-[9px] font-bold text-admin-dim uppercase tracking-widest">
 <th className="px-6 py-3">Categorization Identity</th>
 <th className="px-6 py-3 text-center">Classification</th>
 <th className="px-6 py-3 text-center">Inventory Density</th>
 <th className="px-6 py-3">Internal Specification</th>
 <th className="px-6 py-3 text-right">Management</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-openpos-border">
 {categories.map((cat) => (
 <tr key={cat.id} className="group transition-colors cursor-default">
 <td className="px-6 py-3">
 <div className="flex items-center gap-4">
 <div className="w-10 h-10 rounded-lg overflow-hidden bg-openpos-bg-subtle shrink-0 relative border border-openpos-border shadow-sm transition-transform">
 {cat.image ? (
 <Image src={cat.image} alt={cat.name} fill className="object-cover"/>
 ) : (
 <div className="w-full h-full flex items-center justify-center text-admin-dim"><Tag size={16} /></div>
 )}
 </div>
 <span className="text-[12px] font-bold text-admin-value transition-colors uppercase tracking-tight">{cat.name}</span>
 </div>
 </td>
 <td className="px-6 py-3 text-center">
 <span className={cn(
"px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest border",
 cat.type ==='Service'?"bg-openpos-blue/5 text-openpos-blue border-openpos-blue/20":"bg-openpos-blue/10 text-openpos-blue border-openpos-blue/10"
 )}>
 {cat.type}
 </span>
 </td>
 <td className="px-6 py-3 text-center">
 <div className="flex flex-col items-center">
 <span className="text-[11px] font-bold text-admin-value bg-openpos-bg-subtle px-2.5 py-1 rounded-lg border border-openpos-border shadow-sm">{cat.count.toLocaleString()}</span>
 <span className="text-[8px] font-bold text-admin-dim uppercase tracking-widest mt-1 opacity-70">Linked Items</span>
 </div>
 </td>
 <td className="px-6 py-3">
 <p className="text-[10px] text-admin-dim font-bold uppercase tracking-tight line-clamp-1 max-w-[300px] opacity-80">{cat.desc ||'No system specification defined'}</p>
 </td>
 <td className="px-6 py-3 text-right">
 <div className="flex items-center justify-end gap-1.5">
 <button 
 onClick={() => handleEdit(cat)}
 className="p-2 bg-card-bg border border-openpos-border rounded-lg text-admin-dim transition-all"
 title="Modify Group"
 >
 <Edit2 size={12} />
 </button>
 <button 
 onClick={() => handleDelete(cat)}
 className="p-2 bg-card-bg border border-openpos-border rounded-lg text-admin-dim transition-all"
 title="Purge Category"
 >
 <Trash2 size={12} />
 </button>
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </Card>

 {/* Save Modal */}
 <Modal
 isOpen={showAddModal}
 onClose={() => setShowAddModal(false)}
 title={editingCategory ?'Update Category':'New Category'}
 description="Organize your items and services"
 confirmText={editingCategory ?'Save Changes':'Create'}
 onConfirm={handleSave}
 icon={Layers}
 maxWidth="max-w-lg"
 >
 <div className="space-y-5">
 <div className="space-y-1.5">
 <label className="text-[10px] font-bold text-admin-dim uppercase tracking-widest ml-1">Category Name *</label>
 <input 
 name="name"
 value={formData.name}
 onChange={handleInputChange}
 className="w-full bg-openpos-bg-subtle border border-openpos-border rounded-lg px-4 py-3 text-[12px] font-bold outline-none transition-all"
 placeholder="e.g. Pastries"
 />
 </div>

 <div className="space-y-1.5">
 <label className="text-[10px] font-bold text-admin-dim uppercase tracking-widest ml-1">Identity Image</label>
 <div className="flex items-center gap-4 p-4 bg-openpos-bg-subtle rounded-lg border border-openpos-border">
 <div className="w-16 h-16 rounded-lg bg-card-bg border border-openpos-border overflow-hidden flex items-center justify-center shrink-0 relative group">
 {formData.image ? (
 <>
 <Image src={formData.image} alt="Preview"fill className="object-cover"/>
 <button 
 onClick={() => setFormData(prev => ({ ...prev, image:''}))}
 className="absolute inset-0 bg-black/40 opacity-0 flex items-center justify-center text-white transition-opacity"
 >
 <X size={16} />
 </button>
 </>
 ) : (
 <ImageIcon className="text-admin-dim"size={20} />
 )}
 </div>
 <div className="flex-1">
 <label className="flex flex-col items-center justify-center w-full h-12 border-2 border-dashed border-openpos-border rounded-lg cursor-pointer transition-all group">
 <div className="flex items-center gap-2">
 <Upload size={14} className="text-admin-dim transition-colors"/>
 <span className="text-[10px] font-bold text-admin-dim transition-colors uppercase tracking-widest">
 {formData.image ?'Change':'Upload File'}
 </span>
 </div>
 <input type="file"className="hidden"accept="image/*"onChange={handleImageUpload} />
 </label>
 </div>
 </div>
 </div>

 <div className="space-y-1.5">
 <label className="text-[10px] font-bold text-admin-dim uppercase tracking-widest ml-1">Category Classification</label>
 <div className="grid grid-cols-2 gap-3">
 {['Product','Service'].map(type => (
 <button 
 key={type}
 onClick={() => setFormData(prev => ({ ...prev, type }))}
 className={cn(
"py-3 rounded-lg text-[11px] font-bold border transition-all uppercase tracking-widest",
 formData.type === type 
 ?"bg-openpos-blue/10 border-openpos-blue text-openpos-blue shadow-sm"
 :"bg-openpos-bg-subtle border-transparent text-admin-dim"
 )}
 >
 {type}
 </button>
 ))}
 </div>
 </div>

 <div className="space-y-1.5">
 <label className="text-[10px] font-bold text-admin-dim uppercase tracking-widest ml-1">Internal Description</label>
 <textarea 
 name="desc"
 rows="3"
 value={formData.desc}
 onChange={handleInputChange}
 className="w-full bg-openpos-bg-subtle border border-openpos-border rounded-lg px-4 py-3 text-[12px] font-bold outline-none transition-all resize-none"
 placeholder="Brief category details..."
 />
 </div>
 </div>
 </Modal>

 {/* Delete Modal */}
 <Modal
 isOpen={showDeleteModal}
 onClose={() => setShowDeleteModal(false)}
 title="Remove Category"
 description={`Delete"${deletingCategory?.name}"?`}
 type="danger"
 icon={Trash2}
 confirmText="Delete Category"
 confirmCountdown={5}
 onConfirm={confirmDelete}
 >
 <div className="p-4 bg-openpos-red/5 border border-openpos-red/10 rounded-lg">
 <p className="text-[11px] text-openpos-red font-bold uppercase tracking-tight leading-relaxed">
 This will permanently remove the category. Products currently assigned to this category will become unclassified.
 </p>
 </div>
 </Modal>
 </div>
 )
}
