import { g as getSupabaseAdmin } from '../../../chunks/supabase_Cpv12DNi.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const DELETE = async ({ params, cookies }) => {
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
    const { id } = params;
    if (!id) {
      return new Response(
        JSON.stringify({ error: "Message ID required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (error) {
      console.error("Database error:", error);
      return new Response(
        JSON.stringify({ error: "Mesaj silinemedi" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
    return new Response(
      JSON.stringify({ success: true }),
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
const PATCH = async ({ params, request, cookies }) => {
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
    const { id } = params;
    if (!id) {
      return new Response(
        JSON.stringify({ error: "Message ID required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
    const data = await request.json();
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("contact_messages").update(data).eq("id", id);
    if (error) {
      console.error("Database error:", error);
      return new Response(
        JSON.stringify({ error: "Mesaj güncellenemedi" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
    return new Response(
      JSON.stringify({ success: true }),
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
  DELETE,
  PATCH,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
