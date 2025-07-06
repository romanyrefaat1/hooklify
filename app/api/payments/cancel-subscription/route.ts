import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { cancelSubscription } from '@/lib/dodo-payments';

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's subscription
    const { data: user } = await supabase
      .from('users')
      .select('subscription_id, subscription_status')
      .eq('id', session.user.id)
      .single();

    if (!user?.subscription_id) {
      return NextResponse.json({ error: 'No active subscription' }, { status: 400 });
    }

    // Cancel subscription with DodoPayments
    await cancelSubscription(user.subscription_id);

    // Update user status
    await supabase
      .from('users')
      .update({
        subscription_status: 'cancelled',
      })
      .eq('id', session.user.id);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Subscription cancellation error:', error);
    return NextResponse.json({ 
      error: 'Failed to cancel subscription' 
    }, { status: 500 });
  }
}
