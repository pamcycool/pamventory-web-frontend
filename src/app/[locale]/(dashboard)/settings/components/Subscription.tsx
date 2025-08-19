"use client"
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useSubscriptionApi } from '@/hooks/use-subscription-api'
import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { format } from 'date-fns'

interface SubscriptionError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message: string;
}

const Subscription = () => {
  const { getSubscriptionStatus, initializeSubscription, verifySubscription } = useSubscriptionApi();
  const searchParams = useSearchParams();
  const router = useRouter();
  const verify = searchParams.get('verify');
  const reference = searchParams.get('reference');

  useEffect(() => {
    if (verify && reference) {
      verifySubscription.mutate(reference, {
        onSuccess: () => {
          toast.success('Subscription payment verified successfully');
          // Remove query params
          const url = new URL(window.location.href);
          url.searchParams.delete('verify');
          url.searchParams.delete('reference');
          router.replace(url.pathname);
        },
        onError: (error: SubscriptionError) => {
          toast.error(error.response?.data?.message || 'Failed to verify payment');
        }
      });
    }
  }, [verify, reference]);

  const handleSubscribe = async (interval: 'monthly' | 'yearly') => {
    try {
      const response = await initializeSubscription.mutateAsync({
        plan: 'PREMIUM',
        interval
      });
      console.log(response);
      
      // Redirect to Paystack payment page
      window.location.href = response.data.authorizationUrl;
    } catch (error: SubscriptionError) {
      toast.error(error.response?.data?.message || 'Failed to initialize subscription');
    }
  };

  const { data: subscriptionData, isLoading } = getSubscriptionStatus;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Early return if no data - access data from axios response
  if (!subscriptionData?.data?.data) {
    return <div>Error loading subscription data</div>;
  }

  const { subscriptionStatus, isInTrial, trialDaysLeft, subscription } = subscriptionData.data.data;

  // Render active subscription details
  if (subscriptionStatus === 'ACTIVE' && subscription) {
    return (
      <div className="max-w-2xl">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-green-600">
            You have an active subscription. Your next payment is due on {format(new Date(subscription.endDate), 'MMMM d, yyyy')}.
          </p>
        </div>
        <Card>
          <CardContent className="p-6">
            <h4 className="text-lg font-semibold mb-2">Active Subscription</h4>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Plan</p>
                <p className="font-medium">{subscription.plan} ({subscription.interval})</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Amount</p>
                <p className="font-medium">₦{subscription.amount.toLocaleString()}/{subscription.interval === 'monthly' ? 'month' : 'year'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Next Payment</p>
                <p className="font-medium">{format(new Date(subscription.endDate), 'MMMM d, yyyy')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render trial status
  if (isInTrial) {
    return (
      <>
        <div className="bg-[#1b7339]/10 border border-[#1b7339] rounded-lg p-4 mb-6">
          <p className="text-sm text-[#1b7339]">
            You have {trialDaysLeft} days left in your free trial.
            After the trial period, you&apos;ll need to subscribe to continue using all features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SubscriptionCard
            title="Monthly Premium"
            price={2000}
            interval="month"
            onSubscribe={() => handleSubscribe('monthly')}
            loading={initializeSubscription.isPending}
          />
          <SubscriptionCard
            title="Yearly Premium"
            price={22000}
            interval="year"
            onSubscribe={() => handleSubscribe('yearly')}
            loading={initializeSubscription.isPending}
            highlight="Save ₦2,000"
          />
        </div>
      </>
    );
  }

  // Render expired/no subscription state
  return (
    <>
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-red-600">
          Your subscription has expired. Subscribe now to continue using all features.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SubscriptionCard
          title="Monthly Premium"
          price={2000}
          interval="month"
          onSubscribe={() => handleSubscribe('monthly')}
          loading={initializeSubscription.isPending}
        />
        <SubscriptionCard
          title="Yearly Premium"
          price={22000}
          interval="year"
          onSubscribe={() => handleSubscribe('yearly')}
          loading={initializeSubscription.isPending}
          highlight="Save ₦2,000"
        />
      </div>
    </>
  );
}

interface SubscriptionCardProps {
  title: string;
  price: number;
  interval: string;
  onSubscribe: () => void;
  loading: boolean;
  highlight?: string;
}

const SubscriptionCard = ({ title, price, interval, onSubscribe, loading, highlight }: SubscriptionCardProps) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-lg font-semibold">{title}</h4>
        {highlight && (
          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
            {highlight}
          </span>
        )}
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Flexible {interval}ly billing
      </p>

      <div className="mb-6 mt-3">
        <p className="text-sm font-medium">Fee</p>
        <div className="text-2xl font-bold">
          ₦ {price.toLocaleString()}<span className="text-sm font-normal text-gray-600">/{interval}</span>
        </div>
      </div>

      <Button
        className="w-full bg-[#1b7339] hover:bg-[#1b7339]/80 cursor-pointer rounded-lg mb-6"
        onClick={onSubscribe}
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Subscribe Now'}
      </Button>

      <div>
        <p className="text-sm font-medium mb-2">Includes:</p>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Inventory Management</li>
          <li>• Sales Tracking</li>
          <li>• Smart Alerts</li>
          <li>• Multi-Language</li>
          <li>• AI-powered WhatsApp assistant</li>
        </ul>
      </div>
    </CardContent>
  </Card>
);

export default Subscription