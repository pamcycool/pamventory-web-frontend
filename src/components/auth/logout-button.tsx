"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { LogOut } from "lucide-react"

interface LogoutButtonProps {
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
  className?: string
  showIcon?: boolean
  children?: React.ReactNode
}

export function LogoutButton({ 
  variant = "ghost", 
  size = "default", 
  className = "",
  showIcon = true,
  children 
}: LogoutButtonProps) {
  const { signOut, isLoading } = useAuth()

  return (
    <Button
      variant={variant}
      size={size}
      onClick={signOut}
      disabled={isLoading}
      className={className}
    >
      {showIcon && <LogOut className="h-4 w-4 mr-2" />}
      {children || "Sign out"}
    </Button>
  )
}