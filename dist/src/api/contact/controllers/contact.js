"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
function buildTransporter() {
    return nodemailer_1.default.createTransport({
        host: process.env.SMTP_HOST || 'smtp.hostinger.com',
        port: parseInt(process.env.SMTP_PORT || '465'),
        secure: true,
        auth: {
            user: process.env.SMTP_USER || '',
            pass: process.env.SMTP_PASS || '',
        },
    });
}
exports.default = {
    async test(ctx) {
        const SMTP_USER = process.env.SMTP_USER || '';
        const CONTACT_TO = process.env.CONTACT_TO || 'hola@novamarketing.es';
        if (!SMTP_USER || !process.env.SMTP_PASS) {
            ctx.status = 500;
            ctx.body = { error: 'SMTP_USER or SMTP_PASS env vars are not set' };
            return;
        }
        const transporter = buildTransporter();
        try {
            await transporter.verify();
        }
        catch (err) {
            ctx.status = 500;
            ctx.body = { error: 'SMTP verify failed', detail: err.message, code: err.code };
            return;
        }
        try {
            await transporter.sendMail({
                from: `"nova. test" <${SMTP_USER}>`,
                to: CONTACT_TO,
                subject: '[TEST] SMTP contact form check',
                text: 'Test OK',
            });
        }
        catch (err) {
            ctx.status = 500;
            ctx.body = { error: 'sendMail failed', detail: err.message, code: err.code };
            return;
        }
        ctx.status = 200;
        ctx.body = { ok: true, smtp_user: SMTP_USER, contact_to: CONTACT_TO };
    },
    async send(ctx) {
        const { name, email, url, phone, msg, source } = ctx.request.body;
        if (!name || !email) {
            ctx.status = 400;
            ctx.body = { error: 'Name and email are required' };
            return;
        }
        const SMTP_USER = process.env.SMTP_USER || '';
        const CONTACT_TO = process.env.CONTACT_TO || 'hola@novamarketing.es';
        const transporter = buildTransporter();
        const now = new Date().toLocaleString('en-GB', {
            timeZone: 'Europe/Madrid',
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });
        const pageSource = source || ctx.request.headers['referer'] || '-';
        const adminText = [
            'NUEVA CONSULTA - Nova Marketing',
            '================================',
            `Nombre:   ${name}`,
            `Email:    ${email}`,
            url   ? `Web:      ${url}`   : null,
            phone ? `Telefono: ${phone}` : null,
            msg   ? `Mensaje:  ${msg}`   : null,
            `Pagina:   ${pageSource}`,
            `Fecha:    ${now}`,
        ].filter(Boolean).join('\n');
        // Admin notification — plain text, no encoding issues
        try {
            await transporter.sendMail({
                from: `"nova." <${SMTP_USER}>`,
                to: CONTACT_TO,
                subject: 'Nueva consulta en Nova Marketing',
                text: adminText,
                replyTo: email,
            });
        }
        catch (err) {
            console.error('[Contact] Admin email error:', err.message);
            ctx.status = 500;
            ctx.body = { error: 'Failed to send admin notification', detail: err.message };
            return;
        }
        // User confirmation — HTML, best-effort
        const confirmationHtml = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@900&family=Inter:wght@400;500;700&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background:#f4f4f5;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
      <tr>
        <td style="background:#000000;padding:28px 40px;">
          <span style="font-family:'Montserrat',Arial Black,sans-serif;font-weight:900;font-size:28px;letter-spacing:-0.04em;color:#ffffff;line-height:1;">nova.</span>
        </td>
      </tr>
      <tr>
        <td style="background:#ffffff;padding:48px 40px;">
          <h2 style="font-family:'Montserrat',Arial Black,sans-serif;font-weight:900;font-size:26px;text-transform:uppercase;letter-spacing:-0.03em;color:#09090b;margin:0 0 20px 0;line-height:1.1;">
            &#161;Hemos recibido<br>tu consulta!
          </h2>
          <p style="font-family:'Inter',Arial,sans-serif;font-size:16px;color:#52525b;line-height:1.7;margin:0 0 32px 0;">
            Hola <strong style="color:#09090b;">${name}</strong>, gracias por contactar con nosotros.<br>
            Nos pondremos en contacto contigo en menos de <strong style="color:#09090b;">24 horas</strong>.
          </p>
          ${msg ? `<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;border-radius:6px;margin-bottom:36px;">
            <tr><td style="padding:20px 24px;">
              <p style="font-family:'Montserrat',Arial Black,sans-serif;font-weight:900;font-size:9px;text-transform:uppercase;letter-spacing:0.2em;color:#71717a;margin:0 0 8px 0;">Tu mensaje</p>
              <p style="font-family:'Inter',Arial,sans-serif;font-size:15px;color:#3f3f46;line-height:1.6;margin:0;">${msg}</p>
            </td></tr>
          </table>` : ''}
        </td>
      </tr>
      <tr>
        <td style="background:#f4f4f5;padding:20px 40px;border-top:1px solid #e4e4e7;">
          <p style="font-family:'Inter',Arial,sans-serif;font-size:12px;color:#a1a1aa;margin:0;">
            &copy; Nova Marketing &middot; <a href="mailto:hola@novamarketing.es" style="color:#a1a1aa;text-decoration:none;">hola@novamarketing.es</a>
          </p>
        </td>
      </tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
        try {
            await transporter.sendMail({
                from: `"nova." <${SMTP_USER}>`,
                to: email,
                subject: '¡Hemos recibido tu consulta! - nova.',
                html: confirmationHtml,
            });
        }
        catch (err) {
            console.error('[Contact] User confirmation email error:', err.message);
        }
        ctx.status = 200;
        ctx.body = { ok: true };
    },
};
