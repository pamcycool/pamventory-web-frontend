import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'

const adminApi = axios.create({
  baseURL: `${API_URL}/api/admin`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth-token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const adminApiClient = {
  // Dashboard stats
  getDashboardStats: async () => {
    const response = await adminApi.get('/stats')
    return response.data
  },

  // User management
  getAllUsers: async () => {
    const response = await adminApi.get('/users')
    return response.data
  },

  getUserDetails: async (userId: string) => {
    const response = await adminApi.get(`/users/${userId}`)
    return response.data
  },

  updateUserRole: async (userId: string, role: 'User' | 'Admin') => {
    const response = await adminApi.put(`/users/${userId}/role`, { role })
    return response.data
  },

  deleteUser: async (userId: string) => {
    const response = await adminApi.delete(`/users/${userId}`)
    return response.data
  },

  // Store management
  getAllStores: async () => {
    const response = await adminApi.get('/stores')
    return response.data
  },

  // Subscription management
  getAllSubscriptions: async () => {
    const response = await adminApi.get('/subscriptions')
    return response.data
  },
}
