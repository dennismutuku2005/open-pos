"use client"

import React, { useState } from 'react'
import { 
    User, CreditCard, ShoppingBag, 
    Users, ShieldCheck, Settings as SettingsIcon,
    ChevronRight, LogOut, Bell, Smartphone,
    DollarSign, Receipt, Globe, Shield,
    Store, Briefcase, Lock, Wallet
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const settingsGroups = [
    {
        title: 'Account & Profile',
        items: [
            { id: 'profile', name: 'Your Profile', desc: 'Personal information and security', icon: User, href: '/dashboard/settings/profile' },
            { id: 'notifications', name: 'Notification Settings', desc: 'Configure how you receive alerts', icon: Bell, href: '/dashboard/notifications' },
        ]
    },
    {
        title: 'POS & Sales',
        items: [
            { id: 'payments', name: 'Payment Methods', desc: 'Manage cash, MPESA, and cards', icon: Wallet, href: '/dashboard/settings/payments' },
            { id: 'sales-config', name: 'Sales Configuration', desc: 'Taxes, discounts, and receipts', icon: Store, href: '/dashboard/config' },
            { id: 'expenses', name: 'Expense Categories', desc: 'Organize your spending', icon: Receipt, href: '/dashboard/expenses' },
        ]
    },
    {
        title: 'Organization',
        items: [
            { id: 'staff', name: 'Staff Management', desc: 'Roles, permissions and shifts', icon: Users, href: '/dashboard/staff' },
            { id: 'policies', name: 'Policies & Security', desc: 'System access and audit logs', icon: ShieldCheck, href: '/dashboard/staff' },
        ]
    },
    {
        title: 'System',
        items: [
            { id: 'general', name: 'General Settings', desc: 'Language, timezone and currency', icon: Globe, href: '/dashboard/config' },
            { id: 'api', name: 'API & Integrations', desc: 'Connect with external services', icon: Smartphone, href: '/dashboard/config' },
        ]
    }
]

export default function SettingsPage() {
    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-admin-value">System Settings</h1>
                    <p className="text-admin-label mt-1 text-[14px]">Configure and manage your POS system preferences.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {settingsGroups.map((group, groupIdx) => (
                    <div key={groupIdx} className="space-y-4">
                        <h3 className="text-[11px] font-bold text-admin-dim uppercase tracking-[3px] ml-1">{group.title}</h3>
                        <div className="space-y-3">
                            {group.items.map((item) => (
                                <Link 
                                    key={item.id} 
                                    href={item.href}
                                    className="group flex items-center justify-between p-4 bg-card-bg border border-openpos-border rounded-3xl hover:border-openpos-blue/30 hover:shadow-xl hover:shadow-openpos-blue/5 transition-all"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-openpos-bg-subtle flex items-center justify-center text-admin-dim group-hover:bg-openpos-blue/10 group-hover:text-openpos-blue transition-all">
                                            <item.icon size={24} strokeWidth={1.5} />
                                        </div>
                                        <div>
                                            <p className="text-[14px] font-bold text-admin-value group-hover:text-openpos-blue transition-colors">{item.name}</p>
                                            <p className="text-[11px] text-admin-label font-medium mt-0.5">{item.desc}</p>
                                        </div>
                                    </div>
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-admin-dim group-hover:translate-x-1 group-hover:text-openpos-blue transition-all">
                                        <ChevronRight size={18} />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Support/Info Card */}
            <div className="bg-openpos-blue rounded-3xl p-8 relative overflow-hidden shadow-2xl shadow-openpos-blue/20">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-white">Need help with configuration?</h2>
                        <p className="text-white/70 text-[14px] max-w-lg">Our support team is available 24/7 to help you set up your POS system for maximum efficiency.</p>
                    </div>
                    <button className="bg-white text-openpos-blue px-8 py-3 rounded-2xl font-bold text-[13px] uppercase tracking-widest shadow-xl hover:scale-105 transition-all">
                        Contact Support
                    </button>
                </div>
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />
            </div>
        </div>
    )
}
