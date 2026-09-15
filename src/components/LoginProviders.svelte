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
    "flex w-full items-center gap-3 rounded-full border border-outline px-4 py-2.5 text-sm font-medium text-heading transition-colors hover:bg-surface-high disabled:opacity-50";
</script>

<div class="grid gap-3">
  {#each providers as provider (provider.id)}
    <button
      type="button"
      class={buttonClass}
      disabled={busy}
      onclick={() => login(provider.id)}
    >
      <svg class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        {#if provider.id === "linkedin"}
          <path
            d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
          />
        {:else if provider.id === "github"}
          <path
            d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
          />
        {:else if provider.id === "google"}
          <path
            d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.344-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"
          />
        {:else if provider.id === "microsoft"}
          <rect x="1" y="1" width="10" height="10" />
          <rect x="13" y="1" width="10" height="10" />
          <rect x="1" y="13" width="10" height="10" />
          <rect x="13" y="13" width="10" height="10" />
        {:else if provider.id === "facebook"}
          <path
            d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
          />
        {/if}
      </svg>
      {provider.label}
    </button>
  {/each}

  {#if failed}
    <p class="text-xs text-red-500">Something went wrong — please try again.</p>
  {/if}
</div>
