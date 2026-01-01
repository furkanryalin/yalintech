import type { APIRoute } from 'astro';
import { signAdminToken } from '../../../lib/admin-auth';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const data = await request.json();
    const { password } = data;

    // Require admin password and session secret to be set in env
    const adminPassword = import.meta.env.ADMIN_PASSWORD;
    const sessionSecret = import.meta.env.ADMIN_SESSION_SECRET;

    if (!adminPassword) {
      console.error('ADMIN_PASSWORD is not set');
      return new Response(
        JSON.stringify({ error: 'Server not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!sessionSecret) {
      console.error('ADMIN_SESSION_SECRET is not set');
      return new Response(
        JSON.stringify({ error: 'Server not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Simple password check
    if (password === adminPassword) {
      // Create signed token and set as httpOnly cookie
      const token = signAdminToken({ role: 'admin' }, sessionSecret, 60 * 60 * 24 * 30);

      cookies.set('admin_session', token, {
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        httpOnly: true,
        secure: import.meta.env.PROD,
        sameSite: 'strict'
      });

      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Yanlış şifre' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Login error:', error);
    return new Response(
      JSON.stringify({ error: 'Bir hata oluştu' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const DELETE: APIRoute = async ({ cookies }) => {
  cookies.delete('admin_session', { path: '/' });

  return new Response(
    JSON.stringify({ success: true }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
};

