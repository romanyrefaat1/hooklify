import DodoPayments from 'dodopayments';
import {
  HOOKLIFY_PLANS,
  CreateSubscriptionParams,
  PlanType,
  BillingCycle
} from './dodo-payments';

// Initialize DodoPayments client (server-side only)
export const dodoPayments = new DodoPayments({
  bearerToken: process.env['DODO_PAYMENTS_API_KEY']
});

