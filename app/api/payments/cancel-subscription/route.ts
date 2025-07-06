import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { cancelSubscription } from '@/lib/dodo-payments';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's subscription
    const { data: userData } = await supabase
      .from('users')
      .select('subscription_id, subscription_status')
      .eq('id', user.id)
      .single();

    if (!userData?.subscription_id) {
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
