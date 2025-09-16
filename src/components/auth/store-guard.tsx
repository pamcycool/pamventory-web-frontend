"use client"

import React from 'react'
import { useStore } from '@/contexts/store-context'
import { useAuth } from '@/contexts/auth-context'
import { ForcedCreateStoreModal } from '@/components/modals/ForcedCreateStoreModal'

interface StoreGuardProps {
  children: React.ReactNode
}

export function StoreGuard({ children }: StoreGuardProps) {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const { activeStore, userStores, isLoading: storeLoading } = useStore()

  const isLoading = authLoading || storeLoading

  // Show loading spinner while checking store status
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading your store...</p>
        </div>
      </div>
    )
  }

  // If not authenticated, don't render anything (ProtectedRoute will handle this)
  if (!isAuthenticated) {
    return null
  }

  // If user has no stores, show the forced modal
  const showCreateStoreModal = userStores.length === 0

  return (
    <>
      {children}
      <ForcedCreateStoreModal isOpen={showCreateStoreModal} />
    </>
  )
}
