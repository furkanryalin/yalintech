import { signAdminToken } from '../../../chunks/admin-auth_C2e34xKI.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const POST = async ({ request, cookies }) => {
  try {
    const data = await request.json();
    const { password } = data;
    const adminPassword = "9N2pdNAW5I'H18@;";
    const sessionSecret = "supersecretsessionkey1234567890";
    if (!adminPassword) ;
    if (!sessionSecret) ;
    if (password === adminPassword) {
      const token = signAdminToken({ role: "admin" }, sessionSecret, 60 * 60 * 24 * 30);
      cookies.set("admin_session", token, {
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
        // 30 days
        httpOnly: true,
        secure: true,
        sameSite: "strict"
      });
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }
    return new Response(
      JSON.stringify({ error: "Yanlış şifre" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Login error:", error);
    return new Response(
      JSON.stringify({ error: "Bir hata oluştu" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
const DELETE = async ({ cookies }) => {
  cookies.delete("admin_session", { path: "/" });
  return new Response(
    JSON.stringify({ success: true }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  DELETE,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
