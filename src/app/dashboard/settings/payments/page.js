"use client"

import React, { useState } from 'react'
import { Plus, Edit2, Trash2, Search, CreditCard, Banknote, Smartphone } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function PaymentTypesPage() {
    const [payments, setPayments] = useState([
        { id: 1, name: 'Cash', type: 'cash', status: 'Active', icon: Banknote },
        { id: 2, name: 'M-Pesa STK', type: 'mobile', status: 'Active', icon: Smartphone },
        { id: 3, name: 'Credit Card', type: 'card', status: 'Inactive', icon: CreditCard },
        { id: 4, name: 'Store Credit', type: 'credit', status: 'Active', icon: CreditCard }
    ])

    return (
        <div className="space-y-6 animate-in fade-in duration-500 font-figtree max-w-4xl">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-admin-value">Payment Methods</h1>
                    <p className="text-admin-label mt-1">Configure accepted payment types at checkout.</p>
                </div>
                <button className="bg-openpos-blue text-white px-5 py-3 rounded-xl font-bold text-[12px] flex items-center gap-2 shadow-lg hover:scale-[1.02] transition-all uppercase tracking-widest">
                    <Plus size={18} />
                    Add Method
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-openpos-border shadow-sm overflow-hidden">
                <div className="p-4 border-b border-openpos-border flex items-center justify-between">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-dim" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search methods..." 
                            className="w-full bg-openpos-bg-subtle border-none rounded-xl pl-10 pr-4 py-2 text-[13px] outline-none"
                        />
                    </div>
                </div>
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-openpos-bg-subtle/50 border-b border-openpos-border">
                            <th className="p-4 text-[10px] uppercase font-bold text-admin-dim tracking-widest">Method Name</th>
                            <th className="p-4 text-[10px] uppercase font-bold text-admin-dim tracking-widest">Category</th>
                            <th className="p-4 text-[10px] uppercase font-bold text-admin-dim tracking-widest">Status</th>
                            <th className="p-4 text-[10px] uppercase font-bold text-admin-dim tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-openpos-border">
                        {payments.map(method => {
                            const Icon = method.icon;
                            return (
                                <tr key={method.id} className="hover:bg-openpos-bg-subtle transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-openpos-bg-subtle flex items-center justify-center text-openpos-blue">
                                                <Icon size={20} />
                                            </div>
                                            <span className="font-bold text-[14px] text-admin-value">{method.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="text-[12px] text-admin-dim font-medium uppercase">{method.type}</span>
                                    </td>
                                    <td className="p-4">
                                        <span className={cn(
                                            "px-2.5 py-1 text-[10px] font-bold rounded-md uppercase tracking-wider",
                                            method.status === 'Active' ? "bg-openpos-blue/10 text-openpos-blue" : "bg-openpos-red/10 text-openpos-red"
                                        )}>
                                            {method.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button className="p-2 text-admin-dim hover:text-openpos-blue hover:bg-openpos-blue/5 rounded-xl transition-all">
                                                <Edit2 size={16} />
                                            </button>
                                            <button className="p-2 text-admin-dim hover:text-openpos-red hover:bg-openpos-red/5 rounded-xl transition-all">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
