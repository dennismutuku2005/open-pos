import React from 'react';
import { cn } from '@/lib/utils';

export const Badge = ({ children, variant = 'default', className }) => {
    const variants = {
        default: 'bg-openpos-bg-subtle text-admin-label border-openpos-border',
        success: 'bg-openpos-blue/10 text-openpos-blue border-openpos-blue/20',
        warning: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
        error: 'bg-red-500/10 text-red-500 border-red-500/20',
        info: 'bg-openpos-purple/10 text-openpos-purple border-openpos-purple/20',
        outline: 'bg-transparent text-admin-dim border-openpos-border font-medium',
        secondary: 'bg-openpos-bg-subtle text-admin-dim border-openpos-border'
    };

    return (
        <span className={cn(
            "text-[10px] font-bold px-2 py-0.5 rounded-sm border inline-flex items-center",
            variants[variant],
            className
        )}>
            {children}
        </span>
    );
};
