// app/api/payments/create-checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import DodoPayments from 'dodopayments';
import { HOOKLIFY_PLANS } from '@/lib/dodo-payments';

const client = new DodoPayments({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY!,
  environment: 'test_mode', // or 'live' - must match your API key type
});

async function ensureCustomer(email: string, name: string, reference: string) {
  try {
    return await client.customers.retrieve({ customer_id: reference });
  } catch (err: any) {
    if (err.status === 404) {
      return await client.customers.create({ email, name });
    }
    throw err;
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { planType, billingCycle } = await request.json();

    // Validate input
    if (!planType || !billingCycle || planType === 'free') {
      return NextResponse.json({ error: 'Invalid plan selection' }, { status: 400 });
    }

    // Ensure customer exists in DodoPayments
    const customer = await ensureCustomer(
      user.email!,
      user.user_metadata?.name || user.email!,
      user.id
    );

    // Get product ID from your plans config
    const plan = HOOKLIFY_PLANS[planType];
    if (!plan || !plan[billingCycle]) {
      return NextResponse.json({ error: 'Invalid plan configuration' }, { status: 400 });
    }

    const productId = plan[billingCycle].productId;

    // Set trial days based on billing cycle
    const trialDays = billingCycle === 'annual' ? 7 : 5;

    // Create subscription with DodoPayments
    const subscription = await client.subscriptions.create({
      billing: {
        city: 'Cairo',
        country: 'EG',
        state: 'Cairo',
        street: 'N/A',
        zipcode: '11435',
      },
      customer: { customer_id: customer.customer_id },
      product_id: productId,
      quantity: 1,
      payment_link: true,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
      trial_period_days: trialDays,
      metadata: {
        userId: user.id,
        planType,
        billingCycle,
      },
    });

    // Store subscription info in database
    await supabase
      .from('users')
      .update({
        subscription_id: subscription.id,
        customer_id: customer.customer_id,
        plan_type: planType,
        billing_cycle: billingCycle,
        subscription_status: 'pending',
      })
      .eq('id', user.id);

    return NextResponse.json({
      checkoutUrl: subscription.payment_link
    });

  } catch (error: any) {
    console.error('DodoPayments Error:', error);
    return NextResponse.json(
      { error: error.message || 'Subscription creation failed' },
      { status: error.status || 500 }
    );
  }
}