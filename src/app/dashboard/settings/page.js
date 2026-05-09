"use client"

import React from'react'
import { 
 User, Wallet, Store, Users, 
 Globe, Smartphone, ShieldCheck, 
 Bell, ArrowRight, Settings as SettingsIcon,
 Shield, Lock, CreditCard, Layout
} from'lucide-react'
import { cn } from'@/lib/utils'
import Link from'next/link'

const settingsModules = [
 {
 id:'profile',
 name:'Profile Identity',
 desc:'Personal administrative signatures and security protocols',
 href:'/dashboard/settings/profile',
 icon: User,
 tag:'Identity',
 color:'blue'
 },
 {
 id:'payments',
 name:'Payment Channels',
 desc:'Configure M-Pesa, Cash, and Card settlement vectors',
 href:'/dashboard/settings/payments',
 icon: Wallet,
 tag:'Financial',
 color:'blue'
 },
 {
 id:'pos-config',
 name:'Terminal Config',
 desc:'Taxes, receipt templates, and hardware peripherals',
 href:'/dashboard/settings/terminal',
 icon: Store,
 tag:'Operational',
 color:'blue'
 },
 {
 id:'security',
 name:'Security Shield',
 desc:'Encryption keys, 2FA, and access control policies',
 href:'/dashboard/settings/security',
 icon: ShieldCheck,
 tag:'Protection',
 color:'blue'
 },
 {
 id:'staff-roles',
 name:'Staff Hierarchy',
 desc:'Manage organizational roles and biometric access',
 href:'/dashboard/staff',
 icon: Users,
 tag:'Human Capital',
 color:'blue'
 },
 {
 id:'notifications',
 name:'Alert Protocols',
 desc:'Configure system-wide push and email signals',
 href:'/dashboard/notifications',
 icon: Bell,
 tag:'Signals',
 color:'blue'
 },
 {
 id:'regional',
 name:'Regional Matrix',
 desc:'Currency localization, timezones, and language layers',
 href:'/dashboard/settings/general',
 icon: Globe,
 tag:'Localization',
 color:'blue'
 },
 {
 id:'integrations',
 name:'System Bridge',
 desc:'API keys, webhooks, and third-party sync states',
 href:'/dashboard/settings/api',
 icon: Smartphone,
 tag:'Connection',
 color:'blue'
 }
]

export default function SettingsPage() {
 return (
 <div className="space-y-8 animate-in fade-in duration-500 font-figtree pb-20">
 {/* Header */}
 <div>
 <h1 className="text-xl font-bold tracking-tight text-admin-value uppercase flex items-center gap-2">
 <SettingsIcon size={20} className="text-openpos-blue"/>
 System Configuration Matrix
 </h1>
 <p className="text-[13px] font-medium text-admin-label mt-1">Fine-tune your POS infrastructure and organizational parameters.</p>
 </div>

 {/* POS-Style Grid Layout */}
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
 {settingsModules.map((module) => (
 <Link 
 key={module.id} 
 href={module.href}
 className="group relative bg-card-bg border border-openpos-border rounded-[24px] p-2 transition-all duration-300 flex flex-col"
 >
 {/* Module Visual Area */}
 <div className="aspect-square rounded-[18px] bg-openpos-bg-subtle flex items-center justify-center relative overflow-hidden transition-transform duration-500">
 <div className="absolute inset-0 bg-gradient-to-br from-openpos-blue/5 to-transparent opacity-0 transition-opacity"/>
 <module.icon size={48} className="text-openpos-blue opacity-80 transition-transform duration-500"/>
 
 {/* Floating Metadata Tag */}
 <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-card-bg border border-openpos-border shadow-sm">
 <span className="text-[9px] font-bold text-openpos-blue uppercase tracking-[2px]">{module.tag}</span>
 </div>

 {/* Execution Indicator */}
 <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-openpos-blue text-white flex items-center justify-center opacity-0 translate-y-2 transition-all duration-300 shadow-lg shadow-openpos-blue/20">
 <ArrowRight size={16} />
 </div>
 </div>

 {/* Description Layer */}
 <div className="p-4 space-y-1">
 <h3 className="text-[14px] font-bold text-admin-value transition-colors uppercase tracking-tight">
 {module.name}
 </h3>
 <p className="text-[11px] text-admin-dim font-medium leading-relaxed line-clamp-2">
 {module.desc}
 </p>
 </div>
 </Link>
 ))}
 </div>

 {/* Operational Status (Replaces big blue card) */}
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
 <div className="lg:col-span-2 p-8 bg-openpos-bg-subtle border border-openpos-border rounded-[32px] flex flex-col md:flex-row items-center gap-8 group">
 <div className="flex-1 space-y-4 text-center md:text-left">
 <div className="flex items-center justify-center md:justify-start gap-2">
 <div className="w-8 h-8 rounded-lg bg-openpos-blue text-white flex items-center justify-center shadow-lg shadow-openpos-blue/20">
 <Lock size={16} />
 </div>
 <span className="text-[10px] font-bold text-openpos-blue uppercase tracking-widest">Security Status</span>
 </div>
 <h2 className="text-2xl font-bold text-admin-value leading-tight">Your system is protected by <span className="text-openpos-blue">AES-256</span> encryption protocols.</h2>
 <p className="text-[13px] text-admin-dim font-medium leading-relaxed">
 All settings modified in this matrix are instantly synchronized across your terminal network and cryptographically signed for audit transparency.
 </p>
 <div className="flex flex-wrap gap-3 pt-2 justify-center md:justify-start">
 <div className="px-3 py-1 bg-card-bg border border-openpos-border rounded-lg text-[10px] font-bold text-admin-dim uppercase tracking-widest">TLS 1.3 Active</div>
 <div className="px-3 py-1 bg-card-bg border border-openpos-border rounded-lg text-[10px] font-bold text-admin-dim uppercase tracking-widest">Cloud Sync: OK</div>
 </div>
 </div>
 <div className="w-48 h-48 bg-card-bg border border-openpos-border rounded-[40px] shadow-2xl flex items-center justify-center p-6 -rotate-2 transition-transform duration-500">
 <Lock size={80} className="text-openpos-blue opacity-10"/>
 </div>
 </div>

 <div className="bg-card-bg border border-openpos-border rounded-[32px] p-8 flex flex-col justify-center items-center text-center space-y-6">
 <div className="w-16 h-16 rounded-lg bg-openpos-blue/5 flex items-center justify-center text-openpos-blue">
 <Layout size={32} />
 </div>
 <div>
 <h4 className="text-[15px] font-bold text-admin-value uppercase tracking-tight">Need assistance?</h4>
 <p className="text-[12px] text-admin-dim font-medium mt-2 leading-relaxed">Our technical engineers are on standby for system deployment queries.</p>
 </div>
 <button className="w-full py-3.5 bg-openpos-blue text-white rounded-lg font-bold text-[11px] uppercase tracking-[2px] shadow-lg shadow-openpos-blue/20 transition-all">
 Technical Support
 </button>
 </div>
 </div>
 </div>
 )
}
