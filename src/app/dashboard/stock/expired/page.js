"use client"

import React, { useState } from 'react'
import { 
    Package, Search, Trash2, Calendar, 
    MoreVertical, AlertCircle, History,
    Ban, Info
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Mock Data
const expiredData = [
    { id: 9, name: 'Thermal Receipt Paper (Roll)', category: 'Consumables', expiredOn: '2026-03-15', stock: 5, value: 1200 },
    { id: 10, name: 'Cleaning Solvent 500ml', category: 'Maintenance', expiredOn: '2026-04-20', stock: 2, value: 3500 },
]

export default function ExpiredPage() {
    const [searchTerm, setSearchTerm] = useState('')

    const filteredStock = expiredData.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-admin-value uppercase">Expired Inventory</h1>
                    <p className="text-admin-label mt-1">Manage and write-off products past their shelf life.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="bg-openpos-bg-subtle text-admin-dim px-5 py-2.5 rounded-xl font-bold text-[12px] uppercase flex items-center gap-2 hover:text-openpos-red hover:bg-openpos-red/5 transition-all">
                        <Trash2 size={16} /> Write-off All
                    </button>
                </div>
            </div>

            {/* Warning Banner */}
            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                    <AlertCircle size={20} />
                </div>
                <div>
                    <p className="text-[13px] font-bold text-orange-700 uppercase tracking-widest">Expiration Tracking</p>
                    <p className="text-[12px] text-orange-600 font-medium">The following items have reached or passed their expiration dates and should be removed from active stock to maintain quality standards.</p>
                </div>
            </div>

            {/* List */}
            <div className="bg-white border border-openpos-border rounded-[2rem] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-openpos-bg-subtle/30 text-[10px] font-bold text-admin-dim uppercase tracking-widest">
                                <th className="px-6 py-4">Product Name</th>
                                <th className="px-6 py-4">Expired On</th>
                                <th className="px-6 py-4">Quantity Left</th>
                                <th className="px-6 py-4">Loss Value</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-openpos-border">
                            {filteredStock.length > 0 ? filteredStock.map((item) => (
                                <tr key={item.id} className="group hover:bg-orange-50/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                                                <Ban size={20} />
                                            </div>
                                            <div>
                                                <p className="text-[14px] font-bold text-admin-value">{item.name}</p>
                                                <p className="text-[11px] text-admin-dim">{item.category}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-openpos-red">
                                            <Calendar size={14} />
                                            <span className="text-[14px] font-bold">{new Date(item.expiredOn).toLocaleDateString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-[14px] font-bold text-admin-value">{item.stock} Units</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-[14px] font-bold text-openpos-red">KES {item.value.toLocaleString()}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 text-admin-dim hover:text-openpos-red hover:bg-openpos-red/5 rounded-lg transition-all">
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="p-10 text-center">
                                        <div className="flex flex-col items-center gap-2 opacity-50">
                                            <History size={48} className="text-admin-dim" />
                                            <p className="text-[14px] font-bold text-admin-dim uppercase">No expired products found</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
