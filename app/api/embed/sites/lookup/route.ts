import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function getCleanApiKey(apiKey, prefix) {
  if (!apiKey) return null;
  return apiKey.startsWith(prefix) ? apiKey.substring(prefix.length) : apiKey;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const jwtToken = searchParams.get('jwt');
    const siteApiKey = searchParams.get('siteApiKey');

    let cleanSiteKey;

    if (jwtToken) {
      // Decode JWT to get site API key
      const JWT_SECRET = process.env.HOOKLIFY_JWT_SECRET!;
      const decoded = jwt.verify(jwtToken, JWT_SECRET);
      cleanSiteKey = getCleanApiKey(decoded.siteApiKey, 'site_');
    } else if (siteApiKey) {
      // Direct site API key provided
      cleanSiteKey = getCleanApiKey(siteApiKey, 'site_');
    } else {
      return NextResponse.json({ error: 'JWT token or site API key is required' }, { status: 400 });
    }

    if (!cleanSiteKey) {
      return NextResponse.json({ error: 'Invalid site API key' }, { status: 400 });
    }

    // Look up site by API key
    const { data, error } = await supabase
      .from('sites')
      .select('id, site_url, name')
      .eq('api_key', cleanSiteKey)
      .single();

    if (error) {
      console.error('Error looking up site:', error);
      return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    }

    return NextResponse.json({
      siteId: data.id,
      siteUrl: data.site_url,
      siteName: data.name
    });

  } catch (error) {
    console.error('Site lookup error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: 'Invalid JWT token' }, { status: 401 });
    }
    
    if (error.name === 'TokenExpiredError') {
      return NextResponse.json({ error: 'JWT token expired' }, { status: 401 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
