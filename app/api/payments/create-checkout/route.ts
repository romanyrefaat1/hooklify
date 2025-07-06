// ============================================
// PHASE 4, STEP 3: API ROUTES (90 minutes)
// ============================================

// First, update your lib/dodo-payments.ts with actual product IDs:
// Replace 'prod_growth_monthly', 'prod_growth_annual', etc. with your actual IDs

// ============================================
// 1. /app/api/payments/create-checkout/route.ts
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { createSubscription } from '@/lib/dodo-payments';

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { planType, billingCycle } = await request.json();

    // Validate input
    if (!planType || !billingCycle) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (planType === 'free') {
      return NextResponse.json({ error: 'Cannot create checkout for free plan' }, { status: 400 });
    }

    // Get user details
    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create subscription with DodoPayments
    const subscription = await createSubscription({
      planType,
      billingCycle,
      userId: user.id,
      userEmail: user.email,
      customerName: user.name || user.email,
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel`,
    });

    // Store subscription info in database
    await supabase
      .from('users')
      .update({
        subscription_id: subscription.id,
        customer_id: subscription.customer_id,
        plan_type: planType,
        billing_cycle: billingCycle,
        subscription_status: 'pending',
      })
      .eq('id', user.id);

    return NextResponse.json({ 
      checkoutUrl: subscription.payment_link 
    });

  } catch (error) {
    console.error('Checkout creation error:', error);
    return NextResponse.json({ 
      error: 'Failed to create checkout session' 
    }, { status: 500 });
  }
}