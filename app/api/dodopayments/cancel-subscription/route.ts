import { NextRequest, NextResponse } from 'next/server';
import DodoPayments from 'dodopayments';

const dodoPayments = new DodoPayments({
  bearerToken: process.env['DODO_PAYMENTS_API_KEY']
});

export async function POST(req: NextRequest) {
  try {
    const { subscriptionId } = await req.json();
    try {
      const subscription = await dodoPayments.subscriptions.cancel(subscriptionId);
      return NextResponse.json(subscription);
    } catch (error: any) {
      return NextResponse.json({ error: error.message || 'Failed to cancel subscription' }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to cancel subscription' }, { status: 500 });
  }
}
