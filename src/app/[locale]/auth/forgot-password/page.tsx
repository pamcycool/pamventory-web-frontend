"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Store, AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"
import { ForgotPasswordData, forgotPasswordSchema } from "@/lib/validations"
import { useForgotPassword } from "@/hooks/use-auth-api"
import { useTranslations } from "next-intl"
import { LanguageSwitcher } from "@/components/ui/language-switcher"

const ForgotPasswordPage = () => {
    const [isSuccess, setIsSuccess] = useState(false)
    const forgotPasswordMutation = useForgotPassword()
    const t = useTranslations('Auth')

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        getValues,
    } = useForm<ForgotPasswordData>({
        resolver: zodResolver(forgotPasswordSchema),
    })

    const onSubmit = async (data: ForgotPasswordData) => {
        try {
            await forgotPasswordMutation.mutateAsync(data)
            setIsSuccess(true)
        } catch (error) {
            console.error("Forgot password error:", error)
        }
    }

    if (isSuccess) {
        return (
            <div className="flex-1 flex flex-col justify-center px-8 py-10 lg:px-16">
                <div className="max-w-md mx-auto w-full text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6 mx-auto">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('Check your email')}</h1>
                    <p className="text-gray-600 mb-6">
                        {t('Email sent description')}{" "}
                        <span className="font-medium">{getValues("email")}</span>
                    </p>
                    
                    <div className="text-sm text-gray-500 mb-8">
                        {t('Email sent description')}{" "}
                        <button
                            onClick={() => setIsSuccess(false)}
                            className="text-green-600 hover:underline"
                        >
                            try again
                        </button>
                    </div>
                    
                    <Link href="/auth/login">
                        <Button variant="outline" className="w-full">
                            {t('Back to sign in')}
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="flex-1 flex flex-col px-8 py-10 lg:px-16">
            {/* Header with Back Button and Language Selector */}
            <div className="flex justify-between items-start mb-8">
                <Link href="/auth/login" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                    <ArrowLeft className="h-4 w-4" />
                    <span>{t('Back to sign in')}</span>
                </Link>

                <LanguageSwitcher />
            </div>

            <div className="max-w-md mx-auto w-full flex-1 flex flex-col justify-center">
                {/* Logo */}
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                    <Store className="h-6 w-6 text-green-600" />
                </div>

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('Reset Password')}</h1>
                    <p className="text-gray-600">{t('Reset password description')}</p>
                </div>

                {/* Error Message */}
                {forgotPasswordMutation.error && (
                    <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md mb-6">
                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                        <span>{(forgotPasswordMutation.error as any)?.response?.message || forgotPasswordMutation.error.message}</span>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                            {t('Email')}
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            className="mt-1 h-12"
                            {...register("email")}
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-12 bg-[#1B7339] hover:bg-green-700"
                        disabled={forgotPasswordMutation.isPending || isSubmitting}
                    >
                        {forgotPasswordMutation.isPending || isSubmitting ? (
                            <div className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                {t('Sending')}
                            </div>
                        ) : (
                            t('Send reset link')
                        )}
                    </Button>
                </form>

                {/* Back to login */}
                <div className="text-center mt-6">
                    <Link href="/auth/login" className="text-sm text-gray-600 hover:text-gray-900">
                        <ArrowLeft className="h-3 w-3 inline mr-1" />
                        {t('Back to sign in')}
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default ForgotPasswordPage