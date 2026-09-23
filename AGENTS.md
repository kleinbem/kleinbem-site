## Development

`npm run dev` (Vite) runs in the foreground — there's no built-in background-daemon
mode the way Astro's CLI had. Use the harness's own background-process tooling
(e.g. Claude Code's `run_in_background`) if you need it backgrounded, rather than
reaching for a bespoke daemon pattern.

`npm run check` runs `svelte-kit sync` + `svelte-check` (type errors across the
whole project). `wrangler pages dev .svelte-kit/cloudflare` after `npm run build`
gives closer production parity (real Workers runtime, real `platform.env` path)
when testing anything that touches Cloudflare bindings or the auth flow.

## Svelte 5 & Runes Architecture

This project is built on **Svelte 5** and **SvelteKit 2**. All agents MUST adhere to modern Svelte 5 idioms:

- **Reactivity**:
  - Use `$state()` for reactive variables, and `$state.raw()` for large, immutable objects (API responses, static config) to avoid unnecessary deep proxying.
  - Use `$derived()` (or `$derived.by(() => ...)`) for values computed from other state. Never compute state inside an `$effect`.
  - `$effect()` is an escape hatch for side effects (e.g. syncing with third-party DOM libraries). Never mutate local state inside an effect.
- **Props**: Use `let { ... } = $props()` with TypeScript interface typing. Never use legacy `export let`.
- **Snippets & Slots**: Use `{#snippet name(...)}` and `{@render name(...)}`. Never use legacy `<slot>`.
- **Event Handling**: Use standard HTML attributes (e.g. `onclick={handler}`), never legacy directives (`on:click`).
- **Styling**: Tailwind CSS v4 is used via `@tailwindcss/vite` (`@import "tailwindcss";` in CSS). Do not create or look for a legacy `tailwind.config.js`.

## AI Tooling & Cross-Agent Workflow

This repo includes universal skills in `.agents/skills/` (also symlinked to `.claude/skills/`):
- `svelte-core-bestpractices`: Svelte 5 reactivity, runes, and architecture guidelines.
- `svelte-code-writer`: Instructions for invoking Svelte doc lookups and code validation.

### MCP & CLI Tools
- **MCP-enabled agents (Antigravity IDE, Claude Code, Roo-Cline)**:
  - Call `list-sections` and `get-documentation` for accurate framework references.
  - Run `svelte-autofixer` on any modified `.svelte` or `.svelte.ts` files before finalizing.
- **CLI agents without native MCP (Hermes, Pi / oh-my-pi)**:
  - Run the CLI equivalent via bash:
    ```bash
    npx @sveltejs/mcp svelte-autofixer src/lib/Component.svelte
    npx @sveltejs/mcp get-documentation "$state,$derived"
    ```

## Documentation

Full documentation: https://svelte.dev/docs/kit

Consult these guides before working on related tasks:

- [Routing](https://svelte.dev/docs/kit/routing)
- [Svelte components / runes](https://svelte.dev/docs/svelte/overview)
- [Loading data](https://svelte.dev/docs/kit/load)
- [Server routes / `+server.ts`](https://svelte.dev/docs/kit/routing#server)
- [Adapters (Cloudflare)](https://svelte.dev/docs/kit/adapter-cloudflare)
- [Styling / Tailwind](https://svelte.dev/docs/kit/faq#Where-do-I-put-my-CSS)
