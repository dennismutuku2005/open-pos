"use client"

import React, { useState } from 'react'
import { 
    Wallet, Calendar, Plus, CreditCard, 
    TrendingDown, FileText, Filter, Printer, 
    MoreVertical, Trash2, Edit2, Check, X,
    ChevronLeft, ChevronRight, BarChart3, Receipt,
    ShoppingBag, Lightbulb, Wrench, Car, Clock
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { Modal } from '@/components/Modal'
import { generateReport, generateExcelReport } from '@/lib/pdf'
import { Download, Upload } from 'lucide-react'

// Mock Data
const initialExpenses = [
    { id: 1, date: '2024-05-03', category: 'Shop Supplies', description: 'Cleaning detergents and floor polish', amount: 45.00, status: 'Cleared' },
    { id: 2, date: '2024-05-02', category: 'Utilities', description: 'Electricity Bill - April 2024', amount: 280.00, status: 'Cleared' },
    { id: 3, date: '2024-05-01', category: 'Marketing', description: 'Local flyers printing', amount: 120.00, status: 'Pending' },
]

const categories = [
    { value: 'Shop Supplies', icon: ShoppingBag, color: 'text-blue-500', bg: 'bg-blue-50' },
    { value: 'Utilities', icon: Lightbulb, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { value: 'Marketing', icon: BarChart3, color: 'text-purple-600', bg: 'bg-purple-50' },
    { value: 'Maintenance', icon: Wrench, color: 'text-orange-600', bg: 'bg-orange-50' },
    { value: 'Transport', icon: Car, color: 'text-emerald-600', bg: 'bg-emerald-50' },
]

export default function ExpensesPage() {
    const [expenses, setExpenses] = useState(initialExpenses)
    const [showModal, setShowModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [deletingExpense, setDeletingExpense] = useState(null)
    const [formData, setFormData] = useState({ date: new Date().toISOString().split('T')[0], category: 'Shop Supplies', description: '', amount: '' })

    const exportExpenses = (format) => {
        const columns = ["Date", "Category", "Description", "Amount", "Status"]
        const rows = expenses.map(e => [e.date, e.category, e.description, e.amount, e.status])
        
        if (format === 'PDF') {
            generateReport('Expense List', columns, rows)
            toast.success('Expenses exported as PDF')
        } else {
            generateExcelReport('Expense List', columns, rows)
            toast.success('Expenses exported as Excel')
        }
    }

    const handleSave = () => {
        if (!formData.description || !formData.amount) return toast.error('Please fill all fields')
        const newExp = {
            id: Date.now(),
            ...formData,
            amount: parseFloat(formData.amount),
            status: 'Cleared'
        }
        setExpenses(prev => [newExp, ...prev])
        setShowModal(false)
        toast.success('Expense recorded successfully')
    }

    const handleDelete = (exp) => {
        setDeletingExpense(exp)
        setShowDeleteModal(true)
    }

    const confirmDelete = () => {
        if (!deletingExpense) return
        setExpenses(prev => prev.filter(e => e.id !== deletingExpense.id))
        toast.success('Expense record removed')
        setShowDeleteModal(false)
        setDeletingExpense(null)
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-admin-value uppercase">Business Spending</h1>
                    <p className="text-admin-label mt-1">Track and categorize all non-inventory operational costs.</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="flex items-center bg-white border border-openpos-border rounded-xl overflow-hidden shadow-sm">
                        <button 
                            onClick={() => exportExpenses('PDF')}
                            className="px-4 py-2.5 text-admin-dim hover:text-openpos-blue hover:bg-openpos-blue/5 transition-all flex items-center gap-2 border-r border-openpos-border"
                        >
                            <Download size={16} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">PDF</span>
                        </button>
                        <button 
                            onClick={() => exportExpenses('Excel')}
                            className="px-4 py-2.5 text-admin-dim hover:text-openpos-green hover:bg-openpos-green/5 transition-all flex items-center gap-2"
                        >
                            <Upload size={16} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Excel</span>
                        </button>
                    </div>
                    <button 
                        onClick={() => setShowModal(true)}
                        className="flex-1 sm:flex-none bg-openpos-blue text-white px-5 py-2.5 rounded-xl font-semibold text-[13px] flex items-center justify-center gap-2 shadow-lg shadow-openpos-blue/20 hover:scale-[1.02] transition-all"
                    >
                        <Plus size={18} />
                        Log Expense
                    </button>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white border border-openpos-border rounded-xl p-4 shadow-sm hover:border-openpos-blue/20 transition-all">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-openpos-red bg-openpos-red/5 shrink-0">
                            <TrendingDown size={18} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-admin-dim uppercase tracking-wider">Monthly Total</p>
                            <p className="text-lg font-bold text-admin-value">KES 2,450</p>
                        </div>
                    </div>
                    <div className="mt-3">
                        <span className="text-[9px] font-bold text-openpos-red bg-openpos-red/5 px-2 py-0.5 rounded uppercase">+12% vs last month</span>
                    </div>
                </div>

                <div className="bg-white border border-openpos-border rounded-xl p-4 shadow-sm hover:border-openpos-blue/20 transition-all">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-openpos-blue bg-openpos-blue/5 shrink-0">
                            <Clock size={18} />
                        </div>
                        <div>
                            <p className="text-[10px] font-semibold text-admin-dim uppercase tracking-wider">Pending Approval</p>
                            <p className="text-lg font-semibold text-admin-value">KES 120</p>
                        </div>
                    </div>
                    <div className="mt-3">
                        <span className="text-[9px] font-bold text-openpos-blue bg-openpos-blue/5 px-2 py-0.5 rounded uppercase tracking-tight">1 Transaction</span>
                    </div>
                </div>

                <div className="bg-white border border-openpos-border rounded-xl p-4 shadow-sm hover:border-openpos-blue/20 transition-all">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-purple-600 bg-purple-50 shrink-0">
                            <BarChart3 size={18} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-admin-dim uppercase tracking-wider">Budget Usage</p>
                            <div className="flex items-center gap-2">
                                <p className="text-lg font-bold text-admin-value">65%</p>
                                <div className="h-1 w-16 bg-openpos-bg-subtle rounded-full overflow-hidden">
                                    <div className="h-full bg-purple-600 w-[65%]" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-3">
                        <span className="text-[9px] font-bold text-admin-dim bg-openpos-bg-subtle px-2 py-0.5 rounded uppercase">Healthy Usage</span>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="bg-card-bg border border-openpos-border rounded-3xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-openpos-border flex items-center justify-between">
                    <h3 className="text-sm font-bold text-admin-value uppercase tracking-[2px]">Expense Ledger</h3>
                    <div className="flex items-center gap-2">
                        <button className="p-2.5 bg-openpos-bg-subtle text-admin-dim rounded-xl hover:text-openpos-blue transition-all"><Printer size={16} /></button>
                        <button className="p-2.5 bg-openpos-bg-subtle text-admin-dim rounded-xl hover:text-openpos-blue transition-all"><Filter size={16} /></button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-openpos-bg-subtle/50 border-b border-openpos-border">
                                <th className="py-3 px-6 text-[10px] font-bold text-admin-dim uppercase tracking-widest">Transaction Details</th>
                                <th className="py-3 px-6 text-[10px] font-bold text-admin-dim uppercase tracking-widest">Expense Category</th>
                                <th className="py-3 px-6 text-[10px] font-bold text-admin-dim uppercase tracking-widest text-right">Amount</th>
                                <th className="py-3 px-6 text-[10px] font-bold text-admin-dim uppercase tracking-widest text-center">Status</th>
                                <th className="py-3 px-6 text-[10px] font-bold text-admin-dim uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-openpos-border">
                            {expenses.map((exp) => (
                                <tr key={exp.id} className="group hover:bg-openpos-bg-subtle/30 transition-colors">
                                    <td className="py-2.5 px-6">
                                         <div className="flex items-center gap-3">
                                             <div className="w-8 h-8 rounded-lg bg-openpos-bg-subtle flex items-center justify-center text-admin-dim shrink-0">
                                                 <Receipt size={16} strokeWidth={1.5} />
                                             </div>
                                             <div>
                                                 <h3 className="text-[12px] font-semibold text-admin-value uppercase tracking-tight">{exp.description}</h3>
                                                 <p className="text-[9px] font-medium text-admin-dim uppercase tracking-wider">{exp.date}</p>
                                             </div>
                                         </div>
                                     </td>
                                     <td className="py-2.5 px-6">
                                         <span className="px-2 py-0.5 bg-openpos-bg-subtle text-admin-value text-[9px] font-bold rounded-md tracking-widest border border-openpos-border uppercase">
                                             {exp.category}
                                         </span>
                                     </td>
                                     <td className="py-2.5 px-6 text-right">
                                         <span className="text-[13px] font-bold text-admin-value">KES {exp.amount.toFixed(2)}</span>
                                     </td>
                                     <td className="py-2.5 px-6 text-center">
                                         <span className={cn(
                                             "px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest",
                                             exp.status === 'Cleared' ? "bg-openpos-green/10 text-openpos-green" : "bg-yellow-100/50 text-yellow-700"
                                         )}>
                                             {exp.status}
                                         </span>
                                     </td>
                                     <td className="py-2.5 px-6 text-right">
                                         <div className="flex items-center justify-end gap-1">
                                             <button className="p-1.5 text-admin-dim hover:text-openpos-blue rounded-lg transition-all"><Edit2 size={14} /></button>
                                             <button 
                                                 onClick={() => handleDelete(exp)}
                                                 className="p-1.5 text-admin-dim hover:text-openpos-red rounded-lg transition-all"
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

            {/* Standardized Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="Record New Expense"
                description="Log operational costs and bills"
                confirmText="Record Transaction"
                onConfirm={handleSave}
                icon={Receipt}
                maxWidth="max-w-md"
            >
                <div className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-admin-label uppercase tracking-widest ml-1">Date</label>
                            <input 
                                type="date"
                                className="w-full bg-openpos-bg-subtle border-none rounded-2xl px-4 py-3 text-[13px] font-bold outline-none ring-1 ring-openpos-border focus:ring-openpos-blue/30"
                                value={formData.date}
                                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-admin-label uppercase tracking-widest ml-1">Category</label>
                            <select 
                                className="w-full bg-openpos-bg-subtle border-none rounded-2xl px-4 py-3 text-[13px] font-bold outline-none ring-1 ring-openpos-border focus:ring-openpos-blue/30"
                                value={formData.category}
                                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                            >
                                {categories.map(c => <option key={c.value} value={c.value}>{c.value}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-admin-label uppercase tracking-widest ml-1">Expense Detail</label>
                        <input 
                            className="w-full bg-openpos-bg-subtle border-none rounded-2xl px-4 py-3 text-[13px] font-bold outline-none ring-1 ring-openpos-border focus:ring-openpos-blue/30"
                            placeholder="e.g. Electricity Bill, Internet"
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-admin-label uppercase tracking-widest ml-1">Amount (KES)</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-admin-dim font-bold text-[14px]">KES</span>
                            <input 
                                type="number"
                                className="w-full bg-openpos-bg-subtle border-none rounded-2xl pl-12 pr-4 py-3 text-[13px] font-bold outline-none ring-1 ring-openpos-border focus:ring-openpos-blue/30"
                                placeholder="0.00"
                                value={formData.amount}
                                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                            />
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="Delete Expense Record"
                description={`Are you sure you want to remove the record for "${deletingExpense?.description}"?`}
                type="danger"
                icon={Trash2}
                confirmText="Delete"
                confirmCountdown={5}
                onConfirm={confirmDelete}
            >
                <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
                    <p className="text-[12px] text-red-600 font-medium leading-relaxed">
                        This action is permanent and will remove this expense from your financial reports and spending history.
                    </p>
                </div>
            </Modal>
        </div>
    )
}
