"use client"

import React, { useState } from'react'
import { 
 BarChart3, TrendingUp, DollarSign, Package,
 ArrowUpRight, ArrowDownRight, Calendar,
 PieChart as PieChartIcon, Activity, ShoppingBag
} from'lucide-react'
import { 
 AreaChart, Area, XAxis, YAxis, CartesianGrid, 
 Tooltip, ResponsiveContainer, BarChart, Bar, Cell,
 PieChart, Pie
} from'recharts'
import { cn } from'@/lib/utils'

// Mock Data
const weeklyRevenue = [
 { day:'Mon', amount: 124000 },
 { day:'Tue', amount: 98000 },
 { day:'Wed', amount: 145000 },
 { day:'Thu', amount: 132000 },
 { day:'Fri', amount: 189000 },
 { day:'Sat', amount: 245000 },
 { day:'Sun', amount: 210000 },
]

const categoryDistribution = [
 { name:'Accessories', value: 400, color:'#2563EB'},
 { name:'Computing', value: 300, color:'#3B82F6'},
 { name:'Storage', value: 300, color:'#6366F1'},
 { name:'Audio', value: 200, color:'#8B5CF6'},
 { name:'Mobile', value: 150, color:'#94A3B8'},
]

const topPerformingProducts = [
 { name:'MX Master 3S', sales: 450, growth:'+12.5%'},
 { name:'USB-C Hub', sales: 380, growth:'+8.2%'},
 { name:'SSD 1TB', sales: 310, growth:'-2.1%'},
 { name:'Mech Keyboard', sales: 290, growth:'+15.0%'},
]

export default function SalesAnalyticsPage() {
 return (
 <div className="space-y-6 animate-in fade-in duration-500 font-figtree pb-10">
 {/* Header */}
 <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
 <div>
 <h1 className="text-2xl font-bold tracking-tight text-admin-value uppercase">Sales Analytics</h1>
 <p className="text-admin-label mt-1 font-medium">Deep dive into your revenue patterns and product performance.</p>
 </div>
 <div className="bg-card-bg border border-openpos-border rounded-lg px-4 py-2 flex items-center gap-2 shadow-sm">
 <Calendar size={14} className="text-openpos-blue"/>
 <span className="text-[11px] font-bold text-admin-value uppercase tracking-widest">Year to Date</span>
 </div>
 </div>

 {/* Analytics Stats */}
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
 <AnalyticsCard title="Gross Margin"value="38.5%"change="+2.4%"isPositive={true} icon={TrendingUp} />
 <AnalyticsCard title="Avg Transaction"value="KES 8,420"change="+12%"isPositive={true} icon={DollarSign} />
 <AnalyticsCard title="Customer LTV"value="KES 45,000"change="-0.5%"isPositive={false} icon={Activity} />
 <AnalyticsCard title="Order Velocity"value="12.4 / hr"change="+5%"isPositive={true} icon={ShoppingBag} />
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 {/* Main Revenue Chart */}
 <div className="lg:col-span-2 bg-card-bg border border-openpos-border rounded-3xl p-6 shadow-sm">
 <div className="flex items-center justify-between mb-8">
 <h3 className="text-sm font-bold text-admin-value uppercase tracking-widest flex items-center gap-2">
 <BarChart3 size={18} className="text-openpos-blue"/>
 Weekly Revenue Performance
 </h3>
 </div>
 <div className="h-[350px] w-full">
 <ResponsiveContainer width="100%"height="100%">
 <BarChart data={weeklyRevenue}>
 <CartesianGrid strokeDasharray="3 3"vertical={false} stroke="var(--openpos-border)"/>
 <XAxis dataKey="day"axisLine={false} tickLine={false} tick={{fontSize: 11, fontWeight:'bold', fill:'var(--admin-dim)'}} dy={10} />
 <YAxis axisLine={false} tickLine={false} tick={{fontSize: 11, fontWeight:'bold', fill:'var(--admin-dim)'}} />
 <Tooltip 
 cursor={{fill:'var(--openpos-bg-subtle)'}}
 contentStyle={{ borderRadius:'16px', border:'none', boxShadow:'0 20px 25px -5px rgba(0, 0, 0, 0.1)'}}
 />
 <Bar dataKey="amount"fill="#2563EB"radius={[6, 6, 0, 0]} barSize={40} />
 </BarChart>
 </ResponsiveContainer>
 </div>
 </div>

 {/* Category Distribution Pie */}
 <div className="bg-card-bg border border-openpos-border rounded-3xl p-6 shadow-sm">
 <h3 className="text-sm font-bold text-admin-value uppercase tracking-widest mb-8 flex items-center gap-2">
 <PieChartIcon size={18} className="text-openpos-blue"/>
 Sales by Category
 </h3>
 <div className="h-[250px] w-full relative">
 <ResponsiveContainer width="100%"height="100%">
 <PieChart>
 <Pie
 data={categoryDistribution}
 cx="50%"
 cy="50%"
 innerRadius={60}
 outerRadius={80}
 paddingAngle={5}
 dataKey="value"
 >
 {categoryDistribution.map((entry, index) => (
 <Cell key={`cell-${index}`} fill={entry.color} />
 ))}
 </Pie>
 <Tooltip />
 </PieChart>
 </ResponsiveContainer>
 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
 <div className="text-center">
 <p className="text-[10px] font-bold text-admin-dim uppercase tracking-widest">Total</p>
 <p className="text-[18px] font-bold text-admin-value">1,300</p>
 </div>
 </div>
 </div>
 <div className="mt-6 space-y-2">
 {categoryDistribution.map((cat) => (
 <div key={cat.name} className="flex items-center justify-between">
 <div className="flex items-center gap-2">
 <div className="w-2 h-2 rounded-full"style={{ backgroundColor: cat.color }} />
 <span className="text-[11px] font-bold text-admin-label uppercase tracking-widest">{cat.name}</span>
 </div>
 <span className="text-[11px] font-bold text-admin-value">{Math.round((cat.value / 1300) * 100)}%</span>
 </div>
 ))}
 </div>
 </div>
 </div>

 {/* Secondary Row */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
 {/* Growth Trends */}
 <div className="bg-card-bg border border-openpos-border rounded-3xl p-6 shadow-sm">
 <h3 className="text-sm font-bold text-admin-value uppercase tracking-widest mb-8 flex items-center gap-2">
 <TrendingUp size={18} className="text-openpos-blue"/>
 Market Growth Trend
 </h3>
 <div className="h-[250px] w-full">
 <ResponsiveContainer width="100%"height="100%">
 <AreaChart data={weeklyRevenue}>
 <defs>
 <linearGradient id="growthGradient"x1="0"y1="0"x2="0"y2="1">
 <stop offset="5%"stopColor="#2563EB"stopOpacity={0.1}/>
 <stop offset="95%"stopColor="#2563EB"stopOpacity={0}/>
 </linearGradient>
 </defs>
 <CartesianGrid strokeDasharray="3 3"vertical={false} stroke="var(--openpos-border)"/>
 <XAxis dataKey="day"axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight:'bold', fill:'var(--admin-dim)'}} />
 <Tooltip />
 <Area type="monotone"dataKey="amount"stroke="#2563EB"strokeWidth={3} fillOpacity={1} fill="url(#growthGradient)"/>
 </AreaChart>
 </ResponsiveContainer>
 </div>
 </div>

 {/* Top Performers Table */}
 <div className="bg-card-bg border border-openpos-border rounded-3xl p-6 shadow-sm">
 <h3 className="text-sm font-bold text-admin-value uppercase tracking-widest mb-6 flex items-center gap-2">
 <Package size={18} className="text-openpos-blue"/>
 Star Performers
 </h3>
 <div className="space-y-4">
 {topPerformingProducts.map((product, i) => (
 <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-openpos-bg-subtle/30 border border-openpos-border/50">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-lg bg-card-bg border border-openpos-border flex items-center justify-center text-[14px] font-bold text-openpos-blue">
 {i + 1}
 </div>
 <div>
 <p className="text-[13px] font-bold text-admin-value">{product.name}</p>
 <p className="text-[10px] text-admin-dim font-bold uppercase">{product.sales} sales this month</p>
 </div>
 <span className={cn(
"text-[9px] px-1.5 py-0.5 rounded-md font-bold uppercase",
 product.growth.startsWith('+') ?"bg-openpos-blue/10 text-openpos-blue":"bg-openpos-red/10 text-openpos-red"
 )}>
 {product.growth.startsWith('+') ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
 {product.growth}
 </span>
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>
 )
}

function AnalyticsCard({ title, value, change, isPositive, icon: Icon }) {
 return (
 <div className="bg-card-bg border border-openpos-border rounded-lg p-4 shadow-sm">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-lg bg-openpos-blue/5 text-openpos-blue flex items-center justify-center shrink-0">
 <Icon size={20} />
 </div>
 <div>
 <p className="text-[10px] font-bold text-admin-dim uppercase tracking-widest mb-0.5">{title}</p>
 <div className="flex items-center gap-2">
 <h4 className="text-[18px] font-bold text-admin-value tracking-tight">{value}</h4>
 <span className={cn(
"text-[9px] font-bold px-1.5 py-0.5 rounded uppercase",
 isPositive ?"bg-openpos-blue/10 text-openpos-blue":"bg-openpos-red/10 text-openpos-red"
 )}>
 {change}
 </span>
 </div>
 </div>
 </div>
 </div>
 )
}
