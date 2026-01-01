import type { APIRoute } from 'astro';
import { getSupabaseAdmin } from '../../lib/supabase';

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const supabase = getSupabaseAdmin();
    
    // Get only approved comments, ordered by date
    const { data: comments, error } = await supabase
      .from('comments')
      .select('*')
      .eq('approved', true)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Database error:', error);
      // If the comments table doesn't exist (e.g., fresh DB), return empty list instead of 500
      if ((error as any).code === 'PGRST205') {
        console.warn('Comments table missing; returning empty list for now. Create a `comments` table in your DB to enable comments.');
        return new Response(
          JSON.stringify({ success: true, comments: [] }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ error: 'Yorumlar yüklenemedi' }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify({ success: true, comments: comments || [] }),
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

export const POST: APIRoute = async ({ request }) => {
  try {
    // Get auth token from header
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Giriş yapmanız gerekiyor' }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const supabase = getSupabaseAdmin();
    
    // Verify user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Geçersiz oturum' }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Check if user's profile is approved
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('approved')
      .eq('id', user.id)
      .single();

    if (profileError) {
      // If profiles table missing, allow (fallback)
      if ((profileError as any).code !== 'PGRST205') {
        console.error('Profile lookup error:', profileError);
        return new Response(
          JSON.stringify({ error: 'Sunucu hatası' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    if (profile && profile.approved === false) {
      return new Response(
        JSON.stringify({ error: 'Hesabınız admin onayı bekliyor' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = await request.json();
    const { comment, rating } = data;

    // Validation
    if (!comment || comment.trim().length < 10) {
      return new Response(
        JSON.stringify({ error: 'Yorum en az 10 karakter olmalıdır' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Get user info
    const name = user.user_metadata?.name || user.email?.split('@')[0] || 'Kullanıcı';
    const email = user.email || 'user@example.com';
    const userId = user.id;
    
    const { data: commentData, error } = await getSupabaseAdmin()
      .from('comments')
      .insert([
        {
          user_id: userId,
          name: name.trim(),
          email: email.trim(),
          comment: comment.trim(),
          rating: rating || null,
          approved: false // Needs admin approval
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ error: 'Yorum kaydedilemedi' }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Yorumunuz gönderildi. Onaylandıktan sonra görünecek.',
        id: commentData.id
      }),
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

