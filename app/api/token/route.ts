// app/api/token/route.ts
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
const JWT_SECRET = process.env.HOOKLIFY_JWT_SECRET!

export async function POST(req: NextRequest) {
  const siteKey   = req.headers.get('x-site-api-key')
  const widgetKey = req.headers.get('x-widget-api-key')
  if (!siteKey || !widgetKey) {
    return NextResponse.json({ error: 'Missing API keys' }, { status: 400 })
  }

  // strip prefixes if any
  const cleanSite   = siteKey.replace(/^site_/, '')
  const cleanWidget = widgetKey.replace(/^widget_/, '')

  // lookup widget, join to site
  const { data: widget, error: wErr } = await supabaseAdmin
    .from('widgets')
    .select('id, site_id')
    .eq('api_key', cleanWidget)
    .single()
  if (wErr || !widget) {
    return NextResponse.json({ error: 'Invalid widget key' }, { status: 403 })
  }

  const { data: site, error: sErr } = await supabaseAdmin
    .from('sites')
    .select('id')
    .eq('api_key', cleanSite)
    .eq('id', widget.site_id)
    .single()
  if (sErr || !site) {
    return NextResponse.json({ error: 'Invalid site key' }, { status: 403 })
  }

  // sign a token with 5m TTL
  const token = jwt.sign(
    { siteId: site.id, widgetId: widget.id },
    JWT_SECRET,
    { expiresIn: '5m' }
  )

  return NextResponse.json({ token })
}
