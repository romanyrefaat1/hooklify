'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PlanType, BillingCycle } from '@/lib/dodo-payments';
import { toast } from 'sonner';
import PricingCard from '@/components/pricing/PricingCard';
import PricingToggle from '@/components/pricing/PricingToggle';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface CurrentPlan {
  plan_type: PlanType;
  billing_cycle: BillingCycle;
  subscription_status: string;
}

interface BillingAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
}

export default function PricingPage() {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [currentPlan, setCurrentPlan] = useState<CurrentPlan | null>(null);
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [isLoadingPlan, setIsLoadingPlan] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ planType: PlanType; billingCycle: BillingCycle } | null>(null);
  const [address, setAddress] = useState<BillingAddress>({
    street: '',
    city: '',
    state: '',
    country: 'US',
    zipcode: '',
  });

  useEffect(() => {
    fetchCurrentPlan();
  }, []);

  const fetchCurrentPlan = async () => {
    try {
      const res = await fetch('/api/plans/current');
      if (res.ok) {
        const data = await res.json();
        setCurrentPlan(data);
      }
    } catch (err) {
      console.error('Fetch plan error:', err);
    } finally {
      setIsLoadingPlan(false);
    }
  };

  const handlePlanSelect = (planType: PlanType, billingCycle: BillingCycle) => {
    if (planType === 'free') {
      toast.info('You are already on the Free plan.');
      return;
    }
    setSelectedPlan({ planType, billingCycle });
    setOpenDialog(true);
  };

  const submitSubscription = async () => {
    if (!selectedPlan) return;
    const loadingKey = `${selectedPlan.planType}-${selectedPlan.billingCycle}`;
    setLoading((prev) => ({ ...prev, [loadingKey]: true }));

    try {
      const res = await fetch('/api/payments/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...selectedPlan,
          billingAddress: address,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Something went wrong.');
        return;
      }

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        toast.error('Missing checkout URL.');
      }
    } catch (err) {
      console.error('Plan select error:', err);
      toast.error('Unable to process your request.');
    } finally {
      setOpenDialog(false);
      setLoading((prev) => ({ ...prev, [loadingKey]: false }));
    }
  };

  const isCurrentPlan = (planType: PlanType, billingCycle: BillingCycle) => {
    return (
      currentPlan?.plan_type === planType &&
      currentPlan?.billing_cycle === billingCycle &&
      currentPlan?.subscription_status === 'active'
    );
  };

  const isLoading = (planType: PlanType, billingCycle: BillingCycle) => {
    return loading[`${planType}-${billingCycle}`] || false;
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
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
          <p className="text-xl text-gray-600 mb-8">
            Start with our free plan and upgrade as you grow
          </p>
          <PricingToggle billingCycle={billingCycle} onChange={setBillingCycle} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          <PricingCard
            planType="free"
            billingCycle="monthly"
            isCurrentPlan={isCurrentPlan('free', 'monthly')}
            onSelect={handlePlanSelect}
            isLoading={isLoading('free', 'monthly')}
          />

          <PricingCard
            planType="growth"
            billingCycle={billingCycle}
            isCurrentPlan={isCurrentPlan('growth', billingCycle)}
            onSelect={handlePlanSelect}
            isLoading={isLoading('growth', billingCycle)}
          />

          <PricingCard
            planType="pro"
            billingCycle={billingCycle}
            isCurrentPlan={isCurrentPlan('pro', billingCycle)}
            onSelect={handlePlanSelect}
            isLoading={isLoading('pro', billingCycle)}
          />
        </div>

        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Enter Billing Address</DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <Input
                placeholder="Street"
                value={address.street}
                onChange={(e) => setAddress((prev) => ({ ...prev, street: e.target.value }))}
              />
              <Input
                placeholder="City"
                value={address.city}
                onChange={(e) => setAddress((prev) => ({ ...prev, city: e.target.value }))}
              />
              <Input
                placeholder="State"
                value={address.state}
                onChange={(e) => setAddress((prev) => ({ ...prev, state: e.target.value }))}
              />
              <Input
                placeholder="Country (2-letter code)"
                value={address.country}
                onChange={(e) => setAddress((prev) => ({ ...prev, country: e.target.value }))}
              />
              <Input
                placeholder="Zipcode"
                value={address.zipcode}
                onChange={(e) => setAddress((prev) => ({ ...prev, zipcode: e.target.value }))}
              />
            </div>

            <DialogFooter>
              <Button onClick={submitSubscription}>Continue to Checkout</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
