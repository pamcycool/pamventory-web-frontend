"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Globe, Store, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useVerifyEmail, useResendVerificationOTP } from "@/hooks/use-auth-api"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"

const VerifyEmailPage = () => {
    const router = useRouter()
    const [otp, setOtp] = useState("")
    const [isSuccess, setIsSuccess] = useState(false)
    const [userEmail, setUserEmail] = useState("")
    const [resendCooldown, setResendCooldown] = useState(0)
    const [autoSentOTP, setAutoSentOTP] = useState(false)
    const verifyEmailMutation = useVerifyEmail()
    const resendOTPMutation = useResendVerificationOTP()

    // Get email from localStorage and handle auto OTP sending
    useEffect(() => {
        const email = localStorage.getItem('verification-email')
        const fromLogin = localStorage.getItem('verification-from-login')
        
        if (email) {
            setUserEmail(email)
            
            // If user came from failed login, automatically send OTP
            if (fromLogin === 'true' && !autoSentOTP) {
                setAutoSentOTP(true)
                // Start cooldown immediately before sending
                setResendCooldown(60)
                resendOTPMutation.mutate({ email })
                // Clear the flag so it doesn't auto-send again
                localStorage.removeItem('verification-from-login')
            }
        }
    }, [autoSentOTP, resendOTPMutation])

    // Cooldown timer effect
    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => {
                setResendCooldown(resendCooldown - 1)
            }, 1000)
            return () => clearTimeout(timer)
        }
    }, [resendCooldown])

    // const token = searchParams.get("token") // Removed since not used

    // Remove auto-verification since we now use manual OTP input
    // useEffect(() => {
    //     if (token) {
    //         handleVerifyEmail(token)
    //     }
    // }, [token])

    const handleVerifyEmail = async (verificationOTP: string) => {
        try {
            await verifyEmailMutation.mutateAsync({ otp: verificationOTP })
            setIsSuccess(true)
            // Clear stored email after successful verification
            localStorage.removeItem('verification-email')
            // Redirect to dashboard after 2 seconds
            setTimeout(() => {
                router.push("/dashboard")
            }, 2000)
        } catch (error) {
            console.error("Email verification error:", error)
        }
    }

    const handleOtpSubmit = () => {
        if (otp.length === 6) {
            handleVerifyEmail(otp)
        }
    }

    if (isSuccess) {
        return (
            <div className="flex-1 flex flex-col justify-center px-8 py-10 lg:px-16">
                <div className="max-w-md mx-auto w-full text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Email verified!</h1>
                    <p className="text-gray-600 mb-6">
                        Your email has been successfully verified. You&apos;ll be redirected to login shortly.
                    </p>
                    
                    <Button 
                        onClick={() => router.push("/auth/login")}
                        className="w-full bg-[#1B7339] hover:bg-green-700"
                    >
                        Continue to login
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="flex-1 flex flex-col px-8 py-10 lg:px-16">
            {/* Header with Logo and Language Selector */}
            <div className="flex justify-between items-start mb-8">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Store className="h-6 w-6 text-green-600" />
                </div>

                <Select defaultValue="english">
                    <SelectTrigger className="w-32 border-0 bg-transparent">
                        <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            <SelectValue />
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="max-w-md mx-auto w-full flex-1 flex flex-col justify-center">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Verify your email</h1>
                    <p className="text-gray-600">
                        We sent a verification code to {userEmail ? (
                            <span className="font-medium text-gray-900">{userEmail}</span>
                        ) : "your email address"}. Enter the code below to verify your account.
                    </p>
                </div>

                {/* Error Message */}
                {verifyEmailMutation.error && (
                    <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md mb-6">
                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                        <span>{(verifyEmailMutation.error as Error)?.message || 'Verification failed'}</span>
                    </div>
                )}

                {/* OTP Input */}
                <div className="mb-8">
                    <div className="flex justify-center mb-4">
                        <InputOTP 
                            maxLength={6} 
                            value={otp} 
                            onChange={(value) => setOtp(value)}
                            onComplete={handleOtpSubmit}
                        >
                            <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                            </InputOTPGroup>
                            <InputOTPSeparator />
                            <InputOTPGroup>
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                            </InputOTPGroup>
                        </InputOTP>
                    </div>
                    
                    <Button
                        onClick={handleOtpSubmit}
                        disabled={otp.length !== 6 || verifyEmailMutation.isPending}
                        className="w-full h-12 bg-[#1B7339] hover:bg-green-700"
                    >
                        {verifyEmailMutation.isPending ? (
                            <div className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Verifying...
                            </div>
                        ) : (
                            "Verify Email"
                        )}
                    </Button>
                </div>

                {/* Auto-sent OTP message */}
                {autoSentOTP && resendOTPMutation.isSuccess && (
                    <div className="flex items-center gap-2 p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md mb-4">
                        <CheckCircle className="h-4 w-4 flex-shrink-0" />
                        <span>Verification code sent to your email!</span>
                    </div>
                )}

                {/* Cooldown timer display */}
                {resendCooldown > 0 && (
                    <div className="text-center mb-4">
                        <p className="text-sm text-gray-500">
                            You can request a new code in <span className="font-medium text-gray-700">{resendCooldown}</span> seconds
                        </p>
                    </div>
                )}

                {/* Resend option */}
                <div className="text-center space-y-4">
                    <p className="text-sm text-gray-600">
                        Didn&apos;t receive the code?{" "}
                        <button 
                            className="text-green-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={async () => {
                                if (userEmail && resendCooldown === 0) {
                                    try {
                                        await resendOTPMutation.mutateAsync({ email: userEmail })
                                        setResendCooldown(60) // Start 60-second cooldown
                                    } catch (error) {
                                        console.error("Resend OTP error:", error)
                                    }
                                }
                            }}
                            disabled={resendOTPMutation.isPending || !userEmail || resendCooldown > 0}
                        >
                            {resendOTPMutation.isPending ? (
                                "Sending..."
                            ) : resendCooldown > 0 ? (
                                "Resend"
                            ) : resendOTPMutation.isSuccess && resendCooldown === 0 ? (
                                "Sent!"
                            ) : (
                                "Resend"
                            )}
                        </button>
                    </p>
                    
                    <Link href="/auth/login" className="text-sm text-gray-600 hover:text-gray-900 flex items-center justify-center gap-1">
                        <ArrowLeft className="h-3 w-3" />
                        Back to login
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default VerifyEmailPage