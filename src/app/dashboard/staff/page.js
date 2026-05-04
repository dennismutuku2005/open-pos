"use client"

import React, { useState, useEffect } from 'react'
import {
    Users, Search, Plus, Trash2, Edit2,
    Loader2, CheckCircle2, Eye, EyeOff,
    UserCheck, Key, Fingerprint, RefreshCw,
    AtSign, Phone, Clock, UserX, UserRoundCheck
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card } from '@/components/Card'
import { Skeleton, TableRowSkeleton } from '@/components/Skeleton'
import { Badge } from '@/components/Badge'
import { Modal } from '@/components/Modal'
import { OTPModal } from '@/components/OTPModal'
// import { dashboardService } from '@/services/dashboard'
import authService from '@/lib/auth'
import { Shield, ShieldAlert, BadgeCheck, Lock } from 'lucide-react'
import { toast } from 'sonner'
import policiesData from '@/lib/policies.json'

const AVAILABLE_POLICIES = Object.values(policiesData).flatMap(category => 
    Object.entries(category).map(([id, data]) => ({
        id,
        label: data.label,
        description: data.description
    }))
)

import { useRouter } from 'next/navigation'

const mockStaff = [
    { id: 'STF-001', name: 'Dennis Mutuku', username: 'dennis_root', type: 'admin', status: 'active', phone: '+254 700 123 456', createdAt: '2024-01-10', is_primary: true },
    { id: 'STF-002', name: 'Jane Kamau', username: 'jane_sales', type: 'user', status: 'active', phone: '+254 711 222 333', createdAt: '2024-02-15', policies: ['view_sales', 'create_sales', 'view_inventory'] },
    { id: 'STF-003', name: 'John Omari', username: 'john_stock', type: 'user', status: 'active', phone: '+254 722 333 444', createdAt: '2024-03-05', policies: ['manage_inventory', 'view_purchases'] },
    { id: 'STF-004', name: 'Sarah Wambui', username: 'sarah_audit', type: 'user', status: 'suspended', phone: '+254 733 444 555', createdAt: '2024-03-20', policies: ['view_reports', 'view_audit_logs'] },
]

export default function StaffManagementPage() {
    const router = useRouter()
    const [staff, setStaff] = useState(mockStaff)
    const [isLoading, setIsLoading] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        if (!authService.hasPolicy('manage_users')) {
            router.push('/dashboard')
        }
    }, [router])

    // Modal states
    const [showModal, setShowModal] = useState(false)
    const [showOTPModal, setShowOTPModal] = useState(false)
    const [showDetailModal, setShowDetailModal] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [editingStaff, setEditingStaff] = useState(null)
    const [selectedStaff, setSelectedStaff] = useState(null)
    const [showPassword, setShowPassword] = useState(false)

    // Form states
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        password: '',
        phone: '',
        type: 'user',
        status: 'active',
        policies: []
    })

    const fetchStaff = async () => {
        setIsRefreshing(true)
        // Simulated fetch for dummy info
        setTimeout(() => {
            setStaff(mockStaff)
            setIsRefreshing(false)
        }, 1000)
    }

    useEffect(() => {
        fetchStaff()
    }, [])

    const currentUser = authService.getUser()
    const isSuperAdmin = currentUser?.type === 'superadmin'

    const handleSubmit = async (e, otpCode = null) => {
        if (e) e.preventDefault()

        // Critical Security Check: Ensure OTP is provided if phone number is being changed
        const isPhoneChanged = editingStaff && formData.phone !== editingStaff.phone;
        if (isPhoneChanged && !otpCode) {
            setShowOTPModal(true)
            toast.info("Phone number change detected. Verification required.")
            return
        }

        setIsSubmitting(true)
        try {
            const dataToSave = { ...formData }
            if (otpCode) dataToSave.otp_code = otpCode

            if (editingStaff) {
                setStaff(prev => prev.map(s => s.id === editingStaff.id ? { ...formData, id: s.id, createdAt: s.createdAt, is_primary: s.is_primary } : s))
                toast.success("Staff member updated")
            } else {
                const newStaff = {
                    ...formData,
                    id: `STF-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
                    createdAt: new Date().toISOString().split('T')[0],
                    is_primary: false
                }
                setStaff(prev => [newStaff, ...prev])
                toast.success("Staff member created")
            }
            setShowModal(false)
            setShowOTPModal(false)
            setEditingStaff(null)
            resetForm()
        } catch (e) {
            console.error(e)
            toast.error(e.message || "An error occurred")
            if (!e.message.toLowerCase().includes('verification') && !e.message.toLowerCase().includes('otp')) {
                setShowOTPModal(false)
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeleteUser = async () => {
        setStaff(prev => prev.filter(s => s.id !== selectedStaff.id))
        toast.success("Staff member deleted successfully")
        setIsDeleteModalOpen(false)
    }

    const resetForm = () => {
        setFormData({
            name: '',
            username: '',
            password: '',
            phone: '',
            type: 'user',
            status: 'active',
            policies: []
        })
    }

    const togglePolicy = (policyId) => {
        setFormData(prev => {
            const currentPolicies = prev.policies || []
            if (currentPolicies.includes(policyId)) {
                return { ...prev, policies: currentPolicies.filter(id => id !== policyId) }
            } else {
                return { ...prev, policies: [...currentPolicies, policyId] }
            }
        })
    }

    const openEdit = (user) => {
        setEditingStaff(user)
        setFormData({
            name: user.name,
            username: user.username,
            password: '',
            phone: user.phone,
            type: user.type,
            status: user.status,
            policies: user.policies || []
        })
        setShowModal(true)
    }

    const viewDetails = (user) => {
        setSelectedStaff(user)
        setShowDetailModal(true)
    }

    const filteredStaff = staff.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const getUserLabel = () => {
        const u = authService.getUser()
        return u?.name || 'Admin'
    }

    return (
        <div className="space-y-6 font-figtree animate-in fade-in duration-700 max-w-[1600px] mx-auto pb-10">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-openpos-border pb-6">
                <div>
                    <h1 className="text-xl font-medium text-openpos-blue uppercase tracking-tight">Staff Management</h1>
                    <p className="text-[10px] font-medium text-gray-400 mt-0.5 tracking-widest uppercase">Admin Access & Policy Control</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                    <button
                        onClick={fetchStaff}
                        disabled={isRefreshing}
                        className="flex items-center gap-2 px-6 py-2.5 bg-openpos-blue/5 text-openpos-blue border border-openpos-blue/10 rounded-xl hover:bg-openpos-blue/10 transition-all text-xs font-medium uppercase tracking-widest w-full sm:w-auto justify-center disabled:opacity-50"
                    >
                        <RefreshCw size={14} className={cn(isRefreshing && "animate-spin")} />
                    </button>
                    <button
                        onClick={() => {
                            setEditingStaff(null);
                            resetForm();
                            setShowModal(true);
                        }}
                        className="flex items-center gap-2 px-6 py-2.5 bg-openpos-blue text-white rounded-xl hover:bg-openpos-blue/90 transition-all text-xs font-medium uppercase tracking-widest shadow-lg shadow-openpos-blue/20 w-full sm:w-auto justify-center"
                    >
                        <Plus size={14} /> Add Staff User
                    </button>
                </div>
            </div>

            {/* Directory Control */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-card-bg p-4 rounded-2xl border border-openpos-border shadow-sm">
                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-admin-dim group-focus-within:text-openpos-blue transition-colors" size={16} />
                    <input
                        type="text"
                        autoComplete="off"
                        placeholder="Search staff members..."
                        className="w-full pl-10 pr-4 py-2.5 bg-openpos-bg-subtle border border-openpos-border rounded-xl text-[11px] font-bold text-admin-value focus:outline-none focus:ring-2 focus:ring-openpos-blue/10 focus:border-openpos-blue transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="flex items-center gap-2 px-4 py-2 bg-openpos-blue/5 border border-openpos-blue/10 rounded-xl">
                        <Users size={14} className="text-openpos-blue" />
                        <span className="text-[10px] font-bold text-admin-value uppercase tracking-widest">{filteredStaff.length} Total Members</span>
                    </div>
                </div>
            </div>

            {/* Staff Table Container */}
            <Card noPadding className="shadow-sm">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left whitespace-nowrap border-collapse text-[11px]">
                        <thead>
                            <tr className="bg-openpos-bg-subtle/50 border-b border-openpos-border font-bold text-admin-dim uppercase tracking-widest text-[9px]">
                                <th className="px-6 py-4">Team Member</th>
                                <th className="px-6 py-4 text-center">Authorization Role</th>
                                <th className="px-6 py-4 text-center">System Status</th>
                                <th className="px-6 py-4 text-center">Contact Identity</th>
                                <th className="px-6 py-4 text-right">Management Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-openpos-border">
                            {isLoading ? (
                                <TableRowSkeleton cols={5} rows={5} />
                            ) : filteredStaff.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center text-gray-400 font-bold text-[10px] uppercase tracking-widest bg-openpos-bg-subtle/20">
                                        No staff members found in directory
                                    </td>
                                </tr>
                            ) : (
                                filteredStaff.map((user) => (
                                    <tr key={user.id} className="hover:bg-openpos-bg-subtle/40 transition-colors group cursor-default">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-admin-value leading-none uppercase text-[12px] group-hover:text-openpos-blue transition-colors">{user.name}</span>
                                                <span className="text-[9px] font-bold text-admin-dim mt-1.5 uppercase tracking-tight flex items-center gap-1.5 opacity-80">
                                                    <AtSign size={10} className="text-openpos-blue" /> {user.username}
                                                    <span className="mx-0.5 opacity-30">•</span>
                                                    UID: {user.id.substring(0, 8)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex flex-col items-center">
                                                <span className={cn(
                                                    "text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md",
                                                    user.type === 'admin' ? "bg-red-400/10 text-red-400 border border-red-400/10" : "bg-gray-400/10 text-gray-400 border border-gray-400/10"
                                                )}>
                                                    {user.type === 'admin' ? 'SYSTEM ADMIN' : 'STAFF USER'}
                                                </span>
                                                <span className="text-[8px] font-bold text-admin-dim mt-1.5 uppercase tracking-widest flex items-center gap-1.5 opacity-70">
                                                    <Clock size={10} /> Active Since {new Date(user.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex flex-col items-center">
                                                <Badge variant={user.status === 'active' ? 'success' : 'error'} className="text-[8px] font-bold px-2 py-0.5 border-none uppercase tracking-widest rounded-md shadow-sm">
                                                    {user.status}
                                                </Badge>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex flex-col items-center opacity-80">
                                                <span className="text-[11px] font-bold text-admin-value font-mono tracking-tighter flex items-center gap-2">
                                                    <Phone size={10} className="text-openpos-blue" />
                                                    {user.phone || 'NO CONTACT'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-1.5">
                                                <button
                                                    onClick={() => viewDetails(user)}
                                                    className="p-2 bg-card-bg border border-openpos-border rounded-lg text-admin-dim hover:text-admin-value hover:border-openpos-blue/30 hover:bg-openpos-blue/5 transition-all"
                                                    title="Security Profile"
                                                >
                                                    <Lock size={12} />
                                                </button>
                                
                                                {!user.is_primary && (user.type !== 'admin' || isSuperAdmin || user.id === currentUser?.id) ? (
                                                    <>
                                                        <button
                                                            onClick={() => openEdit(user)}
                                                            className="p-2 bg-card-bg border border-openpos-border rounded-lg text-admin-dim hover:text-openpos-blue hover:border-openpos-blue/30 hover:bg-openpos-blue/5 transition-all"
                                                            title="Edit Access"
                                                        >
                                                            <Edit2 size={12} />
                                                        </button>
                                                        {user.id !== currentUser?.id && (
                                                            <button
                                                                onClick={() => { setSelectedStaff(user); setIsDeleteModalOpen(true); }}
                                                                className="p-2 bg-card-bg border border-openpos-border rounded-lg text-admin-dim hover:text-red-400 hover:border-red-400/30 hover:bg-red-400/5 transition-all"
                                                                title="Revoke Identity"
                                                            >
                                                                <Trash2 size={12} />
                                                            </button>
                                                        )}
                                                    </>
                                                ) : (
                                                    <div className="p-2 bg-openpos-bg-subtle border border-openpos-border rounded-lg text-gray-300 cursor-not-allowed opacity-50" title={user.is_primary ? "System Protected" : "Security Restricted"}>
                                                        <Lock size={12} />
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
                                
            {/* Add/Edit Staff Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => { setShowModal(false); setEditingStaff(null); resetForm(); }}
                title={editingStaff ? "Update Access" : "Provision Account"}
                description={editingStaff ? `Updating ${editingStaff.username}` : "Assign credentials for new personnel"}
                maxWidth="max-w-md"
                footer={null}
            >
                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[9px] font-bold text-admin-dim uppercase ml-1">Full Name</label>
                            <input
                                required
                                autoComplete="off"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 bg-openpos-bg-subtle border border-openpos-border rounded-xl text-[11px] font-bold text-admin-value focus:border-openpos-blue focus:bg-card-bg outline-none transition-all"
                                placeholder="Full Name"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[9px] font-bold text-admin-dim uppercase ml-1">Username</label>
                            <input
                                required
                                disabled={editingStaff}
                                autoComplete="off"
                                value={formData.username}
                                onChange={e => setFormData({ ...formData, username: e.target.value })}
                                className="w-full px-4 py-2 bg-openpos-bg-subtle border border-openpos-border rounded-xl text-[11px] font-bold text-admin-value focus:border-openpos-blue focus:bg-card-bg outline-none transition-all disabled:opacity-50"
                                placeholder="Username"
                            />
                        </div>
                    </div>
                                
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[9px] font-bold text-admin-dim uppercase ml-1">Phone</label>
                            <input
                                autoComplete="off"
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full px-4 py-2 bg-openpos-bg-subtle border border-openpos-border rounded-xl text-[11px] font-bold text-admin-value focus:border-openpos-blue focus:bg-card-bg outline-none transition-all"
                                placeholder="+254..."
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[9px] font-medium text-gray-400 uppercase ml-1">
                                {editingStaff ? "New Password" : "Password"}
                            </label>
                            <div className="relative">
                                <Key size={12} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
                                <input
                                    required={!editingStaff}
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full pl-9 pr-12 py-2 bg-openpos-bg-subtle border border-openpos-border rounded-xl text-[11px] font-bold text-admin-value focus:border-openpos-blue focus:bg-card-bg outline-none transition-all"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-openpos-blue"
                                >
                                    {showPassword ? <EyeOff size={12} /> : <Eye size={12} />}
                                </button>
                            </div>
                        </div>
                    </div>
                                
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[9px] font-medium text-gray-400 uppercase ml-1">Role</label>
                            <select
                                value={formData.type}
                                onChange={e => setFormData({ ...formData, type: e.target.value })}
                                className="w-full px-4 py-2 bg-openpos-bg-subtle border border-openpos-border rounded-xl text-[11px] font-bold text-admin-value focus:border-openpos-blue focus:bg-card-bg outline-none transition-all"
                            >
                                <option value="user">STAFF</option>
                                <option value="admin">ADMIN</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[9px] font-medium text-gray-400 uppercase ml-1">Status</label>
                            <select
                                value={formData.status}
                                onChange={e => setFormData({ ...formData, status: e.target.value })}
                                className="w-full px-4 py-2 bg-openpos-bg-subtle border border-openpos-border rounded-xl text-[11px] font-bold text-admin-value focus:border-openpos-blue focus:bg-card-bg outline-none transition-all"
                            >
                                <option value="active">ACTIVE</option>
                                <option value="suspended">SUSPENDED</option>
                                <option value="inactive">INACTIVE</option>
                            </select>
                        </div>
                    </div>
                                
                    {formData.type === 'user' ? (
                        <div className="space-y-3 pt-2 animate-in slide-in-from-top-2 duration-300">
                            <label className="text-[10px] font-bold text-admin-dim uppercase tracking-widest flex items-center gap-2">
                                <Lock size={12} className="text-openpos-blue" />
                                System Policies & Permissions
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {AVAILABLE_POLICIES.map(policy => {
                                    const isSelected = formData.policies?.includes(policy.id)
                                    return (
                                        <div
                                            key={policy.id}
                                            onClick={() => togglePolicy(policy.id)}
                                            className={cn(
                                                "flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all hover:scale-[1.02] active:scale-95 group",
                                                isSelected
                                                    ? "bg-openpos-blue/5 border-openpos-blue/30 ring-1 ring-openpos-blue/10"
                                                    : "bg-openpos-bg-subtle border-openpos-border hover:border-openpos-blue/20"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-4 h-4 rounded-md border flex items-center justify-center transition-all mt-0.5",
                                                isSelected
                                                    ? "bg-openpos-blue border-openpos-blue"
                                                    : "bg-card-bg border-openpos-border group-hover:border-openpos-blue/40"
                                            )}>
                                                {isSelected && <BadgeCheck size={10} className="text-white" />}
                                            </div>
                                            <div className="flex flex-col gap-0.5">
                                                <span className={cn(
                                                    "text-[10px] font-bold uppercase tracking-tight",
                                                    isSelected ? "text-openpos-blue" : "text-admin-value"
                                                )}>
                                                    {policy.label}
                                                </span>
                                                <span className="text-[8px] text-admin-dim font-medium leading-tight">
                                                    {policy.description}
                                                </span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="p-4 bg-openpos-red/5 border border-openpos-red/10 rounded-xl flex items-center gap-3">
                            <ShieldAlert className="text-red-400 shrink-0" size={16} />
                            <p className="text-[10px] text-red-700/70 font-bold uppercase tracking-tight leading-relaxed">
                                Administrator accounts have full system access by default. Multi-user policies are not required for this role.
                            </p>
                        </div>
                    )}
                                
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-11 bg-openpos-blue text-white rounded-xl font-medium text-[11px] uppercase tracking-widest hover:bg-openpos-blue-dark transition-all active:scale-95 disabled:opacity-50 mt-4 flex items-center justify-center relative overflow-hidden"
                    >
                        {isSubmitting ? (
                            <Loader2 className="animate-spin" size={16} />
                        ) : (
                            <span>{editingStaff ? "Update Account" : "Create Account"}</span>
                        )}
                    </button>
                </form>
            </Modal>
                                
                                
                                
            {/* Account Detail Modal */}
            <Modal
                isOpen={showDetailModal}
                onClose={() => setShowDetailModal(false)}
                title="Account Details"
                maxWidth="max-w-sm"
                footer={null}
            >
                {selectedStaff && (
                    <div className="space-y-6 text-center py-4">
                        <div className="w-16 h-16 bg-openpos-bg-subtle rounded-full flex items-center justify-center mx-auto border border-openpos-border text-admin-dim">
                            <UserCheck size={32} />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-admin-value uppercase leading-none">{selectedStaff.name}</h3>
                            <div className="flex items-center justify-center gap-2 mt-2">
                                <Badge variant={selectedStaff.type === 'admin' ? 'success' : 'secondary'} className="text-[8px] font-medium uppercase tracking-widest px-2">
                                    {selectedStaff.type === 'admin' ? 'SYSTEM ADMIN' : 'STAFF'}
                                </Badge>
                                <Badge variant={selectedStaff.status === 'active' ? 'success' : 'error'} className="text-[8px] font-medium uppercase tracking-widest px-2">
                                    {selectedStaff.status}
                                </Badge>
                            </div>
                        </div>
                                
                        <div className="grid grid-cols-1 gap-1.5 text-left">
                            <div className="bg-openpos-bg-subtle p-3 rounded-xl border border-openpos-border">
                                <p className="text-[8px] font-bold text-admin-dim uppercase tracking-widest">Username</p>
                                <p className="text-[11px] font-bold text-admin-value mt-0.5">{selectedStaff.username}</p>
                            </div>
                            <div className="bg-openpos-bg-subtle p-3 rounded-xl border border-openpos-border">
                                <p className="text-[8px] font-bold text-openpos-blue uppercase tracking-widest">Created</p>
                                <p className="text-[11px] font-bold text-admin-value mt-0.5">{new Date(selectedStaff.createdAt).toLocaleString()}</p>
                            </div>
                        </div>
                                
                        {selectedStaff.policies && selectedStaff.policies.length > 0 && (
                            <div className="space-y-3 text-left">
                                <p className="text-[9px] font-bold text-admin-dim uppercase tracking-widest flex items-center gap-2">
                                    <ShieldAlert size={12} className="text-openpos-blue" />
                                    Active Permissions
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {selectedStaff.policies.map(pId => {
                                        const p = AVAILABLE_POLICIES.find(pol => pol.id === pId)
                                        return (
                                            <Badge key={pId} variant="success" className="bg-openpos-blue/5 text-openpos-blue border-none text-[8px] py-1 px-2 uppercase font-bold tracking-tight">
                                                {p?.label || pId}
                                            </Badge>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                                
                        <button
                            onClick={() => setShowDetailModal(false)}
                            className="w-full py-2.5 border border-openpos-border rounded-xl text-[10px] font-bold uppercase tracking-widest text-admin-dim hover:bg-openpos-bg-subtle transition-colors"
                        >
                            Close
                        </button>
                    </div>
                )}
            </Modal>

            {/* Termination Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Confirm Removal"
                description={`Revoke access for ${selectedStaff?.name}?`}
                type="danger"
                icon={Trash2}
                footer={null}
            >
                <div className="space-y-4 pt-2">
                    <div className="flex-1 bg-card-bg border border-openpos-border rounded-xl p-3 flex items-center gap-3">
                        <UserX className="text-red-400 shrink-0" size={16} />
                        <p className="text-[10px] text-red-700/70 font-medium leading-relaxed uppercase tracking-tight">
                            Warning: This action will immediately terminate all active sessions and permanently revoke system access for this member.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="flex-1 py-3 border border-openpos-border rounded-xl text-[10px] font-bold uppercase tracking-widest text-admin-dim hover:bg-openpos-bg-subtle transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDeleteUser}
                            className="flex-1 py-3 bg-red-500 text-white rounded-xl text-[10px] font-medium uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-red-200 active:scale-95"
                        >
                            Confirm Revoke
                        </button>
                    </div>
                </div>
            </Modal>

            {/* OTP Verification Modal */}
            <OTPModal
                isOpen={showOTPModal}
                onClose={() => setShowOTPModal(false)}
                onVerify={(code) => handleSubmit(null, code)}
                isLoading={isSubmitting}
                phoneNumber={currentUser?.phone}
                actionType="staff_security_edit"
            />
        </div>
    )
}
