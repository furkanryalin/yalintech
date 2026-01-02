export { renderers } from '../../../renderers.mjs';

const prerender = false;
const POST = async ({ request }) => {
  try {
    const { email } = await request.json();
    if (!email) return new Response(JSON.stringify({ error: "Email required" }), { status: 400 });
    const disableConfirm = "true".toString().toLowerCase() === "true";
    if (disableConfirm) {
      return new Response(JSON.stringify({ success: true, message: "Kayıt sürecimiz e‑posta doğrulaması gerektirmiyor. Lütfen hesabınızın admin onayı beklediğini unutmayın." }), { status: 200 });
    }
    const smtpHost = "smtp-relay.brevo.com";
    const smtpPort = "587";
    const smtpUser = "9f205f001@smtp-brevo.com";
    const smtpPass = "SEBVfqc3ar059I8O";
    const emailFrom = "Furkan <habnetfurkan4@gmail.com>";
    if (!smtpHost || !smtpPort || !smtpUser || !smtpPass || !emailFrom) ;
    const nodemailer = await import('nodemailer');
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort, 10),
      secure: parseInt(smtpPort, 10) === 465,
      // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    });
    const mailOptions = {
      from: emailFrom,
      to: email,
      subject: "E-posta doğrulama hatırlatması",
      text: `Merhaba,

Hesabınız için doğrulama maili gönderildi. Lütfen gelen kutunuzdaki doğrulama bağlantısını tıklayarak e-posta adresinizi onaylayın. Eğer doğrulama maili gelmediyse, spam klasörünü kontrol edin.

Teşekkürler,
Yalın Tech`,
      html: `<p>Merhaba,</p><p>Hesabınız için doğrulama maili gönderildi. Lütfen gelen kutunuzdaki doğrulama bağlantısını tıklayarak e-posta adresinizi onaylayın.</p><p>Eğer doğrulama maili gelmediyse, spam klasörünü kontrol edin veya bize ulaşın.</p><p>Teşekkürler,<br/>Yalın Tech</p>`
    };
    await transporter.sendMail(mailOptions);
    return new Response(JSON.stringify({ success: true, message: "Doğrulama hatırlatması gönderildi." }), { status: 200 });
  } catch (err) {
    console.error("Resend request error:", err);
    return new Response(JSON.stringify({ error: "Sunucu hatası" }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
