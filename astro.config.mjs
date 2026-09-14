// @ts-check
import { defineConfig } from 'astro/config';

import svelte from '@astrojs/svelte';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // www.kleinbem.dev is the domain Pages actually serves (see
  // nix/infra/cloudflare-pages.tf); the apex kleinbem.dev is a 301 redirect
  // to it, entangled with mail DNS so it stays apex-only. `site` must be the
  // final, 200-serving URL — canonical/og:url/sitemap all derive from it,
  // and a canonical tag pointing at a redirecting URL is a real
  // Search-Console-flagged issue, not just cosmetic.
  site: 'https://www.kleinbem.dev',
  integrations: [
    svelte(),
    sitemap({
      // Keep in sync with the noindex pages in src/pages — listing a
      // noindexed page in the sitemap is a contradictory signal Search
      // Console flags ("Submitted URL marked 'noindex'").
      filter: (page) =>
        !["login", "register", "forgot-password", "reset-password"].some((p) =>
          page.endsWith(`/${p}/`),
        ),
    }),
  ],

  vite: {
    plugins: [tailwindcss()]
  }
});