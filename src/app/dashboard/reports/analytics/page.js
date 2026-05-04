"use client"

import React, { useState } from 'react'
import { 
    BarChart3, ArrowLeft, Download, RefreshCw, 
    TrendingUp, Calendar, PieChart, Activity,
    ShoppingBag, Target, Zap, Clock
} from 'lucide-react'
import Link from 'next/link'
import { 
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis, 
    CartesianGrid, Tooltip, Cell, PieChart as RePieChart, 
    Pie, AreaChart, Area
} from 'recharts'
import { cn } from '@/lib/utils'
import { Card, StatCard } from '@/components/Card'

const hourlyTraffic = [
    { hour: '08am', traffic: 120 },
    { hour: '10am', traffic: 450 },
    { hour: '12pm', traffic: 890 },
    { hour: '02pm', traffic: 630 },
    { hour: '04pm', traffic: 510 },
    { hour: '06pm', traffic: 920 },
    { hour: '08pm', traffic: 340 },
]

const categorySales = [
    { name: 'Bakery', value: 45, color: '#2563EB' },
    { name: 'Beverages', value: 25, color: '#60A5FA' },
    { name: 'Sweets', value: 20, color: '#93C5FD' },
    { name: 'Dairy', value: 10, color: '#DBEAFE' },
]

export default function AnalyticsReportPage() {
    const [loading, setLoading] = useState(false)

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
                        Market Analytics
                    </h1>
                    <p className="text-[13px] font-medium text-admin-label mt-0.5">Real-time market trends and customer behavior modeling.</p>
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
                        Generate Insight
                    </button>
                </div>
            </div>

            {/* Performance Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Conversion Rate" value="18.5%" change="+2.4%" isPositive={true} icon={Target} color="blue" />
                <StatCard title="Peak Traffic" value="06:00 PM" change="920 Trans" isPositive={true} icon={Zap} color="blue" />
                <StatCard title="Avg. Basket" value="KES 1,240" change="+KES 150" isPositive={true} icon={ShoppingBag} color="blue" />
                <StatCard title="Customer Wait" value="4.2 Min" change="-1.1 Min" isPositive={true} icon={Clock} color="blue" />
            </div>

            {/* Main Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Traffic Bar Chart */}
                <Card 
                    title="Traffic Temporal Flow" 
                    subtitle="Hourly Transaction Volume"
                    className="lg:col-span-2"
                >
                    <div className="h-[300px] w-full mt-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={hourlyTraffic}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--openpos-border)" />
                                <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: 'var(--admin-dim)'}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: 'var(--admin-dim)'}} />
                                <Tooltip 
                                    cursor={{fill: 'var(--openpos-bg-subtle)'}}
                                    contentStyle={{ 
                                        backgroundColor: 'var(--card-bg)', 
                                        borderRadius: '16px', 
                                        border: '1px solid var(--openpos-border)', 
                                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                                        fontSize: '11px',
                                        fontWeight: 'bold'
                                    }} 
                                />
                                <Bar dataKey="traffic" radius={[6, 6, 0, 0]} barSize={32}>
                                    {hourlyTraffic.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.traffic > 700 ? '#2563EB' : '#DBEAFE'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Category Share Donut */}
                <Card title="Category Dominance" subtitle="Revenue Share by Segment">
                    <div className="h-[250px] w-full mt-2 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <RePieChart>
                                <Pie
                                    data={categorySales}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {categorySales.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </RePieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-xl font-bold text-admin-value">45%</span>
                            <span className="text-[9px] font-bold text-admin-dim uppercase">Bakery</span>
                        </div>
                    </div>
                    <div className="mt-4 space-y-2">
                        {categorySales.map((item, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="text-[11px] font-bold text-admin-dim uppercase tracking-tight">{item.name}</span>
                                </div>
                                <span className="text-[11px] font-bold text-admin-value">{item.value}%</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    )
}
