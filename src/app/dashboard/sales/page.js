"use client"

import React, { useState } from 'react'
import { 
    Calendar, Search, ShoppingBag, ShoppingCart, 
    TrendingUp, Package, History, ArrowUpRight,
    ArrowDownRight, MoreVertical, Edit2, Trash2,
    ChevronRight, Activity, DollarSign, Printer
} from 'lucide-react'
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer
} from 'recharts'
import { cn } from '@/lib/utils'
import { Card, StatCard } from '@/components/Card'
import { Modal } from '@/components/Modal'
import { toast } from 'sonner'

// Mock Data
const recentTransactions = [
    { id: 'SAL-001', date: '2024-05-04 10:30', customer: 'Walking Customer', total: 2450, items: 3, payment: 'Cash' },
    { id: 'SAL-002', date: '2024-05-04 11:15', customer: 'John Doe', total: 1500, items: 1, payment: 'M-Pesa' },
    { id: 'SAL-003', date: '2024-05-04 12:45', customer: 'Walking Customer', total: 4275, items: 5, payment: 'Cash' },
    { id: 'SAL-004', date: '2024-05-04 14:20', customer: 'Jane Smith', total: 850, items: 2, payment: 'Card' },
    { id: 'SAL-005', date: '2024-05-04 15:50', customer: 'Walking Customer', total: 3120, items: 4, payment: 'M-Pesa' },
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

export default function SalesManagementPage() {
    const [sales, setSales] = useState(recentTransactions)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [deletingSale, setDeletingSale] = useState(null)

    const handleDelete = (sale) => {
        setDeletingSale(sale)
        setShowDeleteModal(true)
    }

    const confirmDelete = () => {
        setSales(prev => prev.filter(s => s.id !== deletingSale.id))
        setShowDeleteModal(false)
        setDeletingSale(null)
        toast.success('Sale transaction record decommissioned')
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 font-figtree pb-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-admin-value uppercase">Sales Ledger</h1>
                    <p className="text-[13px] font-medium text-admin-label mt-1">Track financial transaction history and real-time revenue performance.</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative group">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-openpos-blue transition-colors" size={16} />
                        <input 
                            type="date" 
                            className="bg-card-bg border border-openpos-border text-admin-value pl-11 pr-5 py-2.5 rounded-xl font-bold text-[11px] hover:border-openpos-blue/30 transition-all uppercase tracking-widest shadow-sm outline-none focus:ring-2 focus:ring-openpos-blue/10"
                            defaultValue={new Date().toISOString().split('T')[0]}
                        />
                    </div>
                </div>
            </div>

            {/* Top Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Today's Sales" value="KES 124,050" change="+12% vs yesterday" isPositive={true} icon={DollarSign} color="blue" />
                <StatCard title="Average Ticket" value="KES 855" change="+2% margin" isPositive={true} icon={ShoppingCart} color="blue" />
                <StatCard title="Volume Sold" value="342 Units" change="Across 145 orders" isPositive={true} icon={Package} color="blue" />
                <StatCard title="Projected Profit" value="KES 48,200" change="38.8% Gross margin" isPositive={true} icon={TrendingUp} color="blue" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sales Chart */}
                <div className="lg:col-span-2">
                    <Card 
                        title="Revenue Velocity" 
                        subtitle="Real-time financial performance tracking"
                        headerAction={
                            <div className="flex items-center gap-2 px-3 py-1 bg-openpos-blue/5 border border-openpos-blue/10 rounded-lg text-openpos-blue">
                                <Activity size={14} className="animate-pulse" />
                                <span className="text-[9px] font-bold uppercase tracking-widest">Live Monitoring</span>
                            </div>
                        }
                    >
                        <div className="h-[320px] w-full mt-4">
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
                                    <Tooltip 
                                        contentStyle={{ 
                                            backgroundColor: 'var(--card-bg)', 
                                            borderRadius: '16px', 
                                            border: '1px solid var(--openpos-border)',
                                            fontSize: '11px',
                                            fontWeight: 'bold'
                                        }} 
                                    />
                                    <Area type="monotone" dataKey="sales" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>

                {/* Best Selling Categories */}
                <Card title="Market Share" subtitle="Category performance analysis">
                    <div className="space-y-6 mt-4">
                        {[
                            { name: 'Beef Crowich', value: 45 },
                            { name: 'Croissants', value: 30 },
                            { name: 'Donuts', value: 15 },
                            { name: 'Others', value: 10 },
                        ].map((p, i) => (
                            <div key={p.name} className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-bold text-admin-label uppercase tracking-widest">{p.name}</span>
                                    <span className="text-[11px] font-bold text-admin-value">{p.value}%</span>
                                </div>
                                <div className="h-1.5 bg-openpos-bg-subtle border border-openpos-border rounded-full overflow-hidden">
                                    <div 
                                        className={cn("h-full rounded-full transition-all duration-1000", i === 0 ? "bg-openpos-blue" : "bg-openpos-blue/30")} 
                                        style={{ width: `${p.value}%` }} 
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-8 p-4 bg-openpos-bg-subtle border border-openpos-border rounded-2xl">
                        <p className="text-[9px] font-bold text-openpos-blue uppercase tracking-widest mb-1">AI INSIGHT</p>
                        <p className="text-[11px] text-admin-dim font-bold uppercase tracking-tight leading-relaxed">
                            Beef Crowich is your primary liquidity driver today, contributing nearly 45% of gross revenue.
                        </p>
                    </div>
                </Card>
            </div>

            {/* Recent Transactions Table */}
            <Card 
                noPadding 
                title="Transaction History" 
                subtitle="Recent financial settlement records"
                headerAction={
                    <div className="relative group">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-admin-dim group-focus-within:text-openpos-blue transition-colors" size={14} />
                        <input 
                            placeholder="Search transactions..." 
                            className="bg-openpos-bg-subtle border border-openpos-border rounded-xl pl-10 pr-4 py-1.5 text-[11px] font-bold text-admin-value outline-none focus:ring-2 focus:ring-openpos-blue/10 focus:border-openpos-blue w-64 transition-all"
                        />
                    </div>
                }
            >
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left whitespace-nowrap border-collapse text-[11px]">
                        <thead>
                            <tr className="bg-openpos-bg-subtle/50 border-b border-openpos-border text-[9px] font-bold text-admin-dim uppercase tracking-widest">
                                <th className="px-6 py-4">Transaction ID</th>
                                <th className="px-6 py-4">Date & Temporal Signature</th>
                                <th className="px-6 py-4">Customer identity</th>
                                <th className="px-6 py-4 text-center">Volume</th>
                                <th className="px-6 py-4 text-center">Settlement Method</th>
                                <th className="px-6 py-4 text-right">Net total</th>
                                <th className="px-6 py-4 text-right">Ledger</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-openpos-border">
                            {sales.map((sale) => (
                                <tr key={sale.id} className="group hover:bg-openpos-bg-subtle/40 transition-colors cursor-default">
                                    <td className="px-6 py-4 font-bold text-admin-value uppercase tracking-tight group-hover:text-openpos-blue transition-colors">{sale.id}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-admin-value uppercase">{sale.date.split(' ')[0]}</span>
                                            <span className="text-[9px] text-admin-dim font-bold uppercase tracking-tighter mt-0.5">{sale.date.split(' ')[1]}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-admin-value font-bold uppercase tracking-tight">{sale.customer}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="px-2 py-1 bg-openpos-bg-subtle border border-openpos-border rounded-md font-bold text-[10px] uppercase tracking-widest">
                                            {sale.items} Items
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={cn(
                                            "inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest border",
                                            sale.payment === 'Cash' ? "bg-openpos-blue/5 text-openpos-blue border-openpos-blue/10" : "bg-purple-500/5 text-purple-500 border-purple-500/10"
                                        )}>
                                            {sale.payment}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-bold text-admin-value">KES {sale.total.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1.5">
                                            <button className="p-2 bg-card-bg border border-openpos-border rounded-lg text-admin-dim hover:text-openpos-blue hover:border-openpos-blue/30 transition-all">
                                                <Printer size={12} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(sale)}
                                                className="p-2 bg-card-bg border border-openpos-border rounded-lg text-admin-dim hover:text-openpos-red hover:border-openpos-red/30 transition-all"
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

            {/* Decommission Confirmation Modal */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="Decommission Transaction Record"
                description={`Are you sure you want to remove sale record "${deletingSale?.id}"?`}
                type="danger"
                icon={Trash2}
                confirmText="Delete"
                confirmCountdown={5}
                onConfirm={confirmDelete}
            >
                <div className="p-4 bg-openpos-red/5 rounded-2xl border border-openpos-red/10">
                    <p className="text-[12px] text-openpos-red font-bold uppercase tracking-tight leading-relaxed opacity-80">
                        This action will permanently purge this transaction record from the financial ledger. This operation cannot be reversed.
                    </p>
                </div>
            </Modal>
        </div>
    )
}
