import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

export interface Sale {
  _id: string
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  totalPrice: number
  saleDate: string
  category: string
  paymentMethod: 'cash' | 'transfer' | 'card' | 'credit'
  customerName?: string
  notes?: string
  createdAt: string
  updatedAt: string
  formattedDate?: string
}

export interface SalesFilters {
  page?: number
  limit?: number
  search?: string
  sortBy?: 'saleDate' | 'productName' | 'quantity' | 'unitPrice' | 'totalPrice' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
  startDate?: string
  endDate?: string
  productName?: string
  category?: string
  paymentMethod?: string
  minAmount?: number
  maxAmount?: number
}

export interface SalesResponse {
  success: boolean
  data: Sale[]
  pagination: {
    currentPage: number
    totalPages: number
    totalSales: number
    hasNextPage: boolean
    hasPrevPage: boolean
    limit: number
  }
}

export interface CreateSaleData {
  productId: string
  quantity: number
  unitPrice: number
  paymentMethod?: 'cash' | 'transfer' | 'card' | 'credit'
  customerName?: string
  notes?: string
}

export interface UpdateSaleData {
  customerName?: string
  notes?: string
  paymentMethod?: 'cash' | 'transfer' | 'card' | 'credit'
}

export interface SalesStats {
  overview: {
    totalSales: number
    totalRevenue: number
    averageSaleValue: number
    totalQuantitySold: number
  }
  topProducts: Array<{
    _id: string
    productName: string
    totalQuantitySold: number
    totalRevenue: number
    salesCount: number
  }>
  salesByPeriod: Array<{
    _id: {
      year: number
      month: number
      day?: number
      week?: number
    }
    totalSales: number
    totalRevenue: number
    totalQuantity: number
  }>
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface FilterOptions {
  categories: string[]
  paymentMethods: string[]
  productNames: string[]
}

// Get all sales with filters
export const useSales = (filters: SalesFilters = {}) => {
  return useQuery({
    queryKey: ['sales', filters],
    queryFn: async () => {
      const params = new URLSearchParams()
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString())
        }
      })

      const response = await api.get(`/api/sales?${params.toString()}`)
      return response
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

// Get single sale
export const useSale = (id: string) => {
  return useQuery({
    queryKey: ['sale', id],
    queryFn: async () => {
      const response = await api.get(`/api/sales/${id}`)
      return response
    },
    enabled: !!id,
  })
}

// Get sales statistics
export const useSalesStats = (startDate?: string, endDate?: string, period?: string) => {
  return useQuery<ApiResponse<SalesStats>>({
    queryKey: ['salesStats', startDate, endDate, period],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (startDate) params.append('startDate', startDate)
      if (endDate) params.append('endDate', endDate)
      if (period) params.append('period', period)

      const response = await api.get<ApiResponse<SalesStats>>(`/api/sales/stats?${params.toString()}`)
      return response
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  })
}

// Get filter options
export const useSalesFilterOptions = () => {
  return useQuery({
    queryKey: ['salesFilterOptions'],
    queryFn: async () => {
      const response = await api.get('/api/sales/filter-options')
      return response
    },
    staleTime: 1000 * 60 * 15, // 15 minutes
  })
}

// Create sale mutation
export const useCreateSale = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: CreateSaleData) => {
      const response = await api.post('/api/sales', data)
      return response
    },
    onSuccess: () => {
      // Invalidate and refetch sales data
      queryClient.invalidateQueries({ queryKey: ['sales'] })
      queryClient.invalidateQueries({ queryKey: ['salesStats'] })
      queryClient.invalidateQueries({ queryKey: ['inventory'] }) // Also invalidate inventory as stock changed
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

// Update sale mutation
export const useUpdateSale = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateSaleData }) => {
      const response = await api.put(`/api/sales/${id}`, data)
      return response
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch sales data
      queryClient.invalidateQueries({ queryKey: ['sales'] })
      queryClient.invalidateQueries({ queryKey: ['sale', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['salesStats'] })
    },
  })
}

// Delete sale mutation
export const useDeleteSale = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/api/sales/${id}`)
      return response
    },
    onSuccess: () => {
      // Invalidate and refetch sales data
      queryClient.invalidateQueries({ queryKey: ['sales'] })
      queryClient.invalidateQueries({ queryKey: ['salesStats'] })
      queryClient.invalidateQueries({ queryKey: ['inventory'] }) // Also invalidate inventory as stock was restored
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}