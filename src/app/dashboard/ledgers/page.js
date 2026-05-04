"use client"

import React, { useState } from 'react'
import { Search, Filter, ArrowUpRight, ArrowDownRight, Users, Briefcase, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

const mockLedger = [
    { id: 'TRX-001', date: '2024-05-01', description: 'Payment Received', type: 'Credit', amount: 15000, balance: 15000, entity: 'John Doe (Customer)' },
    { id: 'TRX-002', date: '2024-05-02', description: 'Supplier Payment', type: 'Debit', amount: 5000, balance: 10000, entity: 'Tech Supply Co.' },
    { id: 'TRX-003', date: '2024-05-03', description: 'Credit Sale', type: 'Debit', amount: 8500, balance: 18500, entity: 'Jane Smith (Customer)' },
    { id: 'TRX-004', date: '2024-05-04', description: 'Refund Issued', type: 'Debit', amount: 1200, balance: 17300, entity: 'John Doe (Customer)' },
]

export default function LedgersPage() {
    const [activeTab, setActiveTab] = useState('customers')

    return (
        <div className="space-y-6 animate-in fade-in duration-500 font-figtree">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-admin-value">Ledgers</h1>
                    <p className="text-admin-label mt-1">Manage customer and supplier financial accounts.</p>
                </div>
                <div className="flex bg-openpos-bg-subtle p-1 rounded-xl">
                    <button 
                        onClick={() => setActiveTab('customers')}
                        className={cn(
                            "px-6 py-2 rounded-lg font-bold text-[12px] uppercase tracking-widest transition-all",
                            activeTab === 'customers' ? "bg-white text-openpos-blue shadow-sm" : "text-admin-dim"
                        )}
                    >
                        Customers
                    </button>
                    <button 
                        onClick={() => setActiveTab('suppliers')}
                        className={cn(
                            "px-6 py-2 rounded-lg font-bold text-[12px] uppercase tracking-widest transition-all",
                            activeTab === 'suppliers' ? "bg-white text-openpos-blue shadow-sm" : "text-admin-dim"
                        )}
                    >
                        Suppliers
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-openpos-border rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-openpos-green/10 flex items-center justify-center text-openpos-green">
                            <ArrowUpRight size={16} />
                        </div>
                        <h3 className="text-[12px] font-bold text-admin-dim uppercase tracking-widest">Total Receivables</h3>
                    </div>
                    <p className="text-2xl font-bold text-admin-value">KES 145,000</p>
                </div>
                <div className="bg-white border border-openpos-border rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-openpos-red/10 flex items-center justify-center text-openpos-red">
                            <ArrowDownRight size={16} />
                        </div>
                        <h3 className="text-[12px] font-bold text-admin-dim uppercase tracking-widest">Total Payables</h3>
                    </div>
                    <p className="text-2xl font-bold text-admin-value">KES 42,500</p>
                </div>
                <div className="bg-white border border-openpos-border rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-openpos-blue/10 flex items-center justify-center text-openpos-blue">
                            <FileText size={16} />
                        </div>
                        <h3 className="text-[12px] font-bold text-admin-dim uppercase tracking-widest">Active Accounts</h3>
                    </div>
                    <p className="text-2xl font-bold text-admin-value">24</p>
                </div>
            </div>

            {/* Ledger Table */}
            <div className="bg-white rounded-2xl border border-openpos-border shadow-sm overflow-hidden">
                <div className="p-4 border-b border-openpos-border flex flex-col md:flex-row items-center gap-4 justify-between">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-dim" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search transactions or entities..." 
                            className="w-full bg-openpos-bg-subtle border-none rounded-xl pl-10 pr-4 py-2 text-[13px] outline-none"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-openpos-bg-subtle text-admin-value rounded-xl text-[12px] font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors">
                        <Filter size={16} />
                        Filter
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-openpos-bg-subtle/30 border-b border-openpos-border">
                                <th className="p-4 text-[10px] uppercase tracking-widest font-bold text-admin-dim">Date & ID</th>
                                <th className="p-4 text-[10px] uppercase tracking-widest font-bold text-admin-dim">Entity</th>
                                <th className="p-4 text-[10px] uppercase tracking-widest font-bold text-admin-dim">Description</th>
                                <th className="p-4 text-[10px] uppercase tracking-widest font-bold text-admin-dim">Type</th>
                                <th className="p-4 text-[10px] uppercase tracking-widest font-bold text-admin-dim text-right">Amount</th>
                                <th className="p-4 text-[10px] uppercase tracking-widest font-bold text-admin-dim text-right">Balance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-openpos-border">
                            {mockLedger.map(trx => (
                                <tr key={trx.id} className="hover:bg-openpos-bg-subtle transition-colors">
                                    <td className="p-4">
                                        <div className="flex flex-col">
                                            <span className="text-[12px] font-bold text-admin-value">{trx.date}</span>
                                            <span className="text-[10px] font-mono text-admin-dim">{trx.id}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="text-[13px] font-bold text-admin-value">{trx.entity}</span>
                                    </td>
                                    <td className="p-4">
                                        <span className="text-[12px] text-admin-dim">{trx.description}</span>
                                    </td>
                                    <td className="p-4">
                                        <span className={cn(
                                            "px-2 py-1 text-[10px] font-bold rounded-md uppercase tracking-wider",
                                            trx.type === 'Credit' ? "bg-openpos-green/10 text-openpos-green" : "bg-openpos-red/10 text-openpos-red"
                                        )}>
                                            {trx.type}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <span className="text-[13px] font-bold text-admin-value">KES {trx.amount}</span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <span className="text-[13px] font-bold text-openpos-blue">KES {trx.balance}</span>
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
