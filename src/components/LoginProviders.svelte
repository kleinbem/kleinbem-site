<script lang="ts">
  import { authClient, type SocialProvider } from "../lib/auth-client";

  let busy = $state(false);
  let failed = $state(false);

  const providers: { id: SocialProvider; label: string }[] = [
    { id: "linkedin", label: "Continue with LinkedIn" },
    { id: "github", label: "Continue with GitHub" },
    { id: "google", label: "Continue with Google" },
    { id: "microsoft", label: "Continue with Microsoft" },
    { id: "facebook", label: "Continue with Facebook" },
  ];

  async function login(provider: SocialProvider) {
    busy = true;
    failed = false;
    try {
      // Static site — no server-side request to read a query string from, so
      // ?redirect is read here, client-side, at click time. Falls back to
      // home if opened directly (no redirect param) or the value is missing.
      // Must be resolved to an absolute URL — a bare path gets resolved by
      // better-auth against its own baseURL (login.kleinbem.dev), not this
      // site, the exact bug already hit once with a relative callbackURL.
      const redirectPath = new URLSearchParams(location.search).get("redirect") || "/";
      const callbackURL = new URL(redirectPath, location.origin).toString();
      await authClient.signIn.social({ provider, callbackURL });
    } catch (err) {
      busy = false;
      failed = true;
      console.error("sign-in failed", err);
    }
  }

  const buttonClass =
    "flex w-full items-center justify-center rounded-lg border border-line px-4 py-2.5 text-sm font-medium text-heading transition-colors hover:bg-surface disabled:opacity-50";
</script>

<div class="grid gap-3">
  {#each providers as provider (provider.id)}
    <button
      type="button"
      class={buttonClass}
      disabled={busy}
      onclick={() => login(provider.id)}
    >
      {provider.label}
    </button>
  {/each}

  {#if failed}
    <p class="text-xs text-red-500">Something went wrong — please try again.</p>
  {/if}
</div>
