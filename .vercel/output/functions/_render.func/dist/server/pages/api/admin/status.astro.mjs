export { renderers } from '../../../renderers.mjs';

const prerender = false;
const GET = async ({ cookies }) => {
  try {
    const session = cookies.get("admin_session");
    const token = session?.value;
    if (!token) {
      return new Response(JSON.stringify({ authenticated: false, reason: "no_session" }), { status: 200, headers: { "Content-Type": "application/json" } });
    }
    const sessionSecret = "supersecretsessionkey1234567890";
    if (!sessionSecret) ;
    const { verifyAdminToken } = await import('../../../chunks/admin-auth_C2e34xKI.mjs');
    const verified = verifyAdminToken(token, sessionSecret);
    if (!verified) {
      return new Response(JSON.stringify({ authenticated: false, reason: "invalid_token" }), { status: 200, headers: { "Content-Type": "application/json" } });
    }
    return new Response(JSON.stringify({ authenticated: true }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    console.error("Admin status error:", err);
    return new Response(JSON.stringify({ authenticated: false, reason: "error" }), { status: 200, headers: { "Content-Type": "application/json" } });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
