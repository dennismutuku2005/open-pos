"use client"

import React, { useState } from 'react'
import { ShieldCheck, Lock, Key, Eye, EyeOff, RefreshCw, ChevronLeft, Shield, AlertTriangle } from 'lucide-react'
import { Card } from '@/components/Card'
import { toast } from 'sonner'
import Link from 'next/link'

export default function SecuritySettingsPage() {
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    
    const handleUpdate = () => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            toast.success('Security protocols hardened successfully')
        }, 1500)
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 font-figtree pb-20">
            {/* Header */}
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
                            <ShieldCheck size={20} className="text-openpos-blue" />
                            Security Shield
                        </h1>
                        <p className="text-[13px] font-medium text-admin-label mt-0.5">Configure biometric access, 2FA, and encryption keys.</p>
                    </div>
                </div>
                <button 
                    onClick={handleUpdate}
                    disabled={loading}
                    className="w-full sm:w-auto bg-openpos-blue text-white px-8 py-2.5 rounded-xl font-bold text-[11px] flex items-center justify-center gap-2 shadow-lg shadow-openpos-blue/20 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest disabled:opacity-50"
                >
                    {loading ? <RefreshCw size={16} className="animate-spin" /> : <Shield size={16} />}
                    Harden Security
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card 
                        title="Administrative Access" 
                        subtitle="Manage password complexity and session timeouts"
                    >
                        <div className="space-y-6 mt-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-admin-label uppercase tracking-widest ml-1">Master Access Key</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-openpos-blue" size={16} />
                                    <input 
                                        type={showPassword ? "text" : "password"} 
                                        className="w-full bg-openpos-bg-subtle border-none rounded-2xl pl-12 pr-12 py-3 text-[13px] font-bold text-admin-value outline-none ring-1 ring-openpos-border focus:ring-openpos-blue/30"
                                        defaultValue="secret_key_placeholder"
                                    />
                                    <button 
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-admin-dim hover:text-openpos-blue transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-4 bg-openpos-bg-subtle border border-openpos-border rounded-2xl space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-bold text-admin-value uppercase tracking-tight">Two-Factor Auth</span>
                                        <div className="w-8 h-4 bg-openpos-blue rounded-full relative">
                                            <div className="absolute right-1 top-1 w-2 h-2 bg-white rounded-full" />
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-admin-dim font-medium leading-relaxed">Require a biometric or SMS token for administrative logins.</p>
                                </div>
                                <div className="p-4 bg-openpos-bg-subtle border border-openpos-border rounded-2xl space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-bold text-admin-value uppercase tracking-tight">Session Timeout</span>
                                        <span className="text-[10px] font-bold text-openpos-blue">4 Hours</span>
                                    </div>
                                    <p className="text-[10px] text-admin-dim font-medium leading-relaxed">Automatically terminate inactive sessions to prevent unauthorized access.</p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card 
                        title="Infrastructure Protection" 
                        subtitle="Database encryption and hardware lockouts"
                    >
                        <div className="space-y-4 mt-4">
                            <div className="flex items-center justify-between p-4 bg-red-500/5 border border-red-500/10 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <AlertTriangle className="text-red-500" size={20} />
                                    <div>
                                        <p className="text-[11px] font-bold text-admin-value uppercase tracking-tight">Data Purge Protocol</p>
                                        <p className="text-[10px] text-admin-dim font-medium">Instantly wipe sensitive data after 5 failed biometric attempts.</p>
                                    </div>
                                </div>
                                <button className="text-[10px] font-bold text-red-500 uppercase tracking-widest bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/20">Inactive</button>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="space-y-6">
                    <div className="p-8 bg-openpos-red/5 border border-openpos-red/10 rounded-[32px] space-y-4">
                        <p className="text-[10px] font-bold text-openpos-red uppercase tracking-widest">Risk Analysis</p>
                        <h4 className="text-[16px] font-bold text-admin-value leading-snug">Security hardening may affect peripheral device sync.</h4>
                        <p className="text-[12px] text-admin-dim font-medium leading-relaxed">
                            Updating your master key will require re-authentication on all active POS terminals and mobile handheld devices.
                        </p>
                    </div>

                    <Card title="Encryption Status" subtitle="System-wide protection" noPadding>
                        <div className="p-6 flex flex-col items-center text-center space-y-4">
                            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                <ShieldCheck size={32} />
                            </div>
                            <div>
                                <p className="text-[13px] font-bold text-admin-value">AES-256 BIT ACTIVE</p>
                                <p className="text-[10px] text-admin-dim font-medium uppercase mt-1">End-to-End Encryption</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
