// "Sign in": redirects straight to Authentik's hosted login. Registration,
// password reset and social login all live there.
import { env } from 'cloudflare:workers';
import type { RequestHandler } from './$types';
import {
	AUTHORIZE_URL,
	AUTH_COOKIE_FLAGS,
	PKCE_COOKIE,
	pkceChallenge,
	randomString,
	redirectUri,
	safeRedirectPath
} from '#lib/server/auth.js';

export const prerender = false;

export const GET: RequestHandler = async ({ url, cookies }) => {
	const redirectPath = safeRedirectPath(url.searchParams.get('redirect'));

	const verifier = randomString(64);
	const challenge = await pkceChallenge(verifier);
	const csrf = randomString(32);
	// ID token replay defense, checked against claims.nonce in the callback.
	// Unlike state it never comes back in a URL; we keep it only in the cookie.
	const nonce = randomString(32);
	// Carries the CSRF token and post-login path; the callback compares the
	// returned state with the copy in the cookie.
	const state = JSON.stringify({ csrf, redirectPath });
	// code_verifier travels only in this cookie, never in a URL — the
	// authorize request only gets the (one-way) challenge.
	const pkceCookieValue = JSON.stringify({ verifier, state, nonce });

	// 10 minutes: enough to log in, short enough that an unused verifier expires.
	cookies.set(PKCE_COOKIE, pkceCookieValue, { ...AUTH_COOKIE_FLAGS, maxAge: 600 });

	const authorize = new URL(AUTHORIZE_URL);
	authorize.searchParams.set('client_id', env.AUTHENTIK_CLIENT_ID);
	authorize.searchParams.set('response_type', 'code');
	authorize.searchParams.set('scope', 'openid email profile');
	authorize.searchParams.set('redirect_uri', redirectUri(env));
	authorize.searchParams.set('code_challenge', challenge);
	authorize.searchParams.set('code_challenge_method', 'S256');
	authorize.searchParams.set('state', state);
	authorize.searchParams.set('nonce', nonce);

	return new Response(null, {
		status: 302,
		headers: { Location: authorize.toString() }
	});
};
