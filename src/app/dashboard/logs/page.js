"use client"
import React, { useState, useEffect, useRef, useCallback } from'react'
import { Activity, Clock, Search, RefreshCw, ChevronDown, Filter } from'lucide-react'
import { Card } from'@/components/Card'
import { Skeleton, TableRowSkeleton } from'@/components/Skeleton'
import { cn } from'@/lib/utils'
import { logsService } from'@/services/logs'
import authService from'@/lib/auth'
import { useRouter } from'next/navigation'

export default function SystemLogsPage() {
 const router = useRouter()
 const [logs, setLogs] = useState([])
 const [isLoading, setIsLoading] = useState(true)
 const [isLoadingMore, setIsLoadingMore] = useState(false)
 const [isRefreshing, setIsRefreshing] = useState(false)
 const [searchTerm, setSearchTerm] = useState('')
 const [statusFilter, setStatusFilter] = useState('all')
 
 // Pagination state
 const [page, setPage] = useState(1)
 const [hasMore, setHasMore] = useState(true)
 const [total, setTotal] = useState(0)
 
 // Refs for infinite scroll
 const observer = useRef()
 const fetchLock = useRef(false)

 /**
 * core fetch logic
 */
 const loadLogs = async (pageNum = 1, search ='', currentStatus ='all', append = false) => {
 if (fetchLock.current) return
 fetchLock.current = true
 
 if (!append) setIsLoading(true)
 else setIsLoadingMore(true)
 
 try {
 const res = await logsService.getLogs({ page: pageNum, limit: 30, search: search, status: currentStatus })
 if (res?.status ==='success') {
 const newLogs = res.data || []
 
 if (append) {
 setLogs(prev => {
 // Avoid duplicates if any
 const existingIds = new Set(prev.map(l => l.id))
 return [...prev, ...newLogs.filter(l => !existingIds.has(l.id))]
 })
 } else {
 setLogs(newLogs)
 }
 
 setTotal(res.pagination?.total || 0)
 setHasMore(res.pagination?.has_more || false)
 setPage(pageNum)
 }
 } catch (e) {
 console.error("Failed to fetch logs:", e)
 } finally {
 setIsLoading(false)
 setIsLoadingMore(false)
 setIsRefreshing(false)
 fetchLock.current = false
 }
 }

 // Initialize load and handle search with debounce
 useEffect(() => {
 if (!authService.hasPolicy('view_logs')) {
 router.push('/dashboard')
 return
 }
 const timer = setTimeout(() => {
 loadLogs(1, searchTerm, statusFilter, false)
 }, 500)
 return () => clearTimeout(timer)
 }, [searchTerm, statusFilter, router])

 const handleRefresh = () => {
 setIsRefreshing(true)
 setSearchTerm('')
 setStatusFilter('all')
 loadLogs(1,'','all', false)
 }

 // Intersection Observer for infinite scroll
 const lastElementRef = useCallback(node => {
 if (isLoading || isLoadingMore) return
 if (observer.current) observer.current.disconnect()
 
 observer.current = new IntersectionObserver(entries => {
 if (entries[0].isIntersecting && hasMore && !fetchLock.current) {
 loadLogs(page + 1, searchTerm, statusFilter, true)
 }
 })
 
 if (node) observer.current.observe(node)
 }, [isLoading, isLoadingMore, hasMore, page, searchTerm, statusFilter])



 return (
 <div className="space-y-6 font-figtree animate-in fade-in duration-700 max-w-[1600px] mx-auto pb-20">
 {/* Header Section */}
 <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-openpos-border pb-6">
 <div>
 <h1 className="text-xl font-bold text-admin-value uppercase tracking-tight">System Logs</h1>
 <p className="text-[10px] font-medium text-gray-400 mt-0.5 tracking-widest uppercase">Comprehensive Audit Trail & User Activity</p>
 </div>
 <div className="flex flex-col sm:flex-row items-center gap-3">
 <button
 onClick={handleRefresh}
 disabled={isRefreshing}
 className="flex items-center gap-2 px-6 py-2.5 bg-openpos-blue/5 text-openpos-blue border border-openpos-blue/10 rounded-xl transition-all text-xs font-medium uppercase tracking-widest w-full sm:w-auto justify-center disabled:opacity-50"
 >
 <RefreshCw size={14} className={cn(isRefreshing &&"animate-spin")} />
 </button>
 </div>
 </div>

 {/* Activity Monitoring Control */}
 <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-card-bg p-4 rounded-2xl border border-openpos-border shadow-sm">
 <div className="relative w-full md:w-96 group">
 <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-admin-dim group-focus-within:text-openpos-blue transition-colors"size={16} />
 <input
 type="text"
 autoComplete="off"
 placeholder="Search by user, action, or description..."
 className="w-full pl-10 pr-4 py-2.5 bg-openpos-bg-subtle border border-openpos-border rounded-xl text-[11px] font-bold text-admin-value transition-all"
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 />
 </div>
 <div className="flex items-center gap-3 w-full md:w-auto">
 <div className="flex items-center gap-2 px-4 py-2 bg-openpos-bg-subtle border border-openpos-border rounded-xl">
 <Filter size={14} className="text-openpos-blue"/>
 <select
 className="bg-transparent text-[11px] font-bold text-admin-value cursor-pointer uppercase tracking-widest outline-none border-none p-0"
 value={statusFilter}
 onChange={(e) => setStatusFilter(e.target.value)}
 >
 <option value="all">ALL SYSTEM ACTIVITY</option>
 <option value="success">SUCCESSFUL VECTORS</option>
 <option value="failed">FAILED VECTORS</option>
 </select>
 </div>
 </div>
 </div>

 {/* Audit Trail Ledger */}
 <Card noPadding className="shadow-sm">
 <div className="overflow-x-auto custom-scrollbar">
 <table className="w-full text-left whitespace-nowrap border-collapse text-[11px]">
 <thead>
 <tr className="bg-openpos-bg-subtle/50 border-b border-openpos-border text-[9px] font-bold text-admin-dim uppercase tracking-widest">
 <th className="px-6 py-4">Security Principal</th>
 <th className="px-6 py-4 text-center">Operation Vector</th>
 <th className="px-6 py-4">Activity Audit Narrative</th>
 <th className="px-6 py-4 text-center">Network Identity</th>
 <th className="px-6 py-4 text-right">Temporal Signature</th>
 <th className="px-6 py-4 text-center">Vector Status</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-openpos-border">
 {isLoading ? (
 <TableRowSkeleton cols={6} rows={15} />
 ) : logs.length === 0 ? (
 <tr>
 <td colSpan={6} className="py-32 text-center bg-openpos-bg-subtle/20">
 <div className="flex flex-col items-center justify-center gap-3">
 <div className="w-16 h-16 bg-openpos-bg-subtle rounded-full flex items-center justify-center text-admin-dim/40 opacity-50 border border-openpos-border">
 <Activity size={32} />
 </div>
 <div className="space-y-1">
 <p className="text-[12px] font-bold text-admin-value uppercase tracking-widest">No audit data indexed</p>
 <p className="text-[10px] text-admin-dim uppercase font-bold opacity-60">Adjust security filters or search vectors</p>
 </div>
 </div>
 </td>
 </tr>
 ) : (
 logs.map((log, index) => {
 const isLast = index === logs.length - 1;
 return (
 <tr 
 key={log.id} 
 ref={isLast ? lastElementRef : null}
 className="transition-colors group cursor-default"
 >
 <td className="px-6 py-4">
 <div className="flex flex-col">
 <span className="text-[11px] font-bold text-admin-value uppercase transition-colors">
 {log.user}
 </span>
 <span className="text-[8px] text-admin-dim font-bold uppercase tracking-tighter opacity-60 mt-1">
 TRX: {log.id.split('-').pop().substring(0, 8)}
 </span>
 </div>
 </td>
 <td className="px-6 py-4 text-center">
 <span className="text-[8px] font-bold uppercase py-1 px-2.5 bg-openpos-bg-subtle border border-openpos-border text-admin-dim rounded-md transition-all">
 {log.action}
 </span>
 </td>
 <td className="px-6 py-4">
 <p className="text-[10px] text-admin-dim max-w-sm font-bold uppercase tracking-tight leading-relaxed opacity-80">
 {log.description}
 </p>
 </td>
 <td className="px-6 py-4 text-center">
 <span className="text-[9px] font-mono font-bold text-admin-dim opacity-70 bg-openpos-bg-subtle px-2 py-0.5 rounded border border-openpos-border">
 {log.ip ||'INTERNAL'}
 </span>
 </td>
 <td className="px-6 py-4 text-right">
 <div className="flex flex-col items-end">
 <span className="text-[10px] font-bold text-admin-value uppercase tracking-tighter">{log.time}</span>
 <span className="text-[8px] text-admin-dim font-bold uppercase tracking-tighter opacity-60 mt-0.5">{log.date.split('')[0]}</span>
 </div>
 </td>
 <td className="px-6 py-4">
 <div className="flex items-center justify-center gap-2">
 <div className={cn(
"w-1.5 h-1.5 rounded-full shadow-sm",
 log.status ==='failed'?"bg-openpos-red":"bg-emerald-500"
 )} />
 <span className={cn(
"text-[9px] font-bold uppercase tracking-widest",
 log.status ==='failed'?"text-openpos-red":"text-emerald-500"
 )}>{log.status}</span>
 </div>
 </td>
 </tr>
 )
 })
 )}
 </tbody>
 </table>
 </div>

 {/* Infinite Scroll Loader */}
 {isLoadingMore ? (
 <div className="bg-card-bg border-t border-openpos-border">
 <table className="w-full">
 <tbody>
 <TableRowSkeleton cols={6} rows={3} />
 </tbody>
 </table>
 </div>
 ) : (
 <div className="py-4 border-t border-openpos-border bg-openpos-bg-subtle/20 flex items-center justify-center">
 <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
 {hasMore ?'Scroll for more activity':`End of trace - ${total} records indexed`}
 </p>
 </div>
 )}
 </Card>
 </div>
 )
}

