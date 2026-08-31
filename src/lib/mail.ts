import { adminEmail } from "@/lib/admin";
import type { OtpPurpose } from "@/lib/account-otp";

type Mail = { to: string; subject: string; text: string; html: string };

function otpHtml(title: string, code: string, body: string) {
  return `
    <div style="font-family:Segoe UI,Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;color:#071840">
      <p style="font-size:12px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#4381C7">AIRSTAY</p>
      <h1 style="font-size:22px;margin:8px 0 16px">${title}</h1>
      <p style="font-size:32px;font-weight:800;letter-spacing:.24em;margin:24px 0">${code}</p>
      <p style="color:#51648F;font-size:14px">${body}</p>
    </div>
  `;
}

async function sendMail({ to, subject, text, html }: Mail) {
  const agentKey = process.env.AGENTMAIL_API_KEY;
  const inbox = process.env.AGENTMAIL_INBOX || "airstay-admin@agentmail.to";
  if (agentKey) {
    const res = await fetch(`https://api.agentmail.to/v0/inboxes/${encodeURIComponent(inbox)}/messages/send`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${agentKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ to: [to], subject, text, html }),
    });
    if (!res.ok) {
      throw new Error(`AgentMail ${res.status}: ${(await res.text()).slice(0, 200)}`);
    }
    return { ok: true as const, via: "agentmail" };
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    const from = process.env.RESEND_FROM || "AIRSTAY <onboarding@resend.dev>";
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [to], subject, html, text }),
    });
    if (!res.ok) throw new Error(`Resend ${res.status}: ${(await res.text()).slice(0, 160)}`);
    return { ok: true as const, via: "resend" };
  }

  throw new Error("No outbound mail provider is configured.");
}

export async function sendAdminOtp(code: string) {
  const to = adminEmail();
  const subject = "AIRSTAY admin login code";
  const text = `Your AIRSTAY admin login code is ${code}.\n\nIt expires in 10 minutes. If you did not try to sign in, ignore this email.`;
  const html = otpHtml(
    "Admin login code",
    code,
    "This code expires in 10 minutes. If you did not try to sign in, you can ignore this email."
  );
  return sendMail({ to, subject, text, html });
}

export async function sendUserOtp(to: string, purpose: OtpPurpose, code: string) {
  const signup = purpose === "signup";
  const subject = signup ? "Confirm your AIRSTAY email" : "Reset your AIRSTAY password";
  const title = signup ? "Confirm your email" : "Password reset code";
  const body = signup
    ? "Enter this code to finish creating your AIRSTAY account. It expires in 10 minutes. If you didn’t sign up, ignore this email."
    : "Enter this code to choose a new password. It expires in 10 minutes. If you didn’t ask for a reset, ignore this email.";
  const text = `${title}: ${code}\n\n${body}`;
  const html = otpHtml(title, code, body);
  return sendMail({ to, subject, text, html });
}

export function mailConfigured() {
  return Boolean(process.env.AGENTMAIL_API_KEY || process.env.RESEND_API_KEY);
}
