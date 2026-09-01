<script lang="ts">
  import { authClient, type SocialProvider } from "../lib/auth-client";

  const session = authClient.useSession();

  let open = $state(false);
  let busy = $state(false);

  async function login(provider: SocialProvider) {
    busy = true;
    await authClient.signIn.social({ provider, callbackURL: location.pathname });
  }

  async function logout() {
    busy = true;
    await authClient.signOut();
    busy = false;
    open = false;
  }

  const menuClass =
    "absolute right-0 mt-2 w-48 rounded-lg border border-line bg-bg p-1 shadow-lg";
  const itemClass =
    "block w-full rounded-md px-3 py-2 text-left text-sm text-fg transition-colors hover:bg-surface disabled:opacity-50";
</script>

<div class="relative">
  {#if $session.isPending}
    <span class="px-2.5 py-1.5 text-sm text-muted">…</span>
  {:else if $session.data}
    <button
      type="button"
      class="rounded-md px-2.5 py-1.5 text-sm text-muted transition-colors hover:text-heading"
      aria-expanded={open}
      onclick={() => (open = !open)}
    >
      {$session.data.user.name || $session.data.user.email}
    </button>
    {#if open}
      <div class={menuClass}>
        <button class={itemClass} disabled={busy} onclick={logout}>Sign out</button>
      </div>
    {/if}
  {:else}
    <button
      type="button"
      class="rounded-md px-2.5 py-1.5 text-sm text-muted transition-colors hover:text-heading"
      aria-expanded={open}
      onclick={() => (open = !open)}
    >
      Sign in
    </button>
    {#if open}
      <div class={menuClass}>
        <button class={itemClass} disabled={busy} onclick={() => login("google")}>
          Continue with Google
        </button>
        <button class={itemClass} disabled={busy} onclick={() => login("facebook")}>
          Continue with Facebook
        </button>
      </div>
    {/if}
  {/if}
</div>
