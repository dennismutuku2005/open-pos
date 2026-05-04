"use client"

import React, { useState } from'react'
import { Scale, Calendar, Download, TrendingUp, TrendingDown, Wallet, Briefcase } from'lucide-react'
import { cn } from'@/lib/utils'
import { toast } from'sonner'
import { Card, StatCard } from'@/components/Card'

export default function BalanceSheetPage() {
 const downloadSheet = () => {
 toast.success("Initializing encrypted PDF generation for Balance Sheet...")
 }

 return (
 <div className="space-y-6 animate-in fade-in duration-500 font-figtree pb-10">
 {/* Header */}
 <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
 <div>
 <h1 className="text-xl font-bold tracking-tight text-admin-value flex items-center gap-2 uppercase">
 <Scale size={20} className="text-openpos-blue"/>
 Balance Sheet Ledger
 </h1>
 <p className="text-[13px] font-medium text-admin-label mt-1">Strategic snapshot of organizational financial position and equity distribution.</p>
 </div>
 <div className="flex gap-3 w-full sm:w-auto">
 <button className="flex-1 sm:flex-none bg-card-bg border border-openpos-border text-admin-value px-4 py-2.5 rounded-xl font-bold text-[11px] flex items-center justify-center gap-2 transition-all uppercase tracking-widest shadow-sm">
 <Calendar size={16} />
 As of Today
 </button>
 <button 
 onClick={downloadSheet}
 className="flex-1 sm:flex-none bg-openpos-blue text-white px-5 py-2.5 rounded-xl font-bold text-[11px] flex items-center justify-center gap-2 shadow-lg shadow-openpos-blue/20 transition-all uppercase tracking-widest"
 >
 <Download size={18} />
 Export Ledger
 </button>
 </div>
 </div>

 {/* Financial Health Metrics */}
 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
 <StatCard 
 title="Liquidity Ratio"
 value="2.45:1"
 change="Stable solvency index"
 isPositive={true} 
 icon={TrendingUp} 
 color="blue"
 subtitle="CURRENT RATIO"
 />
 <StatCard 
 title="Working Capital"
 value="KES 406,000"
 change="Available operational liquidity"
 isPositive={true} 
 icon={Wallet} 
 color="blue"
 subtitle="NET OPERATIONS"
 />
 <StatCard 
 title="Equity Strength"
 value="79.2%"
 change="Owner investment ratio"
 isPositive={true} 
 icon={Briefcase} 
 color="blue"
 subtitle="CAPITAL STRUCTURE"
 />
 </div>

 {/* Balance Sheet Container */}
 <Card 
 title="Consolidated Statement of Financial Position"
 subtitle="High-fidelity audit of assets, liabilities, and owner equity"
 noPadding
 >
 <div className="p-8">
 <div className="text-center mb-10 pb-8 border-b border-openpos-border">
 <h2 className="text-[20px] font-bold text-admin-value uppercase tracking-[4px]">PACE WISP RETAIL</h2>
 <p className="text-[11px] font-bold text-openpos-blue uppercase tracking-[2px] mt-2">Certified Balance Sheet</p>
 <p className="text-[10px] text-admin-dim font-bold uppercase tracking-widest mt-1">Audit Signature: {new Date().toLocaleDateString('en-KE', { month:'long', day:'numeric', year:'numeric'})}</p>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
 
 {/* ASSETS (Left Side) */}
 <div className="space-y-8">
 <div>
 <div className="flex items-center gap-2 border-b-2 border-admin-value pb-3 mb-6">
 <TrendingUp size={18} className="text-openpos-blue"/>
 <h3 className="text-[14px] font-bold text-admin-value uppercase tracking-widest">Organizational Assets</h3>
 </div>
 
 <div className="space-y-8">
 <div>
 <h4 className="text-[10px] font-bold text-openpos-blue uppercase tracking-[2px] mb-4 bg-openpos-blue/5 px-3 py-1 rounded-lg w-fit">Current Assets</h4>
 <div className="space-y-4">
 <div className="flex justify-between items-center group">
 <span className="text-[12px] font-bold text-admin-dim uppercase tracking-tight transition-colors">Cash & Equivalents</span>
 <span className="text-[13px] font-bold text-admin-value tabular-nums">125,500.00</span>
 </div>
 <div className="flex justify-between items-center group">
 <span className="text-[12px] font-bold text-admin-dim uppercase tracking-tight transition-colors">Accounts Receivable</span>
 <span className="text-[13px] font-bold text-admin-value tabular-nums">145,000.00</span>
 </div>
 <div className="flex justify-between items-center group">
 <span className="text-[12px] font-bold text-admin-dim uppercase tracking-tight transition-colors">Inventory Liquidity</span>
 <span className="text-[13px] font-bold text-admin-value tabular-nums">340,000.00</span>
 </div>
 </div>
 <div className="flex justify-between items-center text-[12px] font-bold mt-4 pt-4 border-t border-dashed border-openpos-border text-openpos-blue">
 <span className="uppercase tracking-widest">Total Current Assets</span>
 <span className="tabular-nums">610,500.00</span>
 </div>
 </div>

 <div>
 <h4 className="text-[10px] font-bold text-openpos-blue uppercase tracking-[2px] mb-4 bg-openpos-blue/5 px-3 py-1 rounded-lg w-fit">Fixed Assets</h4>
 <div className="space-y-4">
 <div className="flex justify-between items-center group">
 <span className="text-[12px] font-bold text-admin-dim uppercase tracking-tight transition-colors">Operational Equipment</span>
 <span className="text-[13px] font-bold text-admin-value tabular-nums">250,000.00</span>
 </div>
 <div className="flex justify-between items-center group">
 <span className="text-[12px] font-bold text-admin-dim uppercase tracking-tight transition-colors">Furniture & Infrastructure</span>
 <span className="text-[13px] font-bold text-admin-value tabular-nums">120,000.00</span>
 </div>
 </div>
 <div className="flex justify-between items-center text-[12px] font-bold mt-4 pt-4 border-t border-dashed border-openpos-border text-openpos-blue">
 <span className="uppercase tracking-widest">Total Fixed Assets</span>
 <span className="tabular-nums">370,000.00</span>
 </div>
 </div>
 </div>
 </div>

 <div className="flex justify-between items-center text-[15px] font-bold border-t-2 border-admin-value pt-4 bg-openpos-bg-subtle/30 px-4 py-3 rounded-xl">
 <span className="uppercase tracking-[2px] text-admin-value">Aggregate Assets</span>
 <span className="text-openpos-blue tabular-nums">KES 980,500.00</span>
 </div>
 </div>

 {/* LIABILITIES & EQUITY (Right Side) */}
 <div className="space-y-8">
 <div>
 <div className="flex items-center gap-2 border-b-2 border-admin-value pb-3 mb-6">
 <TrendingDown size={18} className="text-openpos-red"/>
 <h3 className="text-[14px] font-bold text-admin-value uppercase tracking-widest">Liabilities & Equity</h3>
 </div>
 
 <div className="space-y-8">
 <div>
 <h4 className="text-[10px] font-bold text-openpos-red uppercase tracking-[2px] mb-4 bg-openpos-red/5 px-3 py-1 rounded-lg w-fit">Current Liabilities</h4>
 <div className="space-y-4">
 <div className="flex justify-between items-center group">
 <span className="text-[12px] font-bold text-admin-dim uppercase tracking-tight transition-colors">Accounts Payable</span>
 <span className="text-[13px] font-bold text-admin-value tabular-nums">42,500.00</span>
 </div>
 <div className="flex justify-between items-center group">
 <span className="text-[12px] font-bold text-admin-dim uppercase tracking-tight transition-colors">Short-term Debt</span>
 <span className="text-[13px] font-bold text-admin-value tabular-nums">150,000.00</span>
 </div>
 <div className="flex justify-between items-center group">
 <span className="text-[12px] font-bold text-admin-dim uppercase tracking-tight transition-colors">Tax Liabilities</span>
 <span className="text-[13px] font-bold text-admin-value tabular-nums">12,000.00</span>
 </div>
 </div>
 <div className="flex justify-between items-center text-[12px] font-bold mt-4 pt-4 border-t border-dashed border-openpos-border text-openpos-red">
 <span className="uppercase tracking-widest">Total Liabilities</span>
 <span className="tabular-nums">204,500.00</span>
 </div>
 </div>

 <div>
 <h4 className="text-[10px] font-bold text-openpos-blue uppercase tracking-[2px] mb-4 bg-openpos-blue/5 px-3 py-1 rounded-lg w-fit">Owner's Equity</h4>
 <div className="space-y-4">
 <div className="flex justify-between items-center group">
 <span className="text-[12px] font-bold text-admin-dim uppercase tracking-tight transition-colors">Owner's Capital</span>
 <span className="text-[13px] font-bold text-admin-value tabular-nums">500,000.00</span>
 </div>
 <div className="flex justify-between items-center group">
 <span className="text-[12px] font-bold text-admin-dim uppercase tracking-tight transition-colors">Retained Earnings</span>
 <span className="text-[13px] font-bold text-admin-value tabular-nums">288,000.00</span>
 </div>
 <div className="flex justify-between items-center group text-openpos-red">
 <span className="text-[12px] font-bold text-admin-dim uppercase tracking-tight">Dividend Drawings</span>
 <span className="text-[13px] font-bold tabular-nums">(-12,000.00)</span>
 </div>
 </div>
 <div className="flex justify-between items-center text-[12px] font-bold mt-4 pt-4 border-t border-dashed border-openpos-border text-openpos-blue">
 <span className="uppercase tracking-widest">Total Equity</span>
 <span className="tabular-nums">776,000.00</span>
 </div>
 </div>
 </div>
 </div>

 <div className="flex justify-between items-center text-[15px] font-bold border-t-2 border-admin-value pt-4 bg-openpos-bg-subtle/30 px-4 py-3 rounded-xl">
 <span className="uppercase tracking-[2px] text-admin-value">Aggregate Liab. & Equity</span>
 <span className="text-openpos-blue tabular-nums">KES 980,500.00</span>
 </div>
 </div>

 </div>
 </div>
 </Card>
 </div>
 )
}
