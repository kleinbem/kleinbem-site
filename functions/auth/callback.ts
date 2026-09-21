// Authentik redirects here after the visitor signs in on its own hosted
// login page. Exchanges the authorization code for tokens server-side
// (this site has a real backend — Cloudflare Pages Functions — so the
// exchange never touches page JS), verifies the ID token, and mints
// kleinbem-site's own longer-lived session cookie from it. See _lib.ts
// for why this is a separate cookie rather than the raw ID token: the
// ID token's own lifetime is short (minutes) and re-authenticating that
// often would be a real UX downgrade from the "stay signed in 30 days"
// behavior kleinbem-auth had.
import { SignJWT, jwtVerify } from "jose";
import {
  type Env,
  ISSUER,
  PKCE_COOKIE,
  REDIRECT_URI,
  SESSION_COOKIE,
  SITE_ORIGIN,
  TOKEN_URL,
  clearCookie,
  readCookie,
  setCookie,
} from "./_lib";

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

function errorRedirect(reason: string): Response {
  const url = new URL("/login-error", SITE_ORIGIN);
  url.searchParams.set("reason", reason);
  return new Response(null, {
    status: 302,
    headers: { Location: url.toString(), "Set-Cookie": clearCookie(PKCE_COOKIE) },
  });
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const incomingState = url.searchParams.get("state");
  if (!code || !incomingState) return errorRedirect("missing_code_or_state");

  const pkceCookie = readCookie(request, PKCE_COOKIE);
  if (!pkceCookie) return errorRedirect("expired_or_missing_pkce_cookie");

  let verifier: string;
  let expectedNonce: string;
  let redirectPath = "/";
  try {
    const {
      verifier: v,
      state: expectedState,
      nonce,
    } = JSON.parse(pkceCookie) as { verifier: string; state: string; nonce: string };
    if (expectedState !== incomingState) return errorRedirect("state_mismatch");
    verifier = v;
    expectedNonce = nonce;
    redirectPath = (JSON.parse(expectedState) as { redirectPath: string }).redirectPath;
  } catch {
    return errorRedirect("malformed_pkce_cookie");
  }

  const tokenRes = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT_URI,
      client_id: env.AUTHENTIK_CLIENT_ID,
      client_secret: env.AUTHENTIK_CLIENT_SECRET,
      code_verifier: verifier,
    }),
  });
  if (!tokenRes.ok) {
    console.error("Authentik token exchange failed", tokenRes.status, await tokenRes.text());
    return errorRedirect("token_exchange_failed");
  }
  const tokens = (await tokenRes.json()) as { id_token?: string };
  if (!tokens.id_token) return errorRedirect("no_id_token_returned");

  // Authentik signs this provider's ID tokens HS256 (symmetric) — the
  // client_secret IS the verification key. Algorithm pinned explicitly so
  // a forged token can't pick its own (e.g. "none").
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
      { issuer: ISSUER, audience: env.AUTHENTIK_CLIENT_ID, algorithms: ["HS256"] },
    );
    claims = payload as typeof claims;
  } catch (err) {
    console.error("ID token verification failed", err);
    return errorRedirect("id_token_invalid");
  }
  if (claims.nonce !== expectedNonce) return errorRedirect("nonce_mismatch");

  const sessionJwt = await new SignJWT({
    sub: claims.sub,
    email: claims.email ?? null,
    name: claims.name ?? claims.preferred_username ?? null,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(new TextEncoder().encode(env.AUTH_SESSION_SECRET));

  return new Response(null, {
    status: 302,
    headers: [
      ["Location", new URL(redirectPath, SITE_ORIGIN).toString()],
      ["Set-Cookie", clearCookie(PKCE_COOKIE)],
      ["Set-Cookie", setCookie(SESSION_COOKIE, sessionJwt, { maxAgeSeconds: SESSION_MAX_AGE_SECONDS })],
    ],
  });
};
