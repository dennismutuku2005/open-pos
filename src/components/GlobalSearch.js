"use client"

import React, { useState, useEffect, useRef } from'react'
import { useRouter, usePathname } from'next/navigation'
import { 
 Search, ChevronRight, LayoutDashboard, Clock, ShoppingBag, 
 Package, Users, CreditCard, BarChart3, Settings, 
 Activity, PlusCircle, Command, History, Wallet
} from'lucide-react'
import { cn } from'@/lib/utils'
import authService from'@/lib/auth'

const SEARCH_ITEMS = [
 { id:'p1', type:'page', name:'Dashboard', href:'/dashboard', icon: LayoutDashboard, keywords: ['home','summary','overview','main'] },
 { id:'p2', type:'page', name:'Point of Sale (POS)', href:'/dashboard/pos', icon: ShoppingBag, keywords: ['checkout','sales','terminal','register'] },
 { id:'p3', type:'page', name:'Transactions List', href:'/dashboard/sales/list', icon: History, keywords: ['logs','history','sales records'] },
 { id:'p4', type:'page', name:'Product Catalog', href:'/dashboard/products', icon: Package, keywords: ['items','inventory','stock','management'] },
 { id:'p5', type:'page', name:'In Stock', href:'/dashboard/stock/in-stock', icon: Package, keywords: ['available','inventory list'] },
 { id:'p6', type:'page', name:'Out of Stock', href:'/dashboard/stock/out-of-stock', icon: Activity, keywords: ['empty','reorder'] },
 { id:'p7', type:'page', name:'Expired Items', href:'/dashboard/stock/expired', icon: Clock, keywords: ['waste','expired products'] },
 { id:'p8', type:'page', name:'Staff Management', href:'/dashboard/staff', icon: Users, keywords: ['employees','team','access control'] },
 { id:'p9', type:'page', name:'Financial Ledgers', href:'/dashboard/ledgers', icon: Wallet, keywords: ['accounting','books','daily totals'] },
 { id:'p10', type:'page', name:'Sales Reports', href:'/dashboard/report', icon: BarChart3, keywords: ['analytics','performance','charts'] },
 { id:'p11', type:'page', name:'Profile Settings', href:'/dashboard/settings/profile', icon: Settings, keywords: ['account','security','password'] },
]

const QUICK_ACTIONS = [
 { id:'a1', type:'action', name:'New Sale', href:'/dashboard/pos', icon: PlusCircle, keywords: ['add','create','checkout'] },
 { id:'a2', type:'action', name:'Add Product', href:'/dashboard/products?action=add', icon: Package, keywords: ['new item','inventory'] },
]


export function GlobalSearch() {
 const router = useRouter()
 const pathname = usePathname()
 const [query, setQuery] = useState('')
 const [results, setResults] = useState([])
 const [isOpen, setIsOpen] = useState(false)
 const [activeIndex, setActiveIndex] = useState(0)
 const wrapperRef = useRef(null)
 const inputRef = useRef(null)

 useEffect(() => {
 const handleGlobalKeyDown = (e) => {
 if ((e.metaKey || e.ctrlKey) && e.key ==='k') {
 e.preventDefault()
 inputRef.current?.focus()
 }
 }
 window.addEventListener('keydown', handleGlobalKeyDown)
 return () => window.removeEventListener('keydown', handleGlobalKeyDown)
 }, [])

 const [user, setUser] = useState(null)
 const [mounted, setMounted] = useState(false)

 useEffect(() => {
 setMounted(true)
 setUser(authService.getUser())
 }, [])

 useEffect(() => {
 const searchTerm = query.toLowerCase().trim()

 if (!searchTerm) {
 setResults([])
 setIsOpen(false)
 return
 }

 const filteredPages = SEARCH_ITEMS.filter(item => 
 item.name.toLowerCase().includes(searchTerm) ||
 item.keywords.some(k => k.toLowerCase().includes(searchTerm))
 )

 const filteredActions = QUICK_ACTIONS.filter(item => 
 item.name.toLowerCase().includes(searchTerm) ||
 item.keywords.some(k => k.toLowerCase().includes(searchTerm))
 )

 const finalResults = [...filteredActions, ...filteredPages].slice(0, 6)

 setResults(finalResults)
 setIsOpen(finalResults.length > 0)
 setActiveIndex(0)
 }, [query, mounted])

 useEffect(() => {
 function handleClickOutside(event) {
 if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
 setIsOpen(false)
 }
 }
 document.addEventListener('mousedown', handleClickOutside)
 return () => document.removeEventListener('mousedown', handleClickOutside)
 }, [])

 const handleSelect = (item) => {
 router.push(item.href)
 setQuery('')
 setIsOpen(false)
 inputRef.current?.blur()
 }

 const handleKeyDown = (e) => {
 if (!isOpen) return

 if (e.key ==='ArrowDown') {
 e.preventDefault()
 setActiveIndex(prev => (prev + 1) % results.length)
 } else if (e.key ==='ArrowUp') {
 e.preventDefault()
 setActiveIndex(prev => (prev - 1 + results.length) % results.length)
 } else if (e.key ==='Enter') {
 e.preventDefault()
 if (results[activeIndex]) {
 handleSelect(results[activeIndex])
 }
 } else if (e.key ==='Escape') {
 setIsOpen(false)
 inputRef.current?.blur()
 }
 }

 return (
 <div className="relative group"ref={wrapperRef}>
 <div className="flex items-center">
 <Search className={cn(
"absolute left-3 top-1/2 -translate-y-1/2 transition-colors z-10",
 query ?"text-openpos-blue":"text-admin-dim"
 )} size={12} />
 <input
 ref={inputRef}
 type="text"
 autoComplete="off"
 placeholder="Search modules (Press ⌘K)..."
 value={query}
 onChange={(e) => setQuery(e.target.value)}
 onKeyDown={handleKeyDown}
 onFocus={() => {
 if (results.length > 0) setIsOpen(true)
 }}
 className="pl-9 pr-12 py-2 w-full bg-openpos-bg-subtle border-openpos-border border rounded-xl text-[11px] outline-none transition-all placeholder:text-admin-dim font-bold text-admin-value lg:w-[400px] shadow-sm"
 />
 <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-20 pointer-events-none hidden lg:flex">
 <Command size={10} />
 <span className="text-[10px] font-bold">K</span>
 </div>
 </div>

 {/* Floating Results List */}
 {isOpen && (
 <div className="absolute top-full mt-2 left-0 right-0 bg-card-bg border border-openpos-border rounded-2xl shadow-2xl overflow-hidden z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
 <div className="p-2 space-y-1">
 {results.map((item, idx) => (
 <button
 key={item.id}
 onClick={() => handleSelect(item)}
 onMouseEnter={() => setActiveIndex(idx)}
 className={cn(
"w-full flex items-center justify-between p-2 rounded-xl transition-all text-left group/item",
 idx === activeIndex ?"bg-openpos-blue/5 text-openpos-blue":"text-admin-label"
 )}
 >
 <div className="flex items-center gap-3">
 <div className={cn(
"w-8 h-8 rounded-lg flex items-center justify-center transition-all",
 idx === activeIndex ?"bg-openpos-blue text-white shadow-lg shadow-openpos-blue/20 scale-105":"bg-openpos-bg-subtle text-admin-dim"
 )}>
 <item.icon size={14} />
 </div>
 <div className="flex flex-col">
 <div className="flex items-center gap-2">
 <span className="text-[12px] font-bold tracking-tight">{item.name}</span>
 {item.type ==='action'&& (
 <span className="text-[7px] font-black uppercase tracking-widest bg-openpos-blue/10 text-openpos-blue px-1.5 py-0.5 rounded border border-openpos-blue/10">Quick Action</span>
 )}
 </div>
 <span className="text-[9px] opacity-60 font-bold uppercase tracking-widest truncate max-w-[250px] mt-0.5">
 {item.href.replace('/dashboard','SYSTEM').replace(/\//g,'/')}
 </span>
 </div>
 </div>
 <div className="flex items-center gap-2">
 {idx === activeIndex && (
 <ChevronRight size={14} className="opacity-40"/>
 )}
 </div>
 </button>
 ))}
 </div>
 <div className="px-4 py-2.5 bg-openpos-bg-subtle border-t border-openpos-border flex items-center justify-between">
 <div className="flex items-center gap-1.5 opacity-40">
 <span className="text-[8px] font-bold border border-admin-dim/30 px-1 rounded uppercase tracking-tighter text-admin-value">Enter</span>
 <span className="text-[8px] font-bold text-admin-dim uppercase tracking-widest">Execute</span>
 </div>
 <span className="text-[8px] font-bold text-admin-dim uppercase tracking-widest opacity-30">Open POS Matrix AI</span>
 </div>
 </div>
 )}
 </div>
 )
}
