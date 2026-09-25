import { Resend } from "resend";
import { AUTH } from "./config";

const resend = AUTH.RESEND_API_KEY ? new Resend(AUTH.RESEND_API_KEY) : null;

interface SendMagicArgs {
  to: string;
  eventName: string;
  url: string;
}

/**
 * Sends a judge magic-link email.
 * - In prod with RESEND_API_KEY set: sends real email.
 * - In dev without a key: prints the link to server console so you can click it.
 */
export async function sendJudgeMagicEmail({
  to,
  eventName,
  url,
}: SendMagicArgs): Promise<{ delivered: boolean; devUrl?: string }> {
  const subject = `Your judging access for ${eventName}`;
  const text =
    `You've been invited to judge "${eventName}" on IHI.\n\n` +
    `Click to sign in (valid for 15 minutes):\n${url}\n\n` +
    `If you didn't expect this, ignore this email.`;

  const html = `
    <div style="font-family:Inter,system-ui,sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#0A0A0A">
      <h1 style="font-size:20px;margin:0 0 12px">Judging access — ${escapeHtml(eventName)}</h1>
      <p style="color:#525252;line-height:1.6">
        You've been invited to judge on <strong>IHI</strong>. Use the button below to sign in.
        This link is valid for <strong>15 minutes</strong>.
      </p>
      <p style="margin:24px 0">
        <a href="${url}"
           style="display:inline-block;background:#C9A227;color:#0A0A0A;
                  padding:12px 20px;border-radius:8px;text-decoration:none;
                  font-weight:700;letter-spacing:.05em;text-transform:uppercase;font-size:12px">
          Enter judging dashboard
        </a>
      </p>
      <p style="color:#737373;font-size:12px;line-height:1.6">
        If the button doesn't work, paste this URL into your browser:<br/>
        <span style="word-break:break-all">${url}</span>
      </p>
    </div>
  `;

  if (!resend) {
    // Dev fallback — log and return the URL so the caller can surface it.
    console.log(
      `\n[auth/email] DEV MODE — no RESEND_API_KEY set.\n` +
        `  To:      ${to}\n` +
        `  Event:   ${eventName}\n` +
        `  Magic:   ${url}\n`
    );
    return { delivered: false, devUrl: url };
  }

  await resend.emails.send({
    from: AUTH.EMAIL_FROM,
    to,
    subject,
    text,
    html,
  });
  return { delivered: true };
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[c]!));
}