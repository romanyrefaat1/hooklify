import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const params = await req.json();
    const subscription = await createSubscription(params);
    return NextResponse.json(subscription);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create subscription' }, { status: 500 });
  }
}
