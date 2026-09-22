// Shared helpers for the OIDC/PKCE login flow against Authentik (ported
// from the old functions/auth/_lib.ts Cloudflare Pages Function — see the
// route handlers under src/routes/auth/ for how these are used).
//
// Single-tenant, fixed-domain IdP — these paths come straight from
// Authentik's own OIDC discovery document (auth.kleinbem.dev/application/o/
// kleinbem-site/.well-known/openid-configuration, checked live 2026-09-21),
// not something that needs to be runtime-configurable.
const AUTHENTIK_BASE = 'https://auth.kleinbem.dev';
const APP_SLUG = 'kleinbem-site';

export const AUTHORIZE_URL = `${AUTHENTIK_BASE}/application/o/authorize/`;
export const TOKEN_URL = `${AUTHENTIK_BASE}/application/o/token/`;
export const ISSUER = `${AUTHENTIK_BASE}/application/o/${APP_SLUG}/`;

export interface AuthEnv {
	AUTHENTIK_CLIENT_ID: string;
	AUTHENTIK_CLIENT_SECRET: string;
	AUTH_SESSION_SECRET: string;
	// Local-dev-only override (see .dev.vars.example) so the OIDC round trip
	// can be tested against the real Authentik instance without touching
	// the production redirect_uri. Unset (and thus defaulted) in production.
	AUTH_SITE_ORIGIN?: string;
}

export function siteOrigin(env: AuthEnv): string {
	return env.AUTH_SITE_ORIGIN ?? 'https://kleinbem.dev';
}

export function redirectUri(env: AuthEnv): string {
	return `${siteOrigin(env)}/auth/callback`;
}

// PKCE state cookie: short-lived, holds the code_verifier + the exact state
// value the login handler generated, read back by the callback handler to
// complete the exchange and check for CSRF. HttpOnly (never touched by page
// JS) and __Host- prefixed (browser-enforced: Secure, Path=/, no Domain
// attribute — can't be set or overridden by a subdomain or a non-HTTPS
// response).
export const PKCE_COOKIE = '__Host-oidc_pkce';
// Session cookie: a JWT (HS256, signed with AUTH_SESSION_SECRET — see
// session/+server.ts) carrying the signed-in user's claims. Same __Host-
// hardening.
export const SESSION_COOKIE = '__Host-session';

// Shared cookie attributes for both cookies above. `path`/`domain` aren't
// optional for a __Host- cookie: path must be "/" and domain must be unset
// (both enforced by the browser, not just documented here).
export const AUTH_COOKIE_FLAGS = {
	path: '/',
	httpOnly: true,
	secure: true,
	sameSite: 'lax'
} as const;

export function randomString(byteLength: number): string {
	const bytes = new Uint8Array(byteLength);
	crypto.getRandomValues(bytes);
	return base64url(bytes);
}

export function base64url(bytes: Uint8Array): string {
	let str = '';
	for (const b of bytes) str += String.fromCharCode(b);
	return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export async function pkceChallenge(verifier: string): Promise<string> {
	const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier));
	return base64url(new Uint8Array(digest));
}

// Never let ?redirect= be turned into an open redirect — only a path
// rooted at this site, never an absolute/protocol-relative URL to
// somewhere else.
export function safeRedirectPath(raw: string | null): string {
	if (!raw || !raw.startsWith('/') || raw.startsWith('//')) return '/';
	return raw;
}
