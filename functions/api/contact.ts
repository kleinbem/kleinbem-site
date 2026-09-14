interface Env {
  RESEND_API_KEY: string;
  // Optional — matches the rest of this fleet's "off by default until the
  // secret exists" pattern (see kleinbem-auth's SMTP/OAuth options).
  // Verification is skipped, not failed-closed, when unset.
  TURNSTILE_SECRET_KEY?: string;
}

interface ContactBody {
  name?: string;
  email?: string;
  message?: string;
  // Hidden honeypot field — real visitors never fill this in.
  company?: string;
  turnstileToken?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CONTACT_TO = "martin.kleinberger@kleinbem.dev";

async function verifyTurnstile(token: string, secret: string, ip: string | null): Promise<boolean> {
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, response: token, ...(ip ? { remoteip: ip } : {}) }),
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch (err) {
    console.error("Turnstile verification request failed", err);
    return false;
  }
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let body: ContactBody;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { name, email, message, company, turnstileToken } = body;

  if (company) {
    // Bot filled the honeypot — pretend success, drop it silently.
    return Response.json({ ok: true });
  }

  if (env.TURNSTILE_SECRET_KEY) {
    const ip = request.headers.get("CF-Connecting-IP");
    const ok = turnstileToken
      ? await verifyTurnstile(turnstileToken, env.TURNSTILE_SECRET_KEY, ip)
      : false;
    if (!ok) {
      return Response.json({ error: "Verification failed — please try again" }, { status: 400 });
    }
  }

  if (!name?.trim() || !message?.trim() || !EMAIL_RE.test(email ?? "")) {
    return Response.json({ error: "Missing or invalid fields" }, { status: 400 });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "kleinbem.dev contact form <contact@kleinbem.dev>",
      to: CONTACT_TO,
      reply_to: email,
      subject: `Website contact from ${name}`,
      text: `${message}\n\n— ${name} (${email})`,
    }),
  });

  if (!res.ok) {
    console.error("Resend send failed", res.status, await res.text());
    return Response.json({ error: "Failed to send message" }, { status: 502 });
  }

  return Response.json({ ok: true });
};
