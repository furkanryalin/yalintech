import { g as getSupabaseAdmin } from '../../chunks/supabase_Cpv12DNi.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const POST = async ({ request }) => {
  try {
    const data = await request.json();
    const { userId, name, email } = data;
    if (!userId || !email) {
      return new Response(
        JSON.stringify({ error: "userId and email are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("profiles").upsert([
      { id: userId, full_name: name || null, email, approved: false }
    ], { onConflict: "id" });
    if (error) {
      console.error("Database error (create profile):", error);
      return new Response(JSON.stringify({ error: "Profile creation failed" }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("API error (register-profile):", err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
