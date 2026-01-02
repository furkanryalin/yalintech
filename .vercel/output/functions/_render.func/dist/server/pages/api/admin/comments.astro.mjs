import { g as getSupabaseAdmin } from '../../../chunks/supabase_Cpv12DNi.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const GET = async ({ cookies }) => {
  try {
    const session = cookies.get("admin_session");
    const token = session?.value;
    const sessionSecret = "supersecretsessionkey1234567890";
    if (!token || !sessionSecret) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
    const { verifyAdminToken } = await import('../../../chunks/admin-auth_C2e34xKI.mjs');
    const verified = verifyAdminToken(token, sessionSecret);
    if (!verified) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
    const supabase = getSupabaseAdmin();
    const { data: comments, error } = await supabase.from("comments").select("*").order("created_at", { ascending: false });
    if (error) {
      console.error("Database error:", error);
      if (error.code === "PGRST205") {
        console.warn("Comments table missing; returning empty list for admin view.");
        return new Response(
          JSON.stringify({ success: true, comments: [] }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }
      return new Response(
        JSON.stringify({ error: "Yorumlar yüklenemedi" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    return new Response(
      JSON.stringify({ success: true, comments: comments || [] }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("API error:", error);
    return new Response(
      JSON.stringify({ error: "Bir hata oluştu" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
