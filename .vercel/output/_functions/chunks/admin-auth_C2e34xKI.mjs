import { createHmac } from 'crypto';

function base64url(input) {
  return input.toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
function signAdminToken(payload, secret, expiresInSec = 60 * 60 * 24 * 30) {
  const exp = Math.floor(Date.now() / 1e3) + expiresInSec;
  const data = { ...payload, exp };
  const header = base64url(Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })));
  const body = base64url(Buffer.from(JSON.stringify(data)));
  const signature = base64url(createHmac("sha256", secret).update(header + "." + body).digest());
  return `${header}.${body}.${signature}`;
}
function verifyAdminToken(token, secret) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [header, body, sig] = parts;
    const expected = base64url(createHmac("sha256", secret).update(header + "." + body).digest());
    if (!sig || sig !== expected) return null;
    const payload = JSON.parse(Buffer.from(body, "base64").toString("utf8"));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1e3)) return null;
    return payload;
  } catch (err) {
    return null;
  }
}

export { signAdminToken, verifyAdminToken };
