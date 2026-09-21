// Read by AuthNav.svelte on every page load to know whether a visitor is
// signed in. Verifies kleinbem-site's own session cookie (see callback.ts)
// — never touches Authentik itself, so this stays fast and works even if
// Authentik is briefly unreachable.
import { jwtVerify } from "jose";
import { type Env, SESSION_COOKIE, clearCookie, readCookie } from "./_lib";

const NO_STORE = { "Cache-Control": "no-store" };

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const cookie = readCookie(request, SESSION_COOKIE);
  if (!cookie) return Response.json({ user: null }, { headers: NO_STORE });

  try {
    const { payload } = await jwtVerify(cookie, new TextEncoder().encode(env.AUTH_SESSION_SECRET), {
      algorithms: ["HS256"],
    });
    return Response.json(
      { user: { name: payload.name ?? null, email: payload.email ?? null } },
      { headers: NO_STORE },
    );
  } catch {
    // Expired or tampered — treat as signed out and clear it so the
    // browser stops sending a cookie that will never verify again.
    return Response.json(
      { user: null },
      { headers: { ...NO_STORE, "Set-Cookie": clearCookie(SESSION_COOKIE) } },
    );
  }
};
