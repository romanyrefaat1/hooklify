import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function getCleanApiKey(apiKey: string, prefix: string) {
  if (!apiKey) return null;
  return apiKey.startsWith(prefix) ? apiKey.substring(prefix.length) : apiKey;
}

export async function POST(request: NextRequest) {
  try {
    const { jwtToken } = await request.json();

    if (!jwtToken) {
      return NextResponse.json({ error: 'JWT token is required' }, { status: 400 });
    }

    const JWT_SECRET = process.env.HOOKLIFY_JWT_SECRET!;
    const decoded = jwt.verify(jwtToken, JWT_SECRET) as any;

    const { siteApiKey, widgetApiKey, widgetId, siteId } = decoded;

    if (!siteApiKey || !widgetApiKey || !widgetId) {
      return NextResponse.json({ error: 'Invalid JWT payload - missing required fields' }, { status: 400 });
    }

    const cleanSiteKey = getCleanApiKey(siteApiKey, 'site_');
    const cleanWidgetKey = getCleanApiKey(widgetApiKey, 'widget_');

    let finalSiteId = siteId;

    if (!finalSiteId) {
      const { data: siteData, error: siteError } = await supabase
        .from('sites')
        .select('id')
        .eq('api_key', cleanSiteKey)
        .single();

      if (siteError || !siteData) {
        return NextResponse.json({ error: 'Invalid site API key' }, { status: 401 });
      }

      finalSiteId = siteData.id;
    }

    const { data: widgetData, error: widgetError } = await supabase
      .from('widgets')
      .select('*')
      .eq('api_key', cleanWidgetKey)
      .eq('id', widgetId)
      .eq('site_id', finalSiteId)
      .single();

    if (widgetError) {
      console.error('Error fetching widget config:', widgetError);
      return NextResponse.json({ error: 'Widget not found' }, { status: 404 });
    }

    const { data: eventsData, error: eventsError } = await supabase
      .from('events')
      .select('*')
      .eq('site_id', finalSiteId)
      .order('timestamp', { ascending: false })
      .limit(15);

    if (eventsError) {
      console.error('Error fetching events:', eventsError);
      return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
    }

    return new NextResponse(JSON.stringify({
      siteId: finalSiteId,
      widgetConfig: widgetData,
      fallbackEvents: eventsData || []
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });

  } catch (error: any) {
    console.error('Initialize error:', error);

    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: 'Invalid JWT token' }, { status: 401 });
    }

    if (error.name === 'TokenExpiredError') {
      return NextResponse.json({ error: 'JWT token expired' }, { status: 401 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
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
