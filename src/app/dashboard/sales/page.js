"use client"

import React, { useState, useRef } from 'react'
import { 
    BarChart3, Calendar, Download, Filter, 
    Search, FileText, ArrowUpRight, ArrowDownRight,
    TrendingUp, DollarSign, ShoppingBag, Receipt,
    ChevronDown, Printer, BadgeCent, History,
    ArrowRightLeft, Wallet, CheckCircle2, ShoppingCart,
    Activity, Clock
} from 'lucide-react'
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts'
import { cn } from '@/lib/utils'
import { generateReport } from '@/lib/pdf'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

// Mock Data for the Sales Dashboard
const recentTransactions = [
    { id: 'SAL-001', date: 'Today, 10:30 AM', customer: 'Walking Customer', total: 2450, items: 3, payment: 'Cash' },
    { id: 'SAL-002', date: 'Today, 11:15 AM', customer: 'John Doe', total: 1500, items: 1, payment: 'M-Pesa' },
    { id: 'SAL-003', date: 'Today, 12:45 PM', customer: 'Walking Customer', total: 4275, items: 5, payment: 'Cash' },
    { id: 'SAL-004', date: 'Today, 02:20 PM', customer: 'Jane Smith', total: 850, items: 2, payment: 'Card' },
    { id: 'SAL-005', date: 'Today, 03:50 PM', customer: 'Walking Customer', total: 3120, items: 4, payment: 'M-Pesa' },
]

const todaySellingData = [
    { name: '08:00', sales: 4000 },
    { name: '10:00', sales: 3000 },
    { name: '12:00', sales: 5000 },
    { name: '14:00', sales: 4500 },
    { name: '16:00', sales: 6000 },
    { name: '18:00', sales: 8000 },
    { name: '20:00', sales: 7000 },
]

const sellingByProduct = [
    { name: 'Beef Crowich', value: 45 },
    { name: 'Croissants', value: 30 },
    { name: 'Donuts', value: 15 },
    { name: 'Others', value: 10 },
]

export default function SalesManagementPage() {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

    return (
        <div className="space-y-6 animate-in fade-in duration-500 font-figtree pb-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-admin-value uppercase">Sales Management</h1>
                    <p className="text-admin-label mt-1 font-medium">Track transaction history and daily sales performance.</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-openpos-blue" size={18} />
                        <input 
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="bg-white border border-openpos-border text-admin-value pl-11 pr-5 py-3 rounded-xl font-bold text-[12px] hover:border-openpos-blue/30 transition-all uppercase tracking-widest shadow-sm outline-none focus:ring-2 focus:ring-openpos-blue/10"
                        />
                    </div>
                </div>
            </div>

            {/* Top Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <SaleStatCard title="Today's Sales" value="KES 124,050" sub="145 Transactions" icon={DollarSign} />
                <SaleStatCard title="Average Order" value="KES 855" sub="+2% vs Yesterday" icon={ShoppingCart} />
                <SaleStatCard title="Items Sold" value="342" sub="Across all categories" icon={PackageIcon} />
                <SaleStatCard title="Net Profit" value="KES 48,200" sub="38.8% Margin" icon={TrendingUp} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sales Chart */}
                <div className="lg:col-span-2 bg-card-bg border border-openpos-border rounded-3xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-sm font-bold text-admin-value uppercase tracking-widest flex items-center gap-2">
                                <Activity size={18} className="text-openpos-blue" />
                                Sales Velocity Today
                            </h3>
                            <p className="text-[10px] text-admin-dim font-bold mt-1 uppercase tracking-widest">Real-time revenue tracking</p>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={todaySellingData}>
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--openpos-border)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: 'var(--admin-dim)'}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: 'var(--admin-dim)'}} />
                                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }} />
                                <Area type="monotone" dataKey="sales" stroke="#2563EB" strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Best Selling Categories */}
                <div className="bg-card-bg border border-openpos-border rounded-3xl p-6 shadow-sm flex flex-col">
                    <h3 className="text-sm font-bold text-admin-value uppercase tracking-widest mb-6">Top Categories</h3>
                    <div className="flex-1 space-y-6">
                        {sellingByProduct.map((p, i) => (
                            <div key={p.name} className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-[11px] font-bold text-admin-label uppercase">{p.name}</span>
                                    <span className="text-[11px] font-bold text-admin-value">{p.value}%</span>
                                </div>
                                <div className="h-2 bg-openpos-bg-subtle rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${p.value}%` }}
                                        className={cn(
                                            "h-full rounded-full",
                                            i === 0 ? "bg-openpos-blue" : "bg-openpos-blue/40"
                                        )}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-8 p-4 bg-openpos-blue/5 rounded-2xl border border-openpos-blue/10">
                        <p className="text-[10px] font-bold text-openpos-blue uppercase tracking-widest mb-1">Observation</p>
                        <p className="text-[12px] text-admin-dim font-medium leading-relaxed">
                            Beef Crowich is your star performer today, contributing nearly half of your revenue.
                        </p>
                    </div>
                </div>
            </div>

            {/* Sales List */}
            <div className="bg-card-bg border border-openpos-border rounded-3xl overflow-hidden shadow-sm">
                <div className="p-6 border-b border-openpos-border flex items-center justify-between bg-openpos-bg-subtle/20">
                    <h3 className="text-sm font-bold text-admin-value uppercase tracking-widest flex items-center gap-2">
                        <History size={18} className="text-openpos-blue" />
                        Transactions List
                    </h3>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-dim" size={14} />
                            <input placeholder="Search orders..." className="bg-white border border-openpos-border rounded-xl pl-9 pr-4 py-2 text-[12px] font-medium outline-none focus:ring-1 focus:ring-openpos-blue/30 w-64 transition-all" />
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-openpos-bg-subtle/30">
                                <th className="p-5 text-[10px] uppercase font-bold text-admin-dim tracking-widest">Sale ID</th>
                                <th className="p-5 text-[10px] uppercase font-bold text-admin-dim tracking-widest">Time</th>
                                <th className="p-5 text-[10px] uppercase font-bold text-admin-dim tracking-widest">Items</th>
                                <th className="p-5 text-[10px] uppercase font-bold text-admin-dim tracking-widest">Payment</th>
                                <th className="p-5 text-[10px] uppercase font-bold text-admin-dim tracking-widest text-right">Total</th>
                                <th className="p-5"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-openpos-border">
                            {recentTransactions.map((sale) => (
                                <tr key={sale.id} className="group hover:bg-openpos-bg-subtle/50 transition-colors">
                                    <td className="p-5 text-[13px] font-bold text-admin-value">{sale.id}</td>
                                    <td className="p-5 text-[12px] font-medium text-admin-dim flex items-center gap-2">
                                        <Clock size={12} />
                                        {sale.date}
                                    </td>
                                    <td className="p-5 text-[13px] font-bold text-admin-value">{sale.items} items</td>
                                    <td className="p-5">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-openpos-blue/10 text-openpos-blue">
                                            {sale.payment}
                                        </span>
                                    </td>
                                    <td className="p-5 text-right font-bold text-admin-value">KES {sale.total.toLocaleString()}</td>
                                    <td className="p-5 text-right">
                                        <button className="p-2 text-admin-dim hover:text-openpos-blue hover:bg-openpos-blue/10 rounded-lg transition-all">
                                            <Printer size={16} />
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

function SaleStatCard({ title, value, sub, icon: Icon }) {
    return (
        <div className="bg-white border border-openpos-border rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-openpos-blue/5 text-openpos-blue flex items-center justify-center">
                    <Icon size={20} />
                </div>
                <ArrowUpRight size={16} className="text-openpos-blue" />
            </div>
            <p className="text-[10px] font-bold text-admin-dim uppercase tracking-widest mb-1">{title}</p>
            <h4 className="text-[20px] font-bold text-admin-value tracking-tight mb-1">{value}</h4>
            <p className="text-[11px] text-admin-dim font-medium">{sub}</p>
        </div>
    )
}

function PackageIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M16.5 9.4 7.5 4.21" />
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
            <polyline points="3.29 7 12 12 20.71 7" />
            <line x1="12" y1="22" x2="12" y2="12" />
        </svg>
    )
}
