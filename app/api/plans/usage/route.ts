import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's current usage
    const { data: user } = await supabase
      .from('users')
      .select('plan_type, events_used_this_month, events_reset_date')
      .eq('id', session.user.id)
      .single();

    // Get plan limits
    const { data: planLimits } = await supabase
      .from('plan_limits')
      .select('max_events_per_month, max_websites')
      .eq('plan_type', user.plan_type)
      .single();

    // Get current website count
    const { count: websiteCount } = await supabase
      .from('sites')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', session.user.id);

    return NextResponse.json({
      events: {
        used: user.events_used_this_month,
        limit: planLimits.max_events_per_month,
        resetDate: user.events_reset_date,
      },
      websites: {
        used: websiteCount || 0,
        limit: planLimits.max_websites,
      },
    });

  } catch (error) {
    console.error('Get usage error:', error);
    return NextResponse.json({ 
      error: 'Failed to get usage data' 
    }, { status: 500 });
  }
}
