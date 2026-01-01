import type { APIRoute } from 'astro';
import { getSupabaseAdmin } from '../../../lib/supabase';

export const prerender = false;

export const GET: APIRoute = async ({ cookies }) => {
  try {
    // Admin auth
    const session = cookies.get('admin_session');
    const token = session?.value;
    const sessionSecret = import.meta.env.ADMIN_SESSION_SECRET;
    if (!token || !sessionSecret) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const { verifyAdminToken } = await import('../../../lib/admin-auth');
    const verified = verifyAdminToken(token, sessionSecret);
    if (!verified) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const supabase = getSupabaseAdmin();
    const { data: users, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200);

    if (error) {
      console.error('Database error (admin/users):', error);
      return new Response(JSON.stringify({ error: 'Could not load users' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ success: true, users: users || [] }), { status: 200, headers: { 'Content-Type': 'application/json' } });

  } catch (err) {
    console.error('API error (admin/users):', err);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};