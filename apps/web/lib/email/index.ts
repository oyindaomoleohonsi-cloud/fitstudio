export interface EmailPayload { to: string; subject: string; html: string; text?: string }
export interface EmailProvider { name: string; send(p: EmailPayload): Promise<{ id: string }> }

// Dev default: Resend (3k/mo free). Swap via env.
export class ResendProvider implements EmailProvider {
  name = "resend";
  async send(p: EmailPayload) {
    if (!process.env.RESEND_API_KEY) return { id: "mock-resend-no-key" };
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: "FitStudio <hello@fitstudio.ai>", to: p.to, subject: p.subject, html: p.html }),
    });
    const j = await res.json();
    return { id: j.id ?? "resend-unknown" };
  }
}

// Prod bursty: ZeptoMail credits. Scale: SES à-la-carte. Same interface.
export class ZeptoMailProvider implements EmailProvider {
  name = "zeptomail";
  async send(_p: EmailPayload) { return { id: "mock-zeptomail" }; }
}

export function getEmailProvider(): EmailProvider {
  if (process.env.ZEPTOMAIL_API_KEY) return new ZeptoMailProvider();
  return new ResendProvider();
}
