// app/api/payments/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Webhook } from 'standardwebhooks';
import { getPlanFromProductId } from '@/lib/dodo-payments';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const webhook = new Webhook(process.env.DODO_PAYMENTS_WEBHOOK_SECRET!);

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    
    const webhookHeaders = {
      "webhook-id": request.headers.get("webhook-id") || "",
      "webhook-signature": request.headers.get("webhook-signature") || "",
      "webhook-timestamp": request.headers.get("webhook-timestamp") || "",
    };

    // Verify webhook signature
    await webhook.verify(rawBody, webhookHeaders);
    
    const event = JSON.parse(rawBody);
    const { type, data } = event;

    console.log(`Received webhook event: ${type}`, data);

    if (!data || !data.customer || !data.customer.email) {
      console.error('Invalid webhook data:', data);
      return NextResponse.json({ error: 'Invalid webhook data' }, { status: 400 });
    }

    switch (type) {
      case 'customer.created':
        await handleCustomerCreated(data);
        break;

      case 'subscription.created':
      case 'subscription.active':  // This is the actual event DodoPayments sends
      case 'subscription.activated':
        await handleSubscriptionActivated(data);
        break;

      case 'subscription.cancelled':
        await handleSubscriptionCancelled(data);
        break;

      case 'subscription.expired':
        await handleSubscriptionExpired(data);
        break;

      case 'payment.failed':
        await handlePaymentFailed(data);
        break;

      case 'payment.succeeded':
        await handlePaymentSucceeded(data);
        break;

      default:
        console.log(`Unhandled event type: ${type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ 
      error: 'Webhook processing failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

async function handleCustomerCreated(data: any) {
  const { customer } = data;
  
  if (!customer.email) {
    console.error('No customer email in customer.created event');
    return;
  }

  // Update user with customer ID
  const { error } = await supabase
    .from('users')
    .update({
      customer_id: customer.customer_id,
      updated_at: new Date().toISOString(),
    })
    .eq('email', customer.email);

  if (error) {
    console.error('Error updating customer:', error);
  } else {
    console.log(`Customer created for email: ${customer.email}`);
  }
}

async function handleSubscriptionActivated(data: any) {
  const { customer, metadata } = data;
  let userId = metadata?.userId;
  
  // If no userId in metadata, try to find user by email
  if (!userId && customer?.email) {
    const { data: userData } = await supabase
      .from('users')
      .select('id')
      .eq('email', customer.email)
      .single();
    
    userId = userData?.id;
  }

  if (!userId) {
    console.error('No userId found for subscription activation');
    return;
  }

  // Get plan details from product ID
  const planInfo = getPlanFromProductId(data.product_id);
  if (!planInfo) {
    console.error('Unknown product ID:', data.product_id);
    return;
  }

  // Calculate subscription end date based on billing cycle
  const startDate = new Date();
  const endDate = new Date(startDate);
  if (planInfo.billingCycle === 'annual') {
    endDate.setFullYear(endDate.getFullYear() + 1);
  } else {
    endDate.setMonth(endDate.getMonth() + 1);
  }

  // Update user subscription
  const { error } = await supabase
    .from('users')
    .update({
      subscription_status: 'active',
      subscription_start_date: startDate.toISOString(),
      subscription_end_date: endDate.toISOString(),
      plan_type: planInfo.planType,
      billing_cycle: planInfo.billingCycle,
      subscription_id: data.subscription_id || data.id,
      customer_id: customer.customer_id,
      events_used_this_month: 0,
      events_reset_date: startDate.toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (error) {
    console.error('Error updating subscription:', error);
  } else {
    console.log(`Subscription activated for user ${userId}`);
  }
}

async function handleSubscriptionCancelled(data: any) {
  const { customer, metadata } = data;
  let userId = metadata?.userId;
  
  if (!userId && customer?.email) {
    const { data: userData } = await supabase
      .from('users')
      .select('id')
      .eq('email', customer.email)
      .single();
    
    userId = userData?.id;
  }

  if (!userId) return;

  const { error } = await supabase
    .from('users')
    .update({
      subscription_status: 'cancelled',
      plan_type: 'free',
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (error) {
    console.error('Error cancelling subscription:', error);
  } else {
    console.log(`Subscription cancelled for user ${userId}`);
  }
}

async function handleSubscriptionExpired(data: any) {
  const { customer, metadata } = data;
  let userId = metadata?.userId;
  
  if (!userId && customer?.email) {
    const { data: userData } = await supabase
      .from('users')
      .select('id')
      .eq('email', customer.email)
      .single();
    
    userId = userData?.id;
  }

  if (!userId) return;

  const { error } = await supabase
    .from('users')
    .update({
      subscription_status: 'cancelled', // Set to cancelled instead of expired
      plan_type: 'free',
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (error) {
    console.error('Error expiring subscription:', error);
  } else {
    console.log(`Subscription expired for user ${userId}`);
  }
}

async function handlePaymentFailed(data: any) {
  const { customer, metadata } = data;
  let userId = metadata?.userId;
  
  if (!userId && customer?.email) {
    const { data: userData } = await supabase
      .from('users')
      .select('id')
      .eq('email', customer.email)
      .single();
    
    userId = userData?.id;
  }

  if (!userId) return;

  const { error } = await supabase
    .from('users')
    .update({
      subscription_status: 'past_due',
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (error) {
    console.error('Error handling payment failure:', error);
  } else {
    console.log(`Payment failed for user ${userId}`);
  }
}

async function handlePaymentSucceeded(data: any) {
  const { customer, metadata } = data;
  let userId = metadata?.userId;
  
  if (!userId && customer?.email) {
    const { data: userData } = await supabase
      .from('users')
      .select('id')
      .eq('email', customer.email)
      .single();
    
    userId = userData?.id;
  }

  if (!userId) return;

  // Reset monthly usage if payment succeeded
  const { error } = await supabase
    .from('users')
    .update({
      subscription_status: 'active',
      events_used_this_month: 0,
      events_reset_date: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (error) {
    console.error('Error handling payment success:', error);
  } else {
    console.log(`Payment succeeded for user ${userId}`);
  }
}