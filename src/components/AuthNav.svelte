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

  const menuClass = "absolute right-0 mt-2 w-48 rounded-xl bg-surface-high p-1.5 shadow-elevation-2";
  const itemClass =
    "block w-full rounded-lg px-3 py-2 text-left text-sm text-fg transition-colors hover:bg-surface disabled:opacity-50";
</script>

<div class="relative">
  {#if $session.isPending}
    <span class="px-3 py-1.5 text-sm text-muted">…</span>
  {:else if $session.data}
    <button
      type="button"
      class="rounded-full px-3 py-1.5 text-sm text-muted transition-colors hover:bg-surface-high hover:text-heading"
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
      class="rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-accent-fg transition-[background-color,box-shadow] hover:bg-accent-hover hover:shadow-elevation-1"
    >
      Sign in
    </a>
  {/if}
</div>
