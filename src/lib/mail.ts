import { adminEmail } from "@/lib/admin";

export async function sendAdminOtp(code: string) {
  const to = adminEmail();
  const subject = "AIRSTAY admin login code";
  const text = `Your AIRSTAY admin login code is ${code}.\n\nIt expires in 10 minutes. If you did not try to sign in, ignore this email.`;
  const html = `
    <div style="font-family:Segoe UI,Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;color:#071840">
      <p style="font-size:12px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#4381C7">AIRSTAY</p>
      <h1 style="font-size:22px;margin:8px 0 16px">Admin login code</h1>
      <p style="font-size:32px;font-weight:800;letter-spacing:.24em;margin:24px 0">${code}</p>
      <p style="color:#51648F;font-size:14px">This code expires in 10 minutes. If you did not try to sign in, you can ignore this email.</p>
    </div>
  `;

  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    const from = process.env.RESEND_FROM || "AIRSTAY Admin <onboarding@resend.dev>";
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [to], subject, html, text }),
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Resend failed: ${body.slice(0, 200)}`);
    }
    return { ok: true as const, via: "resend" };
  }

  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  if (smtpUser && smtpPass) {
    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: { user: smtpUser, pass: smtpPass },
    });
    await transporter.sendMail({
      from: `AIRSTAY Admin <${smtpUser}>`,
      to,
      subject,
      text,
      html,
    });
    return { ok: true as const, via: "smtp" };
  }

  const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      _subject: subject,
      _template: "box",
      _captcha: "false",
      message: text,
      login_code: code,
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Email send failed: ${body.slice(0, 200)}`);
  }
  return { ok: true as const, via: "formsubmit" };
}

export function mailConfigured() {
  return Boolean(process.env.RESEND_API_KEY || (process.env.SMTP_USER && process.env.SMTP_PASS));
}
