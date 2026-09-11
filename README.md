# kleinbem.dev

Personal site — Astro + Svelte + Tailwind, built as a Nix package and served
from Caddy on `core-pi` behind a Cloudflare Tunnel.

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

Visitor login (Google/Facebook OAuth via `AuthNav`) is served by the
sibling `kleinbem-auth` repo.

See `AGENTS.md`/`CLAUDE.md` for the dev workflow and
[docs.astro.build](https://docs.astro.build) for framework reference.
