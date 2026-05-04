"use client"

import React, { useState, useRef } from 'react'
import { 
    BarChart3, Calendar, Download, Filter, 
    Search, FileText, ArrowUpRight, ArrowDownRight,
    TrendingUp, DollarSign, ShoppingBag, Receipt,
    ChevronDown, Printer, BadgeCent, History,
    ArrowRightLeft, Wallet, CheckCircle2
} from 'lucide-react'
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts'
import { cn } from '@/lib/utils'
import { generateReport } from '@/lib/pdf'
import { toast } from 'sonner'

// Mock Data
const reportsData = [
    { id: 'SAL-001', date: '2024-05-01 10:30', customer: 'Walking Customer', total: 2450, payment: 'Cash', profit: 820 },
    { id: 'SAL-002', date: '2024-05-01 11:15', customer: 'John Doe', total: 1500, payment: 'M-Pesa', profit: 450 },
    { id: 'SAL-003', date: '2024-05-01 12:45', customer: 'Walking Customer', total: 4275, payment: 'Cash', profit: 1530 },
    { id: 'SAL-004', date: '2024-05-01 14:20', customer: 'Jane Smith', total: 850, payment: 'Card', profit: 210 },
    { id: 'SAL-005', date: '2024-05-01 15:50', customer: 'Walking Customer', total: 3120, payment: 'M-Pesa', profit: 1140 },
]

const monthlySales = [
    { name: 'Mon', sales: 40000, profit: 12000 },
    { name: 'Tue', sales: 30000, profit: 9000 },
    { name: 'Wed', sales: 50000, profit: 16000 },
    { name: 'Thu', sales: 45000, profit: 14000 },
    { name: 'Fri', sales: 60000, profit: 21000 },
    { name: 'Sat', sales: 80000, profit: 32000 },
    { name: 'Sun', sales: 70000, profit: 28000 },
]

const topProducts = [
    { id: 1, name: 'Beef Crowich', qty: 420, revenue: 231000 },
    { id: 2, name: 'Buttermelt Croissant', qty: 380, revenue: 152000 },
    { id: 3, name: 'Cereal Cream Donut', qty: 310, revenue: 75950 },
    { id: 4, name: 'Egg Tart', qty: 290, revenue: 94250 },
    { id: 5, name: 'Solo Floss Bread', qty: 250, revenue: 112500 },
]

const leastProducts = [
    { id: 11, name: 'Matcha Latte Cookie', qty: 12, revenue: 3360 },
    { id: 12, name: 'Blueberry Muffin', qty: 15, revenue: 5250 },
    { id: 9, name: 'Sliced Black Forest', qty: 22, revenue: 11000 },
    { id: 8, name: 'Spinchoco Roll', qty: 28, revenue: 11200 },
    { id: 4, name: 'Cheesy Cheesecake', qty: 35, revenue: 13125 },
]

export default function SalesReportPage() {
    const [dateRange, setDateRange] = useState(new Date().toISOString().split('T')[0])
    const [reportType, setReportType] = useState('Sales')
    const dateInputRef = useRef(null)

    const downloadPDF = () => {
        const tableColumn = ["Order ID", "Date", "Customer", "Payment", "Profit", "Total Amount"]
        const tableRows = reportsData.map(sale => [
            sale.id,
            sale.date,
            sale.customer,
            sale.payment,
            `KES ${sale.profit}`,
            `KES ${sale.total}`
        ])

        generateReport(`Sales Report (${dateRange})`, tableColumn, tableRows)
        toast.success('Report Downloaded Successfully!')
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 font-figtree">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-admin-value uppercase">Financial Reports</h1>
                    <p className="text-admin-label mt-1 font-medium">Detailed analysis of your sales, profit and loss.</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-openpos-blue" size={18} />
                        <input 
                            type="date"
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="bg-card-bg border border-openpos-border text-admin-value pl-11 pr-5 py-3 rounded-xl font-bold text-[12px] hover:border-openpos-blue/30 transition-all uppercase tracking-widest shadow-sm outline-none focus:ring-2 focus:ring-openpos-blue/10"
                        />
                    </div>
                    <button 
                        onClick={downloadPDF}
                        className="flex-1 sm:flex-none bg-openpos-blue text-white px-5 py-3 rounded-xl font-bold text-[12px] flex items-center justify-center gap-2 shadow-lg shadow-openpos-blue/20 hover:scale-[1.02] transition-all uppercase tracking-widest"
                    >
                        <Download size={18} />
                        Download PDF
                    </button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <ReportStatCard title="Gross Revenue" value="KES 374,050" change="+12%" icon={BadgeCent} color="blue" />
                <ReportStatCard title="Net Profit" value="KES 148,200" change="+8%" icon={TrendingUp} color="blue" />
                <ReportStatCard title="Total Expenses" value="KES 42,100" change="-4%" icon={Wallet} color="red" />
            </div>

            {/* Report Tabs */}
            <div className="flex flex-wrap gap-2 bg-openpos-bg-subtle p-1 rounded-xl w-fit">
                {['Sales', 'Profits', 'Returns', 'Stock'].map(type => (
                    <button 
                        key={type}
                        onClick={() => setReportType(type)}
                        className={cn(
                            "px-6 py-2.5 rounded-lg font-bold text-[12px] uppercase tracking-widest transition-all",
                            reportType === type ? "bg-card-bg text-openpos-blue shadow-sm" : "text-admin-dim hover:text-admin-value"
                        )}
                    >
                        {type}
                    </button>
                ))}
            </div>

            {/* Performance Chart */}
            <div className="bg-card-bg border border-openpos-border rounded-3xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h3 className="text-sm font-bold text-admin-value uppercase tracking-widest">Revenue Performance</h3>
                        <p className="text-[11px] text-admin-dim font-bold mt-1 uppercase tracking-widest">Weekly Growth Analysis</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-openpos-blue" />
                            <span className="text-[10px] font-bold text-admin-dim uppercase">Sales</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-openpos-blue/40" />
                            <span className="text-[10px] font-bold text-admin-dim uppercase">Profit</span>
                        </div>
                    </div>
                </div>
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={monthlySales}>
                            <defs>
                                <linearGradient id="chartSales" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="chartProfit" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.05}/>
                                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--openpos-border)" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: 'var(--admin-dim)'}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: 'var(--admin-dim)'}} />
                            <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }} />
                            <Area type="monotone" dataKey="sales" stroke="#2563EB" strokeWidth={4} fillOpacity={1} fill="url(#chartSales)" />
                            <Area type="monotone" dataKey="profit" stroke="#2563EB" strokeWidth={4} strokeDasharray="5 5" fillOpacity={1} fill="url(#chartProfit)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Product Performance Section */}
            {reportType === 'Sales' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Top 5 Products */}
                    <div className="bg-card-bg border border-openpos-border rounded-3xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-sm font-bold text-admin-value uppercase tracking-widest flex items-center gap-2">
                                <TrendingUp size={16} className="text-openpos-blue" />
                                Top 5 Products
                            </h3>
                        </div>
                        <div className="space-y-4">
                            {topProducts.map((p, i) => (
                                <div key={p.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-openpos-bg-subtle transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-openpos-blue/10 text-openpos-blue font-bold flex items-center justify-center text-[12px]">{i + 1}</div>
                                        <div>
                                            <p className="text-[13px] font-bold text-admin-value">{p.name}</p>
                                            <p className="text-[11px] text-admin-dim font-medium">{p.qty} sold</p>
                                        </div>
                                    </div>
                                    <span className="text-[13px] font-bold text-admin-value">KES {p.revenue.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Least 5 Products */}
                    <div className="bg-card-bg border border-openpos-border rounded-3xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-sm font-bold text-admin-value uppercase tracking-widest flex items-center gap-2">
                                <ArrowDownRight size={16} className="text-openpos-red" />
                                Least 5 Products
                            </h3>
                        </div>
                        <div className="space-y-4">
                            {leastProducts.map((p, i) => (
                                <div key={p.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-openpos-bg-subtle transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-openpos-red/10 text-openpos-red font-bold flex items-center justify-center text-[12px]">{i + 1}</div>
                                        <div>
                                            <p className="text-[13px] font-bold text-admin-value">{p.name}</p>
                                            <p className="text-[11px] text-admin-dim font-medium">{p.qty} sold</p>
                                        </div>
                                    </div>
                                    <span className="text-[13px] font-bold text-admin-value">KES {p.revenue.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Transactions Table */}
            <div className="bg-card-bg border border-openpos-border rounded-3xl overflow-hidden shadow-sm">
                <div className="p-6 border-b border-openpos-border flex items-center justify-between bg-openpos-bg-subtle/20">
                    <h3 className="text-sm font-bold text-admin-value uppercase tracking-widest flex items-center gap-2">
                        <History size={18} className="text-openpos-blue" />
                        Transaction History
                    </h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-dim" size={14} />
                        <input placeholder="Search orders..." className="bg-card-bg border border-openpos-border rounded-xl pl-9 pr-4 py-2 text-[12px] font-medium outline-none focus:ring-1 focus:ring-openpos-blue/30 w-64 transition-all" />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-openpos-bg-subtle/30">
                                <th className="p-5 text-[10px] uppercase font-bold text-admin-dim tracking-widest">Order ID</th>
                                <th className="p-5 text-[10px] uppercase font-bold text-admin-dim tracking-widest">Date</th>
                                <th className="p-5 text-[10px] uppercase font-bold text-admin-dim tracking-widest">Customer</th>
                                <th className="p-5 text-[10px] uppercase font-bold text-admin-dim tracking-widest">Payment</th>
                                <th className="p-5 text-[10px] uppercase font-bold text-admin-dim tracking-widest text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-openpos-border">
                            {reportsData.map((sale) => (
                                <tr key={sale.id} className="group hover:bg-openpos-bg-subtle/50 transition-colors">
                                    <td className="p-5 text-[13px] font-bold text-admin-value">{sale.id}</td>
                                    <td className="p-5 text-[12px] font-medium text-admin-dim">{sale.date}</td>
                                    <td className="p-5 text-[13px] font-bold text-admin-value">{sale.customer}</td>
                                    <td className="p-5">
                                        <div className={cn(
                                            "inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider",
                                            sale.payment === 'Cash' ? "bg-openpos-blue/10 text-openpos-blue" : 
                                            sale.payment === 'M-Pesa' ? "bg-openpos-blue/10 text-openpos-blue" : "bg-openpos-blue/10 text-openpos-blue"
                                        )}>
                                            {sale.payment}
                                        </div>
                                    </td>
                                    <td className="p-5 text-right font-bold text-admin-value">KES {sale.total}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

function ReportStatCard({ title, value, change, icon: Icon, color }) {
    const colorClasses = {
        blue: "bg-openpos-blue/5 text-openpos-blue",
        red: "bg-openpos-red/5 text-openpos-red",
        purple: "bg-purple-50 text-purple-600",
        yellow: "bg-yellow-50 text-yellow-600",
    }
    const isPositive = !change.startsWith('-')

    return (
        <div className="bg-card-bg border border-openpos-border rounded-xl p-4 shadow-sm hover:border-openpos-blue/20 transition-all">
            <div className="flex items-center gap-3">
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", colorClasses[color] || colorClasses.blue)}>
                    <Icon size={18} />
                </div>
                <div>
                    <p className="text-[10px] font-bold text-admin-dim uppercase tracking-wider">{title}</p>
                    <div className="flex items-center gap-2">
                        <p className="text-lg font-bold text-admin-value">{value}</p>
                        <span className={cn(
                            "text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 uppercase tracking-tighter",
                            isPositive ? "text-openpos-blue bg-openpos-blue/5" : "text-openpos-red bg-openpos-red/5"
                        )}>
                            {isPositive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                            {change}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}
