"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authApi } from '@/lib/api'
import { User, SignInData, SignUpData } from '@/lib/validations'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  signIn: (data: SignInData) => Promise<void>
  signUp: (data: SignUpData) => Promise<void>
  signInWithGoogle: (data: { name: string; email: string }) => Promise<void>
  signUpWithGoogle: (data: { name: string; email: string }) => Promise<void>
  signOut: () => void
  error: string | null
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [error, setError] = useState<string | null>(null)
  const queryClient = useQueryClient()
  const router = useRouter()

  // Get auth token from localStorage
  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth-token')
    }
    return null
  }

  // Check if user is authenticated
  const isAuthenticated = !!getAuthToken()

  // Fetch current user
  const {
    data: userData,
    isLoading,
    error: queryError,
  } = useQuery({
    queryKey: ['currentUser'],
    queryFn: authApi.getCurrentUser,
    enabled: isAuthenticated,
    retry: false,
  })

  const user = userData?.user || null

  // Sign in mutation
  const signInMutation = useMutation({
    mutationFn: authApi.signIn,
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem('auth-token', data.token)
        queryClient.invalidateQueries({ queryKey: ['currentUser'] })
        router.push('/home')
      }
      setError(null)
    },
    onError: (error: Error & { response?: { message?: string; email?: string } }) => {
      const errorMessage = error.response?.data?.message || error.message || 'Sign in failed'
      console.log("errorMessage", error)
      
      // Check if the error is related to email verification
      if (errorMessage === 'Please verify your email before logging in') {
        // Store email for verification page and redirect
        const email = error.response?.email || localStorage.getItem('last-login-email')
        if (email) {
          localStorage.setItem('verification-email', email)
          localStorage.setItem('verification-from-login', 'true')
        }
        router.push('/auth/verify-email')
      } else {
        setError(errorMessage)
      }
    },
  })

  // Sign up mutation
  const signUpMutation = useMutation({
    mutationFn: authApi.signUp,
    onSuccess: (data, variables) => {
      // Store email in localStorage for verification page
      localStorage.setItem('verification-email', variables.email)
      router.push('/auth/verify-email')
      setError(null)
    },
    onError: (error: Error & { response?: { message?: string } }) => {
      setError(error.response?.message || error.message || 'Sign up failed')
    },
  })

  // Google sign in mutation
  const googleSignInMutation = useMutation({
    mutationFn: authApi.signInWithGoogle,
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem('auth-token', data.token)
        queryClient.invalidateQueries({ queryKey: ['currentUser'] })
        router.push('/home')
      }
      setError(null)
    },
    onError: (error: Error & { response?: { message?: string } }) => {
      setError(error.response?.message || error.message || 'Google sign in failed')
    },
  })

  // Google sign up mutation
  const googleSignUpMutation = useMutation({
    mutationFn: authApi.signUpWithGoogle,
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem('auth-token', data.token)
        queryClient.invalidateQueries({ queryKey: ['currentUser'] })
        router.push('/home')
      }
      setError(null)
    },
    onError: (error: Error & { response?: { message?: string } }) => {
      setError(error.response?.message || error.message || 'Google sign up failed')
    },
  })

  const signIn = async (data: SignInData): Promise<void> => {
    await signInMutation.mutateAsync(data)
  }

  const signUp = async (data: SignUpData): Promise<void> => {
    await signUpMutation.mutateAsync(data)
  }

  const signInWithGoogle = async (data: { name: string; email: string }): Promise<void> => {
    await googleSignInMutation.mutateAsync(data)
  }

  const signUpWithGoogle = async (data: { name: string; email: string }): Promise<void> => {
    await googleSignUpMutation.mutateAsync(data)
  }

  const signOut = () => {
    localStorage.removeItem('auth-token')
    queryClient.clear()
    router.push('/auth/login')
    setError(null)
  }

  const clearError = () => {
    setError(null)
  }

  // Handle query errors (e.g., 401 unauthorized)
  useEffect(() => {
    if (queryError) {
      // If user is unauthorized, sign them out
      if ((queryError as Error & { status?: number })?.status === 401) {
        localStorage.removeItem('auth-token')
        queryClient.clear()
        router.push('/auth/login')
        setError(null)
      }
    }
  }, [queryError, queryClient, router])

  const contextValue: AuthContextType = {
    user,
    isLoading: isLoading || signInMutation.isPending || signUpMutation.isPending,
    isAuthenticated,
    signIn,
    signUp,
    signInWithGoogle,
    signUpWithGoogle,
    signOut,
    error: error || (queryError as Error & { response?: { message?: string } })?.response?.message || null,
    clearError,
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}