import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { getPlanDetails } from '@/lib/dodo-payments';

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: user } = await supabase
      .from('users')
      .select(`
        plan_type,
        billing_cycle,
        subscription_status,
        subscription_start_date,
        subscription_end_date,
        events_used_this_month,
        events_reset_date
      `)
      .eq('id', session.user.id)
      .single();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get plan limits
    const { data: planLimits } = await supabase
      .from('plan_limits')
      .select('max_events_per_month, max_websites')
      .eq('plan_type', user.plan_type)
      .single();

    const planDetails = getPlanDetails(user.plan_type, user.billing_cycle);

    return NextResponse.json({
      ...user,
      ...planDetails,
      limits: planLimits,
    });

  } catch (error) {
    console.error('Get current plan error:', error);
    return NextResponse.json({ 
      error: 'Failed to get current plan' 
    }, { status: 500 });
  }
}