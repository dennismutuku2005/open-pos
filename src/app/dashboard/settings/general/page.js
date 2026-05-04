"use client"

import React, { useState } from 'react'
import { Globe, Save, RefreshCw, ChevronLeft, MapPin, Clock, DollarSign, Languages } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card } from '@/components/Card'
import { toast } from 'sonner'
import Link from 'next/link'

export default function GeneralSettingsPage() {
    const [loading, setLoading] = useState(false)
    const [config, setConfig] = useState({
        storeName: 'Pace Wisp Retail',
        timezone: 'Africa/Nairobi',
        currency: 'KES',
        language: 'English',
        address: 'Nairobi, Kenya'
    })

    const handleSave = () => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            toast.success('Regional parameters synchronized successfully')
        }, 1500)
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 font-figtree pb-20">
            {/* Breadcrumbs / Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link 
                        href="/dashboard/settings" 
                        className="w-10 h-10 rounded-xl bg-card-bg border border-openpos-border flex items-center justify-center text-admin-dim hover:text-openpos-blue hover:border-openpos-blue/30 transition-all shadow-sm"
                    >
                        <ChevronLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-admin-value uppercase flex items-center gap-2">
                            <Globe size={20} className="text-openpos-blue" />
                            Regional Matrix
                        </h1>
                        <p className="text-[13px] font-medium text-admin-label mt-0.5">Manage localization, currency layers, and temporal signatures.</p>
                    </div>
                </div>
                <button 
                    onClick={handleSave}
                    disabled={loading}
                    className="w-full sm:w-auto bg-openpos-blue text-white px-8 py-2.5 rounded-xl font-bold text-[11px] flex items-center justify-center gap-2 shadow-lg shadow-openpos-blue/20 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest disabled:opacity-50"
                >
                    {loading ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                    Sync Parameters
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Settings Form */}
                <div className="lg:col-span-2 space-y-6">
                    <Card 
                        title="Localization Architecture" 
                        subtitle="Global system parameters and naming conventions"
                    >
                        <div className="space-y-6 mt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-admin-label uppercase tracking-widest ml-1">Entity Name</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-openpos-bg-subtle border-none rounded-2xl px-4 py-3 text-[13px] font-bold text-admin-value outline-none ring-1 ring-openpos-border focus:ring-openpos-blue/30"
                                        value={config.storeName}
                                        onChange={(e) => setConfig(prev => ({ ...prev, storeName: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-admin-label uppercase tracking-widest ml-1">Primary Language</label>
                                    <div className="relative">
                                        <Languages className="absolute left-4 top-1/2 -translate-y-1/2 text-openpos-blue" size={16} />
                                        <select 
                                            className="w-full bg-openpos-bg-subtle border-none rounded-2xl pl-12 pr-4 py-3 text-[13px] font-bold text-admin-value outline-none ring-1 ring-openpos-border focus:ring-openpos-blue/30 appearance-none"
                                            value={config.language}
                                            onChange={(e) => setConfig(prev => ({ ...prev, language: e.target.value }))}
                                        >
                                            <option>English</option>
                                            <option>Swahili</option>
                                            <option>French</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-admin-label uppercase tracking-widest ml-1">Physical Deployment Address</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-openpos-blue" size={16} />
                                    <input 
                                        type="text" 
                                        className="w-full bg-openpos-bg-subtle border-none rounded-2xl pl-12 pr-4 py-3 text-[13px] font-bold text-admin-value outline-none ring-1 ring-openpos-border focus:ring-openpos-blue/30"
                                        value={config.address}
                                        onChange={(e) => setConfig(prev => ({ ...prev, address: e.target.value }))}
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card 
                        title="Temporal & Fiscal Standards" 
                        subtitle="Standardizing time signatures and currency layers"
                    >
                        <div className="space-y-6 mt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-admin-label uppercase tracking-widest ml-1">System Timezone</label>
                                    <div className="relative">
                                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-openpos-blue" size={16} />
                                        <select 
                                            className="w-full bg-openpos-bg-subtle border-none rounded-2xl pl-12 pr-4 py-3 text-[13px] font-bold text-admin-value outline-none ring-1 ring-openpos-border focus:ring-openpos-blue/30 appearance-none"
                                            value={config.timezone}
                                            onChange={(e) => setConfig(prev => ({ ...prev, timezone: e.target.value }))}
                                        >
                                            <option>Africa/Nairobi (GMT+3)</option>
                                            <option>UTC (GMT+0)</option>
                                            <option>America/New_York (GMT-5)</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-admin-label uppercase tracking-widest ml-1">Settlement Currency</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-openpos-blue" size={16} />
                                        <select 
                                            className="w-full bg-openpos-bg-subtle border-none rounded-2xl pl-12 pr-4 py-3 text-[13px] font-bold text-admin-value outline-none ring-1 ring-openpos-border focus:ring-openpos-blue/30 appearance-none"
                                            value={config.currency}
                                            onChange={(e) => setConfig(prev => ({ ...prev, currency: e.target.value }))}
                                        >
                                            <option>KES (Kenyan Shilling)</option>
                                            <option>USD (US Dollar)</option>
                                            <option>EUR (Euro)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="p-8 bg-openpos-blue/5 border border-openpos-blue/10 rounded-[32px] space-y-4">
                        <p className="text-[10px] font-bold text-openpos-blue uppercase tracking-widest">Technical Insight</p>
                        <h4 className="text-[16px] font-bold text-admin-value leading-snug">Global settings affect all terminal nodes in your network.</h4>
                        <p className="text-[12px] text-admin-dim font-medium leading-relaxed">
                            Updating the currency layer will automatically re-calculate price displays on the POS grid, while timezone adjustments affect audit log temporal signatures.
                        </p>
                    </div>

                    <Card title="Audit Signature" subtitle="Last configuration update" noPadding>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-admin-dim uppercase">Last Modified</span>
                                <span className="text-[11px] font-bold text-admin-value">2 hours ago</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-admin-dim uppercase">Authorized By</span>
                                <span className="text-[11px] font-bold text-openpos-blue">Admin Root</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
