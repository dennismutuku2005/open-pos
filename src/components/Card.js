import React from'react'
import { cn } from'@/lib/utils'

export function Card({ 
 children, 
 className, 
 title, 
 subtitle, 
 headerAction,
 noPadding = false,
 headerClassName,
 ...props 
}) {
 return (
 <div 
 className={cn(
"bg-card-bg border border-openpos-border rounded-lg shadow-sm overflow-hidden",
 className
 )} 
 {...props}
 >
 {(title || subtitle || headerAction) && (
 <div className={cn(
"px-6 py-3 border-b border-openpos-border flex items-center justify-between",
 headerClassName
 )}>
 <div>
 {title && <h3 className="text-[13px] font-bold text-admin-value uppercase tracking-widest">{title}</h3>}
 {subtitle && <p className="text-[10px] text-admin-dim font-medium uppercase tracking-widest mt-0.5">{subtitle}</p>}
 </div>
 {headerAction && (
 <div className="flex items-center gap-2">
 {headerAction}
 </div>
 )}
 </div>
 )}
 <div className={cn(!noPadding &&"p-4 md:p-6")}>
 {children}
 </div>
 </div>
 )
}

export function StatCard({ 
 title, 
 value, 
 change, 
 isPositive, 
 icon: Icon, 
 color ="blue",
 className
}) {
 const colorClasses = {
 blue:"text-openpos-blue bg-openpos-blue/10 border-openpos-blue/10",
 red:"text-openpos-red bg-openpos-red/10 border-openpos-red/10",
 purple:"text-purple-500 bg-purple-500/10 border-purple-500/10",
 green:"text-emerald-500 bg-emerald-500/10 border-emerald-500/10",
 }

 return (
 <div className={cn(
"bg-card-bg border border-openpos-border rounded-lg p-4 shadow-sm transition-all group overflow-hidden relative",
 className
 )}>
 <div className="flex items-center gap-3">
 <div className={cn(
"w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border transition-all", 
 colorClasses[color] || colorClasses.blue
 )}>
 {Icon && <Icon size={18} />}
 </div>
 <div className="flex-1 min-w-0">
 <p className="text-[8.5px] sm:text-[10px] font-bold text-admin-dim uppercase tracking-wider truncate" title={title}>{title}</p>
 <div className="flex flex-col mt-0.5">
 <p className="text-base sm:text-lg font-bold text-admin-value leading-none truncate tracking-tight" title={value}>{value}</p>
 {change && (
 <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 mt-1">
 <span className={cn(
"text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-tight whitespace-nowrap",
 isPositive ?"bg-openpos-blue/10 text-openpos-blue":"bg-openpos-red/10 text-openpos-red"
 )}>
 {change}
 </span>
 </div>
 )}
 </div>
 </div>
 </div>
 </div>
 )
}
