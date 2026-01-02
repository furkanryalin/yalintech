import { g as getSupabaseAdmin } from '../../../../chunks/supabase_Cpv12DNi.mjs';
export { renderers } from '../../../../renderers.mjs';

const prerender = false;
const PATCH = async ({ params, request, cookies }) => {
  try {
    const session = cookies.get("admin_session");
    const token = session?.value;
    const sessionSecret = "supersecretsessionkey1234567890";
    if (!token || !sessionSecret) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
    }
    const { verifyAdminToken } = await import('../../../../chunks/admin-auth_C2e34xKI.mjs');
    const verified = verifyAdminToken(token, sessionSecret);
    if (!verified) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
    }
    const { id } = params;
    if (!id) {
      return new Response(JSON.stringify({ error: "User ID required" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    const data = await request.json();
    const { approved } = data;
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("profiles").update({ approved }).eq("id", id);
    if (error) {
      console.error("Database error (admin/users/[id] PATCH):", error);
      return new Response(JSON.stringify({ error: "Could not update user" }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
    if (approved) {
      try {
        const { data: profile } = await supabase.from("profiles").select("email, full_name").eq("id", id).single();
        if (profile && profile.email) {
          const { sendApprovalEmail } = await import('../../../../chunks/mailer_DlUEOaMH.mjs');
          try {
            await sendApprovalEmail(profile.email, profile.full_name || null);
          } catch (mailErr) {
            console.error("Failed sending approval email via mailer:", mailErr);
          }
        }
      } catch (err) {
        console.error("Failed fetching profile for approval email:", err);
      }
    }
    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    console.error("API error (admin/users/[id]):", err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
};
const DELETE = async ({ params, cookies }) => {
  try {
    const session = cookies.get("admin_session");
    const token = session?.value;
    const sessionSecret = "supersecretsessionkey1234567890";
    if (!token || !sessionSecret) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
    }
    const { verifyAdminToken } = await import('../../../../chunks/admin-auth_C2e34xKI.mjs');
    const verified = verifyAdminToken(token, sessionSecret);
    if (!verified) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
    }
    const { id } = params;
    if (!id) {
      return new Response(JSON.stringify({ error: "User ID required" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("profiles").delete().eq("id", id);
    if (error) {
      console.error("Database error (admin/users/[id] DELETE):", error);
      return new Response(JSON.stringify({ error: "Could not delete user" }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    console.error("API error (admin/users/[id] DELETE):", err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500, headers: { "Content-Type": "application/json" } });
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
