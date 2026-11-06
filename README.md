# kleinbem.dev

Personal site: SvelteKit + Svelte 5 + Tailwind v4, served from Cloudflare Pages
(`www.kleinbem.dev`; the apex redirects to it, see `nix/infra/cloudflare-pages.tf`
in the fleet repo). CI (`.github/workflows/ci.yaml`) builds it and deploys every
push to `main`.

```
src/
├── routes/
│   ├── +page.svelte     # landing page (LinksHub, ContactForm)
│   ├── blog/            # posts from src/lib/blog/posts/*.md
│   ├── courses/         # placeholder catalogue, see src/lib/data/courses.ts
│   ├── experience/
│   ├── services/
│   ├── impressum/
│   ├── privacy/
│   ├── api/             # contact form, JSON profile endpoints, MCP server
│   └── auth/            # visitor login
├── lib/
│   ├── components/
│   ├── data/            # site content (profile, links, services, experience)
│   └── server/auth.ts
static/                  # served as-is (robots.txt, llms.txt, icons)
_headers                 # Cloudflare Pages headers, copied in by the adapter
```

Visitor login (`AuthNav` + `src/routes/auth/*`) is OIDC/PKCE against the
fleet's Authentik instance (`auth.kleinbem.dev`), see `src/lib/server/auth.ts`.

See `AGENTS.md`/`CLAUDE.md` for the dev workflow and
[svelte.dev/docs/kit](https://svelte.dev/docs/kit) for framework reference.
