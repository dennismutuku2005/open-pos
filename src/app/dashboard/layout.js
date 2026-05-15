"use client"

import React, { useState, useEffect, Suspense } from'react'
import { usePathname, useRouter } from'next/navigation'
import Link from'next/link'
import {
  Menu, Bell, ChevronRight, X, LogOut, Search, Shield, Clock, Store, ChevronDown
} from'lucide-react'
import { Sidebar } from'@/components/Sidebar'
import { Modal } from'@/components/Modal'
import { cn } from'@/lib/utils'
import ProtectedRoute from'@/components/ProtectedRoute'
import authService from'@/lib/auth'
import { ThemeToggle } from'@/components/ThemeToggle'
import { GlobalSearch } from'@/components/GlobalSearch'
import { toast } from 'sonner'

export default function DashboardLayout({ children }) {
 const router = useRouter()
 const [isSidebarOpen, setIsSidebarOpen] = useState(true)
 const [isMobile, setIsMobile] = useState(false)
 const [isZenMode, setIsZenMode] = useState(false)
 const [showLogoutModal, setShowLogoutModal] = useState(false)
 const [user, setUser] = useState(null)
 const [businesses, setBusinesses] = useState([])
 const [activeBusiness, setActiveBusiness] = useState(null)
 const [showBusinessDropdown, setShowBusinessDropdown] = useState(false)
 const [currentTime, setCurrentTime] = useState(new Date())
 const [mounted, setMounted] = useState(false)
 const pathname = usePathname()

 useEffect(() => {
 setMounted(true)
 const timer = setInterval(() => setCurrentTime(new Date()), 1000);
 return () => clearInterval(timer);
 }, []);

 useEffect(() => {
   const userData = authService.getUser()
   setUser(userData)
   setBusinesses(authService.getBusinesses())
   setActiveBusiness(authService.getActiveBusiness())
 }, [])

 // Listen for storage events (business changes)
 useEffect(() => {
   const handleStorageChange = () => {
     setActiveBusiness(authService.getActiveBusiness());
   };
   window.addEventListener('storage', handleStorageChange);
   return () => window.removeEventListener('storage', handleStorageChange);
 }, []);

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
 const segments = pathname.split('/').filter(Boolean);
 if (segments.length <= 1) return'';
 
 // Handle nested paths like /dashboard/sales/list ->"Sales List"
 return segments
 .slice(1) // Remove'dashboard'
 .map(word => word.replace(/[-_]/g,''))
 .map(word => word.charAt(0).toUpperCase() + word.slice(1))
 .join('');
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
"transition-all duration-500 ease-in-out h-screen flex flex-col overflow-hidden",
 isZenMode ?"pl-0 md:pl-16": isSidebarOpen ?"pl-0 md:pl-64":"pl-0 md:pl-16"
 )}>
 {/* Header */}
 {!isZenMode && (
 <header className="h-14 border-b border-openpos-border bg-card-bg flex items-center justify-between px-6 shrink-0 z-40">
 <div className="flex items-center gap-3">
 <button 
 onClick={() => setIsSidebarOpen(!isSidebarOpen)}
 className="p-1.5 text-admin-dim rounded-lg transition-all"
 >
 <Menu size={18} />
 </button>
 <div>
  <div className="flex items-center gap-3">
    {/* Business Selector */}
    <div className="relative">
      <button 
        onClick={() => setShowBusinessDropdown(!showBusinessDropdown)}
        className="flex items-center gap-2 px-3 py-1.5 bg-openpos-blue/5 border border-openpos-blue/10 rounded-lg hover:bg-openpos-blue/10 transition-all group"
      >
        <div className="w-6 h-6 rounded-md bg-openpos-blue/10 flex items-center justify-center text-openpos-blue">
          <Store size={14} />
        </div>
        <div className="flex flex-col items-start text-left">
          <span className="text-[10px] font-bold text-admin-value uppercase tracking-tight leading-none">
            {activeBusiness?.name || 'Select Business'}
          </span>
          <span className="text-[8px] font-bold text-openpos-blue uppercase tracking-widest mt-0.5 opacity-70">
            {activeBusiness?.role || 'Staff'} Access
          </span>
        </div>
        <ChevronDown size={12} className={cn("text-admin-dim transition-transform duration-300", showBusinessDropdown && "rotate-180")} />
      </button>

      {showBusinessDropdown && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowBusinessDropdown(false)}
          />
          <div className="absolute top-full left-0 mt-2 w-56 bg-card-bg border border-openpos-border rounded-xl shadow-2xl shadow-openpos-blue/10 z-50 py-2 animate-in fade-in zoom-in-95 duration-200">
            <div className="px-3 py-2 border-b border-openpos-border mb-1">
              <p className="text-[9px] font-bold text-admin-dim uppercase tracking-widest">Switch Business</p>
            </div>
            <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
              {businesses.map((biz) => (
                <button
                  key={biz.id}
                  onClick={() => {
                    authService.setActiveBusiness(biz.id);
                    setActiveBusiness(biz);
                    setShowBusinessDropdown(false);
                    toast.success(`Switched to ${biz.name}`);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 transition-all hover:bg-openpos-bg-subtle",
                    activeBusiness?.id === biz.id ? "bg-openpos-blue/5 border-l-2 border-openpos-blue" : "border-l-2 border-transparent"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[10px]",
                    activeBusiness?.id === biz.id ? "bg-openpos-blue text-white shadow-lg shadow-openpos-blue/20" : "bg-openpos-bg-subtle text-admin-dim"
                  )}>
                    {biz.name.charAt(0)}
                  </div>
                  <div className="flex flex-col items-start text-left">
                    <span className={cn(
                      "text-[11px] font-bold uppercase tracking-tight",
                      activeBusiness?.id === biz.id ? "text-openpos-blue" : "text-admin-value"
                    )}>
                      {biz.name}
                    </span>
                    <span className="text-[9px] font-bold text-admin-dim uppercase tracking-tighter">
                      {biz.role} Account
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
    
    <div className="w-px h-6 bg-openpos-border mx-1 hidden sm:block" />

    {getPageName() && (
      <h2 className="text-[12px] font-bold text-admin-value tracking-tight leading-none uppercase hidden sm:block">
        {getPageName()}
      </h2>
    )}
  </div>
</div>
 </div>

 <div className="flex items-center gap-6">
 {/* Global Search */}
 <div className="hidden lg:block w-[280px]">
 <GlobalSearch />
 </div>

 <div className="flex items-center gap-4">
 {/* Utilities */}
 <div className="flex items-center gap-2 pr-4 border-r border-openpos-border">
 <ThemeToggle />
 <div className="hidden sm:flex items-center gap-2 bg-openpos-bg-subtle px-2 py-1 rounded-lg border border-openpos-border shadow-sm">
 <Clock size={10} className="text-openpos-blue"/>
 <span className="text-[9px] font-bold text-admin-value uppercase tracking-widest">
 {mounted ? currentTime.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit'}) :'--:--'}
 </span>
 </div>
 </div>

 {/* Profile */}
 <div className="flex items-center gap-2 pl-1">
 <div className="text-right hidden md:block">
 <p className="text-[10px] font-bold text-admin-value leading-none">
 {mounted ? (authService.getUser()?.name ||'Admin User') :'...'}
 </p>
 <p className="text-[8px] font-bold text-openpos-blue uppercase tracking-widest mt-0.5">
 {mounted ? (authService.getUser()?.type ||'Staff') :'...'}
 </p>
 </div>
 <div className="w-7 h-7 rounded-lg bg-openpos-blue flex items-center justify-center text-white font-bold shadow-lg shadow-openpos-blue/20 text-[10px]">
 {mounted ? authService.getUser()?.name?.charAt(0) :'A'}
 </div>
 <button 
 onClick={() => setShowLogoutModal(true)}
 className="p-1.5 text-admin-dim rounded-lg transition-all"
 >
 <LogOut size={12} />
 </button>
 </div>
 </div>
 </div>
 </header>
 )}

 <div className={cn(
"flex-1 overflow-y-auto overflow-x-hidden transition-all duration-500 bg-openpos-bg",
 isZenMode ?"p-0":"px-3 md:px-6 py-3"
 )}>
 <div className={cn(
 pathname ==='/dashboard/pos'?"h-full":"max-w-[1600px] mx-auto"
 )}>
 <Suspense fallback={
 <div className="flex items-center justify-center h-64">
 <div className="w-8 h-8 border-4 border-openpos-blue/20 border-t-openpos-blue rounded-full animate-spin"/>
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
 <div className="p-4 bg-red-50 rounded-lg border border-red-100 flex items-start gap-3">
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
