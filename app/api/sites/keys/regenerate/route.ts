import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'Site ID is required' }, { status: 400 });
    }
    
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = user.id;
    

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // First, verify the user owns this site
    const { data: site, error: fetchError } = await supabase
      .from('sites')
      .select('id, user_id')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (fetchError || !site) {
      return NextResponse.json({ error: 'Site not found or access denied' }, { status: 404 });
    }

    // Generate new API key
    const newApiKey = crypto.randomUUID();

    // Update the site with new API key
    const { error: updateError } = await supabase
      .from('sites')
      .update({ api_key: newApiKey })
      .eq('id', id)
      .eq('user_id', userId);

    if (updateError) {
      console.error('Supabase update error:', updateError);
      return NextResponse.json({ error: 'Failed to regenerate API key' }, { status: 500 });
    }

    return NextResponse.json({ 
      apiKey: newApiKey,
      message: 'API key regenerated successfully'
    });
  } catch (error) {
    console.error('Error regenerating API key:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}