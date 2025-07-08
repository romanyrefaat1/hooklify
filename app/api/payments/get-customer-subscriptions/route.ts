import { NextRequest, NextResponse } from 'next/server';
// import { getCustomerSubscriptions } from '@/lib/dodo-payments';

export async function POST(req: NextRequest) {
  try {
    const { customerId } = await req.json();
    if (!customerId) {
      return NextResponse.json({ error: 'Missing customerId' }, { status: 400 });
    }
    // const subscriptions = await getCustomerSubscriptions(customerId);
    return NextResponse.json(subscriptions);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to get customer subscriptions' }, { status: 500 });
  }
}
