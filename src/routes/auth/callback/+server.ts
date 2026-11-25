// Authentik redirects here after sign-in. Exchanges the code server-side, verifies
// the ID token and mints our own 30-day session cookie: the ID token itself
// expires within minutes.
import { SignJWT, jwtVerify } from 'jose';
import { env } from 'cloudflare:workers';
import type { RequestHandler } from './$types';
import {
	AUTH_COOKIE_FLAGS,
	ISSUER,
	PKCE_COOKIE,
	SESSION_COOKIE,
	TOKEN_URL,
	redirectUri,
	safeRedirectPath,
	siteOrigin
} from '#lib/server/auth.js';

export const prerender = false;

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

export const GET: RequestHandler = async ({ url, cookies }) => {
	function errorRedirect(reason: string): Response {
		cookies.delete(PKCE_COOKIE, AUTH_COOKIE_FLAGS);
		const dest = new URL('/login-error', siteOrigin(env));
		dest.searchParams.set('reason', reason);
		return new Response(null, { status: 302, headers: { Location: dest.toString() } });
	}

	const code = url.searchParams.get('code');
	const incomingState = url.searchParams.get('state');
	if (!code || !incomingState) return errorRedirect('missing_code_or_state');

	const pkceCookie = cookies.get(PKCE_COOKIE);
	if (!pkceCookie) return errorRedirect('expired_or_missing_pkce_cookie');

	let verifier: string;
	let expectedNonce: string;
	let redirectPath = '/';
	try {
		const {
			verifier: v,
			state: expectedState,
			nonce
		} = JSON.parse(pkceCookie) as { verifier: string; state: string; nonce: string };
		if (expectedState !== incomingState) return errorRedirect('state_mismatch');
		verifier = v;
		expectedNonce = nonce;
		redirectPath = safeRedirectPath(
			(JSON.parse(expectedState) as { redirectPath: string }).redirectPath
		);
	} catch {
		return errorRedirect('malformed_pkce_cookie');
	}

	const tokenRes = await fetch(TOKEN_URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams({
			grant_type: 'authorization_code',
			code,
			redirect_uri: redirectUri(env),
			client_id: env.AUTHENTIK_CLIENT_ID,
			client_secret: env.AUTHENTIK_CLIENT_SECRET,
			code_verifier: verifier
		})
	});
	if (!tokenRes.ok) {
		console.error('Authentik token exchange failed', tokenRes.status, await tokenRes.text());
		return errorRedirect('token_exchange_failed');
	}
	const tokens = (await tokenRes.json()) as { id_token?: string };
	if (!tokens.id_token) return errorRedirect('no_id_token_returned');

	// Authentik signs this provider's ID tokens HS256 with the client_secret.
	// The algorithm is pinned so a forged token can't pick its own (e.g. "none").
	let claims: {
		sub: string;
		email?: string;
		name?: string;
		preferred_username?: string;
		nonce?: string;
	};
	try {
		const { payload } = await jwtVerify(
			tokens.id_token,
			new TextEncoder().encode(env.AUTHENTIK_CLIENT_SECRET),
			{ issuer: ISSUER, audience: env.AUTHENTIK_CLIENT_ID, algorithms: ['HS256'] }
		);
		claims = payload as typeof claims;
	} catch (err) {
		console.error('ID token verification failed', err);
		return errorRedirect('id_token_invalid');
	}
	if (claims.nonce !== expectedNonce) return errorRedirect('nonce_mismatch');

	const sessionJwt = await new SignJWT({
		sub: claims.sub,
		email: claims.email ?? null,
		name: claims.name ?? claims.preferred_username ?? null
	})
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
		.sign(new TextEncoder().encode(env.AUTH_SESSION_SECRET));

	// SvelteKit adds both queued cookie writes as separate Set-Cookie headers,
	// even on a hand-built Response.
	cookies.delete(PKCE_COOKIE, AUTH_COOKIE_FLAGS);
	cookies.set(SESSION_COOKIE, sessionJwt, { ...AUTH_COOKIE_FLAGS, maxAge: SESSION_MAX_AGE_SECONDS });

	return new Response(null, {
		status: 302,
		headers: { Location: new URL(redirectPath, siteOrigin(env)).toString() }
	});
};
