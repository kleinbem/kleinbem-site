// Helpers for the OIDC/PKCE login flow against Authentik (used by src/routes/auth/).
// Fixed single IdP: these URLs come from Authentik's discovery document
// (/application/o/kleinbem-site/.well-known/openid-configuration).
const AUTHENTIK_BASE = 'https://auth.kleinbem.dev';
const APP_SLUG = 'kleinbem-site';

export const AUTHORIZE_URL = `${AUTHENTIK_BASE}/application/o/authorize/`;
export const TOKEN_URL = `${AUTHENTIK_BASE}/application/o/token/`;
export const ISSUER = `${AUTHENTIK_BASE}/application/o/${APP_SLUG}/`;

export interface AuthEnv {
	AUTHENTIK_CLIENT_ID: string;
	AUTHENTIK_CLIENT_SECRET: string;
	AUTH_SESSION_SECRET: string;
	// Local-dev override (see .dev.vars.example); unset in production.
	AUTH_SITE_ORIGIN?: string;
}

export function siteOrigin(env: AuthEnv): string {
	return env.AUTH_SITE_ORIGIN ?? 'https://kleinbem.dev';
}

export function redirectUri(env: AuthEnv): string {
	return `${siteOrigin(env)}/auth/callback`;
}

// Short-lived PKCE cookie: code_verifier, state and nonce from login, checked by
// the callback. __Host- makes the browser enforce Secure, Path=/ and no Domain,
// so a subdomain or plain-HTTP response can't set or override it.
export const PKCE_COOKIE = '__Host-oidc_pkce';
// Session cookie: HS256 JWT signed with AUTH_SESSION_SECRET, minted by the callback.
export const SESSION_COOKIE = '__Host-session';

// A __Host- cookie must have path "/" and no domain, or the browser drops it.
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

// Only a path on this site may come out of ?redirect=. Checking the prefix isn't
// enough: URL parsing turns `/\host` and `/\t/host` into `//host`, so resolve it
// and keep it only if the origin stays put.
export function safeRedirectPath(raw: string | null): string {
	if (!raw || !raw.startsWith('/')) return '/';
	const base = 'https://site.invalid';
	let url: URL;
	try {
		url = new URL(raw, base);
	} catch {
		return '/';
	}
	// The normalised path can still start with `//` (`/..//host`).
	if (url.origin !== base || url.pathname.startsWith('//')) return '/';
	return url.pathname + url.search + url.hash;
}
