"use client"

import React, { useState } from'react'
import { 
 Package, Search, Trash2, Calendar, 
 MoreVertical, AlertCircle, History,
 Ban, Info, Edit2, Layers
} from'lucide-react'
import Image from'next/image'
import { cn } from'@/lib/utils'
import { Modal } from'@/components/Modal'
import { toast } from'sonner'

// Mock Data
const initialExpiredData = [
 { id: 9, name:'Thermal Receipt Paper (Roll)', category:'Consumables', expiredOn:'2026-03-15', stock: 5, value: 1200, image:'https://images.unsplash.com/photo-1594122230689-45899d9e6f69?w=400&q=80'},
 { id: 10, name:'Cleaning Solvent 500ml', category:'Maintenance', expiredOn:'2026-04-20', stock: 2, value: 3500, image:'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&q=80'},
]

export default function ExpiredPage() {
 const [stockData, setStockData] = useState(initialExpiredData)
 const [searchTerm, setSearchTerm] = useState('')
 const [showDeleteModal, setShowDeleteModal] = useState(false)
 const [selectedItem, setSelectedItem] = useState(null)

 const filteredStock = stockData.filter(s => 
 s.name.toLowerCase().includes(searchTerm.toLowerCase())
 )

 const handleDelete = (item) => {
 setSelectedItem(item)
 setShowDeleteModal(true)
 }

 const confirmWriteOff = () => {
 setStockData(prev => prev.filter(s => s.id !== selectedItem.id))
 toast.success('Product written off from inventory')
 setShowDeleteModal(false)
 }

 const writeOffAll = () => {
 setStockData([])
 toast.success('All expired items have been written off')
 }

 return (
 <div className="space-y-6 animate-in fade-in duration-500">
 {/* Header */}
 <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
 <div>
 <h1 className="text-xl font-bold tracking-tight text-admin-value uppercase">Expired Inventory</h1>
 <p className="text-admin-label mt-1 font-medium">Manage and write-off products past their shelf life.</p>
 </div>
 <div className="flex items-center gap-3">
 <button 
 onClick={writeOffAll}
 className="bg-openpos-bg-subtle text-admin-dim px-5 py-2.5 rounded-lg font-bold text-[12px] uppercase flex items-center gap-2 transition-all"
 >
 <Trash2 size={16} /> Write-off All
 </button>
 </div>
 </div>

 {/* List */}
 <div className="bg-card-bg border border-openpos-border rounded-[2rem] overflow-hidden shadow-sm">
 <div className="overflow-x-auto">
 <table className="w-full text-left">
 <thead>
 <tr className="bg-openpos-bg-subtle/30 text-[10px] font-bold text-admin-dim uppercase tracking-widest">
 <th className="px-6 py-3">Product Name</th>
 <th className="px-6 py-3">Expired On</th>
 <th className="px-6 py-3">Quantity Left</th>
 <th className="px-6 py-3">Loss Value</th>
 <th className="px-6 py-3 text-right">Action</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-openpos-border">
 {filteredStock.length > 0 ? filteredStock.map((item) => (
 <tr key={item.id} className="group transition-colors">
 <td className="px-6 py-3">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-lg overflow-hidden bg-openpos-bg-subtle shrink-0 relative border border-openpos-border shadow-sm">
 {item.image ? (
 <Image src={item.image} alt={item.name} fill className="object-cover"/>
 ) : (
 <div className="w-full h-full flex items-center justify-center text-admin-dim"><Package size={18} /></div>
 )}
 </div>
 <div>
 <p className="text-[14px] font-bold text-admin-value">{item.name}</p>
 <p className="text-[11px] text-admin-dim">{item.category}</p>
 </div>
 </div>
 </td>
 <td className="px-6 py-3">
 <div className="flex items-center gap-2 text-openpos-red">
 <Calendar size={14} />
 <span className="text-[14px] font-bold">{new Date(item.expiredOn).toLocaleDateString()}</span>
 </div>
 </td>
 <td className="px-6 py-3">
 <span className="text-[14px] font-bold text-admin-value">{item.stock} Units</span>
 </td>
 <td className="px-6 py-3">
 <span className="text-[14px] font-bold text-openpos-red">KES {item.value.toLocaleString()}</span>
 </td>
 <td className="px-6 py-3 text-right">
 <button onClick={() => handleDelete(item)} className="p-2 text-admin-dim rounded-lg transition-all">
 <Trash2 size={16} />
 </button>
 </td>
 </tr>
 )) : (
 <tr>
 <td colSpan="5"className="p-10 text-center">
 <div className="flex flex-col items-center gap-2 opacity-50">
 <History size={48} className="text-admin-dim"/>
 <p className="text-[14px] font-bold text-admin-dim uppercase">No expired products found</p>
 </div>
 </td>
 </tr>
 )}
 </tbody>
 </table>
 </div>
 </div>

 {/* Write-off Confirmation Modal */}
 <Modal
 isOpen={showDeleteModal}
 onClose={() => setShowDeleteModal(false)}
 title="Confirm Write-off"
 description={`Are you sure you want to write off ${selectedItem?.stock} units of ${selectedItem?.name}?`}
 type="danger"
 icon={Trash2}
 confirmText="Write-off"
 onConfirm={confirmWriteOff}
 >
 <div className="p-4 bg-openpos-red/5 rounded-lg border border-openpos-red/10">
 <p className="text-[12px] text-openpos-red font-medium">This action will record a financial loss of KES {selectedItem?.value.toLocaleString()} and remove the items from your inventory inventory permanently.</p>
 </div>
 </Modal>
 </div>
 )
}
