"use client"

import React, { useState } from'react'
import { Store, Printer, Receipt, Tablet, RefreshCw, ChevronLeft, Save, Layout, Settings } from'lucide-react'
import { Card } from'@/components/Card'
import { toast } from'sonner'
import Link from'next/link'

export default function TerminalSettingsPage() {
 const [loading, setLoading] = useState(false)
 const [config, setConfig] = useState({
 taxRate: 16,
 discountLimit: 20,
 receiptHeader:'Thank you for shopping with Pace!',
 enablePrinter: true,
 terminalId:'T-800'
 })

 const handleSave = () => {
 setLoading(true)
 setTimeout(() => {
 setLoading(false)
 toast.success('Terminal protocols updated across all nodes')
 }, 1500)
 }

 return (
 <div className="space-y-6 animate-in fade-in duration-500 font-figtree pb-20">
 {/* Header */}
 <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
 <div className="flex items-center gap-4">
 <Link 
 href="/dashboard/settings"
 className="w-10 h-10 rounded-lg bg-card-bg border border-openpos-border flex items-center justify-center text-admin-dim transition-all shadow-sm"
 >
 <ChevronLeft size={20} />
 </Link>
 <div>
 <h1 className="text-xl font-bold tracking-tight text-admin-value uppercase flex items-center gap-2">
 <Store size={20} className="text-openpos-blue"/>
 Terminal Config
 </h1>
 <p className="text-[13px] font-medium text-admin-label mt-0.5">Configure taxes, receipt templates, and hardware peripherals.</p>
 </div>
 </div>
 <button 
 onClick={handleSave}
 disabled={loading}
 className="w-full sm:w-auto bg-openpos-blue text-white px-8 py-2.5 rounded-lg font-bold text-[11px] flex items-center justify-center gap-2 shadow-lg shadow-openpos-blue/20 transition-all uppercase tracking-widest disabled:opacity-50"
 >
 {loading ? <RefreshCw size={16} className="animate-spin"/> : <Settings size={16} />}
 Sync Terminal
 </button>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 <div className="lg:col-span-2 space-y-6">
 <Card 
 title="Fiscal Parameters"
 subtitle="Standardizing tax layers and discount boundaries"
 >
 <div className="space-y-6 mt-4">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div className="space-y-2">
 <label className="text-[10px] font-bold text-admin-label uppercase tracking-widest ml-1">VAT / Sales Tax (%)</label>
 <input 
 type="number"
 className="w-full bg-openpos-bg-subtle border-none rounded-lg px-4 py-3 text-[13px] font-bold text-admin-value outline-none ring-1 ring-openpos-border"
 value={config.taxRate}
 onChange={(e) => setConfig(prev => ({ ...prev, taxRate: e.target.value }))}
 />
 </div>
 <div className="space-y-2">
 <label className="text-[10px] font-bold text-admin-label uppercase tracking-widest ml-1">Max Operator Discount (%)</label>
 <input 
 type="number"
 className="w-full bg-openpos-bg-subtle border-none rounded-lg px-4 py-3 text-[13px] font-bold text-admin-value outline-none ring-1 ring-openpos-border"
 value={config.discountLimit}
 onChange={(e) => setConfig(prev => ({ ...prev, discountLimit: e.target.value }))}
 />
 </div>
 </div>
 </div>
 </Card>

 <Card 
 title="Hardware & Peripherals"
 subtitle="Managing connected thermal printers and displays"
 >
 <div className="space-y-4 mt-4">
 <div className="flex items-center justify-between p-4 bg-openpos-bg-subtle border border-openpos-border rounded-lg group transition-all">
 <div className="flex items-center gap-3">
 <Printer className="text-openpos-blue"size={20} />
 <div>
 <p className="text-[11px] font-bold text-admin-value uppercase tracking-tight">Thermal Printer Integration</p>
 <p className="text-[10px] text-admin-dim font-medium">Automatic receipt generation on settlement</p>
 </div>
 </div>
 <div className="w-10 h-5 bg-openpos-blue rounded-full relative cursor-pointer">
 <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"/>
 </div>
 </div>

 <div className="flex items-center justify-between p-4 bg-openpos-bg-subtle border border-openpos-border rounded-lg group transition-all">
 <div className="flex items-center gap-3">
 <Tablet className="text-openpos-blue"size={20} />
 <div>
 <p className="text-[11px] font-bold text-admin-value uppercase tracking-tight">Customer-Facing Display</p>
 <p className="text-[10px] text-admin-dim font-medium">Real-time cart visualization for clients</p>
 </div>
 </div>
 <div className="w-10 h-5 bg-openpos-bg-subtle border border-openpos-border rounded-full relative cursor-pointer">
 <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full"/>
 </div>
 </div>
 </div>
 </Card>
 </div>

 <div className="space-y-6">
 <div className="p-8 bg-openpos-blue/5 border border-openpos-blue/10 rounded-[32px] space-y-4">
 <p className="text-[10px] font-bold text-openpos-blue uppercase tracking-widest">Printer Preview</p>
 <div className="bg-white p-4 rounded-lg shadow-inner rotate-1 space-y-2">
 <div className="h-2 w-1/2 bg-gray-200 rounded mx-auto"/>
 <div className="h-1 w-full bg-gray-100 rounded"/>
 <div className="h-1 w-3/4 bg-gray-100 rounded mx-auto"/>
 <div className="pt-2 border-t border-dashed border-gray-300">
 <div className="flex justify-between">
 <div className="h-1 w-1/4 bg-gray-100 rounded"/>
 <div className="h-1 w-1/4 bg-gray-100 rounded"/>
 </div>
 </div>
 </div>
 <p className="text-[11px] text-admin-dim font-medium leading-relaxed text-center">
 Standard 58mm / 80mm thermal receipt structure.
 </p>
 </div>

 <Card title="Terminal Identity"subtitle="Hardware tracking"noPadding>
 <div className="p-6 space-y-4">
 <div className="flex items-center justify-between">
 <span className="text-[10px] font-bold text-admin-dim uppercase">Node ID</span>
 <span className="text-[11px] font-bold text-admin-value">{config.terminalId}</span>
 </div>
 <div className="flex items-center justify-between">
 <span className="text-[10px] font-bold text-admin-dim uppercase">Firmware</span>
 <span className="text-[11px] font-bold text-openpos-blue">v2.4.0-Stable</span>
 </div>
 </div>
 </Card>
 </div>
 </div>
 </div>
 )
}
