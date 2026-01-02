import { g as getSupabaseAdmin } from '../../chunks/supabase_Cpv12DNi.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const POST = async ({ request }) => {
  try {
    const data = await request.json();
    const { name, email, message } = data;
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Tüm alanlar zorunludur" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Geçerli bir e-posta adresi giriniz" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
    const supabase = getSupabaseAdmin();
    const { data: messageData, error } = await supabase.from("contact_messages").insert([
      {
        name: name.trim(),
        email: email.trim(),
        message: message.trim()
      }
    ]).select().single();
    if (error) {
      console.error("Database error:", error);
      return new Response(
        JSON.stringify({ error: "Mesaj kaydedilemedi. Lütfen tekrar deneyin." }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
    return new Response(
      JSON.stringify({
        success: true,
        message: "Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.",
        id: messageData.id
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("API error:", error);
    return new Response(
      JSON.stringify({ error: "Bir hata oluştu. Lütfen tekrar deneyin." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
