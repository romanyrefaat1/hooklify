import { NextRequest, NextResponse } from 'next/server';
// import { getSubscription } from '@/lib/dodo-payments';

export async function POST(req: NextRequest) {
  try {
    const { subscriptionId } = await req.json();
    if (!subscriptionId) {
      return NextResponse.json({ error: 'Missing subscriptionId' }, { status: 400 });
    }
    // const subscription = await getSubscription(subscriptionId);
    // return NextResponse.json(subscription);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to get subscription' }, { status: 500 });
  }
}
