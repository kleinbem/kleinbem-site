<script lang="ts">
  import { authClient } from "../lib/auth-client";

  const session = authClient.useSession();

  let open = $state(false);
  let busy = $state(false);

  async function logout() {
    busy = true;
    try {
      await authClient.signOut();
    } catch (err) {
      console.error("sign-out failed", err);
    } finally {
      busy = false;
      open = false;
    }
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
    <a
      href="/login"
      class="rounded-md px-2.5 py-1.5 text-sm text-muted transition-colors hover:text-heading"
    >
      Sign in
    </a>
  {/if}
</div>
