"use client"

import React, { useState, useEffect, Suspense } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
    Menu, Bell, ChevronRight, X, LogOut, Search, Shield
} from 'lucide-react'
import { Sidebar } from '@/components/Sidebar'
import { Modal } from '@/components/Modal'
import { cn } from '@/lib/utils'
import ProtectedRoute from '@/components/ProtectedRoute'
import authService from '@/lib/auth'
import { ThemeToggle } from '@/components/ThemeToggle'
import { GlobalSearch } from '@/components/GlobalSearch'

export default function DashboardLayout({ children }) {
    const router = useRouter()
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const [isMobile, setIsMobile] = useState(false)
    const [isZenMode, setIsZenMode] = useState(false)
    const [showLogoutModal, setShowLogoutModal] = useState(false)
    const [user, setUser] = useState(null)
    const pathname = usePathname()

    useEffect(() => {
        const userData = authService.getUser()
        setUser(userData)
    }, [])

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (mobile) setIsSidebarOpen(false);
            else setIsSidebarOpen(true);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (isMobile) setIsSidebarOpen(false)
    }, [pathname, isMobile])

    const getPageName = () => {
        const path = pathname.split('/').pop() || 'Summary';
        return path
            .replace(/[-_]/g, ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    const handleLogout = async () => {
        await authService.logout()
        router.push('/login')
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-openpos-bg font-figtree overflow-x-hidden relative">
                <Sidebar 
                    isSidebarOpen={isSidebarOpen} 
                    setIsSidebarOpen={setIsSidebarOpen}
                    isMobile={isMobile}
                    pathname={pathname}
                    isZenMode={isZenMode}
                    setIsZenMode={setIsZenMode}
                />

                {/* Main Content Area */}
                <main className={cn(
                    "transition-all duration-500 ease-in-out",
                    pathname === '/dashboard/pos' ? "h-screen overflow-hidden" : "min-h-screen",
                    isZenMode ? "pl-16" : isSidebarOpen ? "md:pl-64" : "pl-16"
                )}>
                    {/* Header */}
                    {!isZenMode && (
                        <header className={cn(
                            "fixed top-0 right-0 z-[100] transition-all duration-500 flex items-center bg-openpos-bg/80 backdrop-blur-xl border-b border-openpos-border h-16",
                            isSidebarOpen ? "md:left-64 left-0" : "left-16"
                        )}>
                            <div className="px-6 w-full flex items-center justify-between max-w-[1600px] mx-auto">
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                        className="p-2 text-admin-dim hover:bg-openpos-bg-subtle rounded-xl md:block hidden transition-all"
                                    >
                                        <Menu size={18} />
                                    </button>
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-[12px] font-bold text-admin-value uppercase tracking-[2px]">{getPageName()}</h2>
                                        <span className="w-1 h-1 rounded-full bg-admin-dim/30" />
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-[10px] font-bold text-admin-dim uppercase tracking-widest">{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                                            <span className="text-[14px]">🇰🇪</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <GlobalSearch />
                                    <ThemeToggle />
                                    <Link 
                                        href="/dashboard/settings/profile"
                                        className="flex items-center gap-3 px-3 py-1.5 bg-openpos-bg-subtle/50 rounded-2xl border border-openpos-border/50 hover:bg-white hover:border-openpos-blue/30 transition-all group"
                                    >
                                        <div className="w-6 h-6 rounded-lg bg-openpos-blue/10 flex items-center justify-center text-openpos-blue font-bold text-[10px] group-hover:bg-openpos-blue group-hover:text-white transition-all">
                                            {user?.name?.charAt(0) || 'A'}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-admin-value leading-none uppercase group-hover:text-openpos-blue transition-all">{user?.name || 'Administrator'}</span>
                                            <span className="text-[8px] font-bold text-admin-dim uppercase tracking-tighter mt-0.5">{user?.role || 'Store Owner'}</span>
                                        </div>
                                    </Link>
                                    <button 
                                        onClick={() => setShowLogoutModal(true)}
                                        className="ml-2 p-1.5 text-admin-dim hover:text-openpos-red hover:bg-openpos-red/5 rounded-lg transition-all"
                                    >
                                        <LogOut size={14} />
                                    </button>
                                </div>
                            </div>
                        </header>
                    )}

                    <div className={cn(
                        "transition-all duration-500",
                        isZenMode 
                            ? "h-screen overflow-hidden" 
                            : pathname === '/dashboard/pos' 
                                ? "pt-16 h-screen overflow-hidden bg-[#F1F5F9]" 
                                : "pt-20 px-6 pb-8 min-h-[calc(100vh-64px)]"
                    )}>
                        <div className={cn(
                            pathname === '/dashboard/pos' ? "h-full" : "max-w-[1600px] mx-auto"
                        )}>
                            <Suspense fallback={
                                <div className="flex items-center justify-center h-64">
                                    <div className="w-8 h-8 border-4 border-openpos-blue/20 border-t-openpos-blue rounded-full animate-spin" />
                                </div>
                            }>
                                {children}
                            </Suspense>
                        </div>
                    </div>
                </main>

                {/* Logout Modal */}
                <Modal
                    isOpen={showLogoutModal}
                    onClose={() => setShowLogoutModal(false)}
                    title="Sign Out"
                    description="Are you sure you want to end your current session?"
                    type="danger"
                    icon={LogOut}
                    confirmText="Logout"
                    confirmCountdown={3}
                    onConfirm={handleLogout}
                >
                    <div className="p-4 bg-red-50 rounded-2xl border border-red-100 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0 mt-0.5">
                            <X size={14} />
                        </div>
                        <div>
                            <p className="text-[12px] text-red-600 font-bold uppercase tracking-widest">Session Termination</p>
                            <p className="text-[11px] text-red-500 mt-1 font-medium leading-relaxed">
                                You will be redirected to the login page and all unsaved progress in active forms may be lost.
                            </p>
                        </div>
                    </div>
                </Modal>
            </div>
        </ProtectedRoute>
    )
}
