"use client"

import React, { useEffect } from'react'
import { X, AlertCircle, CheckCircle2, Info, AlertTriangle, Fingerprint, ShieldCheck, Loader2 } from 'lucide-react'
import { cn } from'@/lib/utils'

export function Modal({
 isOpen,
 onClose,
 title,
 description,
 type ='info', //'info'|'success'|'error'|'warning'|'danger'
 confirmText ='Confirm',
 cancelText ='Cancel',
 onConfirm,
 isLoading = false,
 showCancel = true,
 icon: CustomIcon,
 children,
 footer,
 confirmCountdown = 0,
 maxWidth ='max-w-md'
}) {
 const [timer, setTimer] = React.useState(confirmCountdown)

 // Escape key to close
 useEffect(() => {
 const handleEsc = (e) => {
 if (e.key ==='Escape') onClose()
 }
 if (isOpen) window.addEventListener('keydown', handleEsc)
 return () => window.removeEventListener('keydown', handleEsc)
 }, [isOpen, onClose])

 // Countdown effect
 useEffect(() => {
 let interval
 if (isOpen && confirmCountdown > 0) {
 setTimer(confirmCountdown)
 interval = setInterval(() => {
 setTimer((prev) => {
 if (prev <= 1) {
 clearInterval(interval)
 return 0
 }
 return prev - 1
 })
 }, 1000)
 }
 return () => clearInterval(interval)
 }, [isOpen, confirmCountdown])

 if (!isOpen) return null

 const typeConfig = {
 primary: {
 icon: ShieldCheck,
 color:'text-openpos-purple',
 bg:'bg-openpos-purple/10',
 border:'border-openpos-purple/20',
 btn:'bg-openpos-purple shadow-openpos-purple/20'
 },
 info: {
 icon: Info,
 color:'text-blue-500',
 bg:'bg-blue-500/10',
 border:'border-blue-500/20',
 btn:'bg-blue-600 shadow-blue-500/20'
 },
 success: {
 icon: CheckCircle2,
 color:'text-openpos-blue',
 bg:'bg-openpos-blue/10',
 border:'border-openpos-blue/20',
 btn:'bg-openpos-blue shadow-openpos-blue/20'
 },
 error: {
 icon: AlertCircle,
 color:'text-red-500',
 bg:'bg-red-500/10',
 border:'border-red-500/20',
 btn:'bg-red-600 shadow-red-500/20'
 },
 warning: {
 icon: AlertTriangle,
 color:'text-orange-500',
 bg:'bg-orange-500/10',
 border:'border-orange-500/20',
 btn:'bg-orange-600 shadow-orange-500/20'
 },
 danger: {
 icon: Fingerprint,
 color:'text-red-500',
 bg:'bg-red-500/10',
 border:'border-red-500/20',
 btn:'bg-red-600 shadow-red-500/20'
 }
 }

 const config = typeConfig[type] || typeConfig.info
 const Icon = CustomIcon || config.icon

 return (
 <div className="fixed inset-0 z-[9000] flex items-center justify-center p-4 sm:p-8">
 {/* Backdrop */}
 <div
 className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-300"
 onClick={onClose}
 />

 {/* Modal Content */}
 <div className={cn("relative bg-card-bg w-full rounded-3xl shadow-2xl border border-openpos-border animate-in zoom-in-95 fade-in duration-300 max-h-[90vh] flex flex-col transition-colors duration-300", maxWidth)}>
 <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-8 pb-20">
 <div className="flex items-start justify-between mb-4">
 <div className="flex flex-col gap-1">
 {CustomIcon && (
 <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 mb-4 border transition-colors", config.bg, config.color, config.border)}>
 <Icon size={20} />
 </div>
 )}
 <h3 className="text-base font-bold text-foreground uppercase tracking-tight">{title}</h3>
 {description && <p className="text-[10px] font-semibold text-admin-dim uppercase tracking-widest">{description}</p>}
 </div>
 <button
 onClick={onClose}
 className="p-2 rounded-xl text-admin-dim transition-all"
 >
 <X size={18} />
 </button>
 </div>

 {/* Children Content */}
 {children && (
 <div className="mt-4">
 {children}
 </div>
 )}

 {/* Footer / Actions - Only show if footer is provided or onConfirm is defined and NOT explicitly hidden */}
 {footer !== null && (footer || onConfirm) && (
 <div className="mt-8 flex items-center gap-3">
 {footer ? footer : (
 <>
 {showCancel && (
 <button
 onClick={onClose}
 disabled={isLoading}
 className="flex-1 px-4 py-3 bg-card-bg border border-openpos-border text-admin-dim rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all disabled:opacity-50"
 >
 {cancelText}
 </button>
 )}
 <button
 onClick={onConfirm}
 disabled={isLoading || timer > 0}
 className={cn(
"flex-1 px-4 py-3 text-white rounded-xl text-[10px] font-medium uppercase tracking-widest transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2",
 config.btn
 )}
 >
 {isLoading && <Loader2 className="animate-spin" size={14} />}
 <span>{confirmText}</span>
 {timer > 0 && <span>({timer}s)</span>}
 </button>
 </>
 )}
 </div>
 )}
 </div>

 </div>
 </div>
 )
}
