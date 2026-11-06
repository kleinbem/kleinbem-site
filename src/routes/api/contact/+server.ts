import { env } from 'cloudflare:workers';
import type { RequestHandler } from './$types';

export const prerender = false;

// company is a hidden honeypot field: real visitors never fill it in.
const FIELD_LIMITS = {
	name: 200,
	email: 320,
	message: 10_000,
	company: 200,
	turnstileToken: 4096
} as const;
type ContactBody = Partial<Record<keyof typeof FIELD_LIMITS, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CONTACT_TO = 'martin.kleinberger@kleinbem.dev';
const UPSTREAM_TIMEOUT_MS = 10_000;

function parseBody(raw: unknown): ContactBody | null {
	if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) return null;
	const body: ContactBody = {};
	for (const [field, limit] of Object.entries(FIELD_LIMITS) as [keyof ContactBody, number][]) {
		const value = (raw as Record<string, unknown>)[field];
		if (value === undefined || value === null) continue;
		if (typeof value !== 'string' || value.length > limit) return null;
		body[field] = value;
	}
	return body;
}

async function verifyTurnstile(
	token: string,
	secret: string,
	ip: string | null
): Promise<boolean> {
	try {
		const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ secret, response: token, ...(ip ? { remoteip: ip } : {}) }),
			signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS)
		});
		if (!res.ok) return false;
		const data = (await res.json()) as { success?: boolean };
		return data.success === true;
	} catch (err) {
		console.error('Turnstile verification request failed', err);
		return false;
	}
}

// The home page asks this before showing the form. Pages reads secrets at deploy
// time: to enable it, add RESEND_API_KEY to ci.yaml's secret push, then deploy.
export const GET: RequestHandler = async () =>
	Response.json({ enabled: Boolean(env.RESEND_API_KEY) }, { headers: { 'Cache-Control': 'no-store' } });

export const POST: RequestHandler = async ({ request }) => {
	if (!env.RESEND_API_KEY) {
		return Response.json({ error: 'Contact form is not available' }, { status: 503 });
	}

	let body: ContactBody | null;
	try {
		body = parseBody(await request.json());
	} catch {
		body = null;
	}
	if (!body) {
		return Response.json({ error: 'Invalid request body' }, { status: 400 });
	}

	const { name, email, message, company, turnstileToken } = body;

	if (company) {
		// Bot filled the honeypot — pretend success, drop it silently.
		return Response.json({ ok: true });
	}

	if (env.TURNSTILE_SECRET_KEY) {
		const ip = request.headers.get('CF-Connecting-IP');
		const ok = turnstileToken
			? await verifyTurnstile(turnstileToken, env.TURNSTILE_SECRET_KEY, ip)
			: false;
		if (!ok) {
			return Response.json({ error: 'Verification failed — please try again' }, { status: 400 });
		}
	}

	if (!name?.trim() || !message?.trim() || !EMAIL_RE.test(email ?? '')) {
		return Response.json({ error: 'Missing or invalid fields' }, { status: 400 });
	}

	let res: Response;
	try {
		res = await fetch('https://api.resend.com/emails', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${env.RESEND_API_KEY}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				from: 'kleinbem.dev contact form <contact@kleinbem.dev>',
				to: CONTACT_TO,
				reply_to: email,
				subject: `Website contact from ${name}`,
				text: `${message}\n\n— ${name} (${email})`
			}),
			signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS)
		});
	} catch (err) {
		console.error('Resend request failed', err);
		return Response.json({ error: 'Failed to send message' }, { status: 502 });
	}

	if (!res.ok) {
		console.error('Resend send failed', res.status, await res.text());
		return Response.json({ error: 'Failed to send message' }, { status: 502 });
	}

	return Response.json({ ok: true });
};
