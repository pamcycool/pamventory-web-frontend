"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Store, AlertCircle, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { ResetPasswordData, resetPasswordSchema } from "@/lib/validations"
import { useResetPassword } from "@/hooks/use-auth-api"
import { useTranslations } from "next-intl"
import { LanguageSwitcher } from "@/components/ui/language-switcher"

const ResetPasswordPage = () => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false)
    const resetPasswordMutation = useResetPassword()
    const t = useTranslations('Auth')

    const token = searchParams.get("token")

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
    } = useForm<ResetPasswordData>({
        resolver: zodResolver(resetPasswordSchema),
    })

    useEffect(() => {
        if (token) {
            setValue("token", token)
        }
    }, [token, setValue])

    const onSubmit = async (data: ResetPasswordData) => {
        try {
            await resetPasswordMutation.mutateAsync(data)
            // Redirect to login page on success
            router.push("/auth/login?message=Password reset successfully")
        } catch (error) {
            console.error("Reset password error:", error)
        }
    }

    if (!token) {
        return (
            <div className="flex-1 flex flex-col justify-center px-8 py-10 lg:px-16">
                <div className="max-w-md mx-auto w-full text-center">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-6 mx-auto">
                        <AlertCircle className="h-6 w-6 text-red-600" />
                    </div>
                    
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid reset link</h1>
                    <p className="text-gray-600 mb-6">
                        This password reset link is invalid or has expired.
                    </p>
                    
                    <Link href="/auth/forgot-password">
                        <Button className="w-full bg-[#1B7339] hover:bg-green-700">
                            Request new reset link
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="flex-1 flex flex-col px-8 py-10 lg:px-16">
            {/* Header with Language Selector */}
            <div className="flex justify-end items-start mb-8">
                <LanguageSwitcher />
            </div>

            <div className="max-w-md mx-auto w-full flex-1 flex flex-col justify-center">
                {/* Logo */}
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                    <Store className="h-6 w-6 text-green-600" />
                </div>

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('Set new password')}</h1>
                    <p className="text-gray-600">{t('Password reset description')}</p>
                </div>

                {/* Error Message */}
                {resetPasswordMutation.error && (
                    <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md mb-6">
                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                        <span>{(resetPasswordMutation.error as { response?: { message?: string } })?.response?.message || resetPasswordMutation.error.message}</span>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <input type="hidden" {...register("token")} />
                    
                    <div>
                        <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                            {t('New Password')}
                        </Label>
                        <div className="relative mt-1">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your new password"
                                className="h-12 pr-10"
                                {...register("password")}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                        )}
                        <p className="mt-1 text-xs text-gray-500">Must be at least 6 characters.</p>
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-12 bg-[#1B7339] hover:bg-green-700"
                        disabled={resetPasswordMutation.isPending || isSubmitting}
                    >
                        {resetPasswordMutation.isPending || isSubmitting ? (
                            <div className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Resetting password...
                            </div>
                        ) : (
                            t('Update Password')
                        )}
                    </Button>
                </form>

                {/* Back to login */}
                <div className="text-center mt-6">
                    <Link href="/auth/login" className="text-sm text-gray-600 hover:text-gray-900">
                        {t('Back to sign in')}
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default ResetPasswordPage