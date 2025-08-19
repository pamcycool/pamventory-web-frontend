"use client"
import { createContext, useContext } from 'react';
import { useSubscriptionApi } from '@/hooks/use-subscription-api';
import { useAuth } from './auth-context';

interface SubscriptionData {
  plan: string;
  interval: 'monthly' | 'yearly';
  endDate: string;
  amount: number;
}

interface SubscriptionContextType {
  isSubscribed: boolean;
  isLoading: boolean;
  isInTrial: boolean;
  trialDaysLeft: number;
  subscriptionStatus: 'TRIAL' | 'ACTIVE' | 'EXPIRED' | null;
  subscription: SubscriptionData | null;
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  isSubscribed: false,
  isLoading: true,
  isInTrial: false,
  trialDaysLeft: 0,
  subscriptionStatus: null,
  subscription: null,
});

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const { getSubscriptionStatus } = useSubscriptionApi();

  const { data, isLoading } = getSubscriptionStatus;

  // Access data from axios response: data.data.data
  const subscriptionData = data?.data?.data;
  const isSubscribed = subscriptionData?.subscriptionStatus === 'ACTIVE';
  const isInTrial = subscriptionData?.isInTrial || false;
  const trialDaysLeft = subscriptionData?.trialDaysLeft || 0;
  const subscriptionStatus = subscriptionData?.subscriptionStatus || null;
  const subscription = subscriptionData?.subscription || null;

  return (
    <SubscriptionContext.Provider
      value={{
        isSubscribed,
        isLoading,
        isInTrial,
        trialDaysLeft,
        subscriptionStatus,
        subscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};