"use client"

import React, { useState } from'react'
import { 
 ShoppingBag, ArrowLeft, Download, Search, 
 ArrowUpRight, ArrowDownRight, RefreshCw, 
 Package, Layers, TrendingUp, TrendingDown,
 Activity, Filter, Loader2
} from'lucide-react'
import Link from'next/link'
import { cn } from'@/lib/utils'
import { Card, StatCard } from'@/components/Card'

const topProducts = [
 { id:'PROD-001', name:'Beef Crowich', category:'Bakery', qty: 420, revenue: 231000, trend:'+12%', stock: 45 },
 { id:'PROD-002', name:'Buttermelt Croissant', category:'Bakery', qty: 380, revenue: 152000, trend:'+8%', stock: 12 },
 { id:'PROD-003', name:'Cereal Cream Donut', category:'Sweets', qty: 310, revenue: 75950, trend:'+15%', stock: 88 },
 { id:'PROD-004', name:'Egg Tart', category:'Bakery', qty: 290, revenue: 94250, trend:'+5%', stock: 34 },
 { id:'PROD-005', name:'Solo Floss Bread', category:'Bakery', qty: 250, revenue: 112500, trend:'+20%', stock: 56 },
]

const leastProducts = [
 { id:'PROD-011', name:'Matcha Latte Cookie', category:'Cookies', qty: 12, revenue: 3360, trend:'-45%', stock: 150 },
 { id:'PROD-012', name:'Blueberry Muffin', category:'Bakery', qty: 15, revenue: 5250, trend:'-30%', stock: 42 },
 { id:'PROD-009', name:'Sliced Black Forest', category:'Cakes', qty: 22, revenue: 11000, trend:'-15%', stock: 5 },
 { id:'PROD-008', name:'Spinchoco Roll', category:'Bakery', qty: 28, revenue: 11200, trend:'-10%', stock: 18 },
 { id:'PROD-004', name:'Cheesy Cheesecake', category:'Cakes', qty: 35, revenue: 13125, trend:'-5%', stock: 3 },
]

export default function InventoryReportPage() {
 const [loading, setLoading] = useState(false)
 const [searchTerm, setSearchTerm] = useState('')

 const handleRefresh = () => {
 setLoading(true)
 setTimeout(() => setLoading(false), 1000)
 }

 return (
 <div className="space-y-6 animate-in fade-in duration-500 font-figtree pb-10">
 {/* Header */}
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
 <div className="flex flex-col gap-2">
 <h1 className="text-xl font-bold tracking-tight text-admin-value uppercase flex items-center gap-2">
 Inventory Performance
 </h1>
 <p className="text-[13px] font-medium text-admin-label mt-0.5">Dissecting product movement and stock efficiency.</p>
 </div>
 <div className="flex items-center gap-3">
 <button 
 onClick={handleRefresh}
 className="p-2.5 bg-card-bg border border-openpos-border rounded-xl text-admin-dim transition-all"
 >
 <RefreshCw size={16} className={cn(loading &&"animate-spin")} />
 </button>
 <button 
 onClick={() => {
 setLoading(true);
 setTimeout(() => setLoading(false), 2000);
 }}
 disabled={loading}
 className="bg-openpos-blue text-white px-6 py-2.5 rounded-xl font-bold text-[11px] flex items-center gap-2 transition-all uppercase tracking-widest min-w-[140px] justify-center"
 >
 {loading ? (
 <Loader2 size={16} className="animate-spin" />
 ) : (
 <>
 <Download size={16} />
 Export Data
 </>
 )}
 </button>
 </div>
 </div>

 {/* Performance Stats */}
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
 <StatCard title="Active SKUs"value="156 Items"change="+4 New"isPositive={true} icon={Package} color="blue"/>
 <StatCard title="Stock Value"value="KES 1.2M"change="+KES 45K"isPositive={true} icon={Layers} color="blue"/>
 <StatCard title="Top Movers"value="Bakery"change="65% Share"isPositive={true} icon={TrendingUp} color="blue"/>
 <StatCard title="Low Velocity"value="12 SKUs"change="Requires Action"isPositive={false} icon={Activity} color="red"/>
 </div>

 {/* Top & Least Grid */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
 {/* Top 5 Products */}
 <Card 
 title="Top 5 Performance Matrix"
 subtitle="Primary revenue generators"
 className="h-full"
 headerAction={
 <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md uppercase tracking-widest">High Velocity</span>
 }
 >
 <div className="space-y-2 mt-4">
 {topProducts.map((p, i) => (
 <div key={p.id} className="flex items-center justify-between p-4 rounded-2xl bg-openpos-bg-subtle/30 border border-openpos-border transition-all group cursor-default">
 <div className="flex items-center gap-4">
 <div className="w-10 h-10 rounded-xl bg-openpos-blue/5 text-openpos-blue border border-openpos-blue/10 font-bold flex items-center justify-center text-[12px] transition-transform">
 #{i + 1}
 </div>
 <div>
 <p className="text-[13px] font-bold text-admin-value uppercase tracking-tight transition-colors">{p.name}</p>
 <div className="flex items-center gap-2 mt-1">
 <span className="text-[9px] text-admin-dim font-bold uppercase tracking-widest">{p.category}</span>
 <span className="w-1 h-1 rounded-full bg-admin-dim/30"/>
 <span className="text-[9px] text-admin-dim font-bold uppercase tracking-widest">{p.qty} sold</span>
 </div>
 </div>
 </div>
 <div className="text-right">
 <p className="text-[13px] font-bold text-admin-value">KES {p.revenue.toLocaleString()}</p>
 <span className="text-[9px] font-bold text-emerald-500 flex items-center justify-end gap-1 mt-1">
 <TrendingUp size={10} /> {p.trend}
 </span>
 </div>
 </div>
 ))}
 </div>
 </Card>

 {/* Least 5 Products */}
 <Card 
 title="Low Velocity Analysis"
 subtitle="Inventory requiring promotion"
 className="h-full"
 headerAction={
 <span className="text-[9px] font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-md uppercase tracking-widest">Action Required</span>
 }
 >
 <div className="space-y-2 mt-4">
 {leastProducts.map((p, i) => (
 <div key={p.id} className="flex items-center justify-between p-4 rounded-2xl bg-openpos-bg-subtle/30 border border-openpos-border transition-all group cursor-default">
 <div className="flex items-center gap-4">
 <div className="w-10 h-10 rounded-xl bg-red-500/5 text-red-400 border border-red-500/10 font-bold flex items-center justify-center text-[12px] transition-transform">
 #{i + 1}
 </div>
 <div>
 <p className="text-[13px] font-bold text-admin-value uppercase tracking-tight transition-colors">{p.name}</p>
 <div className="flex items-center gap-2 mt-1">
 <span className="text-[9px] text-admin-dim font-bold uppercase tracking-widest">{p.category}</span>
 <span className="w-1 h-1 rounded-full bg-admin-dim/30"/>
 <span className="text-[9px] text-admin-dim font-bold uppercase tracking-widest">{p.qty} sold</span>
 </div>
 </div>
 </div>
 <div className="text-right">
 <p className="text-[13px] font-bold text-admin-value">KES {p.revenue.toLocaleString()}</p>
 <span className="text-[9px] font-bold text-red-400 flex items-center justify-end gap-1 mt-1">
 <TrendingDown size={10} /> {p.trend}
 </span>
 </div>
 </div>
 ))}
 </div>
 </Card>
 </div>

 {/* Comprehensive Stock Efficiency Table */}
 <Card 
 noPadding 
 title="Stock Efficiency Ledger"
 subtitle="Complete inventory velocity audit"
 headerAction={
 <div className="flex items-center gap-3">
 <div className="relative group">
 <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-admin-dim group-focus-within:text-openpos-blue transition-colors"size={14} />
 <input 
 placeholder="Search inventory..."
 className="bg-openpos-bg-subtle border border-openpos-border rounded-xl pl-10 pr-4 py-1.5 text-[11px] font-bold text-admin-value outline-none w-64 transition-all"
 />
 </div>
 <button className="p-2 bg-card-bg border border-openpos-border rounded-xl text-admin-dim transition-all">
 <Filter size={14} />
 </button>
 </div>
 }
 >
 <div className="overflow-x-auto">
 <table className="w-full text-left">
 <thead>
 <tr className="bg-openpos-bg-subtle/50 border-b border-openpos-border">
 <th className="p-5 text-[10px] uppercase font-bold text-admin-dim tracking-widest">Product Identity</th>
 <th className="p-5 text-[10px] uppercase font-bold text-admin-dim tracking-widest text-center">Movement</th>
 <th className="p-5 text-[10px] uppercase font-bold text-admin-dim tracking-widest text-center">Current Stock</th>
 <th className="p-5 text-[10px] uppercase font-bold text-admin-dim tracking-widest text-right">Revenue Generated</th>
 <th className="p-5 text-[10px] uppercase font-bold text-admin-dim tracking-widest text-right">Efficiency</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-openpos-border">
 {[...topProducts, ...leastProducts].slice(0, 8).map((p) => (
 <tr key={p.id} className="group transition-colors cursor-default">
 <td className="p-5">
 <div className="flex flex-col">
 <span className="text-[13px] font-bold text-admin-value uppercase tracking-tight transition-colors">{p.name}</span>
 <span className="text-[9px] text-admin-dim font-bold uppercase tracking-widest mt-0.5">{p.id}</span>
 </div>
 </td>
 <td className="p-5 text-center">
 <span className="text-[11px] font-bold text-admin-value">{p.qty} Units</span>
 </td>
 <td className="p-5 text-center">
 <span className={cn(
"text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-tight",
 p.stock < 15 ?"bg-red-400/10 text-red-400":"bg-emerald-500/10 text-emerald-500"
 )}>
 {p.stock} In Stock
 </span>
 </td>
 <td className="p-5 text-right text-[13px] font-bold text-admin-value">
 KES {p.revenue.toLocaleString()}
 </td>
 <td className="p-5 text-right">
 <div className="flex items-center justify-end gap-2">
 <div className="w-16 h-1.5 bg-openpos-bg-subtle rounded-full overflow-hidden">
 <div className={cn("h-full", p.qty > 100 ?"bg-openpos-blue":"bg-red-400")} style={{ width:`${Math.min((p.qty / 450) * 100, 100)}%`}} />
 </div>
 <span className="text-[10px] font-bold text-admin-dim">{Math.round((p.qty / 450) * 100)}%</span>
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </Card>
 </div>
 )
}
