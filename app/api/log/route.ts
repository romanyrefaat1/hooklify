import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // server-only
);

// Rich text message type
interface RichTextSegment {
  value: string;
  style?: 'bold' | 'italic' | 'underline';
  color?: string;
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = req.headers.get('x-api-key');
    
    if (!apiKey) {
      return NextResponse.json({ error: 'Missing API key' }, { status: 400 });
    }
    
    // Remove the "site_" prefix if present
    const cleanApiKey = apiKey.startsWith('site_') ? apiKey.substring(5) : apiKey;
    
    const body: {
      event_type: string;
      event_data: any;
      message?: string | RichTextSegment[]
    } = await req.json();
    
    const { event_type, event_data, message } = body;
    
    if (!event_type) {
      return NextResponse.json({ error: 'Missing event_type' }, { status: 400 });
    }
    
    // Look up the site using the clean API key
    const { data: site, error: siteError } = await supabaseAdmin
      .from('sites')
      .select('*, user_id') // Make sure to select user_id
      .eq('api_key', cleanApiKey)
      .single();
    
    if (siteError || !site) {
      console.error('Site lookup error:', siteError);
      return NextResponse.json({ error: 'Invalid API key' }, { status: 403 });
    }

    // ============================================
    // USAGE LIMIT CHECK - Add this section
    // ============================================
    
    // Check if user can track more events
    const { data: canTrack } = await supabaseAdmin
      .rpc('can_track_event', { user_uuid: site.user_id });

    if (!canTrack) {
      return NextResponse.json({ 
        error: 'Event limit reached for your plan',
        upgradeRequired: true 
      }, { status: 403 });
    }

    // ============================================
    // END USAGE LIMIT CHECK
    // ============================================
    
    // Insert the event
    const { error: insertError, data } = await supabaseAdmin
      .from('events')
      .insert({
        site_id: site.id,
        event_type,
        event_data: {
          ...event_data,
          message: message || null // Add the message (rich text or string) to event_data
        },
        timestamp: new Date().toISOString()
      });
    
    console.log("event data:", data);
    
    if (insertError) {
      console.error('Event insert error:', insertError);
      return NextResponse.json({ error: 'Failed to log event' }, { status: 500 });
    }

    // ============================================
    // INCREMENT USAGE COUNTER - Add this section
    // ============================================
    
    // Get current usage and increment
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('events_used_this_month')
      .eq('id', site.user_id)
      .single();

    if (user) {
      await supabaseAdmin
        .from('users')
        .update({
          events_used_this_month: (user.events_used_this_month || 0) + 1
        })
        .eq('id', site.user_id);
    }

    // ============================================
    // END INCREMENT USAGE COUNTER
    // ============================================
    
    // Send broadcast message to all connected clients
    const broadcastPayload = {
      event_type,
      event_data: {
        ...event_data,
        message: message || null
      },
      message: message || null, // Also include message at top level for easy access
      site_id: site.id,
      site_url: site.site_url
    };
    
    const { error: broadcastError } = await supabaseAdmin
      .channel('social-proof-events')
      .send({
        type: 'broadcast',
        event: 'social-proof-event',
        payload: broadcastPayload
      });
    
    if (broadcastError) {
      console.error('Broadcast error:', broadcastError);
      // Don't fail the request if broadcast fails
    } else {
      console.log('Broadcast sent successfully:', broadcastPayload);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Event logged successfully',
      site_url: site.site_url
    });
    
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}