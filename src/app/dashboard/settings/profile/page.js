"use client"

import React, { useState, useEffect } from 'react'
import { 
    User, Mail, Phone, MapPin, 
    Shield, Lock, Bell, Camera,
    Save, X, ChevronRight, CheckCircle2,
    Activity, Key, Smartphone, LogOut,
    BadgeCheck, Globe2
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import authService from '@/lib/auth'

export default function ProfilePage() {
    const [user, setUser] = useState(null)
    const [isEditing, setIsEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        location: 'Nairobi, Kenya',
        bio: 'Senior Administrator'
    })

    useEffect(() => {
        const userData = authService.getUser()
        if (userData) {
            setUser(userData)
            setFormData(prev => ({
                ...prev,
                name: userData.name || '',
                email: userData.username + '@pace.pos',
                phone: userData.phone || '+254 700 000 000'
            }))
        }
        setIsLoading(false)
    }, [])

    const handleSave = () => {
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            setIsEditing(false)
            toast.success('Profile credentials updated')
        }, 800)
    }

    if (!user) return null

    return (
        <div className="max-w-4xl mx-auto pb-10 space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-500 font-figtree">
            {/* Main Identity Card */}
            <div className="bg-white border border-openpos-border rounded-2xl overflow-hidden shadow-sm">
                <div className="h-24 bg-gradient-to-r from-openpos-blue/5 via-openpos-blue/[0.02] to-transparent relative">
                    <div className="absolute top-3 right-5 flex items-center gap-1.5 px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-full border border-openpos-border/50">
                        <span className="text-[12px]">🇰🇪</span>
                        <span className="text-[9px] font-bold text-admin-value uppercase tracking-widest">Kenya Office</span>
                    </div>
                </div>
                
                <div className="px-8 pb-8 relative">
                    <div className="flex flex-col sm:flex-row items-end gap-5 -mt-10 mb-6">
                        <div className="relative group">
                            <div className="w-24 h-24 rounded-2xl bg-white border-[4px] border-white shadow-lg flex items-center justify-center overflow-hidden">
                                <div className="w-full h-full bg-openpos-blue/5 flex items-center justify-center text-openpos-blue text-2xl font-bold">
                                    {user.name.charAt(0)}
                                </div>
                            </div>
                            <button className="absolute bottom-0 right-0 p-1.5 bg-openpos-blue text-white rounded-xl shadow-md hover:scale-105 transition-all border-2 border-white">
                                <Camera size={14} />
                            </button>
                        </div>
                        
                        <div className="flex-1 pb-1">
                            <div className="flex items-center gap-1.5 mb-0.5">
                                <h1 className="text-lg font-bold text-admin-value tracking-tight">{formData.name}</h1>
                                <div className="text-openpos-blue flex items-center" title="Verified Professional">
                                    <BadgeCheck size={18} fill="currentColor" className="text-white" />
                                    <BadgeCheck size={18} className="-ml-[18px]" />
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <p className="text-[10px] font-bold text-admin-dim uppercase tracking-[1.5px]">{user.type} • OPEN POS RETAIL</p>
                                <span className="w-1 h-1 rounded-full bg-admin-dim/20" />
                                <span className="text-[9px] font-bold text-openpos-green uppercase tracking-widest flex items-center gap-1">
                                    <div className="w-1 h-1 rounded-full bg-openpos-green animate-pulse" />
                                    Active
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            {!isEditing ? (
                                <button 
                                    onClick={() => setIsEditing(true)}
                                    className="bg-openpos-bg-subtle text-admin-value px-4 py-2 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-openpos-blue/5 hover:text-openpos-blue transition-all"
                                >
                                    Manage Identity
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => setIsEditing(false)}
                                        className="px-4 py-2 rounded-xl font-bold text-[10px] uppercase tracking-widest text-admin-dim hover:bg-openpos-bg-subtle transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={handleSave}
                                        disabled={isLoading}
                                        className="bg-openpos-blue text-white px-5 py-2 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-openpos-blue-dark transition-all shadow-md shadow-openpos-blue/20 flex items-center gap-1.5"
                                    >
                                        {isLoading ? <div className="w-2.5 h-2.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={12} />}
                                        Update
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-openpos-border pt-8">
                        <div className="space-y-4">
                            <h3 className="text-[9px] font-bold text-admin-dim uppercase tracking-[2.5px]">Personal Credentials</h3>
                            
                            <div className="space-y-3">
                                <div className="group">
                                    <label className="text-[8px] font-bold text-admin-dim uppercase tracking-widest ml-1 mb-1 block">Official Name</label>
                                    <div className={cn(
                                        "flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all",
                                        isEditing ? "bg-white border-openpos-blue/30 shadow-sm shadow-openpos-blue/5" : "bg-openpos-bg-subtle border-transparent"
                                    )}>
                                        <User size={14} className="text-admin-dim" />
                                        <input 
                                            readOnly={!isEditing}
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            className="bg-transparent border-none outline-none text-[12px] font-bold text-admin-value w-full"
                                        />
                                    </div>
                                </div>

                                <div className="group">
                                    <label className="text-[8px] font-bold text-admin-dim uppercase tracking-widest ml-1 mb-1 block">System Email</label>
                                    <div className={cn(
                                        "flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all",
                                        isEditing ? "bg-white border-openpos-blue/30 shadow-sm shadow-openpos-blue/5" : "bg-openpos-bg-subtle border-transparent"
                                    )}>
                                        <Mail size={14} className="text-admin-dim" />
                                        <input 
                                            readOnly={!isEditing}
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            className="bg-transparent border-none outline-none text-[12px] font-bold text-admin-value w-full"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-[9px] font-bold text-admin-dim uppercase tracking-[2.5px]">Contact & Reach</h3>
                            
                            <div className="space-y-3">
                                <div className="group">
                                    <label className="text-[8px] font-bold text-admin-dim uppercase tracking-widest ml-1 mb-1 block">Phone Number</label>
                                    <div className={cn(
                                        "flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all",
                                        isEditing ? "bg-white border-openpos-blue/30 shadow-sm shadow-openpos-blue/5" : "bg-openpos-bg-subtle border-transparent"
                                    )}>
                                        <Phone size={14} className="text-admin-dim" />
                                        <input 
                                            readOnly={!isEditing}
                                            value={formData.phone}
                                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                            className="bg-transparent border-none outline-none text-[12px] font-bold text-admin-value w-full"
                                        />
                                    </div>
                                </div>

                                <div className="group">
                                    <label className="text-[8px] font-bold text-admin-dim uppercase tracking-widest ml-1 mb-1 block">Duty Station</label>
                                    <div className={cn(
                                        "flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all",
                                        isEditing ? "bg-white border-openpos-blue/30 shadow-sm shadow-openpos-blue/5" : "bg-openpos-bg-subtle border-transparent"
                                    )}>
                                        <MapPin size={14} className="text-admin-dim" />
                                        <input 
                                            readOnly={!isEditing}
                                            value={formData.location}
                                            onChange={(e) => setFormData({...formData, location: e.target.value})}
                                            className="bg-transparent border-none outline-none text-[12px] font-bold text-admin-value w-full"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Security Section */}
            <div className="bg-white border border-openpos-border rounded-2xl overflow-hidden shadow-sm">
                <div className="px-8 py-4 border-b border-openpos-border bg-openpos-bg-subtle/30 flex items-center justify-between">
                    <h3 className="text-[9px] font-bold text-admin-value uppercase tracking-[2.5px]">System Security</h3>
                    <div className="flex items-center gap-1.5 text-[9px] font-bold text-openpos-blue bg-openpos-blue/10 px-2.5 py-1 rounded-lg uppercase tracking-widest">
                        <Shield size={10} /> Protected
                    </div>
                </div>
                <div className="divide-y divide-openpos-border">
                    {[
                        { title: 'Password Protection', desc: 'Secure your login credentials', icon: Key },
                        { title: 'Two-Factor Authentication', desc: 'Multi-layer security enabled', icon: Shield, active: true },
                        { title: 'Active Sessions', desc: 'Manage devices currently logged in', icon: Smartphone }
                    ].map((item, i) => (
                        <div key={i} className="px-8 py-4 flex items-center justify-between hover:bg-openpos-bg-subtle/30 transition-all cursor-pointer group">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-openpos-bg-subtle flex items-center justify-center text-admin-dim group-hover:text-openpos-blue group-hover:bg-openpos-blue/5 transition-all">
                                    <item.icon size={18} />
                                </div>
                                <div>
                                    <p className="text-[12px] font-bold text-admin-value">{item.title}</p>
                                    <p className="text-[9px] font-medium text-admin-dim uppercase tracking-widest mt-0.5">{item.desc}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {item.active && (
                                    <span className="text-[8px] font-bold text-white bg-openpos-green px-2 py-0.5 rounded-md uppercase tracking-widest">
                                        Active
                                    </span>
                                )}
                                <ChevronRight size={16} className="text-admin-dim group-hover:translate-x-1 transition-all" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
