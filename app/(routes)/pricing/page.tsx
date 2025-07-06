'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PlanType, BillingCycle } from '@/lib/dodo-payments';
import { toast } from 'sonner';
import PricingCard from '@/components/pricing/PricingCard';
import PricingToggle from '@/components/pricing/PricingToggle';

interface CurrentPlan {
  plan_type: PlanType;
  billing_cycle: BillingCycle;
  subscription_status: string;
}

export default function PricingPage() {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [currentPlan, setCurrentPlan] = useState<CurrentPlan | null>(null);
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [isLoadingPlan, setIsLoadingPlan] = useState(true);

  // Fetch current plan
  useEffect(() => {
    fetchCurrentPlan();
  }, []);

  const fetchCurrentPlan = async () => {
    try {
      const response = await fetch('/api/plans/current');
      if (response.ok) {
        const data = await response.json();
        setCurrentPlan(data);
      }
    } catch (error) {
      console.error('Error fetching current plan:', error);
    } finally {
      setIsLoadingPlan(false);
    }
  };

  const handlePlanSelect = async (planType: PlanType, billingCycle: BillingCycle) => {
    if (planType === 'free') {
      toast.error('Free plan is automatically assigned');
      return;
    }

    const loadingKey = `${planType}-${billingCycle}`;
    setLoading(prev => ({ ...prev, [loadingKey]: true }));

    try {
      const response = await fetch('/api/payments/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planType,
          billingCycle,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to DodoPayments checkout
        window.location.href = data.checkoutUrl;
      } else {
        toast.error(data.error || 'Failed to create checkout session');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(prev => ({ ...prev, [loadingKey]: false }));
    }
  };

  const isCurrentPlan = (planType: PlanType, billingCycle: BillingCycle) => {
    return currentPlan?.plan_type === planType && 
           currentPlan?.billing_cycle === billingCycle &&
           currentPlan?.subscription_status === 'active';
  };

  const isLoading = (planType: PlanType, billingCycle: BillingCycle) => {
    const loadingKey = `${planType}-${billingCycle}`;
    return loading[loadingKey] || false;
  };

  if (isLoadingPlan) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Start with our free plan and upgrade as you grow
          </p>
          
          <PricingToggle
            billingCycle={billingCycle} 
            onChange={setBillingCycle} 
          />
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {/* Free Plan */}
          <PricingCard
            planType="free"
            billingCycle="monthly"
            isCurrentPlan={isCurrentPlan('free', 'monthly')}
            onSelect={handlePlanSelect}
            isLoading={isLoading('free', 'monthly')}
          />

          {/* Growth Plan */}
          <PricingCard
            planType="growth"
            billingCycle={billingCycle}
            isCurrentPlan={isCurrentPlan('growth', billingCycle)}
            onSelect={handlePlanSelect}
            isLoading={isLoading('growth', billingCycle)}
          />

          {/* Pro Plan */}
          <PricingCard
            planType="pro"
            billingCycle={billingCycle}
            isCurrentPlan={isCurrentPlan('pro', billingCycle)}
            onSelect={handlePlanSelect}
            isLoading={isLoading('pro', billingCycle)}
          />
        </div>

        {/* FAQ Section */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I change my plan anytime?
              </h3>
              <p className="text-gray-600">
                Yes! You can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What happens if I exceed my limits?
              </h3>
              <p className="text-gray-600">
                If you reach your plan limits, you'll be prompted to upgrade. Your existing data remains safe and accessible.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is there a free trial?
              </h3>
              <p className="text-gray-600">
                Our free plan gives you 1,000 events per month forever. No credit card required to get started.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
