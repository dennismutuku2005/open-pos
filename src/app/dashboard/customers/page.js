"use client"

import React, { useState } from 'react'
import { 
    Users, Search, Plus, Filter, 
    MoreVertical, Mail, Phone, MapPin,
    Star, ShoppingBag, ArrowUpRight, 
    Trash2, Edit2, UserPlus, Trophy
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { Modal } from '@/components/Modal'
import { generateReport, generateExcelReport } from '@/lib/pdf'
import { Download, Upload } from 'lucide-react'

import { Card, StatCard } from '@/components/Card'

// Mock Data
const initialCustomers = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', phone: '+254 712 345 678', totalSpent: 1250.00, visits: 15, points: 450, status: 'VIP' },
    { id: 2, name: 'Bob Smith', email: 'bob.smith@gmail.com', phone: '+254 722 987 654', totalSpent: 420.50, visits: 4, points: 120, status: 'Regular' },
    { id: 3, name: 'Charlie Davis', email: 'charlie.d@outlook.com', phone: '+254 733 111 222', totalSpent: 85.00, visits: 1, points: 10, status: 'New' },
]

export default function CustomersPage() {
    const [customers, setCustomers] = useState(initialCustomers)
    const [showAddModal, setShowAddModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [editingCustomer, setEditingCustomer] = useState(null)
    const [deletingCustomer, setDeletingCustomer] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        status: 'Regular'
    })

    const filteredCustomers = customers.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.phone.includes(searchTerm)
    )

    const handleAdd = () => {
        setEditingCustomer(null)
        setFormData({ name: '', email: '', phone: '', status: 'Regular' })
        setShowAddModal(true)
    }

    const handleEdit = (cust) => {
        setEditingCustomer(cust)
        setFormData({
            name: cust.name,
            email: cust.email,
            phone: cust.phone,
            status: cust.status
        })
        setShowAddModal(true)
    }

    const handleSave = () => {
        if (!formData.name || !formData.phone) {
            toast.error("Name and Phone are required")
            return
        }

        if (editingCustomer) {
            setCustomers(customers.map(c => 
                c.id === editingCustomer.id ? { ...c, ...formData } : c
            ))
            toast.success('Customer record updated')
        } else {
            const newCustomer = {
                id: Date.now(),
                ...formData,
                totalSpent: 0,
                visits: 0,
                points: 0
            }
            setCustomers([newCustomer, ...customers])
            toast.success('New customer registered')
        }
        setShowAddModal(false)
    }

    const handleDelete = (cust) => {
        setDeletingCustomer(cust)
        setShowDeleteModal(true)
    }

    const confirmDelete = () => {
        if (!deletingCustomer) return
        setCustomers(prev => prev.filter(c => c.id !== deletingCustomer.id))
        toast.success('Customer record removed')
        setShowDeleteModal(false)
        setDeletingCustomer(null)
    }

    const exportCustomers = (format) => {
        const columns = ["Name", "Email", "Phone", "Total Spent", "Points", "Status"]
        const rows = customers.map(c => [c.name, c.email, c.phone, c.totalSpent, c.points, c.status])
        
        if (format === 'PDF') {
            generateReport('Customer List', columns, rows)
            toast.success('Customers exported as PDF')
        } else {
            generateExcelReport('Customer List', columns, rows)
            toast.success('Customers exported as Excel')
        }
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-admin-value uppercase">Customer Directory</h1>
                    <p className="text-[13px] font-medium text-admin-label mt-1">Manage your relationship and loyalty with your clients.</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="flex items-center bg-card-bg border border-openpos-border rounded-xl overflow-hidden shadow-sm">
                        <button 
                            onClick={() => exportCustomers('PDF')}
                            className="px-4 py-2.5 text-admin-dim hover:text-openpos-blue hover:bg-openpos-blue/5 transition-all flex items-center gap-2 border-r border-openpos-border"
                        >
                            <Download size={16} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">PDF</span>
                        </button>
                        <button 
                            onClick={() => exportCustomers('Excel')}
                            className="px-4 py-2.5 text-admin-dim hover:text-openpos-blue hover:bg-openpos-blue/5 transition-all flex items-center gap-2"
                        >
                            <Upload size={16} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Excel</span>
                        </button>
                    </div>
                    <button 
                        onClick={handleAdd}
                        className="flex-1 sm:flex-none bg-openpos-blue text-white px-5 py-2.5 rounded-xl font-bold text-[13px] flex items-center justify-center gap-2 shadow-lg shadow-openpos-blue/20 hover:scale-[1.02] transition-all"
                    >
                        <UserPlus size={18} />
                        Register Customer
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total Customers" value="1,284" change="+12" isPositive={true} icon={Users} color="blue" />
                <StatCard title="Repeat Customers" value="72%" change="+5%" isPositive={true} icon={ShoppingBag} color="blue" />
                <StatCard title="Loyalty Issued" value="45.2k" change="+1.2k" isPositive={true} icon={Trophy} color="blue" />
                <StatCard title="Avg Retention" value="84.5%" change="+0.5%" isPositive={true} icon={ArrowUpRight} color="blue" />
            </div>

            {/* Customer Directory Ledger */}
            <Card 
                noPadding
                title="Client Records"
                subtitle="Active customer database & loyalty ledger"
                headerAction={
                    <div className="flex items-center gap-3">
                        <div className="relative w-full md:w-64 group">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-admin-dim group-focus-within:text-openpos-blue transition-colors" size={14} />
                            <input 
                                placeholder="Search customers..." 
                                className="w-full bg-openpos-bg-subtle border border-openpos-border rounded-xl pl-10 pr-4 py-2 text-[11px] font-bold text-admin-value outline-none focus:ring-2 focus:ring-openpos-blue/10 focus:border-openpos-blue transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="px-4 py-2 bg-openpos-bg-subtle border border-openpos-border text-admin-dim hover:text-admin-value hover:bg-card-bg rounded-xl font-bold text-[10px] flex items-center gap-2 uppercase tracking-widest transition-all">
                            <Filter size={12} /> Filter
                        </button>
                    </div>
                }
            >
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left whitespace-nowrap border-collapse text-[11px]">
                        <thead>
                            <tr className="bg-openpos-bg-subtle/50 text-[9px] font-bold text-admin-dim uppercase tracking-widest border-b border-openpos-border">
                                <th className="px-6 py-4">Customer Identity</th>
                                <th className="px-6 py-4 text-center">Loyalty Assets</th>
                                <th className="px-6 py-4 text-center">Lifetime Value (KES)</th>
                                <th className="px-6 py-4 text-center">Portfolio Status</th>
                                <th className="px-6 py-4 text-right">Management</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-openpos-border">
                            {filteredCustomers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center text-gray-400 font-bold text-[10px] uppercase tracking-widest bg-openpos-bg-subtle/20">
                                        No customer records matching your search
                                    </td>
                                </tr>
                            ) : (
                                filteredCustomers.map((customer) => (
                                    <tr key={customer.id} className="group hover:bg-openpos-bg-subtle/40 transition-colors cursor-default">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-openpos-blue/5 border border-openpos-blue/10 flex items-center justify-center text-openpos-blue font-bold text-[14px] group-hover:scale-105 transition-transform">
                                                    {customer.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h3 className="text-[12px] font-bold text-admin-value group-hover:text-openpos-blue transition-colors uppercase tracking-tight">{customer.name}</h3>
                                                    <div className="flex items-center gap-3 mt-1 text-admin-dim">
                                                        <span className="text-[9px] font-bold flex items-center gap-1.5"><Phone size={10} className="text-openpos-blue" /> {customer.phone}</span>
                                                        {customer.email && <span className="text-[9px] font-bold flex items-center gap-1.5"><Mail size={10} className="text-openpos-blue" /> {customer.email}</span>}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex flex-col items-center">
                                                <div className="flex items-center gap-2 px-2.5 py-1 bg-openpos-blue/5 border border-openpos-blue/10 rounded-lg">
                                                    <Trophy size={12} className="text-openpos-blue" />
                                                    <span className="text-[11px] font-bold text-admin-value">{customer.points.toLocaleString()} PTS</span>
                                                </div>
                                                <span className="text-[8px] font-bold text-admin-dim uppercase tracking-tighter mt-1">Reward Balance</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex flex-col items-center">
                                                <span className="text-[12px] font-bold text-admin-value">{customer.totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                                <span className="text-[8px] font-bold text-admin-dim uppercase tracking-widest mt-1 opacity-70">{customer.visits} Total Sessions</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex flex-col items-center">
                                                <span className={cn(
                                                    "px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest border",
                                                    customer.status === 'VIP' ? "bg-openpos-blue text-white border-openpos-blue shadow-sm" : 
                                                    customer.status === 'Regular' ? "bg-openpos-blue/5 text-openpos-blue border-openpos-blue/10" : "bg-openpos-bg-subtle text-admin-dim border-openpos-border"
                                                )}>
                                                    {customer.status}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <button 
                                                    onClick={() => handleEdit(customer)}
                                                    className="p-2 bg-card-bg border border-openpos-border rounded-lg text-admin-dim hover:text-openpos-blue hover:border-openpos-blue/30 hover:bg-openpos-blue/5 transition-all"
                                                    title="Modify Profile"
                                                >
                                                    <Edit2 size={12} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(customer)}
                                                    className="p-2 bg-card-bg border border-openpos-border rounded-lg text-admin-dim hover:text-red-400 hover:border-red-400/30 hover:bg-red-400/5 transition-all"
                                                    title="Purge Identity"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Save Modal */}
            <Modal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                title={editingCustomer ? "Update Customer" : "Register New Customer"}
                description="Manage client profile and contact information."
                confirmText={editingCustomer ? "Save Changes" : "Register"}
                onConfirm={handleSave}
            >
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-admin-dim uppercase tracking-widest ml-1">Full Name *</label>
                        <input 
                            type="text"
                            placeholder="John Doe"
                            className="w-full bg-openpos-bg-subtle border border-openpos-border rounded-xl px-4 py-3 text-[12px] font-bold outline-none focus:ring-2 focus:ring-openpos-blue/10 transition-all"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-admin-dim uppercase tracking-widest ml-1">Phone Number *</label>
                            <input 
                                type="text"
                                placeholder="+254..."
                                className="w-full bg-openpos-bg-subtle border border-openpos-border rounded-xl px-4 py-3 text-[12px] font-bold outline-none focus:ring-2 focus:ring-openpos-blue/10 transition-all"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-admin-dim uppercase tracking-widest ml-1">Customer Tier</label>
                            <select 
                                className="w-full bg-openpos-bg-subtle border border-openpos-border rounded-xl px-4 py-3 text-[12px] font-bold outline-none cursor-pointer"
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            >
                                <option value="New">New</option>
                                <option value="Regular">Regular</option>
                                <option value="VIP">VIP</option>
                            </select>
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-admin-dim uppercase tracking-widest ml-1">Email Address</label>
                        <input 
                            type="email"
                            placeholder="client@example.com"
                            className="w-full bg-openpos-bg-subtle border border-openpos-border rounded-xl px-4 py-3 text-[12px] font-bold outline-none focus:ring-2 focus:ring-openpos-blue/10 transition-all"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                </div>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="Deregister Customer"
                description={`Remove "${deletingCustomer?.name}" from your database?`}
                type="danger"
                icon={Trash2}
                confirmText="Delete"
                confirmCountdown={5}
                onConfirm={confirmDelete}
            >
                <div className="p-4 bg-openpos-red/5 border border-openpos-red/10 rounded-2xl">
                    <p className="text-[11px] text-openpos-red font-bold uppercase tracking-tight leading-relaxed">
                        This will permanently remove the customer record and their loyalty points history. This action cannot be reversed.
                    </p>
                </div>
            </Modal>
        </div>
    )
}
