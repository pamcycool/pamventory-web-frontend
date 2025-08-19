"use client"
import { useSubscription } from '@/contexts/subscription-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface RequireSubscriptionProps {
  children: React.ReactNode;
}

export const RequireSubscription = ({ children }: RequireSubscriptionProps) => {
  const { isSubscribed, isInTrial, isLoading, subscriptionStatus } = useSubscription();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isSubscribed && !isInTrial) {
      if (subscriptionStatus === 'EXPIRED') {
        toast.error('Your subscription has expired. Please renew to continue using this feature.');
      } else {
        toast.error('Please subscribe to access this feature');
      }
      router.push('/settings');
    }
  }, [isSubscribed, isInTrial, isLoading, subscriptionStatus, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B7339]"></div>
      </div>
    );
  }

  if (!isSubscribed && !isInTrial) {
    return null;
  }

  return <>{children}</>;
};