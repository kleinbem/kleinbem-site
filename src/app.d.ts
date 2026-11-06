/// <reference types="@cloudflare/workers-types" />
// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
	}

	// Bindings read through `import { env } from 'cloudflare:workers'` in the
	// server routes (adapter-cloudflare 8 dropped `event.platform`).
	namespace Cloudflare {
		interface Env {
			// OIDC/PKCE login flow against Authentik (src/lib/server/auth.ts) —
			// set via nix/infra/cloudflare-pages.tf's deployment_configs.
			AUTHENTIK_CLIENT_ID: string;
			AUTHENTIK_CLIENT_SECRET: string;
			AUTH_SESSION_SECRET: string;
			// Local-dev-only override (.dev.vars) so the OIDC round trip can be
			// tested against the real Authentik instance without touching the
			// production redirect_uri. Unset in production.
			AUTH_SITE_ORIGIN?: string;
			// Contact form (src/routes/api/contact) — set by hand in the
			// Cloudflare dashboard, not Terraform-managed (pre-existing gap).
			RESEND_API_KEY: string;
			TURNSTILE_SECRET_KEY?: string;
		}
	}
}

export {};
