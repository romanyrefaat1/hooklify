import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function getCleanApiKey(apiKey, prefix) {
  if (!apiKey) return null;
  return apiKey.startsWith(prefix) ? apiKey.substring(prefix.length) : apiKey;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const jwtToken = searchParams.get('jwt');
    const siteId = searchParams.get('siteId');
    const widgetId = searchParams.get('widgetId');
    const siteApiKey = searchParams.get('siteApiKey');
    const widgetApiKey = searchParams.get('widgetApiKey');

    let cleanSiteKey, cleanWidgetKey, finalSiteId, finalWidgetId;

    if (jwtToken) {
      // Decode JWT to get all required data
      const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
      const decoded = jwt.verify(jwtToken, JWT_SECRET);
      
      cleanSiteKey = getCleanApiKey(decoded.siteApiKey, 'site_');
      cleanWidgetKey = getCleanApiKey(decoded.widgetApiKey, 'widget_');
      finalSiteId = decoded.siteId;
      finalWidgetId = decoded.widgetId;
    } else {
      // Use individual parameters
      cleanSiteKey = getCleanApiKey(siteApiKey, 'site_');
      cleanWidgetKey = getCleanApiKey(widgetApiKey, 'widget_');
      finalSiteId = siteId;
      finalWidgetId = widgetId;
    }

    if (!cleanSiteKey || !cleanWidgetKey || !finalSiteId || !finalWidgetId) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Verify site API key
    const { data: siteData, error: siteError } = await supabase
      .from('sites')
      .select('id')
      .eq('api_key', cleanSiteKey)
      .eq('id', finalSiteId)
      .single();

    if (siteError || !siteData) {
      return NextResponse.json({ error: 'Invalid site API key' }, { status: 401 });
    }

    // Fetch widget config
    const { data: widgetData, error: widgetError } = await supabase
      .from('widgets')
      .select('*')
      .eq('api_key', cleanWidgetKey)
      .eq('id', finalWidgetId)
      .eq('site_id', finalSiteId)
      .single();

    if (widgetError) {
      console.error('Error fetching widget config:', widgetError);
      return NextResponse.json({ error: 'Widget not found' }, { status: 404 });
    }

    return NextResponse.json(widgetData);

  } catch (error) {
    console.error('Widget config error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: 'Invalid JWT token' }, { status: 401 });
    }
    
    if (error.name === 'TokenExpiredError') {
      return NextResponse.json({ error: 'JWT token expired' }, { status: 401 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}