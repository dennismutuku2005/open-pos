"use client"

import React, { useState } from 'react'
import { 
    Package, Search, Filter, ArrowUpRight, 
    MoreVertical, Download, Printer, CheckCircle2,
    Clock, AlertTriangle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Modal } from '@/components/Modal'

// Mock Data
const stockData = [
    { id: 1, name: 'Logitech MX Master 3S', category: 'Accessories', stock: 12, price: 12500, value: 150000, status: 'Healthy' },
    { id: 2, name: 'USB-C Hub Multiport', category: 'Computing', stock: 24, price: 4500, value: 108000, status: 'Healthy' },
    { id: 3, name: 'Portable SSD 1TB', category: 'Storage', stock: 18, price: 15500, value: 279000, status: 'Healthy' },
    { id: 4, name: 'Webcam 4K Ultra HD', category: 'Peripherals', stock: 15, price: 18000, value: 270000, status: 'Healthy' },
    { id: 5, name: 'Bluetooth Earbuds', category: 'Audio', stock: 30, price: 6500, value: 195000, status: 'Healthy' },
]

export default function InStockPage() {
    const [searchTerm, setSearchTerm] = useState('')

    const filteredStock = stockData.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-admin-value uppercase">Products In Stock</h1>
                    <p className="text-admin-label mt-1">Real-time overview of your current inventory levels.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="bg-white border border-openpos-border text-admin-dim px-4 py-2.5 rounded-xl font-bold text-[12px] uppercase flex items-center gap-2 hover:bg-openpos-bg-subtle transition-all">
                        <Download size={16} /> Export
                    </button>
                    <button className="bg-white border border-openpos-border text-admin-dim px-4 py-2.5 rounded-xl font-bold text-[12px] uppercase flex items-center gap-2 hover:bg-openpos-bg-subtle transition-all">
                        <Printer size={16} /> Print
                    </button>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: 'Total Items', value: '99+', icon: Package, color: 'text-openpos-blue', bg: 'bg-openpos-blue/10' },
                    { label: 'Total Value', value: 'KES 1.2M', icon: CheckCircle2, color: 'text-openpos-green', bg: 'bg-openpos-green/10' },
                    { label: 'Inventory Health', value: 'Good', icon: Clock, color: 'text-purple-600', bg: 'bg-purple-100' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white border border-openpos-border rounded-2xl p-4 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", stat.bg, stat.color)}>
                                <stat.icon size={22} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-admin-dim uppercase tracking-widest">{stat.label}</p>
                                <p className="text-[18px] font-bold text-admin-value">{stat.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Inventory Table */}
            <div className="bg-white border border-openpos-border rounded-[2rem] overflow-hidden shadow-sm">
                <div className="p-5 border-b border-openpos-border flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-admin-dim" size={16} />
                        <input 
                            placeholder="Search in stock..." 
                            className="w-full bg-openpos-bg-subtle border-none rounded-xl pl-11 pr-4 py-2.5 text-[13px] font-medium outline-none ring-1 ring-transparent focus:ring-openpos-blue/20 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-openpos-bg-subtle text-admin-dim rounded-xl font-bold text-[12px] uppercase">
                        <Filter size={16} /> Filters
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-openpos-bg-subtle/30 text-[10px] font-bold text-admin-dim uppercase tracking-widest">
                                <th className="px-6 py-4">Product Details</th>
                                <th className="px-6 py-4">Quantity</th>
                                <th className="px-6 py-4">Unit Price</th>
                                <th className="px-6 py-4">Stock Value</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-openpos-border">
                            {filteredStock.map((item) => (
                                <tr key={item.id} className="group hover:bg-openpos-bg-subtle/20 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-openpos-bg-subtle flex items-center justify-center text-openpos-blue">
                                                <Package size={20} />
                                            </div>
                                            <div>
                                                <p className="text-[14px] font-bold text-admin-value">{item.name}</p>
                                                <p className="text-[11px] text-admin-dim">{item.category}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-[14px] font-bold text-admin-value">{item.stock} Units</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-[14px] font-medium text-admin-label">KES {item.price.toLocaleString()}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-[14px] font-bold text-openpos-blue">KES {item.value.toLocaleString()}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-openpos-green" />
                                            <span className="text-[11px] font-bold text-openpos-green uppercase">{item.status}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 text-admin-dim hover:text-openpos-blue hover:bg-openpos-blue/10 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                                            <MoreVertical size={16} />
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
