// Clears only this site's session; the Authentik SSO session stays.
// POST so a link, prefetch or <img> CSRF can't trigger it.
import type { RequestHandler } from './$types';
import { AUTH_COOKIE_FLAGS, SESSION_COOKIE } from '#lib/server/auth.js';

export const prerender = false;

export const POST: RequestHandler = async ({ cookies }) => {
	cookies.delete(SESSION_COOKIE, AUTH_COOKIE_FLAGS);
	return Response.json({ ok: true });
};
