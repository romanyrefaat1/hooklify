import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { planType, billingCycle } = await request.json();

    // Validate upgrade path
    const { data: user } = await supabase
      .from('users')
      .select('plan_type, billing_cycle')
      .eq('id', session.user.id)
      .single();

    const planHierarchy = { free: 0, growth: 1, pro: 2 };
    const currentLevel = planHierarchy[user.plan_type];
    const newLevel = planHierarchy[planType];

    if (newLevel <= currentLevel) {
      return NextResponse.json({ 
        error: 'Cannot downgrade or same plan selected' 
      }, { status: 400 });
    }

    // For upgrades, we need to cancel current subscription and create new one
    // This is a simplified approach - in production, consider prorating
    
    return NextResponse.json({ 
      message: 'Redirect to checkout for upgrade',
      redirectToCheckout: true 
    });

  } catch (error) {
    console.error('Upgrade error:', error);
    return NextResponse.json({ 
      error: 'Failed to process upgrade' 
    }, { status: 500 });
  }
}
