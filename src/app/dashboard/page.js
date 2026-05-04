"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
    TrendingUp, Package, AlertTriangle, Users, 
    ArrowUpRight, ArrowDownRight, Bell, ChevronRight,
    ShoppingBag, DollarSign, Calendar, Eye, CreditCard,
    ShoppingBasket, ArrowRightLeft, Activity
} from 'lucide-react'
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

// Mock Data for Charts
const salesData = [
    { name: '08:00', total: 4000 },
    { name: '10:00', total: 3000 },
    { name: '12:00', total: 5000 },
    { name: '14:00', total: 4500 },
    { name: '16:00', total: 6000 },
    { name: '18:00', total: 8000 },
    { name: '20:00', total: 7000 },
]

const activityLog = [
    { id: 1, type: 'Sale', item: 'Logitech MX Master', amount: 'KES 12,500', time: 'Just now' },
    { id: 2, type: 'Stock', item: 'USB-C Multiport Hub', amount: '+24 Units', time: '2 mins ago' },
    { id: 3, type: 'Sale', item: 'Portable SSD 1TB', amount: 'KES 15,500', time: '5 mins ago' },
    { id: 4, type: 'User', item: 'New Retail Customer', amount: 'Loyalty Join', time: '10 mins ago' },
]

const recentHistory = [
    { id: 1, type: 'Sale', item: 'Smart Watch Series 9', amount: 'KES 42,000', time: '5 hours ago' },
    { id: 2, type: 'Purchase', item: 'Laptop Stock (10 units)', amount: 'KES 450,000', time: '2 days ago' },
    { id: 3, type: 'Sale', item: 'Mechanical Keyboard', amount: 'KES 8,900', time: '3 days ago' },
]

export default function DashboardPage() {
    const [mounted, setMounted] = useState(false)
    const [activityIndex, setActivityIndex] = useState(0)

    useEffect(() => {
        setMounted(true)
        const interval = setInterval(() => {
            setActivityIndex(prev => (prev + 1) % activityLog.length)
        }, 3000)
        return () => clearInterval(interval)
    }, [])

    if (!mounted) return null

    return (
        <div className="space-y-6 animate-in fade-in duration-500 font-figtree">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-admin-value">Open POS Dashboard</h1>
                    <p className="text-admin-label mt-1 text-[13px]">Welcome back, here's what's happening with your store today.</p>
                </div>
                <div className="bg-card-bg border border-openpos-border rounded-xl px-4 py-2 flex items-center justify-center">
                    <span className="font-semibold text-[12px] text-admin-value">{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <StatCard title="Total Sales Today" value="KES 124,050" change="+12.5%" isPositive={true} icon={DollarSign} color="blue" />
                <StatCard title="Products In" value="1,420" change="+3.2%" isPositive={true} icon={Package} color="green" />
                <StatCard title="Products Expired" value="12" change="+2 since yesterday" isPositive={false} icon={AlertTriangle} color="red" />
                <StatCard title="Staffs Active" value="8/10" change="All shifts covered" isPositive={true} icon={Users} color="purple" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Graph & Carousel */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Sales Graph */}
                    <div className="bg-card-bg border border-openpos-border rounded-2xl p-6 relative overflow-hidden shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-lg font-bold text-admin-value">Sales Overview</h3>
                                <p className="text-[11px] text-admin-label font-medium mt-0.5">Performance of the day</p>
                            </div>
                            <select className="bg-openpos-bg-subtle border-none rounded-xl text-[11px] font-bold px-4 py-2 focus:ring-1 focus:ring-openpos-blue/30 outline-none transition-all cursor-pointer">
                                <option>Today</option>
                                <option>Yesterday</option>
                                <option>Last 7 Days</option>
                            </select>
                        </div>
                        <div className="h-[320px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={salesData}>
                                    <defs>
                                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--openpos-blue)" stopOpacity={0.1}/>
                                            <stop offset="95%" stopColor="var(--openpos-blue)" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--openpos-border)" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 11, fill: 'var(--admin-dim)', fontWeight: 500}} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 11, fill: 'var(--admin-dim)', fontWeight: 500}} />
                                    <Tooltip contentStyle={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--openpos-border)', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }} />
                                    <Area type="monotone" dataKey="total" stroke="var(--openpos-blue)" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Activity Carousel */}
                    <div className="bg-openpos-blue/[0.03] border border-openpos-blue/10 rounded-2xl p-6 relative overflow-hidden flex items-center h-32">
                        <div className="absolute top-0 left-0 w-1 h-full bg-openpos-blue" />
                        <div className="flex-1">
                            <p className="text-[10px] font-bold text-openpos-blue uppercase tracking-widest mb-3">Live Open POS activity</p>
                            <div className="relative h-12">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activityIndex}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.4 }}
                                        className="absolute inset-0 flex items-center gap-4"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-white border border-openpos-border flex items-center justify-center shrink-0">
                                            <div className="w-6 h-6 bg-openpos-bg-subtle rounded-md" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className="text-[10px] font-bold text-openpos-blue uppercase">{activityLog[activityIndex].type}</span>
                                                <span className="text-[10px] text-admin-dim font-medium">• {activityLog[activityIndex].time}</span>
                                            </div>
                                            <h4 className="text-[15px] font-bold text-admin-value">{activityLog[activityIndex].item}</h4>
                                            <p className="text-[12px] font-semibold text-openpos-blue">{activityLog[activityIndex].amount}</p>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>
                        <div className="hidden md:flex gap-1.5 ml-10">
                            {activityLog.map((_, i) => (
                                <div key={i} className={cn("w-1.5 h-1.5 rounded-full transition-all duration-300", i === activityIndex ? "bg-openpos-blue w-4" : "bg-openpos-blue/20")} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Notifications & Staff */}
                <div className="space-y-6">
                    {/* Notifications */}
                    <div className="bg-card-bg border border-openpos-border rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-sm font-bold text-admin-value flex items-center gap-2">
                                <Bell size={16} className="text-openpos-blue" />
                                Notifications
                            </h3>
                            <Link href="/dashboard/notifications" className="text-[10px] font-bold text-openpos-blue uppercase tracking-widest">See All</Link>
                        </div>
                        <div className="space-y-4">
                            {[
                                { title: 'Shift Started', desc: 'Staff Richard started shift', time: '5m ago' },
                                { title: 'New Stock Added', desc: '100 units of Pastries', time: '1h ago' },
                                { title: 'Payment Updated', desc: 'KES Currency set as default', time: '2h ago' },
                                { title: 'Order Cancelled', desc: 'Order #005 was cancelled', time: '3h ago' },
                            ].map((notif, i) => (
                                <div key={i} className="relative pl-4 border-l border-openpos-border last:border-transparent">
                                    <div className="absolute left-[-4.5px] top-1.5 w-2 h-2 rounded-full bg-openpos-border" />
                                    <div className="flex flex-col gap-0.5">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[12px] font-bold text-admin-value">{notif.title}</span>
                                            <span className="text-[10px] text-admin-dim">{notif.time}</span>
                                        </div>
                                        <p className="text-[11px] text-admin-label line-clamp-1 font-medium">{notif.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Staffs Section */}
                    <div className="bg-card-bg border border-openpos-border rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-sm font-bold text-admin-value">Staffs</h3>
                            <Link href="/dashboard/staff" className="text-[10px] font-bold text-openpos-blue uppercase tracking-widest">See All</Link>
                        </div>
                        <div className="space-y-3">
                            {[
                                { name: 'Mike', role: 'Kitchen Hand', time: '10:00 AM' },
                                { name: 'Billie', role: 'Cashier', time: '08:45 AM' },
                                { name: 'Richard', role: 'Server', time: '08:15 AM' },
                            ].map((staff, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-openpos-border">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-lg bg-openpos-blue/10 flex items-center justify-center text-openpos-blue font-bold text-xs">
                                            {staff.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-[13px] font-bold text-admin-value">{staff.name}</p>
                                            <p className="text-[10px] text-admin-dim font-medium uppercase tracking-wider">{staff.role}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[9px] font-medium text-admin-dim uppercase">Clocked</p>
                                        <p className="text-[11px] font-bold text-admin-value mt-0.5">{staff.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10">
                {/* Payment Methods Chart */}
                <div className="bg-card-bg border border-openpos-border rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-sm font-bold text-admin-value flex items-center gap-2 uppercase tracking-widest">
                            <CreditCard size={16} className="text-openpos-blue" />
                            Payment Channels
                        </h3>
                    </div>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={[
                                { name: 'M-Pesa', value: 45000 },
                                { name: 'Cash', value: 32000 },
                                { name: 'Card', value: 12000 },
                                { name: 'Voucher', value: 8000 },
                            ]}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--openpos-border)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 11, fill: 'var(--admin-dim)', fontWeight: 500}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 11, fill: 'var(--admin-dim)', fontWeight: 500}} />
                                <Tooltip cursor={{fill: 'var(--openpos-bg-subtle)'}} contentStyle={{ borderRadius: '12px', border: 'none' }} />
                                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                                    {[0, 1, 2, 3].map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={['#10B981', '#2563EB', '#8B5CF6', '#F59E0B'][index]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* REPLACEMENT: Recent Activities (Sales & Purchases) */}
                <div className="bg-card-bg border border-openpos-border rounded-2xl p-6 shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-sm font-bold text-admin-value flex items-center gap-2 uppercase tracking-widest">
                            <Activity size={16} className="text-openpos-blue" />
                            Activity History
                        </h3>
                    </div>
                    <div className="flex-1 space-y-5">
                        {recentHistory.map((act) => (
                            <div key={act.id} className="flex gap-4">
                                <div className={cn(
                                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border",
                                    act.type === 'Sale' ? "bg-openpos-green/10 text-openpos-green border-openpos-green/20" : "bg-openpos-blue/10 text-openpos-blue border-openpos-blue/20"
                                )}>
                                    {act.type === 'Sale' ? <ShoppingBasket size={18} /> : <ArrowRightLeft size={18} />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <h4 className="text-[13px] font-bold text-admin-value truncate">{act.item}</h4>
                                        <span className="text-[10px] font-bold text-admin-dim uppercase whitespace-nowrap ml-2">{act.time}</span>
                                    </div>
                                    <div className="flex justify-between items-center mt-0.5">
                                        <p className="text-[11px] text-admin-dim font-medium uppercase tracking-tight">{act.type}</p>
                                        <p className="text-[12px] font-bold text-admin-value">{act.amount}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

function StatCard({ title, value, change, isPositive, icon: Icon, color }) {
    const colorClasses = {
        blue: "text-openpos-blue bg-openpos-blue/10",
        green: "text-openpos-green bg-openpos-green/10",
        red: "text-openpos-red bg-openpos-red/10",
        purple: "text-openpos-purple bg-openpos-purple/10",
    }

    return (
        <div className="bg-white border border-openpos-border rounded-2xl p-4 shadow-sm hover:border-openpos-blue/30 transition-all group overflow-hidden relative">
            <div className="flex items-center gap-3">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-all group-hover:scale-105", colorClasses[color] || colorClasses.blue, "border-transparent group-hover:border-current/20")}>
                    <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-admin-dim uppercase tracking-wider">{title}</p>
                    <div className="flex flex-col mt-0.5">
                        <p className="text-lg font-bold text-admin-value leading-none truncate tracking-tight">{value}</p>
                        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 mt-1">
                            <span className={cn(
                                "text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-tight whitespace-nowrap",
                                isPositive ? "bg-openpos-green/10 text-openpos-green" : "bg-openpos-red/10 text-openpos-red"
                            )}>
                                {change}
                            </span>
                            <span className="text-[10px] font-bold text-admin-dim">
                                {isPositive ? '+' : '-'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
