'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { PlanType, BillingCycle } from '@/lib/dodo-payments';
import { toast } from 'sonner';

interface CheckoutButtonProps {
  planType: PlanType;
  billingCycle: BillingCycle;
  children: React.ReactNode;
  className?: string;
}

export default function CheckoutButton({ 
  planType, 
  billingCycle, 
  children, 
  className = "" 
}: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    if (planType === 'free') {
      toast.error('Free plan is automatically assigned');
      return;
    }

    setIsLoading(true);

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
        window.location.href = data.checkoutUrl;
      } else {
        toast.error(data.error || 'Failed to create checkout session');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={isLoading}
      className={`
        ${className}
        ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      {isLoading ? (
        <div className="flex items-center">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          Processing...
        </div>
      ) : (
        children
      )}
    </button>
  );
}