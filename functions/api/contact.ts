interface Env {
  RESEND_API_KEY: string;
}

interface ContactBody {
  name?: string;
  email?: string;
  message?: string;
  // Hidden honeypot field — real visitors never fill this in.
  company?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CONTACT_TO = "martin.kleinberger@kleinbem.dev";

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let body: ContactBody;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { name, email, message, company } = body;

  if (company) {
    // Bot filled the honeypot — pretend success, drop it silently.
    return Response.json({ ok: true });
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
