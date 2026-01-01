import type { APIRoute } from 'astro';
import { getSupabaseAdmin } from '../../../../lib/supabase';

export const prerender = false;

export const PATCH: APIRoute = async ({ params, request, cookies }) => {
  try {
    // Check admin session (signed token)
    const session = cookies.get('admin_session');
    const token = session?.value;
    const sessionSecret = import.meta.env.ADMIN_SESSION_SECRET;
    if (!token || !sessionSecret) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { verifyAdminToken } = await import('../../../../lib/admin-auth');
    const verified = verifyAdminToken(token, sessionSecret);
    if (!verified) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { id } = params;
    if (!id) {
      return new Response(
        JSON.stringify({ error: 'Comment ID required' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const data = await request.json();
    const supabase = getSupabaseAdmin();
    
    const { error } = await supabase
      .from('comments')
      .update(data)
      .eq('id', id);

    if (error) {
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ error: 'Yorum güncellenemedi' }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
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

export const DELETE: APIRoute = async ({ params, cookies }) => {
  try {
    // Check admin session (signed token)
    const session = cookies.get('admin_session');
    const token = session?.value;
    const sessionSecret = import.meta.env.ADMIN_SESSION_SECRET;
    if (!token || !sessionSecret) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { verifyAdminToken } = await import('../../../../lib/admin-auth');
    const verified = verifyAdminToken(token, sessionSecret);
    if (!verified) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { id } = params;
    if (!id) {
      return new Response(
        JSON.stringify({ error: 'Comment ID required' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ error: 'Yorum silinemedi' }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
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

