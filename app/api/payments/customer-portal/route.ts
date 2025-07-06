
// ============================================
// 4. /app/api/payments/customer-portal/route.ts
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { getCustomerSubscriptions } from '@/lib/dodo-payments';

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: user } = await supabase
      .from('users')
      .select('customer_id')
      .eq('id', session.user.id)
      .single();

    if (!user?.customer_id) {
      return NextResponse.json({ error: 'No customer ID found' }, { status: 400 });
    }

    // Get customer subscriptions
    const subscriptions = await getCustomerSubscriptions(user.customer_id);

    return NextResponse.json({ subscriptions });

  } catch (error) {
    console.error('Customer portal error:', error);
    return NextResponse.json({ 
      error: 'Failed to access customer portal' 
    }, { status: 500 });
  }
}
