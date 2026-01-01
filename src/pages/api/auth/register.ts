import type { APIRoute } from 'astro';
import { getSupabaseAdmin } from '../../../lib/supabase';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { name, email, password } = await request.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'email and password are required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const supabase = getSupabaseAdmin();

    // Prefer admin.createUser when available (avoids sending confirmation emails)
    let user: any = null;

    try {
      const adminClient: any = (supabase as any).auth?.admin;

      // Require admin client - do not fall back to client signUp to avoid confirmation emails
      if (!adminClient || typeof adminClient.createUser !== 'function') {
        console.error('Admin client not available for creating user');
        return new Response(JSON.stringify({ error: 'Server configuration error: admin client not available' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
      }

      const res = await adminClient.createUser({
        email,
        password,
        user_metadata: { name },
        email_confirm: true,
        email_confirmed_at: new Date().toISOString()
      });

      if (res.error) {
        console.error('Admin createUser error:', res.error);
        throw res.error;
      }

      // The admin API may return the user under different shapes. Normalize it.
      user = res.data?.user ?? res.data ?? null;
      if (!user || !user.id) {
        // log full response for debugging
        console.error('Admin createUser returned unexpected response:', res);
        return new Response(JSON.stringify({ error: 'User creation failed (invalid response from auth service)' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
      }
    } catch (e: any) {
      console.error('Error creating user via admin client:', e);

      // If email already exists, try to return a helpful message instead of a generic 500
      const isEmailExists = e?.code === 'email_exists' || e?.status === 422 || (e?.message || '').toLowerCase().includes('email_exists') || (e?.message || '').toLowerCase().includes('already been registered');
      if (isEmailExists) {
        try {
          // Check profiles table to see approval state (if available)
          const { data: existingProfile, error: pErr } = await supabase.from('profiles').select('approved').eq('email', email).single();
          if (!pErr && existingProfile) {
            if (existingProfile.approved === false) {
              return new Response(JSON.stringify({ success: true, message: 'Bu e‑posta ile zaten kayıtlısınız. Hesabınız admin onayı bekliyor.' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
            }
            return new Response(JSON.stringify({ success: true, message: 'Bu e‑posta ile zaten kayıtlı bir hesap var. Giriş yapabilirsiniz.' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
          }
        } catch (profileErr) {
          console.error('Error checking profile for existing email:', profileErr);
        }

        return new Response(JSON.stringify({ error: 'Bu e‑posta ile zaten kayıtlı bir hesap var. Lütfen giriş yapın veya şifrenizi sıfırlayın.' }), { status: 409, headers: { 'Content-Type': 'application/json' } });
      }

      return new Response(JSON.stringify({ error: 'User creation failed' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    // Upsert profile with approved=false
    try {
      const { error: pError } = await supabase
        .from('profiles')
        .upsert([{ id: user.id, full_name: name || null, email, approved: false }], { onConflict: 'id' });

      if (pError) {
        console.error('Profile upsert failed:', pError);
        // Not a hard failure for registration, but log it
      }
    } catch (e) {
      console.error('Profile upsert exception:', e);
    }

    return new Response(JSON.stringify({ success: true, message: 'Kayıt başarılı. Hesabınız admin onayı bekliyor.' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('Registration API error:', err);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};