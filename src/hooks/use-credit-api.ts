import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

// Customer interfaces
export interface Customer {
  _id: string
  name: string
  phone: string
  address: string
  userId: string
  totalCredit: number
  totalPaid: number
  balance: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CustomerStatistics {
  totalOutstanding: number
  totalCustomers: number
  overdueAmount: number
  creditCustomers: number
}

export interface CreateCustomerData {
  name: string
  phone: string
  address: string
}

export interface UpdateCustomerData {
  name?: string
  phone?: string
  address?: string
}

export interface CustomersFilters {
  page?: number
  limit?: number
  search?: string
}

export interface CustomersResponse {
  success: boolean
  data: Customer[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Transaction interfaces
export interface CreditTransaction {
  _id: string
  customerId: string
  userId: string
  type: 'credit-given' | 'payment-received'
  amount: number
  description: string
  dueDate?: string
  isOverdue: boolean
  status: 'pending' | 'completed' | 'cancelled'
  reference: string
  createdAt: string
  updatedAt: string
  customerId?: {
    _id: string
    name: string
    phone: string
    address?: string
  }
}

export interface CreateTransactionData {
  customerId: string
  type: 'credit-given' | 'payment-received'
  amount: number
  description: string
  dueDate?: string
}

export interface UpdateTransactionData {
  amount?: number
  description?: string
  dueDate?: string
}

export interface TransactionsFilters {
  page?: number
  limit?: number
  type?: 'credit-given' | 'payment-received'
  customerId?: string
}

export interface TransactionsResponse {
  success: boolean
  data: CreditTransaction[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface TransactionSummary {
  totalCredit: number
  totalPaid: number
  outstandingAmount: number
}

// Customer hooks
export const useCustomers = (filters: CustomersFilters = {}) => {
  return useQuery({
    queryKey: ['customers', filters],
    queryFn: async (): Promise<CustomersResponse> => {
      const params = new URLSearchParams()
      
      if (filters.page) params.append('page', filters.page.toString())
      if (filters.limit) params.append('limit', filters.limit.toString())
      if (filters.search) params.append('search', filters.search)

      const response = await api.get(`/api/credit/customers?${params.toString()}`)
      return response.data
    },
  })
}

export const useCustomerStatistics = () => {
  return useQuery({
    queryKey: ['customerStatistics'],
    queryFn: async (): Promise<{ success: boolean; data: CustomerStatistics }> => {
      const response = await api.get('/api/credit/customers/statistics')
      return response.data
    },
  })
}

export const useCustomer = (customerId: string | undefined) => {
  return useQuery({
    queryKey: ['customer', customerId],
    queryFn: async (): Promise<{ success: boolean; data: Customer }> => {
      const response = await api.get(`/api/credit/customers/${customerId}`)
      return response.data
    },
    enabled: !!customerId,
  })
}

export const useCreateCustomer = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateCustomerData): Promise<{ success: boolean; data: Customer; message: string }> => {
      const response = await api.post('/api/credit/customers', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
      queryClient.invalidateQueries({ queryKey: ['customerStatistics'] })
    },
  })
}

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ customerId, data }: { customerId: string; data: UpdateCustomerData }): Promise<{ success: boolean; data: Customer; message: string }> => {
      const response = await api.put(`/api/credit/customers/${customerId}`, data)
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
      queryClient.invalidateQueries({ queryKey: ['customer', variables.customerId] })
      queryClient.invalidateQueries({ queryKey: ['customerStatistics'] })
    },
  })
}

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (customerId: string): Promise<{ success: boolean; message: string }> => {
      const response = await api.delete(`/api/credit/customers/${customerId}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
      queryClient.invalidateQueries({ queryKey: ['customerStatistics'] })
    },
  })
}

// Transaction hooks
export const useCustomerTransactions = (customerId: string | undefined, filters: TransactionsFilters = {}) => {
  return useQuery({
    queryKey: ['customerTransactions', customerId, filters],
    queryFn: async (): Promise<TransactionsResponse> => {
      const params = new URLSearchParams()
      
      if (filters.page) params.append('page', filters.page.toString())
      if (filters.limit) params.append('limit', filters.limit.toString())
      if (filters.type) params.append('type', filters.type)

      const response = await api.get(`/api/credit/customers/${customerId}/transactions?${params.toString()}`)
      return response.data
    },
    enabled: !!customerId,
  })
}

export const useAllTransactions = (filters: TransactionsFilters = {}) => {
  return useQuery({
    queryKey: ['allTransactions', filters],
    queryFn: async (): Promise<TransactionsResponse> => {
      const params = new URLSearchParams()
      
      if (filters.page) params.append('page', filters.page.toString())
      if (filters.limit) params.append('limit', filters.limit.toString())
      if (filters.type) params.append('type', filters.type)
      if (filters.customerId) params.append('customerId', filters.customerId)

      const response = await api.get(`/api/credit/transactions?${params.toString()}`)
      return response.data
    },
  })
}

export const useTransactionSummary = () => {
  return useQuery({
    queryKey: ['transactionSummary'],
    queryFn: async (): Promise<{ success: boolean; data: TransactionSummary }> => {
      const response = await api.get('/api/credit/transactions/summary')
      return response.data
    },
  })
}

export const useCreateTransaction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateTransactionData): Promise<{ success: boolean; data: CreditTransaction; message: string }> => {
      const response = await api.post('/api/credit/transactions', data)
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['customerTransactions', variables.customerId] })
      queryClient.invalidateQueries({ queryKey: ['allTransactions'] })
      queryClient.invalidateQueries({ queryKey: ['customer', variables.customerId] })
      queryClient.invalidateQueries({ queryKey: ['customerStatistics'] })
      queryClient.invalidateQueries({ queryKey: ['transactionSummary'] })
    },
  })
}

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ transactionId, data }: { transactionId: string; data: UpdateTransactionData }): Promise<{ success: boolean; data: CreditTransaction; message: string }> => {
      const response = await api.put(`/api/credit/transactions/${transactionId}`, data)
      return response.data
    },
    onSuccess: (data) => {
      const customerId = data.data.customerId
      queryClient.invalidateQueries({ queryKey: ['customerTransactions', customerId] })
      queryClient.invalidateQueries({ queryKey: ['allTransactions'] })
      queryClient.invalidateQueries({ queryKey: ['customer', customerId] })
      queryClient.invalidateQueries({ queryKey: ['customerStatistics'] })
      queryClient.invalidateQueries({ queryKey: ['transactionSummary'] })
    },
  })
}

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (transactionId: string): Promise<{ success: boolean; message: string }> => {
      const response = await api.delete(`/api/credit/transactions/${transactionId}`)
      return response.data  
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customerTransactions'] })
      queryClient.invalidateQueries({ queryKey: ['allTransactions'] })
      queryClient.invalidateQueries({ queryKey: ['customer'] })
      queryClient.invalidateQueries({ queryKey: ['customerStatistics'] })
      queryClient.invalidateQueries({ queryKey: ['transactionSummary'] })
    },
  })
}