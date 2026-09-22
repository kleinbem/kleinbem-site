## Development

`npm run dev` (Vite) runs in the foreground — there's no built-in background-daemon
mode the way Astro's CLI had. Use the harness's own background-process tooling
(e.g. Claude Code's `run_in_background`) if you need it backgrounded, rather than
reaching for a bespoke daemon pattern.

`npm run check` runs `svelte-kit sync` + `svelte-check` (type errors across the
whole project). `wrangler pages dev .svelte-kit/cloudflare` after `npm run build`
gives closer production parity (real Workers runtime, real `platform.env` path)
when testing anything that touches Cloudflare bindings or the auth flow.

## Documentation

Full documentation: https://svelte.dev/docs/kit

Consult these guides before working on related tasks:

- [Routing](https://svelte.dev/docs/kit/routing)
- [Svelte components / runes](https://svelte.dev/docs/svelte/overview)
- [Loading data](https://svelte.dev/docs/kit/load)
- [Server routes / `+server.ts`](https://svelte.dev/docs/kit/routing#server)
- [Adapters (Cloudflare)](https://svelte.dev/docs/kit/adapter-cloudflare)
- [Styling / Tailwind](https://svelte.dev/docs/kit/faq#Where-do-I-put-my-CSS)
