import { NextRequest, NextResponse } from 'next/server' 
import { createClient } from '@supabase/supabase-js'
import { verifyWidgetToken } from '@/lib/jwt'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  let payload: { siteId: string; widgetId: string }
  try {
    payload = verifyWidgetToken(req)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 401 })
  }

  const { event_type, event_data, message } = await req.json()
  if (!event_type) {
    return NextResponse.json({ error: 'Missing event_type' }, { status: 400 })
  }

  const { data: canTrack } = await supabaseAdmin
    .rpc('can_track_event', { user_uuid: payload.siteId })

  if (!canTrack) {
    return NextResponse.json({
      error: 'Event limit reached for your plan',
      upgradeRequired: true
    }, { status: 403 })
  }

  const { error: insertErr } = await supabaseAdmin
    .from('events')
    .insert({
      site_id:    payload.siteId,
      widget_id:  payload.widgetId,
      event_type,
      event_data: { ...event_data, message: message ?? null },
      timestamp:  new Date().toISOString()
    })

  if (insertErr) {
    return NextResponse.json({ error: 'Failed to log event' }, { status: 500 })
  }

  await supabaseAdmin
    .from('users')
    .update({ events_used_this_month: supabaseAdmin.rpc('events_used_this_month + 1') })
    .eq('id', payload.siteId)

  supabaseAdmin
    .channel('social-proof-events')
    .send({
      type: 'broadcast',
      event: `social-proof-event-${payload.widgetId}`,
      payload: { event_type, event_data, message, site_id: payload.siteId }
    })
    .catch(() => {})

  return new NextResponse(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    }
  });
}
