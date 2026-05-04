"use client"

import React, { useState, useEffect } from 'react'
import { 
    Plus, Search, Filter, MoreVertical, 
    Edit2, Trash2, Package, Barcode,
    DollarSign, Calendar, ImageIcon,
    Download, Upload, ChevronRight, X,
    AlertTriangle, ShoppingBag, Info, Printer
} from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { Modal } from '@/components/Modal'
import { generateReport, generateExcelReport } from '@/lib/pdf'
import { jsPDF } from 'jspdf'

// Mock Data
const initialProducts = [
    { id: 1, name: 'Logitech MX Master 3S', category: 'Accessories', buyPrice: 8500, sellPrice: 12500, stock: 45, expiry: '2026-12-20', barcode: '8901234567890', image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&q=80', desc: 'Advanced wireless mouse with silent clicks and 8K DPI tracking.' },
    { id: 2, name: 'USB-C Hub Multiport', category: 'Computing', buyPrice: 2800, sellPrice: 4500, stock: 22, expiry: '2025-11-15', barcode: '8901234567891', image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&q=80', desc: '7-in-1 USB C adapter with 4K HDMI, 100W PD, and SD card reader.' },
    { id: 3, name: 'Portable SSD 1TB', category: 'Storage', buyPrice: 11000, sellPrice: 15500, stock: 18, expiry: '2027-07-10', barcode: '8901234567892', image: 'https://images.unsplash.com/photo-1597872200370-493dea23936a?w=400&q=80', desc: 'High-speed external solid state drive with up to 1050MB/s read speed.' },
    { id: 4, name: 'Mechanical Keyboard', category: 'Accessories', buyPrice: 5500, sellPrice: 8900, stock: 12, expiry: '2026-06-30', barcode: '8901234567893', image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400&q=80', desc: 'Hot-swappable mechanical keyboard with RGB backlighting and blue switches.' },
    { id: 5, name: 'Webcam 4K Ultra HD', category: 'Peripherals', buyPrice: 12000, sellPrice: 18000, stock: 15, expiry: '2025-08-12', barcode: '8901234567894', image: 'https://images.unsplash.com/photo-1610483178766-8092dcc6f36a?w=400&q=80', desc: 'Professional webcam for streaming and video conferencing with dual mics.' },
    { id: 6, name: 'Bluetooth Earbuds', category: 'Audio', buyPrice: 4000, sellPrice: 6500, stock: 25, expiry: '2026-06-25', barcode: '8901234567895', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80', desc: 'True wireless earbuds with active noise cancellation and 24hr battery.' },
    { id: 7, name: 'Monitor Arm Mount', category: 'Furniture', buyPrice: 4500, sellPrice: 7200, stock: 30, expiry: '2027-07-05', barcode: '8901234567896', image: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=400&q=80', desc: 'Single monitor desk mount for screens up to 32 inches.' },
    { id: 8, name: 'Smart Watch Series 9', category: 'Wearables', buyPrice: 32000, sellPrice: 42000, stock: 5, expiry: '2025-06-18', barcode: '8901234567897', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80', desc: 'Latest smartwatch with fitness tracking, heart rate monitor and GPS.' },
]

const categories = ['Accessories', 'Computing', 'Storage', 'Peripherals', 'Audio', 'Furniture', 'Wearables', 'Mobile']

export default function ProductsPage() {
    const [products, setProducts] = useState(initialProducts)
    const [searchQuery, setSearchQuery] = useState('')
    const [showFormModal, setShowFormModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [editingProduct, setEditingProduct] = useState(null)
    const [deletingProduct, setDeletingProduct] = useState(null)
    
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        buyPrice: '',
        sellPrice: '',
        stock: '',
        hasExpiry: false,
        expiry: '',
        barcode: '',
        desc: '',
        image: '',
        discount: ''
    })

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({ 
            ...prev, 
            [name]: type === 'checkbox' ? checked : value 
        }))
    }

    const handleImageUpload = (e) => {
        const file = e.target.files[0]
        if (file) {
            // Check if it's an image
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

    const generateBarcode = () => {
        const randomBarcode = Math.floor(1000000000000 + Math.random() * 9000000000000).toString()
        setFormData(prev => ({ ...prev, barcode: randomBarcode }))
        toast.info('Barcode generated')
    }

    const handleSave = () => {
        if (!formData.name || !formData.category || !formData.sellPrice) {
            return toast.error('Please fill in required fields')
        }

        if (editingProduct) {
            setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...formData, id: p.id } : p))
            toast.success('Product updated')
        } else {
            const newProduct = { ...formData, id: Date.now() }
            setProducts(prev => [newProduct, ...prev])
            toast.success('Product added')
        }

        setShowFormModal(false)
        resetForm()
    }

    const resetForm = () => {
        setFormData({
            name: '',
            category: '',
            buyPrice: '',
            sellPrice: '',
            stock: '',
            hasExpiry: false,
            expiry: '',
            barcode: '',
            desc: '',
            image: '',
            discount: ''
        })
        setEditingProduct(null)
    }

    const handleEdit = (product) => {
        setEditingProduct(product)
        setFormData(product)
        setShowFormModal(true)
    }

    const handleDelete = (product) => {
        setDeletingProduct(product)
        setShowDeleteModal(true)
    }

    const confirmDelete = () => {
        if (!deletingProduct) return
        setProducts(prev => prev.filter(p => p.id !== deletingProduct.id))
        toast.success('Product removed from inventory')
        setShowDeleteModal(false)
        setDeletingProduct(null)
    }

    const exportProducts = (format) => {
        const columns = ["Product Name", "Barcode", "Category", "Buy Price", "Sell Price", "Stock"]
        const rows = products.map(p => [p.name, p.barcode, p.category, p.buyPrice, p.sellPrice, p.stock])
        
        if (format === 'PDF') {
            generateReport('Inventory List', columns, rows)
            toast.success('Inventory exported as PDF')
        } else {
            generateExcelReport('Inventory List', columns, rows)
            toast.success('Inventory exported as Excel')
        }
    }

    const printBarcode = (product) => {
        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: [50, 30] // Small label size
        });
        
        doc.setFontSize(10)
        doc.setFont('helvetica', 'bold')
        doc.text(product.name, 25, 8, { align: 'center' })
        
        // Mock barcode lines
        doc.setLineWidth(0.5)
        for(let i=0; i<30; i++) {
            if (Math.random() > 0.3) {
                doc.line(10 + i, 12, 10 + i, 22)
            }
        }
        
        doc.setFontSize(8)
        doc.setFont('helvetica', 'normal')
        doc.text(product.barcode, 25, 26, { align: 'center' })
        
        doc.autoPrint()
        window.open(doc.output('bloburl'), '_blank')
        toast.success(`Printing barcode for ${product.name}...`)
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 font-figtree">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-admin-value">Products Management</h1>
                    <p className="text-admin-label mt-1 font-medium text-[13px]">Manage your inventory, prices, and stock levels.</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="flex items-center bg-card-bg border border-openpos-border rounded-xl overflow-hidden shadow-sm">
                        <button 
                            onClick={() => exportProducts('PDF')}
                            className="px-4 py-2.5 text-admin-dim hover:text-openpos-blue hover:bg-openpos-blue/5 transition-all flex items-center gap-2 border-r border-openpos-border"
                        >
                            <Download size={16} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">PDF</span>
                        </button>
                        <button 
                            onClick={() => exportProducts('Excel')}
                            className="px-4 py-2.5 text-admin-dim hover:text-openpos-blue hover:bg-openpos-blue/5 transition-all flex items-center gap-2"
                        >
                            <Upload size={16} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Excel</span>
                        </button>
                    </div>
                    <button 
                        onClick={() => { resetForm(); setShowFormModal(true); }}
                        className="flex-1 sm:flex-none bg-openpos-blue text-white px-5 py-3 rounded-xl font-bold text-[12px] flex items-center justify-center gap-2 shadow-lg shadow-openpos-blue/20 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest"
                    >
                        <Plus size={18} />
                        Add Product
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-card-bg border border-openpos-border rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-dim" size={16} />
                    <input 
                        type="text"
                        placeholder="Search products by name or barcode..."
                        className="w-full bg-openpos-bg-subtle border-none rounded-xl pl-10 pr-4 py-2.5 text-[13px] font-medium focus:ring-1 focus:ring-openpos-blue/30 outline-none transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <select className="flex-1 md:w-48 bg-openpos-bg-subtle border-none rounded-xl px-4 py-2.5 text-[13px] font-bold outline-none">
                        <option>All Categories</option>
                        {categories.map(c => <option key={c}>{c}</option>)}
                    </select>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-card-bg border border-openpos-border rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-openpos-bg-subtle/50 border-b border-openpos-border">
                                <th className="py-3 px-6 text-[10px] uppercase tracking-widest font-bold text-admin-dim">Product</th>
                                <th className="py-3 px-6 text-[10px] uppercase tracking-widest font-bold text-admin-dim">Category</th>
                                <th className="py-3 px-6 text-[10px] uppercase tracking-widest font-bold text-admin-dim">Prices</th>
                                <th className="py-3 px-6 text-[10px] uppercase tracking-widest font-bold text-admin-dim">Stock</th>
                                <th className="py-3 px-6 text-[10px] uppercase tracking-widest font-bold text-admin-dim">Expiry</th>
                                <th className="py-3 px-6 text-[10px] uppercase tracking-widest font-bold text-admin-dim text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-openpos-border">
                            {products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.barcode.includes(searchQuery)).map((product) => (
                                <tr key={product.id} className="group hover:bg-openpos-bg-subtle transition-colors">
                                    <td className="py-2.5 px-6">
                                         <div className="flex items-center gap-4">
                                             <div className="w-10 h-10 rounded-xl overflow-hidden bg-openpos-bg-subtle relative shrink-0 border border-openpos-border shadow-sm">
                                                 {product.image ? (
                                                     <Image src={product.image} alt={product.name} fill className="object-cover" />
                                                 ) : (
                                                     <div className="w-full h-full flex items-center justify-center text-admin-dim"><Tag size={18} /></div>
                                                 )}
                                             </div>
                                             <div>
                                                 <p className="text-[13px] font-semibold text-admin-value">{product.name}</p>
                                                 <div className="flex items-center gap-2 mt-0.5">
                                                     <Barcode size={10} className="text-admin-dim" />
                                                     <span className="text-[9px] font-medium text-admin-dim">{product.barcode}</span>
                                                 </div>
                                             </div>
                                         </div>
                                     </td>
                                     <td className="py-2.5 px-6">
                                         <span className="px-2 py-0.5 bg-openpos-blue/10 text-openpos-blue text-[9px] font-semibold rounded-md uppercase tracking-wider">
                                             {product.category}
                                         </span>
                                     </td>
                                     <td className="py-2.5 px-6">
                                         <div className="flex flex-col gap-0.5">
                                             <div className="flex items-center justify-between text-[10px] font-medium">
                                                 <span className="text-admin-dim uppercase tracking-widest text-[8px]">Buy</span>
                                                 <span className="text-admin-value">KES {product.buyPrice}</span>
                                             </div>
                                             <div className="flex items-center justify-between text-[12px] font-semibold">
                                                 <span className="text-admin-dim uppercase tracking-widest text-[8px]">Sell</span>
                                                 <span className="text-openpos-blue">KES {product.sellPrice}</span>
                                             </div>
                                         </div>
                                     </td>
                                     <td className="py-2.5 px-6">
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center gap-2">
                                                <span className={cn(
                                                    "text-[15px] font-semibold",
                                                    product.stock < 10 ? "text-openpos-red" : "text-admin-value"
                                                )}>{product.stock}</span>
                                                <span className="text-[10px] font-medium text-admin-dim uppercase tracking-widest">In Stock</span>
                                            </div>
                                            <div className="w-20 h-1 bg-openpos-bg-subtle rounded-full overflow-hidden">
                                                <div 
                                                    className={cn("h-full transition-all", product.stock < 10 ? "bg-openpos-red" : "bg-openpos-blue")} 
                                                    style={{ width: `${Math.min(100, (product.stock / 50) * 100)}%` }} 
                                                />
                                            </div>
                                        </div>
                                    </td>
                                     <td className="py-2.5 px-6">
                                        <div className="flex flex-col">
                                            <span className={cn(
                                                "text-[12px] font-semibold",
                                                product.hasExpiry ? "text-admin-value" : "text-admin-dim"
                                            )}>
                                                {product.hasExpiry ? product.expiry : 'No Expiry'}
                                            </span>
                                            {product.hasExpiry && <span className="text-[9px] text-admin-dim uppercase">Expires</span>}
                                        </div>
                                    </td>
                                    <td className="py-2.5 px-6 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button onClick={() => printBarcode(product)} className="p-1.5 text-admin-dim hover:text-openpos-blue hover:bg-openpos-blue/5 rounded-lg transition-all" title="Print Barcode"><Printer size={14} /></button>
                                            <button onClick={() => handleEdit(product)} className="p-1.5 text-admin-dim hover:text-openpos-blue hover:bg-openpos-blue/5 rounded-lg transition-all"><Edit2 size={14} /></button>
                                            <button onClick={() => handleDelete(product)} className="p-1.5 text-admin-dim hover:text-openpos-red hover:bg-openpos-red/5 rounded-lg transition-all"><Trash2 size={14} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Product Form Modal */}
            <Modal
                isOpen={showFormModal}
                onClose={() => setShowFormModal(false)}
                title={editingProduct ? 'Edit Product' : 'Add New Product'}
                description="Manage your inventory item details"
                confirmText={editingProduct ? 'Update Product' : 'Create Product'}
                onConfirm={handleSave}
                maxWidth="max-w-2xl"
                type="primary"
                icon={ShoppingBag}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 py-2">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-admin-label uppercase tracking-widest ml-1">Product Name *</label>
                        <div className="relative">
                            <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-admin-dim" size={16} />
                            <input 
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full bg-openpos-bg-subtle border-none rounded-2xl pl-12 pr-4 py-3 text-[13px] font-bold outline-none ring-1 ring-openpos-border focus:ring-openpos-blue/30"
                                placeholder="e.g. Sourdough Loaf"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-admin-label uppercase tracking-widest ml-1">Category *</label>
                        <select 
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="w-full bg-openpos-bg-subtle border-none rounded-2xl px-4 py-3 text-[13px] font-bold outline-none ring-1 ring-openpos-border focus:ring-openpos-blue/30"
                        >
                            <option value="">Select Category</option>
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    <div className="md:col-span-2 space-y-1.5">
                        <label className="text-[10px] font-bold text-admin-label uppercase tracking-widest ml-1">Product Image</label>
                        <div className="flex items-center gap-4 p-4 bg-openpos-bg-subtle rounded-2xl ring-1 ring-openpos-border">
                            <div className="w-16 h-16 rounded-xl bg-card-bg border border-openpos-border overflow-hidden flex items-center justify-center shrink-0 relative group">
                                {formData.image ? (
                                    <>
                                        <Image src={formData.image} alt="Preview" fill className="object-cover" />
                                        <button 
                                            onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                                            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                                        >
                                            <X size={16} />
                                        </button>
                                    </>
                                ) : (
                                    <ImageIcon className="text-admin-dim" size={20} />
                                )}
                            </div>
                            <div className="flex-1">
                                <label className="flex flex-col items-center justify-center w-full h-12 border-2 border-dashed border-openpos-border rounded-xl cursor-pointer hover:bg-card-bg transition-all group">
                                    <div className="flex items-center gap-2">
                                        <Upload size={14} className="text-admin-dim group-hover:text-openpos-blue transition-colors" />
                                        <span className="text-[11px] font-bold text-admin-dim group-hover:text-admin-value transition-colors uppercase tracking-widest">
                                            {formData.image ? 'Change Image' : 'Upload from PC'}
                                        </span>
                                    </div>
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        accept="image/*" 
                                        onChange={handleImageUpload}
                                    />
                                </label>
                                <p className="text-[9px] text-admin-dim mt-2 uppercase tracking-tight">Allowed: JPG, PNG, WEBP. Max size 2MB.</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-admin-label uppercase tracking-widest ml-1">Buying Price (KES)</label>
                        <input 
                            name="buyPrice"
                            type="number"
                            value={formData.buyPrice}
                            onChange={handleInputChange}
                            className="w-full bg-openpos-bg-subtle border-none rounded-2xl px-4 py-3 text-[13px] font-bold outline-none ring-1 ring-openpos-border"
                            placeholder="0.00"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-admin-label uppercase tracking-widest ml-1">Selling Price (KES) *</label>
                        <input 
                            name="sellPrice"
                            type="number"
                            value={formData.sellPrice}
                            onChange={handleInputChange}
                            className="w-full bg-openpos-bg-subtle border-none rounded-2xl px-4 py-3 text-[13px] font-bold outline-none ring-1 ring-openpos-border focus:ring-openpos-blue/30"
                            placeholder="0.00"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-admin-label uppercase tracking-widest ml-1">Stock Level</label>
                        <input 
                            name="stock"
                            type="number"
                            value={formData.stock}
                            onChange={handleInputChange}
                            className="w-full bg-openpos-bg-subtle border-none rounded-2xl px-4 py-3 text-[13px] font-bold outline-none ring-1 ring-openpos-border focus:ring-openpos-blue/30"
                            placeholder="0"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-admin-label uppercase tracking-widest ml-1">Discount (%)</label>
                        <input 
                            name="discount"
                            type="number"
                            min="0"
                            max="100"
                            value={formData.discount}
                            onChange={handleInputChange}
                            className="w-full bg-openpos-bg-subtle border-none rounded-2xl px-4 py-3 text-[13px] font-bold outline-none ring-1 ring-openpos-border focus:ring-openpos-blue/30"
                            placeholder="e.g. 10"
                        />
                    </div>

                    <div className="md:col-span-2 space-y-4 bg-openpos-bg-subtle/50 p-4 rounded-2xl border border-openpos-border/50">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-card-bg border border-openpos-border flex items-center justify-center text-admin-dim">
                                    <Calendar size={16} />
                                </div>
                                <div>
                                    <p className="text-[11px] font-bold text-admin-value uppercase tracking-widest">Expiration Tracking</p>
                                    <p className="text-[9px] text-admin-dim font-medium uppercase mt-0.5">Track shelf-life of this product</p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    name="hasExpiry"
                                    checked={formData.hasExpiry}
                                    onChange={handleInputChange}
                                    className="sr-only peer" 
                                />
                                <div className="w-11 h-6 bg-admin-dim/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-openpos-blue"></div>
                            </label>
                        </div>

                        {formData.hasExpiry && (
                            <div className="animate-in slide-in-from-top-2 duration-300">
                                <label className="text-[10px] font-bold text-admin-label uppercase tracking-widest ml-1">Expiry Date *</label>
                                <input 
                                    name="expiry"
                                    type="date"
                                    value={formData.expiry}
                                    onChange={handleInputChange}
                                    className="w-full bg-card-bg border-none rounded-xl px-4 py-3 text-[13px] font-bold outline-none ring-1 ring-openpos-border mt-1.5 focus:ring-openpos-blue/30 transition-all"
                                    required={formData.hasExpiry}
                                />
                            </div>
                        )}
                    </div>

                    <div className="md:col-span-2 space-y-1.5">
                        <label className="text-[10px] font-bold text-admin-label uppercase tracking-widest ml-1">Barcode</label>
                        <div className="flex gap-2">
                            <input 
                                name="barcode"
                                value={formData.barcode}
                                onChange={handleInputChange}
                                className="flex-1 bg-openpos-bg-subtle border-none rounded-2xl px-4 py-3 text-[13px] font-bold outline-none ring-1 ring-openpos-border"
                                placeholder="Barcode"
                            />
                            <button 
                                onClick={generateBarcode}
                                className="bg-openpos-blue/10 text-openpos-blue font-bold text-[10px] px-6 rounded-2xl uppercase tracking-widest hover:bg-openpos-blue hover:text-white transition-all"
                            >
                                Auto
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="Delete Product"
                description={`Are you sure you want to remove "${deletingProduct?.name}"?`}
                type="danger"
                icon={Trash2}
                confirmText="Delete"
                confirmCountdown={5}
                onConfirm={confirmDelete}
            >
                <div className="p-4 bg-openpos-red/5 rounded-2xl border border-openpos-red/10">
                    <p className="text-[12px] text-openpos-red font-medium leading-relaxed">
                        This will permanently remove the product from your inventory. All historical sales data will remain, but you won't be able to sell this item anymore.
                    </p>
                </div>
            </Modal>
        </div>
    )
}

