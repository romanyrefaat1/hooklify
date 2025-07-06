// Service function to call the backend API route for creating a subscription
import { PlanType, BillingCycle } from '@/lib/dodo-payments';

interface CreateSubscriptionParams {
  planType: PlanType;
  billingCycle: BillingCycle;
  userId: string;
  userEmail: string;
  customerName: string;
  successUrl: string;
  cancelUrl: string;
}

export async function createSubscriptionService(params: CreateSubscriptionParams) {
  const response = await fetch('/api/dodopayments/create-subscription', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to create subscription');
  }
  return data;
}
