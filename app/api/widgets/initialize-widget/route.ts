import { NextRequest, NextResponse } from 'next/server'
import { createClient }        from '@/lib/supabase/server'
import { verifyWidgetToken }   from '@/lib/jwt'

export async function GET(request: NextRequest) {
  // 1) Verify JWT
  let payload: { siteId: string; widgetId: string }
  try {
    payload = verifyWidgetToken(request)
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Invalid or missing token' },
      { status: 401 }
    )
  }

  // 2) Spin up your Supabase client
  const supabase = await createClient()
  if (!supabase || typeof supabase.from !== 'function') {
    console.error('Supabase client not initialized')
    return NextResponse.json(
      { error: 'Server error: Supabase client not created' },
      { status: 500 }
    )
  }

  // 3) Fetch the widget by ID *and* ensure it belongs to this site
  const { data, error } = await supabase
    .from('widgets')
    .select('*')
    .eq('id', payload.widgetId)
    .eq('site_id', payload.siteId)
    .single()

  if (error || !data) {
    console.error('Error fetching widget:', error)
    return NextResponse.json(
      { error: 'Widget not found or access denied' },
      { status: 404 }
    )
  }

  // 4) Return only the widget data
  return NextResponse.json(data)
}
