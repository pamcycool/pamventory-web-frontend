"use client"

import { useMutation } from '@tanstack/react-query'
import { authApi } from '@/lib/api'


// Hook for forgot password
export function useForgotPassword() {
  return useMutation({
    mutationFn: authApi.forgotPassword,
    onError: (error: unknown) => {
      console.error('Forgot password error:', error)
    },
  })
}

// Hook for reset password
export function useResetPassword() {
  return useMutation({
    mutationFn: authApi.resetPassword,
    onError: (error: unknown) => {
      console.error('Reset password error:', error)
    },
  })
}

// Hook for email verification
export function useVerifyEmail() {
  return useMutation({
    mutationFn: authApi.verifyEmail,
    onError: (error: unknown) => {
      console.error('Email verification error:', error)
    },
  })
}

// Hook for resending verification OTP
export function useResendVerificationOTP() {
  return useMutation({
    mutationFn: authApi.resendVerificationOTP,
    onError: (error: unknown) => {
      console.error('Resend OTP error:', error)
    },
  })
}
