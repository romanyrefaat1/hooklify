// ============================================
// PHASE 4, STEP 2: DODOPAYMENTS SETUP (CORRECTED)
// ============================================

// lib/dodo-payments.ts
import DodoPayments from 'dodopayments';

// Initialize DodoPayments client
export const dodoPayments = new DodoPayments({
  // bearerToken: process.env['DODO_PAYMENTS_API_KEY']
  bearerToken: "C9-qsQE38WwiuLUS.YMcrc0nqrUPtRkSvM88S3BfPQzGFKNyYT-f5EzjGaEfvs3Yv"
});

// Product configuration for Hooklify (separate products for each billing cycle)
export const HOOKLIFY_PLANS = {
  growth: {
    name: 'Growth Plan',
    description: '10k events/month, 5 websites',
    features: ['10,000 events per month', '5 websites', 'Email support'],
    monthly: {
      price: 2900, // $29.00 in cents
      productId: 'prod_growth_monthly', // You'll get this from DodoPayments dashboard
    },
    annual: {
      price: 29000, // $290.00 in cents (10 months price)
      productId: 'prod_growth_annual', // You'll get this from DodoPayments dashboard
    },
  },
  pro: {
    name: 'Pro Plan',
    description: '50k events/month, 25 websites',
    features: ['50,000 events per month', '25 websites', 'Priority support'],
    monthly: {
      price: 7900, // $79.00 in cents
      productId: 'prod_pro_monthly', // You'll get this from DodoPayments dashboard
    },
    annual: {
      price: 79000, // $790.00 in cents (10 months price)
      productId: 'prod_pro_annual', // You'll get this from DodoPayments dashboard
    },
  },
} as const;

// Type definitions
export type PlanType = 'free' | 'growth' | 'pro';
export type BillingCycle = 'monthly' | 'annual';

export interface CreateSubscriptionParams {
  planType: PlanType;
  billingCycle: BillingCycle;
  userId: string;
  userEmail: string;
  customerName: string;
  successUrl: string;
  cancelUrl: string;
}

export interface WebhookEvent {
  type: string;
  data: {
    id: string;
    customer_id: string;
    product_id: string;
    status: string;
    created_at: string;
    updated_at: string;
    metadata?: {
      userId?: string;
      planType?: string;
      billingCycle?: string;
    };
  };
}

// Helper function to create subscription
export async function createSubscription({
  planType,
  billingCycle,
  userId,
  userEmail,
  customerName,
  successUrl,
  cancelUrl,
}: CreateSubscriptionParams) {
  if (planType === 'free') {
    throw new Error('Cannot create subscription for free plan');
  }

  const plan = HOOKLIFY_PLANS[planType];
  const productId = plan[billingCycle].productId;

  try {
    const subscription = await dodoPayments.subscriptions.create({
      customer: {
        email: userEmail,
        name: customerName,
      },
      product_id: productId,
      payment_link: true,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId,
        planType,
        billingCycle,
      },
      billing: {
        street: 'N/A',
        city: 'Cairo',
        state: 'Cairo',
        country: 'EG',
        zipcode: '11435',
      },
    });

    return subscription;
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
}

// Helper function to get subscription details
export async function getSubscription(subscriptionId: string) {
  try {
    const subscription = await dodoPayments.subscriptions.retrieve(subscriptionId);
    return subscription;
  } catch (error) {
    console.error('Error retrieving subscription:', error);
    throw error;
  }
}

// Helper function to cancel subscription
export async function cancelSubscription(subscriptionId: string) {
  try {
    const subscription = await dodoPayments.subscriptions.cancel(subscriptionId);
    return subscription;
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
}

// Helper function to get customer subscriptions
export async function getCustomerSubscriptions(customerId: string) {
  try {
    const subscriptions = await dodoPayments.subscriptions.list({
      customer_id: customerId,
    });
    return subscriptions;
  } catch (error) {
    console.error('Error retrieving customer subscriptions:', error);
    throw error;
  }
}

// Helper function to verify webhook signature (if DodoPayments supports it)
export function verifyWebhookSignature(payload: string, signature: string): boolean {
  // Note: Check DodoPayments documentation for webhook signature verification
  // This is a placeholder - implement according to DodoPayments webhook security
  try {
    // Implement actual signature verification here
    return true;
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return false;
  }
}

// Helper function to parse webhook event
export function parseWebhookEvent(payload: string): WebhookEvent {
  try {
    const event = JSON.parse(payload);
    return event as WebhookEvent;
  } catch (error) {
    console.error('Error parsing webhook event:', error);
    throw error;
  }
}

// Helper function to get plan details
export function getPlanDetails(planType: PlanType, billingCycle: BillingCycle) {
  if (planType === 'free') {
    return {
      name: 'Free Plan',
      description: '1k events/month, 1 website',
      features: ['1,000 events per month', '1 website', 'Community support'],
      price: 0,
      priceFormatted: '$0.00',
      billingCycle: 'monthly' as BillingCycle,
      productId: null,
    };
  }

  const plan = HOOKLIFY_PLANS[planType];
  const pricing = plan[billingCycle];

  return {
    name: plan.name,
    description: plan.description,
    features: plan.features,
    price: pricing.price,
    priceFormatted: formatPrice(pricing.price),
    billingCycle,
    productId: pricing.productId,
  };
}

// Helper function to get all plan options for UI
export function getAllPlanOptions() {
  return [
    {
      planType: 'free' as PlanType,
      billingCycle: 'monthly' as BillingCycle,
      ...getPlanDetails('free', 'monthly'),
    },
    {
      planType: 'growth' as PlanType,
      billingCycle: 'monthly' as BillingCycle,
      ...getPlanDetails('growth', 'monthly'),
    },
    {
      planType: 'growth' as PlanType,
      billingCycle: 'annual' as BillingCycle,
      ...getPlanDetails('growth', 'annual'),
    },
    {
      planType: 'pro' as PlanType,
      billingCycle: 'monthly' as BillingCycle,
      ...getPlanDetails('pro', 'monthly'),
    },
    {
      planType: 'pro' as PlanType,
      billingCycle: 'annual' as BillingCycle,
      ...getPlanDetails('pro', 'annual'),
    },
  ];
}

// Helper function to format price
export function formatPrice(priceInCents: number): string {
  return `$${(priceInCents / 100).toFixed(2)}`;
}

// Helper function to calculate annual savings
export function calculateAnnualSavings(planType: PlanType): number {
  if (planType === 'free') return 0;
  
  const plan = HOOKLIFY_PLANS[planType];
  const monthlyYearly = plan.monthly.price * 12;
  const annualPrice = plan.annual.price;
  
  return monthlyYearly - annualPrice;
}

// Helper function to get savings percentage
export function getSavingsPercentage(planType: PlanType): number {
  if (planType === 'free') return 0;
  
  const savings = calculateAnnualSavings(planType);
  const plan = HOOKLIFY_PLANS[planType];
  const monthlyYearly = plan.monthly.price * 12;
  
  return Math.round((savings / monthlyYearly) * 100);
}

// Helper function to determine plan and billing cycle from product ID
export function getPlanFromProductId(productId: string): { planType: PlanType; billingCycle: BillingCycle } | null {
  for (const [planType, plan] of Object.entries(HOOKLIFY_PLANS)) {
    if (plan.monthly.productId === productId) {
      return { planType: planType as PlanType, billingCycle: 'monthly' };
    }
    if (plan.annual.productId === productId) {
      return { planType: planType as PlanType, billingCycle: 'annual' };
    }
  }
  return null;
}