"use client"

import React, { useState } from 'react'
import { 
    TrendingUp, TrendingDown, ArrowLeft, Download, 
    Calendar, DollarSign, Wallet, ArrowUpRight, 
    ArrowDownRight, RefreshCw, BarChart3, PieChart
} from 'lucide-react'
import Link from 'next/link'
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts'
import { cn } from '@/lib/utils'
import { Card, StatCard } from '@/components/Card'

const profitLossData = [
    { month: 'Jan', revenue: 450000, expenses: 310000, profit: 140000 },
    { month: 'Feb', revenue: 520000, expenses: 340000, profit: 180000 },
    { month: 'Mar', revenue: 480000, expenses: 320000, profit: 160000 },
    { month: 'Apr', revenue: 610000, expenses: 380000, profit: 230000 },
    { month: 'May', revenue: 550000, expenses: 350000, profit: 200000 },
    { month: 'Jun', revenue: 670000, expenses: 400000, profit: 270000 },
]

export default function ProfitLossPage() {
    const [loading, setLoading] = useState(false)
    const [dateRange, setDateRange] = useState('June 2024')

    const handleRefresh = () => {
        setLoading(true)
        setTimeout(() => setLoading(false), 1000)
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 font-figtree pb-10">
            {/* Breadcrumbs & Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-xl font-bold tracking-tight text-admin-value uppercase flex items-center gap-2">
                        Profit & Loss Statement
                    </h1>
                    <p className="text-[13px] font-medium text-admin-label mt-0.5">Comprehensive fiscal analysis for {dateRange}.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={handleRefresh}
                        className="p-2.5 bg-card-bg border border-openpos-border rounded-xl text-admin-dim hover:text-openpos-blue transition-all"
                    >
                        <RefreshCw size={16} className={cn(loading && "animate-spin")} />
                    </button>
                    <button className="bg-openpos-blue text-white px-6 py-2.5 rounded-xl font-bold text-[11px] flex items-center gap-2 shadow-lg shadow-openpos-blue/20 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest">
                        <Download size={16} />
                        Export Audit
                    </button>
                </div>
            </div>

            {/* Fiscal Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Gross Revenue" value="KES 670,000" change="+12.5%" isPositive={true} icon={DollarSign} color="blue" />
                <StatCard title="Operating Costs" value="KES 400,000" change="+5.2%" isPositive={false} icon={Wallet} color="red" />
                <StatCard title="Net Profit" value="KES 270,000" change="+18.4%" isPositive={true} icon={TrendingUp} color="blue" />
                <StatCard title="Profit Margin" value="40.3%" change="+2.1%" isPositive={true} icon={PieChart} color="blue" />
            </div>

            {/* Chart Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card 
                    title="Revenue vs Expenditure" 
                    subtitle="Fiscal Year 2024 Progress"
                    className="lg:col-span-2"
                >
                    <div className="h-[350px] w-full mt-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={profitLossData}>
                                <defs>
                                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="expensesGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.05}/>
                                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--openpos-border)" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: 'var(--admin-dim)'}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: 'var(--admin-dim)'}} />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: 'var(--card-bg)', 
                                        borderRadius: '16px', 
                                        border: '1px solid var(--openpos-border)', 
                                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                                        fontSize: '11px',
                                        fontWeight: 'bold'
                                    }} 
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#revenueGrad)" />
                                <Area type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={2} strokeDasharray="5 5" fillOpacity={1} fill="url(#expensesGrad)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <div className="space-y-6">
                    <Card title="Expense Breakdown" subtitle="Major cost centers">
                        <div className="space-y-4 mt-2">
                            {[
                                { label: 'Procurement', amount: 'KES 245,000', percentage: 61, color: 'bg-openpos-blue' },
                                { label: 'Staff Salaries', amount: 'KES 85,000', percentage: 21, color: 'bg-indigo-500' },
                                { label: 'Utility & Rent', amount: 'KES 45,000', percentage: 11, color: 'bg-purple-500' },
                                { label: 'Marketing', amount: 'KES 25,000', percentage: 7, color: 'bg-emerald-500' },
                            ].map((item, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[11px] font-bold text-admin-value uppercase tracking-tight">{item.label}</span>
                                        <span className="text-[11px] font-bold text-admin-dim">{item.amount}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-openpos-bg-subtle rounded-full overflow-hidden">
                                        <div className={cn("h-full transition-all duration-1000", item.color)} style={{ width: `${item.percentage}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>

            {/* Detailed Ledger Summary */}
            <Card title="Statement Details" subtitle="Granular financial breakdown" noPadding>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-openpos-bg-subtle/50 border-b border-openpos-border">
                                <th className="p-5 text-[10px] uppercase font-bold text-admin-dim tracking-widest">Description</th>
                                <th className="p-5 text-[10px] uppercase font-bold text-admin-dim tracking-widest text-right">Debit (Out)</th>
                                <th className="p-5 text-[10px] uppercase font-bold text-admin-dim tracking-widest text-right">Credit (In)</th>
                                <th className="p-5 text-[10px] uppercase font-bold text-admin-dim tracking-widest text-right">Balance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-openpos-border text-[13px] font-bold">
                            <tr className="hover:bg-openpos-bg-subtle/30 transition-colors">
                                <td className="p-5 text-admin-value uppercase tracking-tight">Sales Revenue (Monthly)</td>
                                <td className="p-5 text-right text-admin-dim">-</td>
                                <td className="p-5 text-right text-emerald-500">KES 670,000</td>
                                <td className="p-5 text-right text-admin-value">KES 670,000</td>
                            </tr>
                            <tr className="hover:bg-openpos-bg-subtle/30 transition-colors">
                                <td className="p-5 text-admin-value uppercase tracking-tight">Inventory Procurement</td>
                                <td className="p-5 text-right text-red-500">KES 245,000</td>
                                <td className="p-5 text-right text-admin-dim">-</td>
                                <td className="p-5 text-right text-admin-value">KES 425,000</td>
                            </tr>
                            <tr className="hover:bg-openpos-bg-subtle/30 transition-colors">
                                <td className="p-5 text-admin-value uppercase tracking-tight">Administrative Expenses</td>
                                <td className="p-5 text-right text-red-500">KES 155,000</td>
                                <td className="p-5 text-right text-admin-dim">-</td>
                                <td className="p-5 text-right text-admin-value font-black">KES 270,000</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    )
}
