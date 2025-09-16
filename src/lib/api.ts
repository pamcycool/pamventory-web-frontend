import axios from 'axios';
import { toast } from 'sonner';
import { SignInData, SignUpData, AuthResponse, CreateStoreData, UpdateStoreData, StoreResponse, StoresResponse } from './validations';

export const api = axios.create({
  baseURL: 'https://api.pamventory.com',
});

// Add a request interceptor to include auth token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle subscription required error
    if (error.response?.data?.code === 'SUBSCRIPTION_REQUIRED') {
      toast.error('Please subscribe to access this feature');
      // Redirect to settings page
      if (typeof window !== 'undefined') {
        window.location.href = '/settings';
      }
      return Promise.reject(error);
    }

    // Don't show toast for auth-related errors - let components handle them
    if (!error.config?.url?.includes('/auth/')) {
      const message = error.response?.data?.message || 'An error occurred';
      toast.error(message);
    }
    
    return Promise.reject(error);
  }
);

// Auth API methods
export const authApi = {
  signIn: async (data: SignInData): Promise<AuthResponse> => {
    const response = await api.post('/api/auth/signin', data);
    return response.data;
  },

  signUp: async (data: SignUpData): Promise<AuthResponse> => {
    const response = await api.post('/api/auth/signup', data);
    return response.data;
  },

  signInWithGoogle: async (data: { name: string; email: string }): Promise<AuthResponse> => {
    const response = await api.post('/api/auth/gmail/login', data);
    return response.data;
  },

  signUpWithGoogle: async (data: { name: string; email: string }): Promise<AuthResponse> => {
    const response = await api.post('/api/auth/gmail/signup', data);
    return response.data;
  },

  getCurrentUser: async (): Promise<AuthResponse> => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },

  verifyEmail: async (data: { otp: string }): Promise<AuthResponse> => {
    const response = await api.post('/api/auth/verify-email', data);
    return response.data;
  },

  forgotPassword: async (data: { email: string }): Promise<AuthResponse> => {
    const response = await api.post('/api/auth/forgot-password', data);
    return response.data;
  },

  resetPassword: async (data: { token: string; password: string }): Promise<AuthResponse> => {
    const response = await api.post('/api/auth/reset-password', data);
    return response.data;
  },

  resendVerificationOTP: async (data: { email: string }): Promise<AuthResponse> => {
    const response = await api.post('/api/auth/resend-verification-otp', data);
    return response.data;
  },
};

// Store API methods
export const storeApi = {
  createStore: async (data: CreateStoreData): Promise<StoreResponse> => {
    const response = await api.post('/api/stores', data);
    return response.data;
  },

  getUserStores: async (): Promise<StoresResponse> => {
    const response = await api.get('/api/stores');
    return response.data;
  },

  getActiveStore: async (): Promise<StoreResponse> => {
    const response = await api.get('/api/stores/active');
    return response.data;
  },

  getStore: async (storeId: string): Promise<StoreResponse> => {
    const response = await api.get(`/api/stores/${storeId}`);
    return response.data;
  },

  updateStore: async (storeId: string, data: UpdateStoreData): Promise<StoreResponse> => {
    const response = await api.put(`/api/stores/${storeId}`, data);
    return response.data;
  },

  deleteStore: async (storeId: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/api/stores/${storeId}`);
    return response.data;
  },

  setActiveStore: async (storeId: string): Promise<{ success: boolean; message: string; data: { activeStoreId: string } }> => {
    const response = await api.put('/api/stores/set-active', { storeId });
    return response.data;
  },
};