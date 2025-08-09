"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"
import { SignInData, SignUpData, signInSchema, signUpSchema } from "@/lib/validations"
import { AlertCircle, Eye, EyeOff } from "lucide-react"

interface AuthFormProps {
  type: "signin" | "signup"
  onSubmit?: () => void
}

export function AuthForm({ type, onSubmit }: AuthFormProps) {
  const { signIn, signUp, isLoading, error, clearError } = useAuth()
  const [showPassword, setShowPassword] = useState(false)

  const schema = type === "signin" ? signInSchema : signUpSchema
  const isSignUp = type === "signup"

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SignInData | SignUpData>({
    resolver: zodResolver(schema),
  })

  const onFormSubmit = async (data: SignInData | SignUpData) => {
    try {
      clearError()
      
      if (isSignUp) {
        await signUp(data as SignUpData)
      } else {
        // Store email for potential verification redirect
        localStorage.setItem('last-login-email', data.email)
        await signIn(data as SignInData)
      }
      
      reset()
      onSubmit?.()
    } catch (error) {
      // Error is handled by the auth context
      console.error('Form submission error:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {isSignUp && (
        <div>
          <Label htmlFor="name" className="text-sm font-medium text-gray-700">
            Full Name
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter your full name"
            className="mt-1 h-12"
            {...register("name" as keyof (SignInData | SignUpData))}
          />
          {isSignUp && 'name' in errors && errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>
      )}

      <div>
        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email
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

      <div>
        <Label htmlFor="password" className="text-sm font-medium text-gray-700">
          Password
        </Label>
        <div className="relative mt-1">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
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
      </div>

      <Button
        type="submit"
        className="w-full h-12 bg-[#1B7339] hover:bg-green-700 mt-6"
        disabled={isLoading || isSubmitting}
      >
        {isLoading || isSubmitting ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            {isSignUp ? "Creating account..." : "Signing in..."}
          </div>
        ) : (
          isSignUp ? "Create Account" : "Sign In"
        )}
      </Button>
    </form>
  )
}