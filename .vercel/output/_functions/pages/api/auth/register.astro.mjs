import { g as getSupabaseAdmin } from '../../../chunks/supabase_Cpv12DNi.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const POST = async ({ request }) => {
  try {
    const { name, email, password } = await request.json();
    if (!email || !password) {
      return new Response(JSON.stringify({ error: "email and password are required" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    const supabase = getSupabaseAdmin();
    let user = null;
    try {
      const adminClient = supabase.auth?.admin;
      if (!adminClient || typeof adminClient.createUser !== "function") {
        console.error("Admin client not available for creating user");
        return new Response(JSON.stringify({ error: "Server configuration error: admin client not available" }), { status: 500, headers: { "Content-Type": "application/json" } });
      }
      const res = await adminClient.createUser({
        email,
        password,
        user_metadata: { name },
        email_confirm: true,
        email_confirmed_at: (/* @__PURE__ */ new Date()).toISOString()
      });
      if (res.error) {
        console.error("Admin createUser error:", res.error);
        throw res.error;
      }
      user = res.data?.user ?? res.data ?? null;
      if (!user || !user.id) {
        console.error("Admin createUser returned unexpected response:", res);
        return new Response(JSON.stringify({ error: "User creation failed (invalid response from auth service)" }), { status: 500, headers: { "Content-Type": "application/json" } });
      }
    } catch (e) {
      console.error("Error creating user via admin client:", e);
      const isEmailExists = e?.code === "email_exists" || e?.status === 422 || (e?.message || "").toLowerCase().includes("email_exists") || (e?.message || "").toLowerCase().includes("already been registered");
      if (isEmailExists) {
        try {
          const { data: existingProfile, error: pErr } = await supabase.from("profiles").select("approved").eq("email", email).single();
          if (!pErr && existingProfile) {
            if (existingProfile.approved === false) {
              return new Response(JSON.stringify({ success: true, message: "Bu e‑posta ile zaten kayıtlısınız. Hesabınız admin onayı bekliyor." }), { status: 200, headers: { "Content-Type": "application/json" } });
            }
            return new Response(JSON.stringify({ success: true, message: "Bu e‑posta ile zaten kayıtlı bir hesap var. Giriş yapabilirsiniz." }), { status: 200, headers: { "Content-Type": "application/json" } });
          }
        } catch (profileErr) {
          console.error("Error checking profile for existing email:", profileErr);
        }
        return new Response(JSON.stringify({ error: "Bu e‑posta ile zaten kayıtlı bir hesap var. Lütfen giriş yapın veya şifrenizi sıfırlayın." }), { status: 409, headers: { "Content-Type": "application/json" } });
      }
      return new Response(JSON.stringify({ error: "User creation failed" }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
    try {
      const { error: pError } = await supabase.from("profiles").upsert([{ id: user.id, full_name: name || null, email, approved: false }], { onConflict: "id" });
      if (pError) {
        console.error("Profile upsert failed:", pError);
      }
    } catch (e) {
      console.error("Profile upsert exception:", e);
    }
    return new Response(JSON.stringify({ success: true, message: "Kayıt başarılı. Hesabınız admin onayı bekliyor." }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    console.error("Registration API error:", err);
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
