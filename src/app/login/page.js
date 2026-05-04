"use client"

import React, { useState, useEffect } from'react'
import Image from'next/image'
import { useRouter } from'next/navigation'
import { motion } from'framer-motion'
import { Eye, EyeOff, AlertCircle } from'lucide-react'
import authService from'@/lib/auth'
import { APP_VERSION } from'@/lib/version'

export default function LoginPage() {
 const router = useRouter()
 const [isAuthenticating, setIsAuthenticating] = useState(false)
 const [isRedirecting, setIsRedirecting] = useState(false)
 const [showPassword, setShowPassword] = useState(false)
 const [error, setError] = useState('')
 const [formData, setFormData] = useState({
 username:'',
 password:''
 })

 useEffect(() => {
 if (authService.isAuthenticated()) {
 router.push('/dashboard')
 }
 }, [router])

 const handleChange = (e) => {
 setFormData({
 ...formData,
 [e.target.name]: e.target.value
 })
 setError('')
 }

 const enterDashboard = async (e) => {
 e.preventDefault()
 setError('')
 setIsAuthenticating(true)

 try {
 const result = await authService.login(formData.username, formData.password)

 if (result.success) {
 setIsAuthenticating(false)
 setIsRedirecting(true)

 setTimeout(() => {
 router.push(`/dashboard`)
 }, 400)
 } else {
 setError(result.message ||'Login failed. Please check your credentials.')
 setIsAuthenticating(false)
 }
 } catch (err) {
 setError('Something went wrong. Please try again.')
 setIsAuthenticating(false)
 }
 }

 if (isRedirecting) {
 return (
 <div className="h-screen w-screen flex items-center justify-center bg-[#F8FAFC]">
 <div className="relative w-12 h-12">
 <div className="absolute inset-0 rounded-full border-4 border-openpos-blue/10"/>
 <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-openpos-blue animate-spin"/>
 </div>
 </div>
 )
 }

 return (
 <div className="h-screen w-screen flex bg-[#F8FAFC] font-figtree overflow-hidden">
 {/* Left Side: Form */}
 <div className="w-full lg:w-[480px] h-full bg-white border-r border-openpos-border flex flex-col px-10 lg:px-16 py-12 relative z-10 shadow-2xl">
 <div className="mb-auto">
 <div className="flex justify-center mb-12">
 <Image 
 src="/logoc.png"
 alt="POS Logo"
 width={160} 
 height={50} 
 className="h-12 w-auto object-contain"
 priority 
 />
 </div>

 <div className="space-y-2 mb-10 text-center">
 <h1 className="text-2xl font-bold text-admin-value tracking-tight">System Login</h1>
 <p className="text-[11px] font-medium text-admin-label uppercase tracking-widest">Access your Open POS administration panel</p>
 </div>

 <form onSubmit={enterDashboard} className="space-y-5">
 {error && (
 <motion.div 
 initial={{ opacity: 0, y: -10 }}
 animate={{ opacity: 1, y: 0 }}
 className="bg-openpos-red-light border border-openpos-red/20 text-openpos-red px-4 py-3 rounded-xl flex items-center gap-3 text-[12px] font-bold"
 >
 <AlertCircle size={16} />
 {error}
 </motion.div>
 )}

 <div className="space-y-2">
 <label className="text-[10px] font-bold text-admin-label uppercase tracking-widest ml-1">Username</label>
 <input
 type="text"
 name="username"
 value={formData.username}
 onChange={handleChange}
 required
 disabled={isAuthenticating}
 className="w-full px-4 py-3 rounded-xl border border-openpos-border bg-white outline-none transition-all font-medium text-admin-value placeholder:text-admin-dim/50"
 placeholder="admin"
 />
 </div>

 <div className="space-y-2">
 <label className="text-[10px] font-bold text-admin-label uppercase tracking-widest ml-1">Password</label>
 <div className="relative">
 <input
 type={showPassword ?"text":"password"}
 name="password"
 value={formData.password}
 onChange={handleChange}
 required
 disabled={isAuthenticating}
 className="w-full px-4 py-3 pr-12 rounded-xl border border-openpos-border bg-white outline-none transition-all font-medium text-admin-value placeholder:text-admin-dim/50"
 placeholder="••••••••"
 />
 <button
 type="button"
 onClick={() => setShowPassword(!showPassword)}
 className="absolute right-3 top-1/2 -translate-y-1/2 text-admin-dim transition-colors p-2"
 >
 {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
 </button>
 </div>
 </div>

 <button
 type="submit"
 disabled={isAuthenticating}
 className="w-full bg-openpos-blue text-white rounded-xl py-4 font-bold text-[13px] uppercase tracking-[2px] shadow-lg shadow-openpos-blue/20 transition-all"
 >
 {isAuthenticating ? (
 <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
 ) : (
'Sign In'
 )}
 </button>
 </form>
 </div>

 <div className="mt-auto pt-10 border-t border-openpos-border">
 <div className="flex items-center justify-between">
 <div className="space-y-1">
 <p className="text-[10px] text-admin-dim font-bold uppercase tracking-widest">© 2026 Open POS</p>
 <p className="text-[9px] text-admin-dim/60 font-bold uppercase tracking-widest">Version {APP_VERSION}</p>
 </div>
 </div>
 </div>
 </div>

 {/* Right Side: Hero */}
 <div className="hidden lg:flex flex-1 relative bg-openpos-blue-dark overflow-hidden items-center justify-center">
 <Image 
 src="/sideimage.png"
 alt="POS System"
 fill 
 className="object-cover opacity-40 mix-blend-overlay"
 priority
 />
 
 <div className="relative z-10 p-20 max-w-2xl text-center">
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.8 }}
 >
 <div className="w-20 h-1.5 bg-white mx-auto mb-10 rounded-full"/>
 <h2 className="text-5xl font-bold text-white leading-[1.1] tracking-tight mb-6">
 Next Generation Open POS.
 </h2>
 <p className="text-white/70 text-lg font-medium leading-relaxed">
 A unified platform for inventory, sales, and customer management designed for high-growth businesses.
 </p>
 </motion.div>
 </div>

 {/* Decorative Elements */}
 <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-openpos-blue rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 opacity-30"/>
 <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-black rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 opacity-20"/>
 </div>
 </div>
 )
}
