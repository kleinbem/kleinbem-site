// Read by AuthNav.svelte on every page load to know whether a visitor is
// signed in. Verifies kleinbem-site's own session cookie (see
// auth/callback) — never touches Authentik itself, so this stays fast and
// works even if Authentik is briefly unreachable.
import { json } from '@sveltejs/kit';
import { jwtVerify } from 'jose';
import type { RequestHandler } from './$types';
import { AUTH_COOKIE_FLAGS, SESSION_COOKIE } from '$lib/server/auth';

export const prerender = false;

const NO_STORE = { 'Cache-Control': 'no-store' };

export const GET: RequestHandler = async ({ cookies, platform }) => {
	const env = platform!.env;
	const cookie = cookies.get(SESSION_COOKIE);
	if (!cookie) return json({ user: null }, { headers: NO_STORE });

	try {
		const { payload } = await jwtVerify(cookie, new TextEncoder().encode(env.AUTH_SESSION_SECRET), {
			algorithms: ['HS256']
		});
		return json(
			{ user: { name: payload.name ?? null, email: payload.email ?? null } },
			{ headers: NO_STORE }
		);
	} catch {
		// Expired or tampered — treat as signed out and clear it so the
		// browser stops sending a cookie that will never verify again.
		cookies.delete(SESSION_COOKIE, AUTH_COOKIE_FLAGS);
		return json({ user: null }, { headers: NO_STORE });
	}
};
