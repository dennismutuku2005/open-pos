"use client"

import React from'react'
import Link from'next/link'
import { 
 Wallet, Scale, BookOpen, FileText, 
 TrendingUp, ArrowRight, ChevronRight,
 PieChart, Landmark, History
} from'lucide-react'
import { cn } from'@/lib/utils'
import { Card } from'@/components/Card'

export default function FinanceIndexPage() {
 const financeModules = [
 {
 id:'daybook',
 name:'Daily Daybook',
 description:'Cash flow & petty cash registry',
 href:'/dashboard/finance/daybook',
 icon: BookOpen,
 tag:'Real-time',
 color:'blue'
 },
 {
 id:'balance-sheet',
 name:'Balance Sheet',
 description:'Organizational solvency snapshot',
 href:'/dashboard/finance/balance-sheet',
 icon: Scale,
 tag:'Audit-ready',
 color:'blue'
 },
 {
 id:'ledger',
 name:'General Ledger',
 description:'Customer & Vendor account history',
 href:'/dashboard/finance/ledger',
 icon: History,
 tag:'Detailed',
 color:'blue'
 },
 {
 id:'profit-loss',
 name:'Profit & Loss',
 description:'Revenue vs Expenditure analysis',
 href:'/dashboard/profit-loss',
 icon: PieChart,
 tag:'Analytics',
 color:'blue'
 }
 ]

 return (
 <div className="space-y-8 animate-in fade-in duration-500 font-figtree pb-20">
 {/* Header */}
 <div>
 <h1 className="text-xl font-bold tracking-tight text-admin-value uppercase">Finance Architecture</h1>
 <p className="text-[13px] font-medium text-admin-label mt-1">Select a financial module to manage your organization's fiscal health.</p>
 </div>

 {/* Folder/Module Grid - Inspired by the"Item Grid"aesthetic */}
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
 {financeModules.map((module) => (
 <Link 
 key={module.id} 
 href={module.href}
 className="group relative bg-card-bg border border-openpos-border rounded-[24px] p-2 transition-all duration-300 flex flex-col"
 >
 {/*"Item"Image Area */}
 <div className="aspect-square rounded-[18px] bg-openpos-bg-subtle flex items-center justify-center relative overflow-hidden transition-transform duration-500">
 <div className="absolute inset-0 bg-gradient-to-br from-openpos-blue/5 to-transparent opacity-0 transition-opacity"/>
 <module.icon size={48} className="text-openpos-blue transition-transform duration-500 opacity-80"/>
 
 {/* Floating Tag (like'Sandwich'tag in image) */}
 <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-card-bg border border-openpos-border shadow-sm">
 <span className="text-[9px] font-bold text-openpos-blue uppercase tracking-widest">{module.tag}</span>
 </div>

 {/* Hover Action Indicator */}
 <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-openpos-blue text-white flex items-center justify-center opacity-0 translate-y-2 transition-all duration-300 shadow-lg shadow-openpos-blue/20">
 <ArrowRight size={16} />
 </div>
 </div>

 {/* Text Content */}
 <div className="p-4 space-y-1">
 <h3 className="text-[14px] font-bold text-admin-value transition-colors uppercase tracking-tight">
 {module.name}
 </h3>
 <p className="text-[11px] text-admin-dim font-medium leading-relaxed line-clamp-2">
 {module.description}
 </p>
 </div>
 </Link>
 ))}
 </div>

 {/* Quick Action / Summary Area (Lower section of POS-style grid) */}
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 <Card title="Financial Integrity"subtitle="Audit trails & Data security"noPadding>
 <div className="p-6 space-y-4">
 <div className="flex items-start gap-4 p-4 bg-openpos-bg-subtle rounded-2xl border border-openpos-border">
 <Landmark className="text-openpos-blue mt-1"size={20} />
 <div>
 <h4 className="text-[13px] font-bold text-admin-value uppercase">Consolidated Ledger</h4>
 <p className="text-[11px] text-admin-dim font-medium mt-1">All financial interactions are cryptographically signed and immutable once indexed.</p>
 </div>
 </div>
 <div className="flex items-center justify-between px-2">
 <span className="text-[10px] font-bold text-admin-dim uppercase tracking-widest">Compliance Status</span>
 <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded-md">Verified</span>
 </div>
 </div>
 </Card>
 
 <div className="lg:col-span-2 bg-openpos-blue/5 border border-openpos-blue/10 rounded-[32px] p-8 flex flex-col md:flex-row items-center gap-8">
 <div className="flex-1 space-y-4">
 <div className="flex items-center gap-2">
 <div className="w-8 h-8 rounded-lg bg-openpos-blue text-white flex items-center justify-center shadow-lg shadow-openpos-blue/20">
 <TrendingUp size={16} />
 </div>
 <span className="text-[10px] font-bold text-openpos-blue uppercase tracking-widest">Fiscal Growth</span>
 </div>
 <h2 className="text-2xl font-bold text-admin-value leading-tight">Master your organizational <span className="text-openpos-blue">cash flow dynamics</span> in real-time.</h2>
 <p className="text-[13px] text-admin-dim font-medium leading-relaxed">
 Navigate through specialized ledgers to gain unprecedented visibility into your procurement cycles and customer settlement behaviors.
 </p>
 </div>
 <div className="w-48 h-48 bg-card-bg border border-openpos-border rounded-3xl shadow-2xl flex items-center justify-center p-6 rotate-3 transition-transform duration-500">
 <Wallet size={80} className="text-openpos-blue opacity-20"/>
 </div>
 </div>
 </div>
 </div>
 )
}
