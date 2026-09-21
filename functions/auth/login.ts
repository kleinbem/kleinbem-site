// Entry point for "Sign in" — immediately redirects to Authentik's own
// hosted login page (Phase 3 of the kleinbem-auth -> Authentik migration).
// There is no login form on kleinbem-site itself anymore: registration,
// password reset, and social login are all Authentik's job now, not ours.
import {
  AUTHORIZE_URL,
  type Env,
  PKCE_COOKIE,
  REDIRECT_URI,
  pkceChallenge,
  randomString,
  safeRedirectPath,
  setCookie,
} from "./_lib";

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url);
  const redirectPath = safeRedirectPath(url.searchParams.get("redirect"));

  const verifier = randomString(64);
  const challenge = await pkceChallenge(verifier);
  const csrf = randomString(32);
  // OIDC's own replay defense for the ID token — checked against
  // claims.nonce in callback.ts. Sent to Authentik (below) but, unlike
  // state, never echoed back in a URL — kept in the cookie only, matching
  // the OIDC Core spec's expectation that it isn't attacker-observable
  // ahead of the id_token being minted.
  const nonce = randomString(32);
  // Carries the CSRF nonce and the post-login destination through the
  // round trip to Authentik and back — see callback.ts, which checks the
  // incoming `state` against this same cookie's value.
  const state = JSON.stringify({ csrf, redirectPath });
  // code_verifier travels only in this cookie, never in a URL — the
  // authorize request only gets the (one-way) challenge.
  const pkceCookieValue = JSON.stringify({ verifier, state, nonce });

  const authorize = new URL(AUTHORIZE_URL);
  authorize.searchParams.set("client_id", env.AUTHENTIK_CLIENT_ID);
  authorize.searchParams.set("response_type", "code");
  authorize.searchParams.set("scope", "openid email profile");
  authorize.searchParams.set("redirect_uri", REDIRECT_URI);
  authorize.searchParams.set("code_challenge", challenge);
  authorize.searchParams.set("code_challenge_method", "S256");
  authorize.searchParams.set("state", state);
  authorize.searchParams.set("nonce", nonce);

  return new Response(null, {
    status: 302,
    headers: {
      Location: authorize.toString(),
      // 10 minutes — plenty to complete a login, short enough that a
      // stale, unused verifier doesn't linger.
      "Set-Cookie": setCookie(PKCE_COOKIE, pkceCookieValue, { maxAgeSeconds: 600 }),
    },
  });
};
