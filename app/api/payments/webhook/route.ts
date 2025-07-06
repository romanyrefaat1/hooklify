import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Webhook } from 'standardwebhooks';
import { getPlanFromProductId } from '@/lib/dodo-payments';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const webhook = new Webhook(process.env.DODO_PAYMENTS_WEBHOOK_SECRET!);

// Rate limiting for webhook (optional)
const recentWebhooks = new Set();

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
    
    // Simple duplicate prevention
    const webhookId = webhookHeaders["webhook-id"];
    if (recentWebhooks.has(webhookId)) {
      console.log('Duplicate webhook ignored:', webhookId);
      return NextResponse.json({ received: true });
    }
    recentWebhooks.add(webhookId);
    
    // Clean up old webhook IDs (simple cleanup)
    if (recentWebhooks.size > 1000) {
      const oldIds = Array.from(recentWebhooks).slice(0, 500);
      oldIds.forEach(id => recentWebhooks.delete(id));
    }
    
    const event = JSON.parse(rawBody);
    const { type, data } = event;

    console.log(`Received webhook event: ${type}`, { 
      customerId: data?.customer?.customer_id,
      subscriptionId: data?.subscription_id || data?.id
    });

    if (!data || !data.customer) {
      console.error('Invalid webhook data: missing customer');
      return NextResponse.json({ error: 'Invalid webhook data' }, { status: 400 });
    }

    switch (type) {
      case 'customer.created':
        await handleCustomerCreated(data);
        break;

      case 'subscription.created':
      case 'subscription.active':
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

// Improved user resolution function
async function resolveUserId(data: any): Promise<string | null> {
  const { customer, metadata } = data;
  
  // First try metadata userId (most reliable)
  if (metadata?.userId) {
    return metadata.userId;
  }
  
  // Then try customer reference (if it's a user ID)
  if (customer?.reference) {
    const { data: userData } = await supabase
      .from('users')
      .select('id')
      .eq('id', customer.reference)
      .single();
    
    if (userData) {
      return userData.id;
    }
  }
  
  // Last resort: email lookup with additional verification
  if (customer?.email && metadata?.userEmail) {
    // Only use email if it matches the metadata email
    if (customer.email === metadata.userEmail) {
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('email', customer.email)
        .single();
      
      return userData?.id || null;
    }
  }
  
  console.error('Could not resolve user ID from webhook data');
  return null;
}

async function handleCustomerCreated(data: any) {
  const { customer } = data;
  
  if (!customer.email) {
    console.error('No customer email in customer.created event');
    return;
  }

  // Update user with customer ID using reference (user ID)
  if (customer.reference) {
    const { error } = await supabase
      .from('users')
      .update({
        customer_id: customer.customer_id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', customer.reference);

    if (error) {
      console.error('Error updating customer by reference:', error);
    } else {
      console.log(`Customer created for user: ${customer.reference}`);
      return;
    }
  }

  // Fallback to email lookup
  const { error } = await supabase
    .from('users')
    .update({
      customer_id: customer.customer_id,
      updated_at: new Date().toISOString(),
    })
    .eq('email', customer.email);

  if (error) {
    console.error('Error updating customer by email:', error);
  } else {
    console.log(`Customer created for email: ${customer.email}`);
  }
}

async function handleSubscriptionActivated(data: any) {
  const userId = await resolveUserId(data);
  
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

  // Calculate subscription dates
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
      customer_id: data.customer.customer_id,
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
  const userId = await resolveUserId(data);
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
  const userId = await resolveUserId(data);
  if (!userId) return;

  const { error } = await supabase
    .from('users')
    .update({
      subscription_status: 'expired',
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
  const userId = await resolveUserId(data);
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
  const userId = await resolveUserId(data);
  if (!userId) return;

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