"use client"

import React, { useState, useEffect } from'react'
import Link from'next/link'
import { useSearchParams } from'next/navigation'
import Image from'next/image'
import {
 Users, CreditCard, Ticket, Settings,
 Activity, FileText, Network, Receipt,
 UserRoundCheck, MessageSquare, Globe, ChevronDown,
 LogOut, LayoutDashboard, Clock, Smartphone, Bell,
 Package, Layers, ShoppingBag, BarChart3, Store, Wallet
} from'lucide-react'
import { Modal } from'@/components/Modal'
import { cn } from'@/lib/utils'

import authService from'@/lib/auth'

export function Sidebar({ isSidebarOpen, setIsSidebarOpen, isMobile, pathname, isZenMode, setIsZenMode }) {
 const [openMenus, setOpenMenus] = useState([])
 const [showLogoutModal, setShowLogoutModal] = useState(false)
 const [isLoggingOut, setIsLoggingOut] = useState(false)
 const [mounted, setMounted] = useState(false)
 const searchParams = useSearchParams()

 useEffect(() => {
 setMounted(true)
 }, [])

 // Helper to persist query params
 const createHref = (href) => {
 if (!searchParams) return href
 const params = new URLSearchParams(searchParams)

 // Remove specific identifiers that shouldn't persist across different pages
 const keysToClear = ['phone','mac','id','code','v']
 keysToClear.forEach(key => params.delete(key))

 const queryString = params.toString()
 return queryString ?`${href}?${queryString}`: href
 }

 const toggleMenu = (id) => {
 setOpenMenus(prev =>
 prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
 )
 }

 const user = mounted ? authService.getUser() : null
 const isAdmin = user?.type ==='admin'|| user?.type ==='superadmin'
 const hasPolicy = (policy) => authService.hasPolicy(policy);

 // Add body scroll lock when mobile sidebar is open
 useEffect(() => {
 if (isMobile && isSidebarOpen) {
 document.body.style.overflow ='hidden';
 } else {
 document.body.style.overflow ='';
 }
 return () => {
 document.body.style.overflow ='';
 };
 }, [isMobile, isSidebarOpen]);

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { id: 'pos', name: 'POS', href: '/dashboard/pos', icon: Smartphone, badge: 'Live', policy: 'access_pos' },
    { 
      id: 'sales', 
      name: 'Sales', 
      icon: ShoppingBag,
      policy: 'view_sales',
      children: [
        { name: 'Overview', href: '/dashboard/sales' },
        { name: 'Transactions', href: '/dashboard/sales/list' },
        { name: 'Analytics', href: '/dashboard/sales/analytics' },
      ]
    },
    
    {
      id: 'inventory',
      name: 'Inventory',
      icon: Package,
      policy: 'view_inventory',
      children: [
        { name: 'Products', href: '/dashboard/products', badge: '12' },
        { name: 'Categories', href: '/dashboard/categories' },
        { name: 'Stock Corrections', href: '/dashboard/stock-adjustment' },
      ]
    },
    
    {
      id: 'stock',
      name: 'Stock Management',
      icon: Layers,
      policy: 'view_inventory',
      children: [
        { name: 'In Stock', href: '/dashboard/stock/in-stock' },
        { name: 'Out of Stock', href: '/dashboard/stock/out-of-stock' },
        { name: 'Expired Products', href: '/dashboard/stock/expired' },
      ]
    },

    {
      id: 'relations',
      name: 'Relations',
      icon: Users,
      policy: 'view_customers',
      children: [
        { name: 'Customers', href: '/dashboard/customers' },
        { name: 'Suppliers', href: '/dashboard/suppliers' },
      ]
    },

    { id: 'purchases', name: 'Procurement', href: '/dashboard/purchases', icon: ShoppingBag, badge: '2 Pending', policy: 'view_purchases' },
    
    {
      id: 'finance',
      name: 'Finance',
      href: '/dashboard/finance',
      icon: Wallet,
      policy: 'view_income',
      children: [
        { name: 'Finance Overview', href: '/dashboard/finance' },
        { name: 'Daybook', href: '/dashboard/finance/daybook' },
        { name: 'Balance Sheet', href: '/dashboard/finance/balance-sheet' },
        { name: 'General Ledger', href: '/dashboard/finance/ledger' },
      ]
    },
    
    {
      id: 'reports',
      name: 'Reports',
      icon: BarChart3,
      policy: 'view_reports',
      children: [
        { name: 'Market Analytics', href: '/dashboard/reports/analytics' },
        { name: 'Profit & Loss', href: '/dashboard/reports/profit-loss' },
        { name: 'Inventory Perf.', href: '/dashboard/reports/inventory' },
        { name: 'Activity Logs', href: '/dashboard/logs' },
      ]
    },

    { id: 'staff', name: 'Staff Management', href: '/dashboard/staff', icon: Network, policy: 'manage_users' },
    { id: 'expenses', name: 'Business Expenses', href: '/dashboard/expenses', icon: Receipt, policy: 'manage_expenses' },

    { id: 'notifications', name: 'Notifications', href: '/dashboard/notifications', icon: Bell, badge: '3' },
    
    { id: 'profile', name: 'Profile', href: '/dashboard/settings/profile', icon: UserRoundCheck },
    { id: 'settings', name: 'System Settings', href: '/dashboard/settings', icon: Settings, policy: 'system_config' },
  ]

  const filteredNavigation = navigation.filter(item => {
    if (!item.policy) return true;
    return hasPolicy(item.policy);
  });

 const sidebarClass = isMobile
 ? cn(
"fixed inset-y-0 left-0 z-50 bg-card-bg border-r border-openpos-border transition-transform duration-300 w-64 shadow-2xl flex flex-col",
 isSidebarOpen ?"translate-x-0":"-translate-x-full"
 )
 : cn(
"fixed inset-y-0 left-0 z-50 bg-card-bg border-r border-openpos-border transition-all duration-300 flex flex-col",
 (isSidebarOpen && !isZenMode) ?"w-64":"w-16"
 );

 const showText = (isMobile || isSidebarOpen) && !isZenMode;

 return (
 <>
 <aside className={sidebarClass}>
 {/* Logo Section */}
 <div className="h-20 flex items-center justify-center border-b border-openpos-border">
 <Link href={createHref("/dashboard")} className="flex items-center justify-center gap-2">
 {showText ? (
 <Image
 src="/logoc.png"
 alt="Open POS"
 width={160}
 height={40}
 className="h-10 w-auto object-contain"
 priority
 />
 ) : (
 <Image
 src="/logoc.png"
 alt="Open POS"
 width={40}
 height={40}
 className="h-8 w-auto object-contain"
 priority
 />
 )}
 </Link>
 </div>

 {/* Navigation - Flex-1 with scroll */}
 <nav className={cn(
"flex-1 overflow-y-auto custom-scrollbar space-y-1",
 showText ?"p-3":"px-2 py-3"
 )}>
  {filteredNavigation.map((item) => {
 const isActive = pathname === item.href || item.children?.some(child => child.href === pathname);
 const isExpanded = openMenus.includes(item.id);

 return (
 <div key={item.id} className="space-y-0.5">
 {item.children ? (
 <div className="space-y-0.5">
 <button
 onClick={() => toggleMenu(item.id)}
 className={cn(
"w-full flex items-center rounded-lg transition-all group relative text-[13px] cursor-pointer py-2.5",
 showText ?"px-3 gap-3":"px-0 justify-center",
 isActive && !isExpanded ?"bg-openpos-blue/10 text-openpos-blue font-semibold":"text-admin-label"
 )}
 >
 <item.icon size={18} className={cn("shrink-0 transition-colors", isActive ?"text-openpos-blue":"text-admin-dim")} />
 {showText && (
 <div className="flex-1 flex items-center justify-between transition-opacity duration-200">
 <span className="truncate">{item.name}</span>
 <ChevronDown size={14} className={cn("transition-transform duration-200 text-admin-dim", isExpanded ?"rotate-180":"")} />
 </div>
 )}
 </button>
 {/* Submenu */}
 {showText && isExpanded && (
 <div className="ml-4 space-y-0.5 border-l border-openpos-border pl-2 my-1">
 {item.children.map((child) => {
 const isChildActive = pathname === child.href;
 return (
 <Link
 key={child.name}
 href={createHref(child.href)}
 className={cn(
"flex items-center justify-between px-3 py-2 rounded-lg text-[12px] transition-all",
 isChildActive
 ?"text-openpos-blue font-semibold bg-openpos-blue/10"
 :"text-admin-dim"
 )}
 >
 <span>{child.name}</span>
 {child.badge && (
 <span className={cn(
"text-[9px] px-1.5 py-0.5 rounded-md font-bold uppercase",
 isChildActive ?"bg-white text-openpos-blue shadow-sm":"bg-openpos-blue/10 text-openpos-blue"
 )}>
 {child.badge}
 </span>
 )}
 </Link>
 )
 })}
 </div>
 )}
 </div>
 ) : (
 <Link
 href={createHref(item.href)}
 className={cn(
"flex items-center rounded-lg transition-all group relative text-[13px] py-2.5",
 showText ?"px-3 gap-3":"px-0 justify-center",
 isActive
 ?"bg-openpos-blue text-white shadow-sm font-semibold"
 :"text-admin-label"
 )}
 >
 <item.icon size={18} className={cn("shrink-0 transition-colors", isActive ?"text-white":"text-admin-dim")} />
 {showText && (
 <div className="flex-1 flex items-center justify-between whitespace-nowrap overflow-hidden transition-opacity duration-200">
 <span>{item.name}</span>
 {item.badge && (
 <span className={cn(
"text-[10px] px-1.5 py-0.5 rounded-full font-medium min-w-[20px] text-center",
 isActive ?"bg-white/20 text-white":"bg-openpos-blue/10 text-openpos-blue"
 )}>
 {item.badge}
 </span>
 )}
 </div>
 )}
 </Link>
 )}
 </div>
 )
 })}
 </nav>

 {/* Footer Section */}
 <div className={cn(
"mt-auto border-t border-openpos-border py-2 space-y-1",
 showText ?"px-3":"px-2"
 )}>


 <button
 onClick={() => setShowLogoutModal(true)}
 className={cn(
"w-full flex items-center text-admin-dim transition-all rounded-lg text-[13px] font-semibold group cursor-pointer py-2.5",
 showText ?"px-3 gap-3":"px-0 justify-center"
 )}
 >
 <LogOut size={18} className="transition-transform"/>
 {showText && <span>Sign Out</span>}
 </button>
 </div>
 </aside>

  {/* Standardized Logout Modal */}
  <Modal
  isOpen={showLogoutModal}
  onClose={() => !isLoggingOut && setShowLogoutModal(false)}
  title="Confirm Logout"
  description="Are you sure you want to sign out?"
  type="danger"
  icon={LogOut}
  confirmText="Sign Out"
  isLoading={isLoggingOut}
  onConfirm={async () => {
  setIsLoggingOut(true);
  await authService.logout();
  window.location.href ='/login';
  }}
  />
 </>
 )
}

