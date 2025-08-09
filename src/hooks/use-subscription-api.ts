import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

interface InitializeSubscriptionData {
  plan: 'PREMIUM';
  interval: 'monthly' | 'yearly';
}

interface SubscriptionResponse {
  status: string;
  data: {
    subscriptionStatus: 'TRIAL' | 'ACTIVE' | 'EXPIRED';
    isInTrial: boolean;
    trialDaysLeft: number;
    subscription: {
      plan: string;
      interval: 'monthly' | 'yearly';
      endDate: string;
      amount: number;
    } | null;
  };
}

export const useSubscriptionApi = () => {
  const queryClient = useQueryClient();

  const getSubscriptionStatus = useQuery<SubscriptionResponse>({
    queryKey: ['subscription-status'],
    queryFn: async () => {
      const response = await api.get('/api/subscription/status');
      return response
    },
    retry: 2, // Retry failed requests up to 2 times
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
  });

  const initializeSubscription = useMutation({
    mutationFn: async (data: InitializeSubscriptionData) => {
      const response = await api.post('/api/subscription/initialize', data);
      return response.data;
    }
  });

  const verifySubscription = useMutation({
    mutationFn: async (reference: string) => {
      const response = await api.get(`/api/subscription/verify?reference=${reference}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription-status'] });
    }
  });

  return {
    getSubscriptionStatus,
    initializeSubscription,
    verifySubscription
  };
};