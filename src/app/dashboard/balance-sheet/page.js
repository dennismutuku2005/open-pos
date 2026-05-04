"use client"

import React, { useState } from 'react'
import { Scale, Calendar, Download } from 'lucide-react'
import { cn } from '@/lib/utils'
import { generateReport } from '@/lib/pdf'
import { toast } from 'sonner'

export default function BalanceSheetPage() {
    const downloadSheet = () => {
        // This is a placeholder since a true balance sheet PDF would be more complex
        toast.success("Downloading Balance Sheet PDF...")
    }

    return (
        <div className="sopenpos-y-6 animate-in fade-in duration-500 font-figtree max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-admin-value flex items-center gap-2">
                        <Scale size={24} className="text-openpos-blue" />
                        Balance Sheet
                    </h1>
                    <p className="text-admin-label mt-1">Snapshot of your business's financial position.</p>
                </div>
                <div className="flex gap-3">
                    <button className="bg-white border border-openpos-border text-admin-value px-4 py-2.5 rounded-xl font-bold text-[12px] flex items-center gap-2 hover:bg-gray-50 transition-all uppercase tracking-widest shadow-sm">
                        <Calendar size={16} />
                        As of Today
                    </button>
                    <button 
                        onClick={downloadSheet}
                        className="bg-openpos-blue text-white px-5 py-2.5 rounded-xl font-bold text-[12px] flex items-center gap-2 shadow-lg hover:scale-[1.02] transition-all uppercase tracking-widest"
                    >
                        <Download size={18} />
                        Export PDF
                    </button>
                </div>
            </div>

            {/* Balance Sheet Container */}
            <div className="bg-white border border-openpos-border rounded-2xl shadow-sm overflow-hidden p-6 md:p-8">
                <div className="text-center mb-8 pb-6 border-b border-openpos-border">
                    <h2 className="text-[20px] font-bold text-admin-value uppercase tracking-widest">PACE WISP RETAIL</h2>
                    <p className="text-[14px] font-bold text-admin-dim">BALANCE SHEET</p>
                    <p className="text-[12px] text-admin-label mt-1">As of May 03, 2026</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    
                    {/* ASSETS (Left Side) */}
                    <div className="sopenpos-y-6">
                        <div>
                            <h3 className="text-[16px] font-bold text-admin-value uppercase border-b-2 border-admin-value pb-2 mb-4">Assets</h3>
                            
                            <div className="sopenpos-y-4">
                                <div>
                                    <h4 className="text-[12px] font-bold text-openpos-blue uppercase tracking-widest mb-2">Current Assets</h4>
                                    <div className="sopenpos-y-2">
                                        <div className="flex justify-between text-[14px]">
                                            <span className="text-admin-dim">Cash & Equivalents</span>
                                            <span className="font-semibold text-admin-value">125,500</span>
                                        </div>
                                        <div className="flex justify-between text-[14px]">
                                            <span className="text-admin-dim">Accounts Receivable</span>
                                            <span className="font-semibold text-admin-value">145,000</span>
                                        </div>
                                        <div className="flex justify-between text-[14px]">
                                            <span className="text-admin-dim">Inventory</span>
                                            <span className="font-semibold text-admin-value">340,000</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between text-[14px] font-bold mt-2 pt-2 border-t border-dashed border-openpos-border">
                                        <span className="text-admin-value">Total Current Assets</span>
                                        <span className="text-admin-value">610,500</span>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-[12px] font-bold text-openpos-blue uppercase tracking-widest mb-2 mt-6">Fixed Assets</h4>
                                    <div className="sopenpos-y-2">
                                        <div className="flex justify-between text-[14px]">
                                            <span className="text-admin-dim">Equipment</span>
                                            <span className="font-semibold text-admin-value">250,000</span>
                                        </div>
                                        <div className="flex justify-between text-[14px]">
                                            <span className="text-admin-dim">Furniture & Fixtures</span>
                                            <span className="font-semibold text-admin-value">120,000</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between text-[14px] font-bold mt-2 pt-2 border-t border-dashed border-openpos-border">
                                        <span className="text-admin-value">Total Fixed Assets</span>
                                        <span className="text-admin-value">370,000</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between text-[16px] font-bold border-t-2 border-admin-value pt-3">
                            <span className="uppercase tracking-widest text-admin-value">Total Assets</span>
                            <span className="text-openpos-green">KES 980,500</span>
                        </div>
                    </div>

                    {/* LIABILITIES & EQUITY (Right Side) */}
                    <div className="sopenpos-y-6">
                        <div>
                            <h3 className="text-[16px] font-bold text-admin-value uppercase border-b-2 border-admin-value pb-2 mb-4">Liabilities & Equity</h3>
                            
                            <div className="sopenpos-y-4">
                                <div>
                                    <h4 className="text-[12px] font-bold text-openpos-blue uppercase tracking-widest mb-2">Liabilities</h4>
                                    <div className="sopenpos-y-2">
                                        <div className="flex justify-between text-[14px]">
                                            <span className="text-admin-dim">Accounts Payable</span>
                                            <span className="font-semibold text-admin-value">42,500</span>
                                        </div>
                                        <div className="flex justify-between text-[14px]">
                                            <span className="text-admin-dim">Short-term Loans</span>
                                            <span className="font-semibold text-admin-value">150,000</span>
                                        </div>
                                        <div className="flex justify-between text-[14px]">
                                            <span className="text-admin-dim">Taxes Payable</span>
                                            <span className="font-semibold text-admin-value">12,000</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between text-[14px] font-bold mt-2 pt-2 border-t border-dashed border-openpos-border">
                                        <span className="text-admin-value">Total Liabilities</span>
                                        <span className="text-admin-value">204,500</span>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-[12px] font-bold text-openpos-blue uppercase tracking-widest mb-2 mt-6">Owner's Equity</h4>
                                    <div className="sopenpos-y-2">
                                        <div className="flex justify-between text-[14px]">
                                            <span className="text-admin-dim">Owner's Capital</span>
                                            <span className="font-semibold text-admin-value">500,000</span>
                                        </div>
                                        <div className="flex justify-between text-[14px]">
                                            <span className="text-admin-dim">Retained Earnings</span>
                                            <span className="font-semibold text-admin-value">288,000</span>
                                        </div>
                                        <div className="flex justify-between text-[14px] text-openpos-red">
                                            <span className="text-admin-dim">Less: Drawings</span>
                                            <span className="font-semibold">(-12,000)</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between text-[14px] font-bold mt-2 pt-2 border-t border-dashed border-openpos-border">
                                        <span className="text-admin-value">Total Equity</span>
                                        <span className="text-admin-value">776,000</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between text-[16px] font-bold border-t-2 border-admin-value pt-3">
                            <span className="uppercase tracking-widest text-admin-value">Total Liab. & Equity</span>
                            <span className="text-openpos-blue">KES 980,500</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
