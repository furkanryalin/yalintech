import type { APIRoute } from 'astro';
import { getSupabaseAdmin } from '../../../../lib/supabase';

export const prerender = false;

export const PATCH: APIRoute = async ({ params, request, cookies }) => {
  try {
    // Admin auth
    const session = cookies.get('admin_session');
    const token = session?.value;
    const sessionSecret = import.meta.env.ADMIN_SESSION_SECRET;
    if (!token || !sessionSecret) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const { verifyAdminToken } = await import('../../../../lib/admin-auth');
    const verified = verifyAdminToken(token, sessionSecret);
    if (!verified) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const { id } = params;
    if (!id) {
      return new Response(JSON.stringify({ error: 'User ID required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const data = await request.json();
    const { approved } = data;

    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from('profiles')
      .update({ approved })
      .eq('id', id);

    if (error) {
      console.error('Database error (admin/users/[id] PATCH):', error);
      return new Response(JSON.stringify({ error: 'Could not update user' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    // If approved and SMTP configured, send notification email via shared mailer
    if (approved) {
      try {
        const { data: profile } = await supabase.from('profiles').select('email, full_name').eq('id', id).single();
        if (profile && profile.email) {
          const { sendApprovalEmail } = await import('../../../../lib/mailer');
          try {
            await sendApprovalEmail(profile.email, profile.full_name || null);
          } catch (mailErr) {
            console.error('Failed sending approval email via mailer:', mailErr);
          }
        }
      } catch (err) {
        console.error('Failed fetching profile for approval email:', err);
      }
    }

    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });

  } catch (err) {
    console.error('API error (admin/users/[id]):', err);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};

export const DELETE: APIRoute = async ({ params, cookies }) => {
  try {
    // Admin auth
    const session = cookies.get('admin_session');
    const token = session?.value;
    const sessionSecret = import.meta.env.ADMIN_SESSION_SECRET;
    if (!token || !sessionSecret) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const { verifyAdminToken } = await import('../../../../lib/admin-auth');
    const verified = verifyAdminToken(token, sessionSecret);
    if (!verified) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const { id } = params;
    if (!id) {
      return new Response(JSON.stringify({ error: 'User ID required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Database error (admin/users/[id] DELETE):', error);
      return new Response(JSON.stringify({ error: 'Could not delete user' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });

  } catch (err) {
    console.error('API error (admin/users/[id] DELETE):', err);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};