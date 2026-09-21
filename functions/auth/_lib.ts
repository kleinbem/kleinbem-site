// Shared helpers for the OIDC/PKCE login flow against Authentik (Phase 3 of
// the kleinbem-auth -> Authentik migration). Filename starts with `_` so
// Cloudflare Pages doesn't treat this as a route.
//
// Single-tenant, fixed-domain IdP — these paths come straight from
// Authentik's own OIDC discovery document (auth.kleinbem.dev/application/o/
// kleinbem-site/.well-known/openid-configuration, checked live 2026-09-21),
// not something that needs to be runtime-configurable.
const AUTHENTIK_BASE = "https://auth.kleinbem.dev";
const APP_SLUG = "kleinbem-site";
export const SITE_ORIGIN = "https://kleinbem.dev";

export const AUTHORIZE_URL = `${AUTHENTIK_BASE}/application/o/authorize/`;
export const TOKEN_URL = `${AUTHENTIK_BASE}/application/o/token/`;
export const ISSUER = `${AUTHENTIK_BASE}/application/o/${APP_SLUG}/`;
export const END_SESSION_URL = `${AUTHENTIK_BASE}/application/o/${APP_SLUG}/end-session/`;
export const REDIRECT_URI = `${SITE_ORIGIN}/auth/callback`;

export interface Env {
  AUTHENTIK_CLIENT_ID: string;
  AUTHENTIK_CLIENT_SECRET: string;
  AUTH_SESSION_SECRET: string;
}

// PKCE state cookie: short-lived, holds the code_verifier + the exact state
// value login.ts generated, read back by callback.ts to complete the
// exchange and check for CSRF. HttpOnly (never touched by page JS) and
// __Host- prefixed (browser-enforced: Secure, Path=/, no Domain attribute
// — can't be set or overridden by a subdomain or a non-HTTPS response).
export const PKCE_COOKIE = "__Host-oidc_pkce";
// Session cookie: a JWT (HS256, signed with AUTH_SESSION_SECRET — see
// session.ts) carrying the signed-in user's claims. Same __Host- hardening.
export const SESSION_COOKIE = "__Host-session";

export function randomString(byteLength: number): string {
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);
  return base64url(bytes);
}

export function base64url(bytes: Uint8Array): string {
  let str = "";
  for (const b of bytes) str += String.fromCharCode(b);
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function pkceChallenge(verifier: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
  return base64url(new Uint8Array(digest));
}

export function readCookie(request: Request, name: string): string | null {
  const header = request.headers.get("Cookie");
  if (!header) return null;
  for (const part of header.split(";")) {
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    if (part.slice(0, eq).trim() === name) return part.slice(eq + 1).trim();
  }
  return null;
}

export function setCookie(
  name: string,
  value: string,
  opts: { maxAgeSeconds: number },
): string {
  return `${name}=${value}; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=${opts.maxAgeSeconds}`;
}

export function clearCookie(name: string): string {
  return `${name}=; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=0`;
}

// Never let ?redirect= be turned into an open redirect — only a path
// rooted at this site, never an absolute/protocol-relative URL to
// somewhere else.
export function safeRedirectPath(raw: string | null): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "/";
  return raw;
}
