"use client"

import React, { useState } from'react'
import { Search, Filter, ArrowUpRight, ArrowDownRight, Users, Briefcase, FileText, Activity, ChevronRight, Calendar } from'lucide-react'
import { cn } from'@/lib/utils'
import { Card, StatCard } from'@/components/Card'

const mockLedger = [
 { id:'TRX-001', date:'2024-05-01', description:'Payment Received', type:'Credit', amount: 15000, balance: 15000, entity:'John Doe (Customer)'},
 { id:'TRX-002', date:'2024-05-02', description:'Supplier Payment', type:'Debit', amount: 5000, balance: 10000, entity:'Tech Supply Co.'},
 { id:'TRX-003', date:'2024-05-03', description:'Credit Sale', type:'Debit', amount: 8500, balance: 18500, entity:'Jane Smith (Customer)'},
 { id:'TRX-004', date:'2024-05-04', description:'Refund Issued', type:'Debit', amount: 1200, balance: 17300, entity:'John Doe (Customer)'},
]

export default function LedgersPage() {
 const [activeTab, setActiveTab] = useState('customers')

 return (
 <div className="space-y-6 animate-in fade-in duration-500 font-figtree pb-10">
 {/* Header */}
 <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
 <div>
 <h1 className="text-xl font-bold tracking-tight text-admin-value uppercase">General Ledger</h1>
 <p className="text-[13px] font-medium text-admin-label mt-1">Audit trail for customer and supplier financial account settlements.</p>
 </div>
 <div className="flex bg-openpos-bg-subtle p-1 rounded-2xl ring-1 ring-openpos-border shadow-sm">
 <button 
 onClick={() => setActiveTab('customers')}
 className={cn(
"px-6 py-2 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all",
 activeTab ==='customers'?"bg-card-bg text-openpos-blue shadow-lg border border-openpos-border":"text-admin-dim"
 )}
 >
 Customer Ledger
 </button>
 <button 
 onClick={() => setActiveTab('suppliers')}
 className={cn(
"px-6 py-2 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all",
 activeTab ==='suppliers'?"bg-card-bg text-openpos-blue shadow-lg border border-openpos-border":"text-admin-dim"
 )}
 >
 Vendor Ledger
 </button>
 </div>
 </div>

 {/* Quick Stats */}
 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
 <StatCard title="Total Receivables"value="KES 145,000"change="+KES 12,400 this week"isPositive={true} icon={ArrowUpRight} color="blue"subtitle="CUSTOMER BALANCES"/>
 <StatCard title="Total Payables"value="KES 42,500"change="-KES 5,000 this week"isPositive={false} icon={ArrowDownRight} color="blue"subtitle="SUPPLIER BALANCES"/>
 <StatCard title="Account Activity"value="24 Active"change="Across all entities"isPositive={true} icon={Activity} color="blue"subtitle="LEDGER VOLUME"/>
 </div>

 {/* Ledger Table */}
 <Card 
 noPadding
 title={`${activeTab ==='customers'?'Accounts Receivable':'Accounts Payable'} Registry`}
 subtitle={`Chronological audit of ${activeTab} financial interactions`}
 headerAction={
 <div className="flex items-center gap-3">
 <div className="relative group">
 <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-admin-dim group-focus-within:text-openpos-blue transition-colors"size={14} />
 <input 
 placeholder="Search entities or TRX ID..."
 className="bg-openpos-bg-subtle border border-openpos-border rounded-xl pl-10 pr-4 py-1.5 text-[11px] font-bold text-admin-value outline-none w-64 transition-all"
 />
 </div>
 <button className="flex items-center gap-2 px-3 py-1.5 bg-openpos-bg-subtle border border-openpos-border rounded-lg text-admin-dim transition-all">
 <Filter size={14} />
 <span className="text-[10px] font-bold uppercase tracking-widest">Filter</span>
 </button>
 </div>
 }
 >
 <div className="overflow-x-auto custom-scrollbar">
 <table className="w-full text-left whitespace-nowrap border-collapse text-[11px]">
 <thead>
 <tr className="bg-openpos-bg-subtle/50 border-b border-openpos-border text-[9px] font-bold text-admin-dim uppercase tracking-widest">
 <th className="px-6 py-4">Temporal Signature</th>
 <th className="px-6 py-4">Transaction Identity</th>
 <th className="px-6 py-4">Entity Identity</th>
 <th className="px-6 py-4">Narration</th>
 <th className="px-6 py-4 text-center">Settlement Type</th>
 <th className="px-6 py-4 text-right">Settlement Total</th>
 <th className="px-6 py-4 text-right">Cumulative Balance</th>
 <th className="px-6 py-4 text-right">Ledger</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-openpos-border">
 {mockLedger.map(trx => (
 <tr key={trx.id} className="group transition-colors cursor-default">
 <td className="px-6 py-4">
 <div className="flex items-center gap-2 text-admin-dim font-bold">
 <Calendar size={12} className="text-openpos-blue"/>
 <span className="uppercase">{trx.date}</span>
 </div>
 </td>
 <td className="px-6 py-4">
 <span className="font-bold text-admin-value uppercase tracking-tight transition-colors">{trx.id}</span>
 </td>
 <td className="px-6 py-4">
 <span className="text-admin-value font-bold uppercase tracking-tight">{trx.entity}</span>
 </td>
 <td className="px-6 py-4">
 <span className="text-admin-dim font-bold uppercase tracking-tighter opacity-80">{trx.description}</span>
 </td>
 <td className="px-6 py-4 text-center">
 <span className={cn(
"inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest border",
 trx.type ==='Credit'?"bg-openpos-blue/5 text-openpos-blue border-openpos-blue/10":"bg-openpos-red/5 text-openpos-red border-openpos-red/10"
 )}>
 {trx.type}
 </span>
 </td>
 <td className="px-6 py-4 text-right">
 <span className="text-[13px] font-bold text-admin-value">KES {trx.amount.toLocaleString()}</span>
 </td>
 <td className="px-6 py-4 text-right">
 <span className="text-[13px] font-bold text-openpos-blue">KES {trx.balance.toLocaleString()}</span>
 </td>
 <td className="px-6 py-4 text-right">
 <div className="w-10"/> {/* Spacer for alignment */}
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
