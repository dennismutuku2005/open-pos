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
    const [deletingCustomer, setDeletingCustomer] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')

    const filteredCustomers = customers.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.phone.includes(searchTerm)
    )

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
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-admin-value uppercase">Customer Directory</h1>
                    <p className="text-admin-label mt-1">Manage your relationship and loyalty with your clients.</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="flex items-center bg-white border border-openpos-border rounded-xl overflow-hidden shadow-sm">
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
                        onClick={() => setShowAddModal(true)}
                        className="flex-1 sm:flex-none bg-openpos-blue text-white px-5 py-2.5 rounded-xl font-bold text-[13px] flex items-center justify-center gap-2 shadow-lg shadow-openpos-blue/20 hover:scale-[1.02] transition-all"
                    >
                        <UserPlus size={18} />
                        Register Customer
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Customers', value: '1,284', icon: Users, color: 'text-openpos-blue', bg: 'bg-openpos-blue/10' },
                    { label: 'Repeat Customers', value: '72%', icon: ShoppingBag, color: 'text-openpos-blue', bg: 'bg-openpos-blue/10' },
                    { label: 'Loyalty Points Issued', value: '45.2k', icon: Trophy, color: 'text-yellow-600', bg: 'bg-yellow-100' },
                    { label: 'Avg Customer Value', value: 'KES 184.50', icon: ArrowUpRight, color: 'text-purple-600', bg: 'bg-purple-100' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white border border-openpos-border rounded-xl p-4 shadow-sm hover:border-openpos-blue/20 transition-all">
                        <div className="flex items-center gap-3">
                            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", stat.bg, stat.color)}>
                                <stat.icon size={18} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-admin-dim uppercase tracking-wider">{stat.label}</p>
                                <p className="text-lg font-bold text-admin-value">{stat.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* List */}
            <div className="bg-card-bg border border-openpos-border rounded-3xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-openpos-border flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-dim" size={14} />
                        <input 
                            placeholder="Search by name, phone or email..." 
                            className="w-full bg-openpos-bg-subtle border-none rounded-xl pl-9 pr-4 py-2.5 text-[12px] font-bold outline-none ring-1 ring-transparent focus:ring-openpos-blue/30"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <button className="flex-1 md:flex-none px-4 py-2.5 bg-openpos-bg-subtle text-admin-dim rounded-xl font-bold text-[12px] flex items-center justify-center gap-2">
                            <Filter size={14} /> Filter
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-openpos-bg-subtle/50 text-[10px] font-bold text-admin-dim uppercase tracking-[2px]">
                                <th className="p-5">Customer Identity</th>
                                <th className="p-5">Loyalty Points</th>
                                <th className="p-5">Total Revenue</th>
                                <th className="p-5">Status</th>
                                <th className="p-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-openpos-border">
                            {filteredCustomers.map((customer) => (
                                <tr key={customer.id} className="group hover:bg-openpos-bg-subtle/30 transition-colors">
                                    <td className="p-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-openpos-blue/10 flex items-center justify-center text-openpos-blue font-bold text-[14px]">
                                                {customer.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="text-[13px] font-bold text-admin-value group-hover:text-openpos-blue transition-colors uppercase">{customer.name}</h3>
                                                <div className="flex items-center gap-3 mt-1 opacity-60">
                                                    <span className="text-[10px] flex items-center gap-1"><Phone size={10} /> {customer.phone}</span>
                                                    <span className="text-[10px] flex items-center gap-1"><Mail size={10} /> {customer.email}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-yellow-50 flex items-center justify-center text-yellow-600">
                                                <Trophy size={16} />
                                            </div>
                                            <span className="text-[14px] font-bold text-admin-value">{customer.points} pts</span>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <div className="flex flex-col">
                                            <span className="text-[14px] font-bold text-admin-value">KES {customer.totalSpent.toFixed(2)}</span>
                                            <span className="text-[10px] font-bold text-admin-dim uppercase">{customer.visits} Total Visits</span>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <span className={cn(
                                            "px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-widest",
                                            customer.status === 'VIP' ? "bg-openpos-blue text-white shadow-lg shadow-openpos-blue/20" : 
                                            customer.status === 'Regular' ? "bg-openpos-blue/10 text-openpos-blue" : "bg-admin-dim/10 text-admin-dim"
                                        )}>
                                            {customer.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-2.5 text-right">
                                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                            <button className="p-1.5 text-admin-dim hover:text-openpos-blue hover:bg-openpos-blue/5 rounded-lg transition-all">
                                                <Edit2 size={14} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(customer)}
                                                className="p-1.5 text-admin-dim hover:text-openpos-red hover:bg-openpos-red/5 rounded-lg transition-all"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

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
                <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
                    <p className="text-[12px] text-red-600 font-medium leading-relaxed">
                        This will permanently remove the customer record and their loyalty points history. This action cannot be reversed.
                    </p>
                </div>
            </Modal>
        </div>
    )
}
