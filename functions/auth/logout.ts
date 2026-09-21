// Clears kleinbem-site's own session only — deliberately does NOT also end
// the visitor's SSO session at Authentik itself (auth.kleinbem.dev keeps
// its own login cookie). Same semantics as signing out of one app that
// happens to use Google/GitHub SSO: it doesn't sign you out of Google.
// POST, not GET — this changes state, so it shouldn't be triggerable by a
// plain link, prefetch, or CSRF via <img>.
import { SESSION_COOKIE, clearCookie } from "./_lib";

export const onRequestPost: PagesFunction = async () =>
  Response.json({ ok: true }, { headers: { "Set-Cookie": clearCookie(SESSION_COOKIE) } });
