"use client"

import React, { useState, useRef } from'react'
import { 
 BarChart3, Calendar, Download, Filter, 
 Search, FileText, ArrowUpRight, ArrowDownRight,
 TrendingUp, DollarSign, ShoppingBag, Receipt,
 ChevronDown, Printer, BadgeCent, History,
 ArrowRightLeft, Wallet, CheckCircle2
} from'lucide-react'
import { 
 AreaChart, Area, XAxis, YAxis, CartesianGrid, 
 Tooltip, ResponsiveContainer, BarChart, Bar, Cell
} from'recharts'
import { cn } from'@/lib/utils'
import { generateReport } from'@/lib/pdf'
import { toast } from'sonner'

import { Card, StatCard } from'@/components/Card'

// Mock Data
const reportsData = [
 { id:'SAL-001', date:'2024-05-01 10:30', customer:'Walking Customer', total: 2450, payment:'Cash', profit: 820 },
 { id:'SAL-002', date:'2024-05-01 11:15', customer:'John Doe', total: 1500, payment:'M-Pesa', profit: 450 },
 { id:'SAL-003', date:'2024-05-01 12:45', customer:'Walking Customer', total: 4275, payment:'Cash', profit: 1530 },
 { id:'SAL-004', date:'2024-05-01 14:20', customer:'Jane Smith', total: 850, payment:'Card', profit: 210 },
 { id:'SAL-005', date:'2024-05-01 15:50', customer:'Walking Customer', total: 3120, payment:'M-Pesa', profit: 1140 },
]

const monthlySales = [
 { name:'Mon', sales: 40000, profit: 12000 },
 { name:'Tue', sales: 30000, profit: 9000 },
 { name:'Wed', sales: 50000, profit: 16000 },
 { name:'Thu', sales: 45000, profit: 14000 },
 { name:'Fri', sales: 60000, profit: 21000 },
 { name:'Sat', sales: 80000, profit: 32000 },
 { name:'Sun', sales: 70000, profit: 28000 },
]

const topProducts = [
 { id: 1, name:'Beef Crowich', qty: 420, revenue: 231000 },
 { id: 2, name:'Buttermelt Croissant', qty: 380, revenue: 152000 },
 { id: 3, name:'Cereal Cream Donut', qty: 310, revenue: 75950 },
 { id: 4, name:'Egg Tart', qty: 290, revenue: 94250 },
 { id: 5, name:'Solo Floss Bread', qty: 250, revenue: 112500 },
]

const leastProducts = [
 { id: 11, name:'Matcha Latte Cookie', qty: 12, revenue: 3360 },
 { id: 12, name:'Blueberry Muffin', qty: 15, revenue: 5250 },
 { id: 9, name:'Sliced Black Forest', qty: 22, revenue: 11000 },
 { id: 8, name:'Spinchoco Roll', qty: 28, revenue: 11200 },
 { id: 4, name:'Cheesy Cheesecake', qty: 35, revenue: 13125 },
]

export default function SalesReportPage() {
 const [dateRange, setDateRange] = useState(new Date().toISOString().split('T')[0])
 const [reportType, setReportType] = useState('Sales')

 const downloadPDF = () => {
 const tableColumn = ["Order ID","Date","Customer","Payment","Profit","Total Amount"]
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
 <div className="space-y-6 animate-in fade-in duration-500 font-figtree pb-10">
 {/* Header */}
 <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
 <div>
 <h1 className="text-xl font-bold tracking-tight text-admin-value uppercase">Financial Reports</h1>
 <p className="text-[13px] font-medium text-admin-label mt-1">Detailed analysis of your sales, profit and loss performance.</p>
 </div>
 <div className="flex items-center gap-3 w-full sm:w-auto">
 <div className="relative">
 <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-openpos-blue"size={16} />
 <input 
 type="date"
 value={dateRange}
 onChange={(e) => setDateRange(e.target.value)}
 className="bg-card-bg border border-openpos-border text-admin-value pl-11 pr-5 py-2.5 rounded-xl font-bold text-[11px] transition-all uppercase tracking-widest shadow-sm outline-none"
 />
 </div>
 <button 
 onClick={downloadPDF}
 className="flex-1 sm:flex-none bg-openpos-blue text-white px-5 py-2.5 rounded-xl font-bold text-[11px] flex items-center justify-center gap-2 shadow-lg shadow-openpos-blue/20 transition-all uppercase tracking-widest"
 >
 <Download size={16} />
 Download PDF
 </button>
 </div>
 </div>

 {/* Quick Stats Grid */}
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
 <StatCard title="Gross Revenue"value="KES 374,050"change="+12%"isPositive={true} icon={BadgeCent} color="blue"/>
 <StatCard title="Net Profit"value="KES 148,200"change="+8%"isPositive={true} icon={TrendingUp} color="blue"/>
 <StatCard title="Total Expenses"value="KES 42,100"change="-4%"isPositive={false} icon={Wallet} color="red"/>
 </div>

 {/* Performance Chart Card */}
 <Card 
 title="Revenue Performance"
 subtitle="Weekly Growth Analysis"
 headerAction={
 <div className="flex flex-wrap gap-1 bg-openpos-bg-subtle p-1 rounded-lg">
 {['Sales','Profits','Returns','Stock'].map(type => (
 <button 
 key={type}
 onClick={() => setReportType(type)}
 className={cn(
"px-4 py-1.5 rounded-md font-bold text-[10px] uppercase tracking-widest transition-all",
 reportType === type ?"bg-card-bg text-openpos-blue shadow-sm":"text-admin-dim"
 )}
 >
 {type}
 </button>
 ))}
 </div>
 }
 >
 <div className="h-[350px] w-full mt-4">
 <ResponsiveContainer width="100%"height="100%">
 <AreaChart data={monthlySales}>
 <defs>
 <linearGradient id="chartSales"x1="0"y1="0"x2="0"y2="1">
 <stop offset="5%"stopColor="#2563EB"stopOpacity={0.1}/>
 <stop offset="95%"stopColor="#2563EB"stopOpacity={0}/>
 </linearGradient>
 <linearGradient id="chartProfit"x1="0"y1="0"x2="0"y2="1">
 <stop offset="5%"stopColor="#2563EB"stopOpacity={0.05}/>
 <stop offset="95%"stopColor="#2563EB"stopOpacity={0}/>
 </linearGradient>
 </defs>
 <CartesianGrid strokeDasharray="3 3"vertical={false} stroke="var(--openpos-border)"/>
 <XAxis dataKey="name"axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight:'bold', fill:'var(--admin-dim)'}} dy={10} />
 <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight:'bold', fill:'var(--admin-dim)'}} />
 <Tooltip 
 contentStyle={{ 
 backgroundColor:'var(--card-bg)', 
 borderRadius:'16px', 
 border:'1px solid var(--openpos-border)', 
 boxShadow:'0 20px 25px -5px rgba(0, 0, 0, 0.1)',
 fontSize:'11px',
 fontWeight:'bold'
 }} 
 />
 <Area type="monotone"dataKey="sales"stroke="#2563EB"strokeWidth={3} fillOpacity={1} fill="url(#chartSales)"/>
 <Area type="monotone"dataKey="profit"stroke="#2563EB"strokeWidth={3} strokeDasharray="5 5"fillOpacity={1} fill="url(#chartProfit)"/>
 </AreaChart>
 </ResponsiveContainer>
 </div>
 </Card>

 {/* Product Performance Section */}
 {reportType ==='Sales'&& (
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
 {/* Top 5 Products */}
 <Card 
 title="Top 5 Products"
 subtitle="High performing inventory"
 className="h-full"
 >
 <div className="space-y-2 mt-2">
 {topProducts.map((p, i) => (
 <div key={p.id} className="flex items-center justify-between p-3 rounded-xl transition-colors group cursor-default">
 <div className="flex items-center gap-3">
 <div className="w-8 h-8 rounded-lg bg-openpos-blue/5 text-openpos-blue border border-openpos-blue/10 font-bold flex items-center justify-center text-[11px] transition-transform">{i + 1}</div>
 <div>
 <p className="text-[13px] font-bold text-admin-value uppercase tracking-tight">{p.name}</p>
 <p className="text-[10px] text-admin-dim font-bold uppercase mt-0.5">{p.qty} units sold</p>
 </div>
 </div>
 <span className="text-[13px] font-bold text-admin-value">KES {p.revenue.toLocaleString()}</span>
 </div>
 ))}
 </div>
 </Card>

 {/* Least 5 Products */}
 <Card 
 title="Least 5 Products"
 subtitle="Low performing inventory"
 className="h-full"
 >
 <div className="space-y-2 mt-2">
 {leastProducts.map((p, i) => (
 <div key={p.id} className="flex items-center justify-between p-3 rounded-xl transition-colors group cursor-default">
 <div className="flex items-center gap-3">
 <div className="w-8 h-8 rounded-lg bg-openpos-red/5 text-openpos-red border border-openpos-red/10 font-bold flex items-center justify-center text-[11px] transition-transform">{i + 1}</div>
 <div>
 <p className="text-[13px] font-bold text-admin-value uppercase tracking-tight">{p.name}</p>
 <p className="text-[10px] text-admin-dim font-bold uppercase mt-0.5">{p.qty} units sold</p>
 </div>
 </div>
 <span className="text-[13px] font-bold text-admin-value">KES {p.revenue.toLocaleString()}</span>
 </div>
 ))}
 </div>
 </Card>
 </div>
 )}

 {/* Transactions Table */}
 <Card 
 noPadding
 title="Transaction History"
 subtitle="Recent financial ledger records"
 headerAction={
 <div className="relative">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-dim"size={14} />
 <input placeholder="Search orders..."className="bg-openpos-bg-subtle border border-openpos-border rounded-xl pl-9 pr-4 py-1.5 text-[11px] font-bold outline-none w-64 transition-all"/>
 </div>
 }
 >
 <div className="overflow-x-auto">
 <table className="w-full text-left">
 <thead>
 <tr className="bg-openpos-bg-subtle/30 border-b border-openpos-border">
 <th className="p-5 text-[10px] uppercase font-bold text-admin-dim tracking-widest">Order ID</th>
 <th className="p-5 text-[10px] uppercase font-bold text-admin-dim tracking-widest">Date</th>
 <th className="p-5 text-[10px] uppercase font-bold text-admin-dim tracking-widest">Customer</th>
 <th className="p-5 text-[10px] uppercase font-bold text-admin-dim tracking-widest">Payment</th>
 <th className="p-5 text-[10px] uppercase font-bold text-admin-dim tracking-widest text-right">Amount</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-openpos-border">
 {reportsData.map((sale) => (
 <tr key={sale.id} className="group transition-colors cursor-default">
 <td className="p-5 text-[13px] font-bold text-admin-value uppercase tracking-tight">{sale.id}</td>
 <td className="p-5 text-[11px] font-bold text-admin-dim uppercase">{sale.date}</td>
 <td className="p-5 text-[13px] font-bold text-admin-value uppercase tracking-tight">{sale.customer}</td>
 <td className="p-5">
 <div className="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest bg-openpos-blue/10 text-openpos-blue border border-openpos-blue/10">
 {sale.payment}
 </div>
 </td>
 <td className="p-5 text-right font-bold text-admin-value">KES {sale.total.toLocaleString()}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </Card>
 </div>
 )
}

function ReportStatCard({ title, value, change, icon: Icon, color }) {
 const colorClasses = {
 blue:"bg-openpos-blue/5 text-openpos-blue",
 red:"bg-openpos-red/5 text-openpos-red",
 purple:"bg-purple-50 text-purple-600",
 yellow:"bg-yellow-50 text-yellow-600",
 }
 const isPositive = !change.startsWith('-')

 return (
 <div className="bg-card-bg border border-openpos-border rounded-xl p-4 shadow-sm transition-all">
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
 isPositive ?"text-openpos-blue bg-openpos-blue/5":"text-openpos-red bg-openpos-red/5"
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
