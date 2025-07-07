
// ============================================
// 4. /app/api/payments/customer-portal/route.ts
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
// import { getCustomerSubscriptions } from '@/lib/dodo-payments';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: userData } = await supabase
      .from('users')
      .select('customer_id')
      .eq('id', user.id)
      .single();

    if (!userData?.customer_id) {
      return NextResponse.json({ error: 'No customer ID found' }, { status: 400 });
    }

    // Get customer subscriptions
    // const subscriptions = await getCustomerSubscriptions(user.customer_id);

    // return NextResponse.json({ subscriptions });

  } catch (error) {
    console.error('Customer portal error:', error);
    return NextResponse.json({ 
      error: 'Failed to access customer portal' 
    }, { status: 500 });
  }
}
