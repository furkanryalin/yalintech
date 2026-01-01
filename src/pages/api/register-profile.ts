import type { APIRoute } from 'astro';
import { getSupabaseAdmin } from '../../lib/supabase';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { userId, name, email } = data;

    if (!userId || !email) {
      return new Response(
        JSON.stringify({ error: 'userId and email are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const supabase = getSupabaseAdmin();

    // Upsert profile (if exists, do nothing)
    const { error } = await supabase
      .from('profiles')
      .upsert([
        { id: userId, full_name: name || null, email: email, approved: false }
      ], { onConflict: 'id' });

    if (error) {
      console.error('Database error (create profile):', error);
      return new Response(JSON.stringify({ error: 'Profile creation failed' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    console.error('API error (register-profile):', err);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};