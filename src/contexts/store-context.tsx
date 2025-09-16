"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { storeApi } from '@/lib/api'
import { Store, CreateStoreData } from '@/lib/validations'
import { useRouter } from 'next/navigation'

interface StoreContextType {
  activeStore: Store | null
  userStores: Store[]
  isLoading: boolean
  createStore: (data: CreateStoreData) => Promise<void>
  updateStore: (storeId: string, data: Partial<CreateStoreData>) => Promise<void>
  deleteStore: (storeId: string) => Promise<void>
  switchStore: (storeId: string) => Promise<void>
  error: string | null
  clearError: () => void
}

const StoreContext = createContext<StoreContextType | undefined>(undefined)

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [error, setError] = useState<string | null>(null)
  const queryClient = useQueryClient()
  const router = useRouter()

  // Get user's stores
  const {
    data: storesData,
    isLoading: storesLoading,
    error: storesError,
  } = useQuery({
    queryKey: ['userStores'],
    queryFn: storeApi.getUserStores,
    retry: false,
  })

  const userStores = storesData?.data || []

  // Log errors for debugging
  if (storesError) {
    console.error('Failed to fetch user stores:', storesError)
  }



  // Get active store
  const {
    data: activeStoreData,
    isLoading: activeStoreLoading,
    error: activeStoreError,
  } = useQuery({
    queryKey: ['activeStore'],
    queryFn: storeApi.getActiveStore,
    enabled: userStores.length > 0,
    retry: false,
  })

  const activeStore = activeStoreData?.data || null

  // If user has no stores, we don't need to wait for active store query
  const effectiveStoreLoading = userStores.length === 0 ? false : activeStoreLoading

  // Create store mutation
  const createStoreMutation = useMutation({
    mutationFn: storeApi.createStore,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['userStores'] })
      queryClient.invalidateQueries({ queryKey: ['activeStore'] })
      queryClient.invalidateQueries({ queryKey: ['currentUser'] })
      setError(null)
    },
    onError: (error: Error & { response?: { message?: string } }) => {
      setError(error.response?.message || error.message || 'Failed to create store')
    },
  })

  // Update store mutation
  const updateStoreMutation = useMutation({
    mutationFn: ({ storeId, data }: { storeId: string; data: Partial<CreateStoreData> }) =>
      storeApi.updateStore(storeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userStores'] })
      queryClient.invalidateQueries({ queryKey: ['activeStore'] })
      setError(null)
    },
    onError: (error: Error & { response?: { message?: string } }) => {
      setError(error.response?.message || error.message || 'Failed to update store')
    },
  })

  // Delete store mutation
  const deleteStoreMutation = useMutation({
    mutationFn: storeApi.deleteStore,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userStores'] })
      queryClient.invalidateQueries({ queryKey: ['activeStore'] })
      queryClient.invalidateQueries({ queryKey: ['currentUser'] })
      setError(null)
    },
    onError: (error: Error & { response?: { message?: string } }) => {
      setError(error.response?.message || error.message || 'Failed to delete store')
    },
  })

  // Switch store mutation
  const switchStoreMutation = useMutation({
    mutationFn: storeApi.setActiveStore,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeStore'] })
      queryClient.invalidateQueries({ queryKey: ['currentUser'] })
      // Invalidate all store-specific data
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['sales'] })
      queryClient.invalidateQueries({ queryKey: ['customers'] })
      queryClient.invalidateQueries({ queryKey: ['credits'] })
      setError(null)
    },
    onError: (error: Error & { response?: { message?: string } }) => {
      setError(error.response?.message || error.message || 'Failed to switch store')
    },
  })

  const createStore = async (data: CreateStoreData): Promise<void> => {
    await createStoreMutation.mutateAsync(data)
  }

  const updateStore = async (storeId: string, data: Partial<CreateStoreData>): Promise<void> => {
    await updateStoreMutation.mutateAsync({ storeId, data })
  }

  const deleteStore = async (storeId: string): Promise<void> => {
    await deleteStoreMutation.mutateAsync(storeId)
  }

  const switchStore = async (storeId: string): Promise<void> => {
    await switchStoreMutation.mutateAsync(storeId)
  }

  const clearError = () => {
    setError(null)
  }

  const isLoading = storesLoading || effectiveStoreLoading || createStoreMutation.isPending || updateStoreMutation.isPending || deleteStoreMutation.isPending || switchStoreMutation.isPending

  const contextValue: StoreContextType = {
    activeStore,
    userStores,
    isLoading,
    createStore,
    updateStore,
    deleteStore,
    switchStore,
    error: error || (storesError as Error & { response?: { message?: string } })?.response?.message || (activeStoreError as Error & { response?: { message?: string } })?.response?.message || null,
    clearError,
  }

  return <StoreContext.Provider value={contextValue}>{children}</StoreContext.Provider>
}

export function useStore() {
  const context = useContext(StoreContext)
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider')
  }
  return context
}
