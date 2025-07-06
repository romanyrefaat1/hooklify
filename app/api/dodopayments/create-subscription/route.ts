import { NextRequest, NextResponse } from 'next/server';
import DodoPayments from 'dodopayments';

const dodoPayments = new DodoPayments({
  bearerToken: process.env['DODO_PAYMENTS_API_KEY']
});

export async function POST(req: NextRequest) {
  try {
    const params = await req.json();
    if (params.planType === 'free') {
      return NextResponse.json({ error: 'Cannot create subscription for free plan' }, { status: 400 });
    }
    const HOOKLIFY_PLANS = (await import('@/lib/dodo-payments')).HOOKLIFY_PLANS;
    const plan = HOOKLIFY_PLANS[params.planType];
    const productId = plan[params.billingCycle].productId;
    try {
      const subscription = await dodoPayments.subscriptions.create({
        customer: {
          email: params.userEmail,
          name: params.customerName,
        },
        product_id: productId,
        payment_link: true,
        success_url: params.successUrl,
        cancel_url: params.cancelUrl,
        metadata: {
          userId: params.userId,
          planType: params.planType,
          billingCycle: params.billingCycle,
        },
        billing: {
          street: 'N/A',
          city: 'Cairo',
          state: 'Cairo',
          country: 'EG',
          zipcode: '11435',
        },
      });
      return NextResponse.json(subscription);
    } catch (error: any) {
      return NextResponse.json({ error: error.message || 'Failed to create subscription' }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create subscription' }, { status: 500 });
  }
}
