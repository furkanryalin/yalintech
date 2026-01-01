export async function createTransport() {
  const smtpHost = import.meta.env.SMTP_HOST;
  const smtpPort = import.meta.env.SMTP_PORT;
  const smtpUser = import.meta.env.SMTP_USER;
  const smtpPass = import.meta.env.SMTP_PASS;

  if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
    throw new Error('SMTP not configured');
  }

  const nodemailer = await import('nodemailer');
  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: parseInt(smtpPort, 10),
    secure: parseInt(smtpPort, 10) === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  return transporter;
}

export function approvalEmailHtml(fullName: string | null, siteUrl = '/login') {
  const name = fullName || '';
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Hesabınız Onaylandı</title>
  </head>
  <body style="font-family: Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; background:#f7fbff; margin:0; padding:20px;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 6px 18px rgba(12,32,61,0.08);">
            <tr style="background:linear-gradient(90deg,#0ea5e9,#2563eb); color:#fff;">
              <td style="padding:28px;text-align:center;">
                <h1 style="margin:0;font-size:22px;">EfkyTech</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:28px;color:#0f172a;">
                <h2 style="margin:0 0 8px 0;">Merhaba ${name},</h2>
                <p style="margin:0 0 16px 0;color:#475569;">Hesabınız yönetici tarafından onaylandı. Artık giriş yapabilir ve yorumlar bırakabilirsiniz.</p>
                <div style="text-align:center;margin:24px 0;">
                  <a href="${siteUrl}" style="background:#2563eb;color:#fff;padding:12px 20px;border-radius:6px;text-decoration:none;display:inline-block;font-weight:600;">Giriş Yap</a>
                </div>
                <p style="margin:0;color:#64748b;font-size:13px;">Herhangi bir sorununuz olursa bu e‑postaya cevap vererek bize ulaşabilirsiniz.</p>
              </td>
            </tr>
            <tr>
              <td style="background:#f1f5f9;padding:14px;text-align:center;color:#94a3b8;font-size:13px;">EfkyTech • <a href="/" style="color:#2563eb;text-decoration:none;">efkytech.com</a></td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function approvalEmailText(fullName: string | null, siteUrl = '/login') {
  const name = fullName || '';
  return `Merhaba ${name},\n\nHesabınız yönetici tarafından onaylandı. Giriş yapmak için: ${siteUrl}\n\nTeşekkürler,\nEfkyTech`;
}

export async function sendApprovalEmail(to: string, fullName: string | null) {
  try {
    const transporter = await createTransport();
    const emailFrom = import.meta.env.EMAIL_FROM || `EfkyTech <no-reply@${import.meta.env.PUBLIC_SUPABASE_URL?.replace(/^https?:\/\//, '') || 'example.com'}>`;
    const siteUrl = (import.meta.env.PUBLIC_SITE_URL as string) || '/login';

    const mailOptions = {
      from: emailFrom,
      to,
      subject: 'Hesabınız onaylandı',
      text: approvalEmailText(fullName, siteUrl),
      html: approvalEmailHtml(fullName, siteUrl),
    };

    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error('sendApprovalEmail error:', err);
    throw err;
  }
}
