"use client"

import React, { useState } from'react'
import { 
 Wallet, Calendar, Plus, CreditCard, 
 TrendingDown, FileText, Filter, Printer, 
 MoreVertical, Trash2, Edit2, Check, X,
 ChevronLeft, ChevronRight, BarChart3, Receipt,
 ShoppingBag, Lightbulb, Wrench, Car, Clock
} from'lucide-react'
import { cn } from'@/lib/utils'
import { toast } from'sonner'
import { Modal } from'@/components/Modal'
import { generateReport, generateExcelReport } from'@/lib/pdf'
import { Download, Upload } from'lucide-react'
import { Card, StatCard } from'@/components/Card'

// Mock Data
const initialExpenses = [
 { id: 1, date:'2024-05-03', category:'Shop Supplies', description:'Cleaning detergents and floor polish', amount: 45.00, status:'Cleared'},
 { id: 2, date:'2024-05-02', category:'Utilities', description:'Electricity Bill - April 2024', amount: 280.00, status:'Cleared'},
 { id: 3, date:'2024-05-01', category:'Marketing', description:'Local flyers printing', amount: 120.00, status:'Pending'},
]

const expenseCategories = [
 { value:'Shop Supplies', icon: ShoppingBag, color:'text-blue-500', bg:'bg-blue-50'},
 { value:'Utilities', icon: Lightbulb, color:'text-yellow-600', bg:'bg-yellow-50'},
 { value:'Marketing', icon: BarChart3, color:'text-purple-600', bg:'bg-purple-50'},
 { value:'Maintenance', icon: Wrench, color:'text-orange-600', bg:'bg-orange-50'},
 { value:'Transport', icon: Car, color:'text-emerald-600', bg:'bg-emerald-50'},
]

export default function ExpensesPage() {
 const [expenses, setExpenses] = useState(initialExpenses)
 const [showModal, setShowModal] = useState(false)
 const [showDeleteModal, setShowDeleteModal] = useState(false)
 const [editingExpense, setEditingExpense] = useState(null)
 const [deletingExpense, setDeletingExpense] = useState(null)
 const [formData, setFormData] = useState({ date: new Date().toISOString().split('T')[0], category:'Shop Supplies', description:'', amount:''})

 const exportExpenses = (format) => {
 const columns = ["Date","Category","Description","Amount","Status"]
 const rows = expenses.map(e => [e.date, e.category, e.description, e.amount, e.status])
 
 if (format ==='PDF') {
 generateReport('Expense List', columns, rows)
 toast.success('Expenses exported as PDF')
 } else {
 generateExcelReport('Expense List', columns, rows)
 toast.success('Expenses exported as Excel')
 }
 }

 const handleAdd = () => {
 setEditingExpense(null)
 setFormData({ date: new Date().toISOString().split('T')[0], category:'Shop Supplies', description:'', amount:''})
 setShowModal(true)
 }

 const handleEdit = (exp) => {
 setEditingExpense(exp)
 setFormData({
 date: exp.date,
 category: exp.category,
 description: exp.description,
 amount: exp.amount.toString()
 })
 setShowModal(true)
 }

 const handleSave = () => {
 if (!formData.description || !formData.amount) return toast.error('Please fill all fields')
 
 if (editingExpense) {
 setExpenses(prev => prev.map(e => e.id === editingExpense.id ? { 
 ...e, 
 ...formData, 
 amount: parseFloat(formData.amount) 
 } : e))
 toast.success('Expense record updated')
 } else {
 const newExp = {
 id: Date.now(),
 ...formData,
 amount: parseFloat(formData.amount),
 status:'Cleared'
 }
 setExpenses(prev => [newExp, ...prev])
 toast.success('Expense recorded successfully')
 }
 setShowModal(false)
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
 <div className="space-y-6 animate-in fade-in duration-500 pb-10">
 {/* Header */}
 <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
 <div>
 <h1 className="text-xl font-bold tracking-tight text-admin-value uppercase">Business Spending</h1>
 <p className="text-[13px] font-medium text-admin-label mt-1">Track and categorize all non-inventory operational costs.</p>
 </div>
 <div className="flex items-center gap-3 w-full sm:w-auto">
 <div className="flex items-center bg-card-bg border border-openpos-border rounded-lg overflow-hidden shadow-sm">
 <button 
 onClick={() => exportExpenses('PDF')}
 className="px-4 py-2.5 text-admin-dim transition-all flex items-center gap-2 border-r border-openpos-border"
 >
 <Download size={16} />
 <span className="text-[10px] font-bold uppercase tracking-widest">PDF</span>
 </button>
 <button 
 onClick={() => exportExpenses('Excel')}
 className="px-4 py-2.5 text-admin-dim transition-all flex items-center gap-2"
 >
 <Upload size={16} />
 <span className="text-[10px] font-bold uppercase tracking-widest">Excel</span>
 </button>
 </div>
 <button 
 onClick={handleAdd}
 className="flex-1 sm:flex-none bg-openpos-blue text-white px-5 py-2.5 rounded-lg font-bold text-[13px] flex items-center justify-center gap-2 shadow-lg shadow-openpos-blue/20 transition-all uppercase tracking-widest"
 >
 <Plus size={18} />
 Log Expense
 </button>
 </div>
 </div>

 {/* Metrics */}
 <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
 <StatCard title="Monthly Total"value="KES 2,450"change="+12%"isPositive={false} icon={TrendingDown} color="blue"/>
 <StatCard title="Pending Approval"value="KES 120"change="1 Record"isPositive={true} icon={Clock} color="blue"/>
 <StatCard title="Budget Usage"value="65%"change="Within Limit"isPositive={true} icon={BarChart3} color="blue"/>
 </div>

 {/* Ledger Card */}
 <Card 
 noPadding
 title="Expense Ledger"
 subtitle="Chronological transaction history"
 headerAction={
 <div className="flex items-center gap-2">
 <button className="p-2 bg-openpos-bg-subtle border border-openpos-border text-admin-dim rounded-lg transition-all"><Printer size={14} /></button>
 <button className="p-2 bg-openpos-bg-subtle border border-openpos-border text-admin-dim rounded-lg transition-all"><Filter size={14} /></button>
 </div>
 }
 >
 <div className="overflow-x-auto">
 <table className="w-full text-left">
 <thead>
 <tr className="bg-openpos-bg-subtle/30 border-b border-openpos-border">
 <th className="p-5 text-[10px] font-bold text-admin-dim uppercase tracking-widest">Transaction Details</th>
 <th className="p-5 text-[10px] font-bold text-admin-dim uppercase tracking-widest">Expense Category</th>
 <th className="p-5 text-[10px] font-bold text-admin-dim uppercase tracking-widest text-right">Amount</th>
 <th className="p-5 text-[10px] font-bold text-admin-dim uppercase tracking-widest text-center">Status</th>
 <th className="p-5 text-[10px] font-bold text-admin-dim uppercase tracking-widest text-right">Actions</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-openpos-border">
 {expenses.map((exp) => (
 <tr key={exp.id} className="group transition-colors cursor-default">
 <td className="p-5">
 <div className="flex items-center gap-3">
 
 <div>
 <h3 className="text-[13px] font-bold text-admin-value uppercase tracking-tight">{exp.description}</h3>
 <p className="text-[10px] font-bold text-admin-dim uppercase tracking-tight mt-0.5">{exp.date}</p>
 </div>
 </div>
 </td>
 <td className="p-5">
 <span className="px-2 py-0.5 bg-openpos-bg-subtle text-admin-value text-[9px] font-bold rounded-md tracking-widest border border-openpos-border uppercase">
 {exp.category}
 </span>
 </td>
 <td className="p-5 text-right">
 <span className="text-[13px] font-bold text-admin-value">KES {exp.amount.toFixed(2)}</span>
 </td>
 <td className="p-5 text-center">
 <span className={cn(
"px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest",
 exp.status ==='Cleared'?"bg-openpos-blue/10 text-openpos-blue":"bg-openpos-red/10 text-openpos-red"
 )}>
 {exp.status}
 </span>
 </td>
 <td className="p-5 text-right">
 <div className="flex items-center justify-end gap-1">
 <button 
 onClick={() => handleEdit(exp)}
 className="p-1.5 text-admin-dim rounded-lg transition-all"
 >
 <Edit2 size={14} />
 </button>
 <button 
 onClick={() => handleDelete(exp)}
 className="p-1.5 text-admin-dim rounded-lg transition-all"
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
 </Card>

 {/* Save Modal */}
 <Modal
 isOpen={showModal}
 onClose={() => setShowModal(false)}
 title={editingExpense ?"Update Expense Record":"Record New Expense"}
 description={editingExpense ?"Modify transaction details":"Log operational costs and bills"}
 confirmText={editingExpense ?"Save Changes":"Record Transaction"}
 onConfirm={handleSave}
 icon={Receipt}
 maxWidth="max-w-md"
 >
 <div className="space-y-5">
 <div className="grid grid-cols-2 gap-4">
 <div className="space-y-1.5">
 <label className="text-[10px] font-bold text-admin-dim uppercase tracking-widest ml-1">Date</label>
 <input 
 type="date"
 className="w-full bg-openpos-bg-subtle border border-openpos-border rounded-lg px-4 py-3 text-[12px] font-bold outline-none transition-all"
 value={formData.date}
 onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
 />
 </div>
 <div className="space-y-1.5">
 <label className="text-[10px] font-bold text-admin-dim uppercase tracking-widest ml-1">Category</label>
 <select 
 className="w-full bg-openpos-bg-subtle border border-openpos-border rounded-lg px-4 py-3 text-[12px] font-bold outline-none cursor-pointer"
 value={formData.category}
 onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
 >
 {expenseCategories.map(c => <option key={c.value} value={c.value}>{c.value}</option>)}
 </select>
 </div>
 </div>
 <div className="space-y-1.5">
 <label className="text-[10px] font-bold text-admin-dim uppercase tracking-widest ml-1">Expense Detail</label>
 <input 
 className="w-full bg-openpos-bg-subtle border border-openpos-border rounded-lg px-4 py-3 text-[12px] font-bold outline-none transition-all"
 placeholder="e.g. Electricity Bill, Internet"
 value={formData.description}
 onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
 />
 </div>
 <div className="space-y-1.5">
 <label className="text-[10px] font-bold text-admin-dim uppercase tracking-widest ml-1">Amount (KES)</label>
 <div className="relative">
 <span className="absolute left-4 top-1/2 -translate-y-1/2 text-admin-dim font-bold text-[12px]">KES</span>
 <input 
 type="number"
 className="w-full bg-openpos-bg-subtle border border-openpos-border rounded-lg pl-12 pr-4 py-3 text-[12px] font-bold outline-none transition-all"
 placeholder="0.00"
 value={formData.amount}
 onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
 />
 </div>
 </div>
 </div>
 </Modal>

 {/* Delete Modal */}
 <Modal
 isOpen={showDeleteModal}
 onClose={() => setShowDeleteModal(false)}
 title="Delete Expense Record"
 description={`Are you sure you want to remove the record for"${deletingExpense?.description}"?`}
 type="danger"
 icon={Trash2}
 confirmText="Delete Record"
 confirmCountdown={5}
 onConfirm={confirmDelete}
 >
 <div className="p-4 bg-openpos-red/5 border border-openpos-red/10 rounded-lg">
 <p className="text-[11px] text-openpos-red font-bold uppercase tracking-tight leading-relaxed">
 This action is permanent and will remove this expense from your financial reports and spending history.
 </p>
 </div>
 </Modal>
 </div>
 )
}
