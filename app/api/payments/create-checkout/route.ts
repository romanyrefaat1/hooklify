import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import DodoPayments from 'dodopayments';
import { HOOKLIFY_PLANS } from '@/lib/dodo-payments';
import { z } from 'zod';

const client = new DodoPayments({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY!,
  environment: process.env.NODE_ENV === 'production' ? 'live' : 'test_mode',
});

// Input validation schema
const checkoutSchema = z.object({
  planType: z.enum(['growth', 'pro']), // Add your valid plan types
  billingCycle: z.enum(['monthly', 'annual']),
  billingAddress: z.object({
    street: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    country: z.string().length(2), // ISO country code
    zipcode: z.string().min(1),
  }).optional(),
});

async function ensureCustomer(supabase: any, email: string, name: string, userId: string) {
  try {
    // First try to find customer by user ID (more reliable)
    const { data: existingUser } = await supabase
      .from('users')
      .select('customer_id')
      .eq('id', userId)
      .single();
    
    if (existingUser?.customer_id) {
      try {
        return await client.customers.retrieve({ customer_id: existingUser.customer_id });
      } catch (err: any) {
        if (err.status !== 404) throw err;
        // Customer deleted from DodoPayments, create new one
      }
    }
    
    // Create new customer
    const customer = await client.customers.create({ 
      email, 
      name,
      reference: userId // Use user ID as reference for tracking
    });
    
    // Store customer ID in database
    await supabase
      .from('users')
      .update({ customer_id: customer.customer_id })
      .eq('id', userId);
    
    return customer;
  } catch (error) {
    console.error('Customer creation error:', error);
    throw error;
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

    // Validate input
    let body = await request.json();
    console.log("body", body)
    const validatedData = checkoutSchema.parse(body);
    console.log("passed zod")
    const { planType, billingCycle, billingAddress } = validatedData;

    // Check if user already has active subscription
    const { data: userData } = await supabase
      .from('users')
      .select('subscription_status, plan_type')
      .eq('id', user.id)
      .single();

    if (userData?.subscription_status === 'active') {
      return NextResponse.json({ 
        error: 'You already have an active subscription' 
      }, { status: 400 });
    }

    // Get product ID from your plans config
    const plan = HOOKLIFY_PLANS[planType];
    if (!plan || !plan[billingCycle]) {
      return NextResponse.json({ error: 'Invalid plan configuration' }, { status: 400 });
    }

    const productId = plan[billingCycle].productId;

    // Ensure customer exists in DodoPayments
    const customer = await ensureCustomer(
      supabase,
      user.email!,
      user.user_metadata?.name || user.email!,
      user.id
    );

    // Set trial days based on billing cycle
    const trialDays = billingCycle === 'annual' ? 7 : 5;

    // Use provided billing address or default
    const billing = billingAddress || {
      city: 'Cairo',
      country: 'EG',
      state: 'Cairo',
      street: 'N/A',
      zipcode: '11435',
    };

    // Create subscription with DodoPayments
    const subscription = await client.subscriptions.create({
      billing,
      customer: { customer_id: customer.customer_id },
      product_id: productId,
      quantity: 1,
      payment_link: true,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancelled`,
      trial_period_days: trialDays,
      metadata: {
        userId: user.id,
        planType,
        billingCycle,
        userEmail: user.email, // Store email for verification
      },
    });

    // Store subscription info in database
    const { error } = await supabase
      .from('users')
      .update({
        subscription_id: subscription.id,
        customer_id: customer.customer_id,
        plan_type: planType,
        billing_cycle: billingCycle,
        subscription_status: 'pending',
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (error) {
      console.error('Database update error:', error);
      // Consider canceling the subscription if DB update fails
    }

    return NextResponse.json({
      checkoutUrl: subscription.payment_link
    });

  } catch (error: any) {
    console.error('Checkout creation error:', error);
    
    // Return appropriate error messages
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Subscription creation failed' },
      { status: 500 }
    );
  }
}
