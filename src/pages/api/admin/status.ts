import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ cookies }) => {
  try {
    const session = cookies.get('admin_session');
    const token = session?.value;

    if (!token) {
      return new Response(JSON.stringify({ authenticated: false, reason: 'no_session' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    const sessionSecret = import.meta.env.ADMIN_SESSION_SECRET;
    if (!sessionSecret) {
      console.error('ADMIN_SESSION_SECRET is not set');
      return new Response(JSON.stringify({ authenticated: false, reason: 'server_misconfig' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    const { verifyAdminToken } = await import('../../../lib/admin-auth');
    const verified = verifyAdminToken(token, sessionSecret);

    if (!verified) {
      return new Response(JSON.stringify({ authenticated: false, reason: 'invalid_token' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ authenticated: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('Admin status error:', err);
    return new Response(JSON.stringify({ authenticated: false, reason: 'error' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }
};
