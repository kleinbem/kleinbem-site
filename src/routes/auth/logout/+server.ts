// Clears kleinbem-site's own session only — deliberately does NOT also end
// the visitor's SSO session at Authentik itself (auth.kleinbem.dev keeps
// its own login cookie). Same semantics as signing out of one app that
// happens to use Google/GitHub SSO: it doesn't sign you out of Google.
// POST, not GET — this changes state, so it shouldn't be triggerable by a
// plain link, prefetch, or CSRF via <img>.
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { AUTH_COOKIE_FLAGS, SESSION_COOKIE } from '$lib/server/auth';

export const prerender = false;

export const POST: RequestHandler = async ({ cookies }) => {
	cookies.delete(SESSION_COOKIE, AUTH_COOKIE_FLAGS);
	return json({ ok: true });
};
