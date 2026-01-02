import { g as getSupabaseAdmin } from '../../../chunks/supabase_Cpv12DNi.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const GET = async ({ cookies }) => {
  try {
    const session = cookies.get("admin_session");
    const token = session?.value;
    const sessionSecret = "supersecretsessionkey1234567890";
    if (!token || !sessionSecret) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
    }
    const { verifyAdminToken } = await import('../../../chunks/admin-auth_C2e34xKI.mjs');
    const verified = verifyAdminToken(token, sessionSecret);
    if (!verified) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
    }
    const supabase = getSupabaseAdmin();
    const { data: users, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(200);
    if (error) {
      console.error("Database error (admin/users):", error);
      return new Response(JSON.stringify({ error: "Could not load users" }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
    return new Response(JSON.stringify({ success: true, users: users || [] }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    console.error("API error (admin/users):", err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
