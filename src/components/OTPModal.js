"use client"

import React, { useState, useEffect } from'react'
import { Modal } from'./Modal'
import { ShieldCheck, MessageSquareText } from'lucide-react'
import { cn } from'@/lib/utils'
import { toast } from'sonner'
import authService from'@/lib/auth'
import { API_BASE } from'@/lib/api-config'

export function OTPModal({ isOpen, onClose, onVerify, phoneNumber, isLoading, actionType ='admin_verification'}) {
 const [otp, setOtp] = useState(['','','','','',''])
 const [timer, setTimer] = useState(0)
 const [isResending, setIsResending] = useState(false)
 const inputRefs = React.useRef([])

 useEffect(() => {
 let interval
 if (timer > 0) {
 interval = setInterval(() => setTimer(prev => prev - 1), 1000)
 }
 return () => clearInterval(interval)
 }, [timer])

 const handleResend = async () => {
 if (timer > 0 || isResending) return
 
 setIsResending(true)
 try {
 const response = await authService.authenticatedFetch(`${API_BASE}/otp_resend.php`, {
 method:'POST',
 headers: {
'Content-Type':'application/json'
 },
 body: JSON.stringify({ action_type: actionType })
 })
 const data = await response.json()
 if (data.status ==='success') {
 setTimer(60) // 1 minute cooldown
 setOtp(['','','','','','']) // Clear old entered code
 // Refocus first input
 if (inputRefs.current[0]) {
 setTimeout(() => inputRefs.current[0].focus(), 50)
 }
 toast.success(data.message)
 } else {
 toast.error(data.message ||"Failed to resend code")
 }
 } catch (error) {
 console.error("Resend error:", error)
 toast.error("Network error. Please try again.")
 } finally {
 setIsResending(false)
 }
 }

 const handlePaste = (e) => {
 e.preventDefault()
 const pastedData = e.clipboardData.getData('text').replace(/\D/g,'').slice(0, 6)
 if (!pastedData) return

 const newOtp = ['','','','','','']
 for (let i = 0; i < pastedData.length; i++) {
 newOtp[i] = pastedData[i]
 }
 setOtp(newOtp)

 // Focus the next empty input or the last one
 const focusIndex = Math.min(pastedData.length, 5)
 if (inputRefs.current[focusIndex]) {
 inputRefs.current[focusIndex].focus()
 }
 }

 const handleChange = (index, value) => {
 if (isNaN(value)) return
 const newOtp = [...otp]
 newOtp[index] = value.substring(value.length - 1)
 setOtp(newOtp)

 // Focus next input
 if (value && index < 5) {
 inputRefs.current[index + 1].focus()
 }
 }

 const handleKeyDown = (index, e) => {
 if (e.key ==='Backspace'&& !otp[index] && index > 0) {
 inputRefs.current[index - 1].focus()
 }
 }

 const handleSubmit = () => {
 const code = otp.join('')
 if (code.length === 6) {
 onVerify(code)
 }
 }

 useEffect(() => {
 if (isOpen) {
 setOtp(['','','','','',''])
 setTimer(0)
 // Focus first input after animation completes
 const timer = setTimeout(() => {
 const firstInput = inputRefs.current[0];
 if (firstInput) {
 firstInput.focus();
 // Multi-step focus to ensure it takes
 setTimeout(() => firstInput.focus(), 50);
 }
 }, 300)
 return () => clearTimeout(timer)
 }
 }, [isOpen])

 return (
 <Modal
 isOpen={isOpen}
 onClose={onClose}
 title="Two-Step Verification"
 description="High Priority Security Check"
 type="primary"
 icon={Lock}
 confirmText="Verify Action"
 onConfirm={handleSubmit}
 isLoading={isLoading}
 maxWidth="max-w-md"
 >
 <div className="flex flex-col items-center gap-6 py-4">
 <div className="flex flex-col items-center text-center gap-2">
 <div className="w-16 h-16 bg-openpos-purple/10 rounded-full flex items-center justify-center text-openpos-purple mb-2">
 <MessageSquareText size={32} />
 </div>
 <p className="text-sm text-foreground font-medium">Verify your identity</p>
 <p className="text-[10px] text-admin-dim uppercase tracking-wider leading-relaxed">
 We've sent a 6-digit verification code to your WhatsApp number. 
 Please enter it below to authorize this sensitive change.
 </p>
 </div>

 <div className="flex gap-2 sm:gap-3">
 {otp.map((digit, index) => (
 <input
 key={index}
 ref={(el) => (inputRefs.current[index] = el)}
 type="text"
 inputMode="numeric"
 maxLength={1}
 value={digit}
 onChange={(e) => handleChange(index, e.target.value)}
 onKeyDown={(e) => handleKeyDown(index, e)}
 onPaste={handlePaste}
 className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg font-bold bg-card-bg border border-openpos-border text-openpos-purple rounded-lg outline-none transition-all uppercase tracking-tighter"
 />
 ))}
 </div>
 
 <div className="flex flex-col items-center gap-2">
 <button 
 onClick={handleResend}
 disabled={timer > 0 || isResending}
 className={cn(
"text-[10px] font-bold uppercase tracking-widest transition-all",
 timer > 0 ?"text-admin-dim cursor-not-allowed":"text-openpos-purple"
 )}
 >
 {isResending ?"Sending...": timer > 0 ?`Resend code in ${timer}s`:"Didn't receive code? Resend"}
 </button>
 <p className="text-[9px] text-admin-dim">
 The code expires in 5 minutes.
 </p>
 </div>
 </div>
 </Modal>
 )
}
