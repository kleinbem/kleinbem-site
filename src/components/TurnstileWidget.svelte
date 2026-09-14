<script lang="ts">
  import { onMount } from "svelte";

  let { onToken }: { onToken: (token: string) => void } = $props();
  let container: HTMLDivElement;

  // Not a secret — Turnstile sitekeys are meant to ship in page source, same
  // as the Cloudflare Web Analytics token in Layout.astro. Provisioned by
  // nix/infra/cloudflare-turnstile.tf (`tofu output turnstile_site_key`).
  // TODO(martin): replace once the widget exists — see the Terraform output.
  const SITE_KEY = "1x00000000000000000000AA";

  function loadScript(): Promise<void> {
    const w = window as unknown as { turnstile?: unknown };
    if (w.turnstile) return Promise.resolve();
    const existing = document.querySelector<HTMLScriptElement>('script[data-turnstile]');
    if (existing) {
      return new Promise((resolve) => existing.addEventListener("load", () => resolve()));
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      script.async = true;
      script.defer = true;
      script.dataset.turnstile = "true";
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load Turnstile"));
      document.head.appendChild(script);
    });
  }

  onMount(() => {
    let widgetId: string | undefined;
    let cancelled = false;
    loadScript().then(() => {
      if (cancelled) return;
      const turnstile = (window as unknown as { turnstile: any }).turnstile;
      widgetId = turnstile.render(container, {
        sitekey: SITE_KEY,
        callback: onToken,
        "expired-callback": () => onToken(""),
        "error-callback": () => onToken(""),
      });
    });
    return () => {
      cancelled = true;
      const turnstile = (window as unknown as { turnstile?: any }).turnstile;
      if (widgetId && turnstile) turnstile.remove(widgetId);
    };
  });
</script>

<div bind:this={container}></div>
