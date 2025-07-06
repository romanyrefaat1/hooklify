import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { parseWebhookEvent, verifyWebhookSignature, getPlanFromProductId } from '@/lib/dodo-payments';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('dodo-signature') || '';

    // Verify webhook signature (if DodoPayments supports it)
    if (!verifyWebhookSignature(body, signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = parseWebhookEvent(body);

    switch (event.type) {
      case 'subscription.created':
      case 'subscription.activated':
        await handleSubscriptionActivated(event);
        break;

      case 'subscription.cancelled':
        await handleSubscriptionCancelled(event);
        break;

      case 'subscription.expired':
        await handleSubscriptionExpired(event);
        break;

      case 'payment.failed':
        await handlePaymentFailed(event);
        break;

      case 'payment.succeeded':
        await handlePaymentSucceeded(event);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

async function handleSubscriptionActivated(event: any) {
  const { data } = event;
  const userId = data.metadata?.userId;
  
  if (!userId) {
    console.error('No userId in subscription metadata');
    return;
  }

  // Get plan details from product ID
  const planInfo = getPlanFromProductId(data.product_id);
  if (!planInfo) {
    console.error('Unknown product ID:', data.product_id);
    return;
  }

  // Update user subscription
  await supabase
    .from('users')
    .update({
      subscription_status: 'active',
      subscription_start_date: new Date().toISOString(),
      subscription_end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      plan_type: planInfo.planType,
      billing_cycle: planInfo.billingCycle,
      events_used_this_month: 0,
      events_reset_date: new Date().toISOString(),
    })
    .eq('id', userId);

  console.log(`Subscription activated for user ${userId}`);
}

async function handleSubscriptionCancelled(event: any) {
  const { data } = event;
  const userId = data.metadata?.userId;
  
  if (!userId) return;

  await supabase
    .from('users')
    .update({
      subscription_status: 'cancelled',
      plan_type: 'free',
    })
    .eq('id', userId);

  console.log(`Subscription cancelled for user ${userId}`);
}

async function handleSubscriptionExpired(event: any) {
  const { data } = event;
  const userId = data.metadata?.userId;
  
  if (!userId) return;

  await supabase
    .from('users')
    .update({
      subscription_status: 'expired',
      plan_type: 'free',
    })
    .eq('id', userId);

  console.log(`Subscription expired for user ${userId}`);
}

async function handlePaymentFailed(event: any) {
  const { data } = event;
  const userId = data.metadata?.userId;
  
  if (!userId) return;

  await supabase
    .from('users')
    .update({
      subscription_status: 'past_due',
    })
    .eq('id', userId);

  console.log(`Payment failed for user ${userId}`);
}

async function handlePaymentSucceeded(event: any) {
  const { data } = event;
  const userId = data.metadata?.userId;
  
  if (!userId) return;

  // Reset monthly usage if payment succeeded
  await supabase
    .from('users')
    .update({
      subscription_status: 'active',
      events_used_this_month: 0,
      events_reset_date: new Date().toISOString(),
    })
    .eq('id', userId);

  console.log(`Payment succeeded for user ${userId}`);
}
