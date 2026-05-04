"use client"

import React, { useState } from 'react'
import { 
    Package, Search, Filter, AlertCircle, 
    MoreVertical, ShoppingCart, RefreshCcw,
    XCircle, AlertTriangle
} from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

// Mock Data
const outOfStockData = [
    { id: 6, name: 'Wireless Headphones Pro', category: 'Audio', lastStock: 0, reorderPoint: 5, status: 'Out of Stock', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80' },
    { id: 7, name: '4K HDMI Cable 2m', category: 'Accessories', lastStock: 0, reorderPoint: 10, status: 'Critical', image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&q=80' },
    { id: 8, name: 'Laptop Stand Aluminum', category: 'Furniture', lastStock: 2, reorderPoint: 5, status: 'Low Stock', image: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=400&q=80' },
]

export default function OutOfStockPage() {
    const [searchTerm, setSearchTerm] = useState('')

    const filteredStock = outOfStockData.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-admin-value uppercase text-openpos-red">Stock Alerts</h1>
                    <p className="text-admin-label mt-1">Products that require immediate replenishment.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="bg-openpos-blue text-white px-5 py-2.5 rounded-xl font-bold text-[12px] uppercase flex items-center gap-2 shadow-lg shadow-openpos-blue/20 hover:scale-[1.02] transition-all">
                        <ShoppingCart size={16} /> Create Purchase Order
                    </button>
                </div>
            </div>

            {/* Warning Banner */}
            <div className="bg-openpos-red/5 border border-openpos-red/10 rounded-2xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-openpos-red/10 flex items-center justify-center text-openpos-red shrink-0">
                    <AlertTriangle size={20} />
                </div>
                <div>
                    <p className="text-[13px] font-bold text-openpos-red uppercase tracking-widest">Inventory Warning</p>
                    <p className="text-[12px] text-openpos-red/80 font-medium">You have 12 products currently out of stock or below critical levels. This may impact your sales performance.</p>
                </div>
            </div>

            {/* List */}
            <div className="bg-white border border-openpos-border rounded-[2rem] overflow-hidden shadow-sm">
                <div className="p-5 border-b border-openpos-border flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-admin-dim" size={16} />
                        <input 
                            placeholder="Search alerts..." 
                            className="w-full bg-openpos-bg-subtle border-none rounded-xl pl-11 pr-4 py-2.5 text-[13px] font-medium outline-none ring-1 ring-transparent focus:ring-openpos-red/20 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-openpos-bg-subtle/30 text-[10px] font-bold text-admin-dim uppercase tracking-widest">
                                <th className="px-6 py-4">Product</th>
                                <th className="px-6 py-4">Current Stock</th>
                                <th className="px-6 py-4">Reorder Point</th>
                                <th className="px-6 py-4">Priority</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-openpos-border">
                            {filteredStock.map((item) => (
                                <tr key={item.id} className="group hover:bg-openpos-red/[0.02] transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-openpos-bg-subtle shrink-0 relative border border-openpos-border shadow-sm">
                                                {item.image ? (
                                                    <Image src={item.image} alt={item.name} fill className="object-cover" />
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
                                    <td className="px-6 py-4">
                                        <span className="text-[14px] font-bold text-openpos-red">{item.lastStock} Units</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-[14px] font-medium text-admin-label">Min: {item.reorderPoint} Units</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5">
                                            <div className={cn(
                                                "w-1.5 h-1.5 rounded-full",
                                                item.status === 'Out of Stock' ? "bg-openpos-red" : "bg-orange-500"
                                            )} />
                                            <span className={cn(
                                                "text-[11px] font-bold uppercase",
                                                item.status === 'Out of Stock' ? "text-openpos-red" : "text-orange-500"
                                            )}>{item.status}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="bg-openpos-bg-subtle text-admin-dim hover:text-openpos-blue px-3 py-1.5 rounded-lg font-bold text-[11px] uppercase transition-all flex items-center gap-2 ml-auto">
                                            <RefreshCcw size={14} /> Restock
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
