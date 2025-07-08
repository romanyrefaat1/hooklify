// Updated GET route to return masked API keys only
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get('siteId');

    if (!siteId) {
      return NextResponse.json({ error: 'Site ID is required' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.id;

    const { data: sites, error } = await supabase
      .from('sites')
      .select('id, name, site_url, api_key, created_at')
      .eq('user_id', userId)
      .eq('id', siteId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to fetch sites' }, { status: 500 });
    }

    const maskKey = (key) => {
      if (!key || key.length < 10) return key;
      const prefix = key.slice(0, 4);
      const suffix = key.slice(-3);
      return `${prefix}${'*'.repeat(key.length - 7)}${suffix}`;
    };

    // Format and mask the data
    const formattedSites = sites.map(site => ({
      id: site.id,
      name: site.name,
      site_url: site.site_url,
      api_key: `site_${maskKey(site.api_key)}`,
      created: new Date(site.created_at).toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: 'short', 
        year: '2-digit' 
      }),
      lastUsed: 'Never'
    }));

    return NextResponse.json(formattedSites);
  } catch (error) {
    console.error('Error fetching sites:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
