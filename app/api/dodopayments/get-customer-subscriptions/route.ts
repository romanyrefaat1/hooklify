import { NextRequest, NextResponse } from 'next/server';
import DodoPayments from 'dodopayments';

const dodoPayments = new DodoPayments({
  bearerToken: process.env['DODO_PAYMENTS_API_KEY']
});

export async function POST(req: NextRequest) {
  try {
    const { customerId } = await req.json();
    const subscriptions = await dodoPayments.subscriptions.list({
      customer_id: customerId,
    });
    return NextResponse.json(subscriptions);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to get customer subscriptions' }, { status: 500 });
  }
}
