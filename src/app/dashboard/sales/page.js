"use client"

import React, { useState, useEffect } from 'react'
import { 
    Search, Clock, ChevronDown, Plus, Minus, 
    Trash2, CreditCard, ShoppingCart, Zap,
    ArrowLeft, MoreHorizontal, Package,
    Filter, X, CheckCircle2, Phone, Printer,
    Smartphone, Banknote, Receipt, Download,
    Menu, Power, Edit3, Ticket, QrCode, Calendar,
    Loader2, Info, Tag
} from 'lucide-react'
import { Modal } from '@/components/Modal'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { generateReceipt } from '@/lib/pdf'

// Mock Data
const products = [
    { id: 1, name: 'Logitech MX Master 3S', category: 'Accessories', price: 12500, stock: 12, description: 'Advanced wireless mouse with silent clicks and 8K DPI tracking.', image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&q=80' },
    { id: 2, name: 'USB-C Hub Multiport', category: 'Computing', price: 4500, stock: 24, description: '7-in-1 USB C adapter with 4K HDMI, 100W PD, and SD card reader.', image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&q=80' },
    { id: 3, name: 'Portable SSD 1TB', category: 'Storage', price: 15500, stock: 18, description: 'High-speed external solid state drive with up to 1050MB/s read speed.', image: 'https://images.unsplash.com/photo-1597872200370-493dea23936a?w=400&q=80' },
    { id: 4, name: 'Mechanical Keyboard', category: 'Accessories', price: 8900, stock: 8, description: 'Hot-swappable mechanical keyboard with RGB backlighting and blue switches.', image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400&q=80' },
    { id: 5, name: 'Webcam 4K Ultra HD', category: 'Peripherals', price: 18000, stock: 15, description: 'Professional webcam for streaming and video conferencing with dual mics.', image: 'https://images.unsplash.com/photo-1610483178766-8092dcc6f36a?w=400&q=80' },
    { id: 6, name: 'Bluetooth Earbuds', category: 'Audio', price: 6500, stock: 30, description: 'True wireless earbuds with active noise cancellation and 24hr battery.', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80' },
    { id: 7, name: 'Monitor Arm Mount', category: 'Furniture', price: 7200, stock: 10, description: 'Single monitor desk mount for screens up to 32 inches.', image: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=400&q=80' },
    { id: 8, name: 'Power Bank 20000mAh', category: 'Mobile', price: 5800, stock: 20, description: 'Large capacity power bank with fast charging and multiple ports.', image: 'https://images.unsplash.com/photo-1609592806457-99d4ad9b3f3a?w=400&q=80' },
    { id: 9, name: 'Laptop Cooling Pad', category: 'Computing', price: 3200, stock: 25, description: 'Slim and quiet laptop cooler with adjustable height and blue LED.', image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&q=80' },
    { id: 10, name: 'Smart Watch Series 9', category: 'Wearables', price: 42000, stock: 6, description: 'Latest smartwatch with fitness tracking, heart rate monitor and GPS.', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80' },
]

export default function POSPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [cart, setCart] = useState([])
    const [showClearCartModal, setShowClearCartModal] = useState(false)
    const [isFullScreen, setIsFullScreen] = useState(false)

    // Checkout Flow State
    const [checkoutStep, setCheckoutStep] = useState('cart') // cart, payment, mpesa, processing, success
    const [paymentMethod, setPaymentMethod] = useState('') // cash, mpesa
    const [phoneNumber, setPhoneNumber] = useState('')
    const [infoModalProduct, setInfoModalProduct] = useState(null)
    const [lastSaleId, setLastSaleId] = useState(null)

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const total = subtotal

    const updateQuantity = (id, delta) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = Math.max(0, item.quantity + delta)
                return { ...item, quantity: newQty }
            }
            return item
        }).filter(item => item.quantity > 0))
    }

    const handleMainAction = () => {
        if (cart.length === 0 && checkoutStep === 'cart') {
            toast.error("Cart is empty")
            return
        }

        if (checkoutStep === 'cart') {
            setCheckoutStep('payment')
        } else if (checkoutStep === 'payment') {
            if (!paymentMethod) {
                toast.error("Please select a payment method")
                return
            }
            if (paymentMethod === 'mpesa') {
                setCheckoutStep('mpesa')
            } else if (paymentMethod === 'cash') {
                processCashPayment()
            }
        } else if (checkoutStep === 'mpesa') {
            if (!phoneNumber || phoneNumber.length < 9) {
                toast.error("Please enter a valid mobile number")
                return
            }
            processMpesaPayment()
        } else if (checkoutStep === 'success') {
            // New Sale reset
            setCart([])
            setCheckoutStep('cart')
            setPaymentMethod('')
            setPhoneNumber('')
        }
    }

    const processCashPayment = () => {
        setCheckoutStep('processing')
        setTimeout(() => {
            setLastSaleId(`SL-${Math.floor(1000 + Math.random() * 9000)}`)
            setCheckoutStep('success')
            toast.success("Payment Received!")
        }, 1000)
    }

    const processMpesaPayment = () => {
        setCheckoutStep('processing')
        toast.info("Sending STK Push...")
        setTimeout(() => {
            setLastSaleId(`SL-${Math.floor(1000 + Math.random() * 9000)}`)
            setCheckoutStep('success')
            toast.success("M-Pesa Payment Successful!")
        }, 3000)
    }

    const handleGenerateReceipt = (action) => {
        generateReceipt({
            id: lastSaleId,
            items: cart,
            total: total,
            paymentMethod: paymentMethod
        }, action)
    }

    const getButtonText = () => {
        if (checkoutStep === 'cart') return "Checkout"
        if (checkoutStep === 'payment') {
            if (paymentMethod === 'mpesa') return "Continue"
            if (paymentMethod === 'cash') return "Paid"
            return "Select Payment"
        }
        if (checkoutStep === 'mpesa') return "Send STK"
        if (checkoutStep === 'processing') return "Processing..."
        if (checkoutStep === 'success') return "New Sale"
    }

    const getButtonColor = () => {
        if (checkoutStep === 'success') return "bg-openpos-green"
        if (checkoutStep === 'processing') return "bg-admin-dim cursor-not-allowed opacity-80"
        return "bg-openpos-blue"
    }

    const renderRightColumnContent = () => {
        if (checkoutStep === 'cart') {
            if (cart.length === 0) {
                return (
                    <div className="h-full flex flex-col items-center justify-center text-admin-dim opacity-50">
                        <ShoppingCart size={48} className="mb-4" />
                        <p className="text-[14px] font-bold">Cart is empty</p>
                    </div>
                )
            }
            return (
                <div className="sopenpos-y-4">
                    {cart.map((item, idx) => (
                        <div key={idx} className="flex gap-4">
                            <div className="w-14 h-14 bg-openpos-bg-subtle rounded-xl overflow-hidden shrink-0 border border-openpos-border relative">
                                <Image src={item.image} alt={item.name} fill className="object-cover" />
                            </div>
                            <div className="flex-1 min-w-0 py-0.5">
                                <h4 className="text-[12px] font-bold text-admin-value truncate">{item.name}</h4>
                                <p className="text-[12px] font-bold text-admin-dim">KES {item.price}</p>
                            </div>
                            <div className="flex items-center gap-2 bg-[#F8FAFC] px-2 py-1 rounded-lg border border-openpos-border h-fit self-center">
                                <button onClick={() => updateQuantity(item.id, -1)} className="text-admin-dim"><Minus size={14} /></button>
                                <span className="text-[12px] font-bold text-admin-value">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, 1)} className="text-admin-dim"><Plus size={14} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            )
        }

        if (checkoutStep === 'payment') {
            return (
                <div className="sopenpos-y-4 animate-in fade-in slide-in-from-right-4 duration-300 h-full">
                    <div className="flex items-center gap-2 mb-6">
                        <button onClick={() => setCheckoutStep('cart')} className="p-1 text-admin-dim hover:text-admin-value transition-colors">
                            <ArrowLeft size={18} />
                        </button>
                        <h3 className="text-[14px] font-bold text-admin-value uppercase tracking-widest">Select Payment</h3>
                    </div>
                    
                    <button 
                        onClick={() => setPaymentMethod('mpesa')}
                        className={cn(
                            "w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all",
                            paymentMethod === 'mpesa' ? "border-openpos-green bg-openpos-green/5" : "border-openpos-border bg-white hover:border-openpos-blue/30"
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-green-100 text-openpos-green flex items-center justify-center">
                                <Smartphone size={20} />
                            </div>
                            <div className="text-left">
                                <h4 className="text-[14px] font-bold text-admin-value">M-Pesa</h4>
                                <p className="text-[11px] text-admin-dim font-medium">Pay via STK Push</p>
                            </div>
                        </div>
                        {paymentMethod === 'mpesa' && <CheckCircle2 className="text-openpos-green" size={20} />}
                    </button>

                    <button 
                        onClick={() => setPaymentMethod('cash')}
                        className={cn(
                            "w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all",
                            paymentMethod === 'cash' ? "border-openpos-blue bg-openpos-blue/5" : "border-openpos-border bg-white hover:border-openpos-blue/30"
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-100 text-openpos-blue flex items-center justify-center">
                                <Banknote size={20} />
                            </div>
                            <div className="text-left">
                                <h4 className="text-[14px] font-bold text-admin-value">Cash</h4>
                                <p className="text-[11px] text-admin-dim font-medium">Physical currency</p>
                            </div>
                        </div>
                        {paymentMethod === 'cash' && <CheckCircle2 className="text-openpos-blue" size={20} />}
                    </button>
                </div>
            )
        }

        if (checkoutStep === 'mpesa') {
            return (
                <div className="sopenpos-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="flex items-center gap-2 mb-2">
                        <button onClick={() => setCheckoutStep('payment')} className="p-1 text-admin-dim hover:text-admin-value transition-colors">
                            <ArrowLeft size={18} />
                        </button>
                        <h3 className="text-[14px] font-bold text-admin-value uppercase tracking-widest">M-Pesa Details</h3>
                    </div>
                    
                    <div className="bg-openpos-bg-subtle/50 border border-openpos-border p-4 rounded-2xl flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center border border-openpos-border">
                            <Smartphone className="text-openpos-green" size={24} />
                        </div>
                        <div>
                            <p className="text-[11px] text-admin-dim font-bold uppercase tracking-widest">Amount to Pay</p>
                            <p className="text-[18px] font-bold text-admin-value">KES {total}</p>
                        </div>
                    </div>

                    <div className="sopenpos-y-2">
                        <label className="text-[12px] font-bold text-admin-value uppercase tracking-widest ml-1">Customer Mobile Number</label>
                        <div className="relative">
                            <input 
                                type="text"
                                placeholder="e.g. 0712345678"
                                className="w-full bg-white border border-openpos-border rounded-xl pl-11 pr-4 py-3 text-[14px] font-bold outline-none shadow-sm focus:ring-2 focus:ring-openpos-green/20 focus:border-openpos-green transition-all"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                autoFocus
                            />
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-admin-dim" size={16} />
                        </div>
                    </div>
                </div>
            )
        }

        if (checkoutStep === 'processing') {
            return (
                <div className="h-full flex flex-col items-center justify-center sopenpos-y-6 animate-in fade-in duration-300 mt-10">
                    <div className="relative w-20 h-20">
                        <div className="absolute inset-0 border-4 border-openpos-border rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-openpos-blue rounded-full border-t-transparent animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="text-openpos-blue animate-spin" size={24} />
                        </div>
                    </div>
                    <div className="text-center">
                        <h3 className="text-[16px] font-bold text-admin-value mb-1">
                            {paymentMethod === 'mpesa' ? "Waiting for M-Pesa Pin..." : "Processing Payment..."}
                        </h3>
                        <p className="text-[12px] text-admin-dim font-medium">Please do not close this window</p>
                    </div>
                </div>
            )
        }

        if (checkoutStep === 'success') {
            return (
                <div className="h-full flex flex-col items-center justify-center sopenpos-y-6 animate-in zoom-in-95 duration-500 mt-4">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-openpos-green shadow-lg shadow-openpos-green/20">
                        <CheckCircle2 size={40} />
                    </div>
                    <div className="text-center sopenpos-y-1">
                        <h3 className="text-[22px] font-bold text-admin-value tracking-tight">Sale Complete</h3>
                        <p className="text-[12px] font-bold text-admin-dim uppercase tracking-widest">Sale ID: #{lastSaleId}</p>
                    </div>
                    
                    <div className="w-full bg-openpos-bg-subtle border border-openpos-border rounded-2xl p-4 sopenpos-y-3">
                        <div className="flex justify-between text-[12px] font-bold">
                            <span className="text-admin-dim uppercase">Total Amount</span>
                            <span className="text-admin-value">KES {total}</span>
                        </div>
                        <div className="flex justify-between text-[12px] font-bold">
                            <span className="text-admin-dim uppercase">Payment Method</span>
                            <span className="text-admin-value uppercase">{paymentMethod}</span>
                        </div>
                        <div className="flex justify-between text-[12px] font-bold">
                            <span className="text-admin-dim uppercase">Items Count</span>
                            <span className="text-admin-value">{cart.reduce((s, i) => s + i.quantity, 0)} items</span>
                        </div>
                    </div>

                    <div className="flex gap-3 w-full mt-4">
                        <button 
                            onClick={() => handleGenerateReceipt('download')}
                            className="flex-1 bg-white border border-openpos-border text-openpos-blue rounded-xl py-3 flex items-center justify-center gap-2 font-bold text-[12px] uppercase shadow-sm hover:border-openpos-blue transition-colors"
                        >
                            <Download size={16} />
                            Download
                        </button>
                        <button 
                            onClick={() => handleGenerateReceipt('print')}
                            className="flex-1 bg-white border border-openpos-border text-openpos-blue rounded-xl py-3 flex items-center justify-center gap-2 font-bold text-[12px] uppercase shadow-sm hover:border-openpos-blue transition-colors"
                        >
                            <Printer size={16} />
                            Print
                        </button>
                    </div>
                </div>
            )
        }
    }

    return (
        <div className={cn(
            "flex bg-[#F1F5F9] font-figtree overflow-hidden",
            isFullScreen ? "fixed inset-0 z-[1000] p-3 gap-3 h-screen" : "h-[calc(100vh-64px)] gap-4"
        )}>
            {/* Left Terminal */}
            <div className="flex-1 flex flex-col gap-3 min-w-0 overflow-hidden">
                
                {/* Fixed Header */}
                <div className="flex items-center justify-between shrink-0 h-10">
                    <div className="flex items-center gap-2">
                        <button onClick={() => setIsFullScreen(!isFullScreen)} className="w-8 h-8 bg-white rounded-lg border border-openpos-border flex items-center justify-center text-openpos-blue shadow-sm">
                            <Menu size={15} />
                        </button>
                        <div className="bg-white rounded-xl px-3 py-1.5 border border-openpos-border shadow-sm flex items-center gap-2">
                            <Calendar size={13} className="text-openpos-blue" />
                            <span className="text-[11px] font-bold text-admin-value">29 May 2024</span>
                            <span className="text-openpos-border mx-0.5">|</span>
                            <Clock size={13} className="text-openpos-blue" />
                            <span className="text-[11px] font-bold text-admin-value">07:59 AM</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-openpos-border shadow-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-openpos-green" />
                            <span className="text-[11px] font-bold text-admin-value">Open Order</span>
                        </div>
                        <button className="w-8 h-8 bg-white rounded-lg border border-openpos-border flex items-center justify-center text-openpos-green">
                            <Power size={15} />
                        </button>
                    </div>
                </div>

                {/* Fixed Search */}
                <div className="relative shrink-0">
                    <input 
                        type="text"
                        placeholder="Search items..."
                        className="w-full bg-white border border-openpos-border rounded-xl pl-4 pr-10 py-2.5 text-[12px] font-medium outline-none shadow-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-admin-dim" size={15} />
                </div>

                {/* Scrollable Product Grid — only this scrolls */}
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 pb-2">
                    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                        {products
                            .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
                            .map((product) => (
                            <div 
                                key={product.id}
                                className="bg-white border border-openpos-border rounded-2xl p-3 flex flex-col gap-3 shadow-sm cursor-pointer"
                                onClick={() => setCart(prev => {
                                    const exists = prev.find(i => i.id === product.id)
                                    if (exists) return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
                                    return [...prev, { ...product, quantity: 1 }]
                                })}
                            >
                                <div className="aspect-[4/3] relative rounded-xl overflow-hidden bg-openpos-bg-subtle">
                                    <Image src={product.image} alt={product.name} fill className="object-cover" />
                                    <button 
                                        className="absolute top-2 right-2 w-7 h-7 bg-white/80 backdrop-blur rounded-lg flex items-center justify-center text-admin-dim hover:text-openpos-blue hover:bg-white shadow-sm transition-all"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setInfoModalProduct(product);
                                        }}
                                    >
                                        <Info size={14} />
                                    </button>
                                </div>
                                <div className="sopenpos-y-1.5">
                                    <h4 className="text-[12px] font-bold text-admin-value truncate">{product.name}</h4>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[9px] font-bold px-1.5 py-0.5 bg-openpos-blue/5 text-openpos-blue rounded-md uppercase">
                                            {product.category}
                                        </span>
                                        <span className="text-[12px] font-bold text-admin-value">KES {product.price}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>            {/* Right Column (Cart / Checkout Flow) */}
            <div className="w-[360px] h-full bg-white rounded-[24px] border border-openpos-border shadow-lg flex flex-col overflow-hidden shrink-0">
                
                {/* Header */}
                <div className="p-5 pb-4 border-b border-openpos-border bg-white shrink-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-openpos-blue/10 rounded-lg flex items-center justify-center">
                                <ShoppingCart size={16} className="text-openpos-blue" />
                            </div>
                            <div>
                                <p className="text-[11px] font-bold text-admin-dim uppercase tracking-widest">Current Order</p>
                                <p className="text-[13px] font-bold text-admin-value">{cart.length} item{cart.length !== 1 ? 's' : ''}</p>
                            </div>
                        </div>
                        {checkoutStep === 'cart' && cart.length > 0 && (
                            <button 
                                onClick={() => setShowClearCartModal(true)}
                                className="w-8 h-8 bg-openpos-bg-subtle rounded-lg flex items-center justify-center text-admin-dim hover:text-openpos-red transition-colors"
                            >
                                <Trash2 size={15} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-4">
                    {renderRightColumnContent()}
                </div>

                {/* Footer */}
                <div className="p-6 bg-white border-t border-dashed border-openpos-border sopenpos-y-4 shrink-0">
                    {checkoutStep !== 'processing' && checkoutStep !== 'success' && (
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[14px] font-bold text-admin-value uppercase">Total</span>
                            <span className="text-[20px] font-bold text-admin-value">KES {subtotal.toFixed(0)}</span>
                        </div>
                    )}

                    <button 
                        className={cn(
                            "w-full text-white rounded-xl py-4 font-bold text-[13px] uppercase tracking-widest shadow-lg transition-all",
                            getButtonColor()
                        )}
                        onClick={handleMainAction}
                        disabled={checkoutStep === 'processing' || (checkoutStep === 'payment' && !paymentMethod)}
                    >
                        {getButtonText()}
                    </button>
                </div>
            </div>
            {/* Clear Cart Confirmation */}
            <Modal
                isOpen={showClearCartModal}
                onClose={() => setShowClearCartModal(false)}
                title="Clear Cart"
                description="Are you sure you want to remove all items from the current order?"
                type="danger"
                icon={Trash2}
                confirmText="Delete"
                confirmCountdown={5}
                onConfirm={() => {
                    setCart([])
                    setShowClearCartModal(false)
                    toast.success("Cart cleared")
                }}
            />

            {/* Product Info Modal */}
            <Modal
                isOpen={!!infoModalProduct}
                onClose={() => setInfoModalProduct(null)}
                title={infoModalProduct?.name || "Product Details"}
                maxWidth="max-w-sm"
            >
                {infoModalProduct && (
                    <div className="sopenpos-y-4">
                        <div className="relative h-48 w-full bg-openpos-bg-subtle rounded-2xl overflow-hidden">
                            <Image src={infoModalProduct.image} alt={infoModalProduct.name} fill className="object-cover" />
                        </div>
                        <div className="sopenpos-y-4">
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <h3 className="text-[18px] font-bold text-admin-value">{infoModalProduct.name}</h3>
                                    <span className="text-[14px] font-bold text-openpos-blue">KES {infoModalProduct.price}</span>
                                </div>
                                <span className="text-[10px] font-bold px-2 py-1 bg-openpos-blue/10 text-openpos-blue rounded-md uppercase tracking-widest inline-block">
                                    {infoModalProduct.category}
                                </span>
                            </div>
                            <p className="text-[13px] text-admin-dim leading-relaxed">
                                {infoModalProduct.description || "No description available for this item."}
                            </p>
                            <div className="pt-4 border-t border-openpos-border flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className={cn("w-2 h-2 rounded-full", infoModalProduct.stock > 10 ? "bg-openpos-green" : "bg-openpos-red")} />
                                    <span className="text-[12px] font-bold text-admin-value uppercase tracking-widest">{infoModalProduct.stock} in stock</span>
                                </div>
                                <button 
                                    className="px-6 py-2.5 bg-openpos-blue text-white rounded-xl font-bold text-[12px] uppercase tracking-widest shadow-lg hover:shadow-openpos-blue/30 transition-all"
                                    onClick={() => {
                                        setCart(prev => {
                                            const exists = prev.find(i => i.id === infoModalProduct.id)
                                            if (exists) return prev.map(i => i.id === infoModalProduct.id ? { ...i, quantity: i.quantity + 1 } : i)
                                            return [...prev, { ...infoModalProduct, quantity: 1 }]
                                        });
                                        setInfoModalProduct(null);
                                    }}
                                >
                                    Add to Order
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    )
}
