"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Bell, CheckCircle, Clock, Eye, AlertCircle, RefreshCw, X, Info, CheckCircle2 } from 'lucide-react'
import { Badge } from '@/components/Badge'
import { Skeleton, TableRowSkeleton } from '@/components/Skeleton'
import { systemService } from '@/services/system'
import { format } from 'date-fns'
import authService from '@/lib/auth'
import { useRouter } from 'next/navigation'

export default function NotificationsPage() {
    const router = useRouter()
    const [notifications, setNotifications] = useState([])
    const [loading, setLoading] = useState(true)
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, has_more: false })
    const [error, setError] = useState(null)
    
    // Modal State
    const [selectedNotif, setSelectedNotif] = useState(null)

    // Refs for infinite scroll
    const observer = useRef()
    const fetchLock = useRef(false)

    useEffect(() => {
        if (!authService.hasPolicy('view_notifications')) {
            router.push('/dashboard')
            return
        }
        fetchNotifications(1, false)
    }, [router])

    const fetchNotifications = async (page = 1, append = false) => {
        if (fetchLock.current) return
        fetchLock.current = true

        if (!append) setLoading(true)
        else setIsLoadingMore(true)

        try {
            const res = await systemService.getNotifications(page, 20)
            if (res.status === 'success') {
                const newItems = res.data || []
                if (append) {
                    setNotifications(prev => [...prev, ...newItems])
                } else {
                    setNotifications(newItems)
                }
                setPagination(res.pagination)
            } else {
                setError(res.message)
            }
        } catch (err) {
            setError("Failed to load notifications")
        } finally {
            setLoading(false)
            setRefreshing(false)
            setIsLoadingMore(false)
            fetchLock.current = false
        }
    }

    const handleRefresh = () => {
        setRefreshing(true)
        fetchNotifications(1, false)
    }

    const lastElementRef = useCallback(node => {
        if (loading || isLoadingMore) return
        if (observer.current) observer.current.disconnect()
        
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && pagination.has_more && !fetchLock.current) {
                fetchNotifications(pagination.page + 1, true)
            }
        })
        
        if (node) observer.current.observe(node)
    }, [loading, isLoadingMore, pagination.has_more, pagination.page])

    const handleMarkAsRead = async (id = null) => {
        try {
            const res = await systemService.markNotificationAsRead(id)
            if (res.status === 'success') {
                if (id) {
                    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: 1 } : n))
                } else {
                    setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })))
                }
            }
        } catch (err) {
            console.error("Error marking as read:", err)
        }
    }

    const openModal = (notif) => {
        setSelectedNotif(notif)
        if (notif.is_read == 0) {
            handleMarkAsRead(notif.id)
        }
    }

    const unreadCount = notifications.filter(n => n.is_read == 0).length

    return (
        <div className="space-y-6 animate-in fade-in duration-700 max-w-6xl mx-auto pb-20">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-openpos-border pb-5">
                <div>
                    <h1 className="text-xl font-medium text-openpos-blue flex items-center gap-2 uppercase tracking-tight">
                        <Bell size={20} />
                        System Notifications
                        {unreadCount > 0 && (
                            <span className="ml-2 text-[10px] font-bold bg-openpos-red text-white px-2 py-0.5 rounded-full">{unreadCount} UNREAD</span>
                        )}
                    </h1>
                    <p className="text-[10px] text-admin-dim mt-0.5 font-medium uppercase tracking-widest">
                        View system alerts, inventory warnings, and POS operational messages.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="flex items-center gap-2 px-6 py-2.5 bg-openpos-blue/5 text-openpos-blue border border-openpos-blue/10 rounded-xl hover:bg-openpos-blue/10 transition-all text-xs font-medium uppercase tracking-widest w-full sm:w-auto justify-center disabled:opacity-50"
                        title="Refresh"
                    >
                        <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
                    </button>
                    <button
                        onClick={() => handleMarkAsRead()}
                        className="px-4 py-2 bg-openpos-bg-subtle border border-openpos-border text-admin-dim rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-card-bg hover:text-openpos-blue transition-all"
                    >
                        Mark All as Read
                    </button>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-600 text-xs">
                    <AlertCircle size={16} />
                    {error}
                </div>
            )}

            {/* Notifications Table */}
            <div className="bg-card-bg border border-openpos-border rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-[11px]">
                        <thead className="bg-openpos-bg-subtle border-b border-openpos-border text-admin-dim font-bold uppercase tracking-wider text-[10px]">
                            <tr>
                                <th className="px-6 py-4 w-12">Status</th>
                                <th className="px-6 py-4 w-32">Type</th>
                                <th className="px-6 py-4 w-64">Title</th>
                                <th className="px-6 py-4">Message Snippet</th>
                                <th className="px-6 py-4 w-32">Time</th>
                                <th className="px-6 py-4 text-right w-24">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-openpos-border">
                            {loading && notifications.length === 0 ? (
                                <TableRowSkeleton cols={6} rows={12} />
                            ) : notifications.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-20 text-center text-gray-400">
                                        <Bell size={48} className="mx-auto mb-4 opacity-10" />
                                        <p className="font-medium text-xs uppercase tracking-widest">No notifications to show</p>
                                    </td>
                                </tr>
                            ) : (
                                notifications.map((notif, index) => {
                                    const isLast = index === notifications.length - 1;
                                    return (
                                        <tr 
                                            key={notif.id} 
                                            ref={isLast ? lastElementRef : null}
                                            onClick={() => openModal(notif)}
                                            className={`hover:bg-openpos-bg-subtle/50 transition-colors cursor-pointer group ${notif.is_read == 0 ? 'bg-openpos-blue/[0.02]' : ''}`}
                                        >
                                            <td className="px-6 py-4">
                                                {notif.is_read == 0 ? (
                                                    <div className="w-2.5 h-2.5 rounded-full bg-openpos-blue shadow-[0_0_8px_rgba(37,99,235,0.5)]" title="Unread" />
                                                ) : (
                                                    <CheckCircle size={14} className="text-admin-dim opacity-40" />
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge 
                                                    variant={
                                                        notif.type === 'alert' ? 'error' :
                                                        notif.type === 'success' ? 'success' : 'info'
                                                    }
                                                    className="text-[9px] uppercase tracking-tighter px-2 py-0.5"
                                                >
                                                    {notif.type || 'system'}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-admin-value">
                                                {notif.title}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-admin-dim font-medium line-clamp-1 group-hover:text-admin-value transition-colors">{notif.message}</span>
                                            </td>
                                            <td className="px-6 py-4 text-admin-dim">
                                                <div className="flex items-center gap-1.5 whitespace-nowrap font-bold">
                                                    <Clock size={12} />
                                                    {format(new Date(notif.created_at), 'MMM d, HH:mm')}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        className="p-2 text-admin-dim hover:text-openpos-blue hover:bg-openpos-blue/10 rounded-lg transition-all"
                                                        title="View Details"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>

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
                            {pagination.has_more ? 'Scroll for more alerts' : `End of notifications - ${pagination.total} alerts tracked`}
                        </p>
                    </div>
                )}
            </div>

            {/* Notification Detail Modal */}
            {selectedNotif && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedNotif(null)} />
                    <div className="bg-card-bg border border-openpos-border rounded-3xl w-full max-w-md overflow-hidden relative shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="p-6 border-b border-openpos-border flex items-center justify-between bg-openpos-bg-subtle/50">
                            <div className="flex items-center gap-3">
                                {selectedNotif.type === 'alert' ? <AlertCircle className="text-openpos-red" size={24} /> :
                                 selectedNotif.type === 'success' ? <CheckCircle2 className="text-openpos-green" size={24} /> :
                                 <Info className="text-openpos-blue" size={24} />}
                                <h2 className="text-lg font-bold text-admin-value uppercase tracking-tighter">Notification Details</h2>
                            </div>
                            <button onClick={() => setSelectedNotif(null)} className="p-2 hover:bg-white rounded-xl text-admin-dim transition-colors"><X size={20} /></button>
                        </div>
                        <div className="p-6 space-y-5">
                            <div>
                                <h3 className="text-xl font-bold text-admin-value tracking-tight mb-2">{selectedNotif.title}</h3>
                                <p className="text-[13px] font-medium text-admin-label leading-relaxed bg-openpos-bg-subtle p-4 rounded-xl border border-openpos-border">
                                    {selectedNotif.message}
                                </p>
                            </div>
                            
                            <div className="flex items-center justify-between pt-4 border-t border-openpos-border">
                                <span className="text-[10px] font-bold text-admin-dim uppercase tracking-widest bg-openpos-bg-subtle px-3 py-1.5 rounded-lg">
                                    {format(new Date(selectedNotif.created_at), 'PPpp')}
                                </span>
                                <Badge 
                                    variant={selectedNotif.type === 'alert' ? 'error' : selectedNotif.type === 'success' ? 'success' : 'info'}
                                    className="text-[10px] uppercase tracking-tighter px-3 py-1"
                                >
                                    {selectedNotif.type || 'system'}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
