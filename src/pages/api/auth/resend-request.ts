import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email } = await request.json();
    if (!email) return new Response(JSON.stringify({ error: 'Email required' }), { status: 400 });

    // If signup confirmation is disabled via env, inform the user instead of sending a mail
    const disableConfirm = (import.meta.env.DISABLE_SIGNUP_CONFIRMATION || '').toString().toLowerCase() === 'true';
    if (disableConfirm) {
      return new Response(JSON.stringify({ success: true, message: 'Kayıt sürecimiz e‑posta doğrulaması gerektirmiyor. Lütfen hesabınızın admin onayı beklediğini unutmayın.' }), { status: 200 });
    }

    const smtpHost = import.meta.env.SMTP_HOST;
    const smtpPort = import.meta.env.SMTP_PORT;
    const smtpUser = import.meta.env.SMTP_USER;
    const smtpPass = import.meta.env.SMTP_PASS;
    const emailFrom = import.meta.env.EMAIL_FROM;

    if (!smtpHost || !smtpPort || !smtpUser || !smtpPass || !emailFrom) {
      return new Response(JSON.stringify({ success: true, message: 'Doğrulama e-postası tekrar gönderilemiyor. Lütfen gelen kutunuzu kontrol edin veya spam klasörünü kontrol edin.' }), { status: 200 });
    }

    const nodemailer = await import('nodemailer');
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort, 10),
      secure: parseInt(smtpPort, 10) === 465, // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    });

    const mailOptions = {
      from: emailFrom,
      to: email,
      subject: 'E-posta doğrulama hatırlatması',
      text: `Merhaba,\n\nHesabınız için doğrulama maili gönderildi. Lütfen gelen kutunuzdaki doğrulama bağlantısını tıklayarak e-posta adresinizi onaylayın. Eğer doğrulama maili gelmediyse, spam klasörünü kontrol edin.\n\nTeşekkürler,\nYalın Tech`,
      html: `<p>Merhaba,</p><p>Hesabınız için doğrulama maili gönderildi. Lütfen gelen kutunuzdaki doğrulama bağlantısını tıklayarak e-posta adresinizi onaylayın.</p><p>Eğer doğrulama maili gelmediyse, spam klasörünü kontrol edin veya bize ulaşın.</p><p>Teşekkürler,<br/>Yalın Tech</p>`
    };

    await transporter.sendMail(mailOptions);

    return new Response(JSON.stringify({ success: true, message: 'Doğrulama hatırlatması gönderildi.' }), { status: 200 });
  } catch (err) {
    console.error('Resend request error:', err);
    return new Response(JSON.stringify({ error: 'Sunucu hatası' }), { status: 500 });
  }
};