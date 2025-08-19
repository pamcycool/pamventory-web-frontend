import { z } from "zod"

// Base validation schemas
export const emailSchema = z.string().email("Please enter a valid email address")
export const passwordSchema = z.string().min(6, "Password must be at least 6 characters long")
export const nameSchema = z.string().min(2, "Name must be at least 2 characters long")

// Authentication schemas
export const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})

export const signUpSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
})

export const forgotPasswordSchema = z.object({
  email: emailSchema,
})

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: passwordSchema,
})

export const verifyEmailSchema = z.object({
  otp: z.string().min(6, "OTP must be 6 digits").max(6, "OTP must be 6 digits"),
})

// User type definitions
export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  isVerified: z.boolean(),
  role: z.string().optional(),
  lastLogin: z.string().optional(),
  createdAt: z.string().optional(),
})

// API response types
export const authResponseSchema = z.object({
  message: z.string(),
  token: z.string().optional(),
  user: userSchema.optional(),
})

export const errorResponseSchema = z.object({
  message: z.string(),
  error: z.string().optional(),
})

// Type exports
export type SignInData = z.infer<typeof signInSchema>
export type SignUpData = z.infer<typeof signUpSchema>
export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordData = z.infer<typeof resetPasswordSchema>
export type VerifyEmailData = z.infer<typeof verifyEmailSchema>
export type User = z.infer<typeof userSchema>
export type AuthResponse = z.infer<typeof authResponseSchema>
export type ErrorResponse = z.infer<typeof errorResponseSchema>