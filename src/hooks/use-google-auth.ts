"use client"

import { useState } from "react"
import { useGoogleLogin } from "@react-oauth/google"
import { useRouter } from "next/navigation"
import axios from "axios"
import { useAuth } from "@/contexts/auth-context"

export function useGoogleAuth() {
  const [googleLoading, setGoogleLoading] = useState(false)
  const { signInWithGoogle, signUpWithGoogle } = useAuth()
  const router = useRouter()

  const googleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      setGoogleLoading(true)
      try {
        const res = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${response.access_token}`,
            },
          }
        )
        
        if (res.data.email) {
          await signInWithGoogle({ 
            email: res.data.email, 
            name: res.data.name || res.data.given_name || "Google User"
          })
        }
      } catch (err) {
        console.error("Google login error:", err)
        throw err
      } finally {
        setGoogleLoading(false)
      }
    },
    onError: (error) => {
      console.error("Google OAuth error:", error)
      setGoogleLoading(false)
    }
  })

  const googleSignup = useGoogleLogin({
    onSuccess: async (response) => {
      setGoogleLoading(true)
      try {
        const res = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${response.access_token}`,
            },
          }
        )
        
        if (res.data.email) {
          await signUpWithGoogle({ 
            email: res.data.email, 
            name: res.data.name || res.data.given_name || "Google User"
          })
        }
      } catch (err) {
        console.error("Google signup error:", err)
        throw err
      } finally {
        setGoogleLoading(false)
      }
    },
    onError: (error) => {
      console.error("Google OAuth error:", error)
      setGoogleLoading(false)
    }
  })

  return {
    googleLogin,
    googleSignup,
    googleLoading
  }
}