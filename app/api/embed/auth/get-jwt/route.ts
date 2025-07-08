// This is the backend API file: app/api/embed/auth/get-jwt/route.ts
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
const JWT_SECRET = process.env.HOOKLIFY_JWT_SECRET!

export async function POST(req: NextRequest) {
  const siteAPIKey   = req.headers.get('x-site-api-key')
  const widgetAPIKey = req.headers.get('x-widget-api-key')
  const { siteId, widgetId } = await req.json();

  if (!siteAPIKey || !widgetAPIKey || !siteId || !widgetId) {
    return NextResponse.json({ error: 'Missing Site or Widget: API keys or IDs.' }, { status: 400 })
  }

  const cleanSiteAPIKey   = siteAPIKey.replace(/^site_/, '')
  const cleanSiteId       = siteId.replace(/^site_/, '')
  const cleanWidgetAPIKey = widgetAPIKey.replace(/^widget_/, '')
  const cleanWidgetId     = widgetId.replace(/^widget_/, '')

  const { data: widget, error: wErr } = await supabaseAdmin
    .from('widgets')
    .select('id, site_id, api_key')
    .eq('api_key', cleanWidgetAPIKey)
    .eq('id', cleanWidgetId)
    .eq('site_id', cleanSiteId)
    .single()

  if (wErr || !widget || widget.api_key !== cleanWidgetAPIKey) {
    return NextResponse.json({ error: 'Invalid widget key' }, { status: 403 })
  }

  const { data: site, error: sErr } = await supabaseAdmin
    .from('sites')
    .select('id')
    .eq('api_key', cleanSiteAPIKey)
    .eq('id', cleanSiteId)
    .single()

  if (sErr || !site) {
    return NextResponse.json({ error: 'Invalid site key' }, { status: 403 })
  }

  const token = jwt.sign(
    { siteId: site.id, widgetId: widget.id, siteApiKey: cleanSiteAPIKey, widgetApiKey: cleanWidgetAPIKey },
    JWT_SECRET,
    { expiresIn: '5m' }
  )

  return new NextResponse(JSON.stringify({ token }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    }
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-site-api-key, x-widget-api-key',
      'Access-Control-Max-Age': '86400'
    }
  });
}
