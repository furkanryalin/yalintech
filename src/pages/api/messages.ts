import type { APIRoute } from 'astro';
import { getSupabaseAdmin } from '../../lib/supabase';

export const prerender = false;

export const GET: APIRoute = async ({ request, cookies }) => {
  try {
    // Check admin session (signed token)
    const session = cookies.get('admin_session');
    const token = session?.value;

    // No session cookie
    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized', reason: 'no_session' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const sessionSecret = import.meta.env.ADMIN_SESSION_SECRET;
    if (!sessionSecret) {
      console.error('ADMIN_SESSION_SECRET is not set');
      return new Response(
        JSON.stringify({ error: 'Server not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verify token
    const { verifyAdminToken } = await import('../../lib/admin-auth');
    const verified = verifyAdminToken(token, sessionSecret);
    if (!verified) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized', reason: 'invalid_token' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get query parameters
    const url = new URL(request.url);
    const read = url.searchParams.get('read');
    const limit = parseInt(url.searchParams.get('limit') || '50');

    // Build query
    const supabase = getSupabaseAdmin();
    let query = supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    // Filter by read status if provided
    if (read !== null) {
      query = query.eq('read', read === 'true');
    }

    const { data: messages, error } = await query;

    if (error) {
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ error: 'Mesajlar yüklenemedi' }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify({ success: true, messages }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('API error:', error);
    return new Response(
      JSON.stringify({ error: 'Bir hata oluştu' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};

