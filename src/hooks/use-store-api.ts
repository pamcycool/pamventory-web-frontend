import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { storeApi } from '@/lib/api'
import { CreateStoreData, UpdateStoreData } from '@/lib/validations'
import { toast } from 'sonner'

export function useStoreApi() {
  const queryClient = useQueryClient()

  // Get user's stores
  const useUserStores = () => {
    return useQuery({
      queryKey: ['userStores'],
      queryFn: storeApi.getUserStores,
      retry: false,
    })
  }

  // Get active store
  const useActiveStore = (enabled = true) => {
    return useQuery({
      queryKey: ['activeStore'],
      queryFn: storeApi.getActiveStore,
      enabled,
      retry: false,
    })
  }

  // Create store mutation
  const useCreateStore = () => {
    return useMutation({
      mutationFn: storeApi.createStore,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['userStores'] })
        queryClient.invalidateQueries({ queryKey: ['activeStore'] })
        queryClient.invalidateQueries({ queryKey: ['currentUser'] })
        toast.success('Store created successfully!')
      },
      onError: (error: Error & { response?: { message?: string } }) => {
        toast.error(error.response?.message || error.message || 'Failed to create store')
      },
    })
  }

  // Update store mutation
  const useUpdateStore = () => {
    return useMutation({
      mutationFn: ({ storeId, data }: { storeId: string; data: UpdateStoreData }) =>
        storeApi.updateStore(storeId, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['userStores'] })
        queryClient.invalidateQueries({ queryKey: ['activeStore'] })
        toast.success('Store updated successfully!')
      },
      onError: (error: Error & { response?: { message?: string } }) => {
        toast.error(error.response?.message || error.message || 'Failed to update store')
      },
    })
  }

  // Delete store mutation
  const useDeleteStore = () => {
    return useMutation({
      mutationFn: storeApi.deleteStore,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['userStores'] })
        queryClient.invalidateQueries({ queryKey: ['activeStore'] })
        queryClient.invalidateQueries({ queryKey: ['currentUser'] })
        toast.success('Store deleted successfully!')
      },
      onError: (error: Error & { response?: { message?: string } }) => {
        toast.error(error.response?.message || error.message || 'Failed to delete store')
      },
    })
  }

  // Switch store mutation
  const useSwitchStore = () => {
    return useMutation({
      mutationFn: storeApi.setActiveStore,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['activeStore'] })
        queryClient.invalidateQueries({ queryKey: ['currentUser'] })
        // Invalidate all store-specific data
        queryClient.invalidateQueries({ queryKey: ['products'] })
        queryClient.invalidateQueries({ queryKey: ['sales'] })
        queryClient.invalidateQueries({ queryKey: ['customers'] })
        queryClient.invalidateQueries({ queryKey: ['credits'] })
        toast.success('Store switched successfully!')
      },
      onError: (error: Error & { response?: { message?: string } }) => {
        toast.error(error.response?.message || error.message || 'Failed to switch store')
      },
    })
  }

  return {
    useUserStores,
    useActiveStore,
    useCreateStore,
    useUpdateStore,
    useDeleteStore,
    useSwitchStore,
  }
}
