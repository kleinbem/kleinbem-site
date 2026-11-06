# kleinbem.dev

Personal site — Astro + Svelte + Tailwind, served from Cloudflare Pages
(`www.kleinbem.dev`; the apex redirects to it — see `nix/infra/cloudflare-pages.tf`
in the fleet repo). CI (`.github/workflows/ci.yaml`) builds and deploys it.

```
src/pages/
├── index.astro        # landing page (LinksHub, ContactForm)
├── blog/               # content collections
├── courses.astro       # placeholder catalogue — see src/data/courses.ts
├── experience.astro
├── services.astro
├── impressum.astro
└── privacy.astro
```

Visitor login (`AuthNav` + `functions/auth/*`) is OIDC/PKCE against the
fleet's Authentik instance (`auth.kleinbem.dev`) — see `functions/auth/_lib.ts`.
This replaced the old `kleinbem-auth` service (decommissioned 2026-09-21).

See `AGENTS.md`/`CLAUDE.md` for the dev workflow and
[docs.astro.build](https://docs.astro.build) for framework reference.
