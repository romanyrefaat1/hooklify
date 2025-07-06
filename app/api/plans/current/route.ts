import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { getPlanDetails } from '@/lib/dodo-payments';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: userData } = await supabase
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
      .eq('id', user.id)
      .single();

    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get plan limits
    const { data: planLimits } = await supabase
      .from('plan_limits')
      .select('max_events_per_month, max_websites')
      .eq('plan_type', user.plan_type)
      .single();

    const planDetails = getPlanDetails(userData.plan_type, userData.billing_cycle);

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