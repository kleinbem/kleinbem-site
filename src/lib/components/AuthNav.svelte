<script lang="ts">
  import { onMount } from "svelte";
  import { browser } from "$app/env";
  import { page } from "$app/state";

  type SessionUser = { name: string | null; email: string | null };

  let user: SessionUser | null = $state(null);
  let pending = $state(true);
  let open = $state(false);
  let busy = $state(false);

  onMount(async () => {
    try {
      const res = await fetch("/auth/session");
      const data = (await res.json()) as { user: SessionUser | null };
      user = data.user;
    } catch (err) {
      console.error("session check failed", err);
    } finally {
      pending = false;
    }
  });

  async function logout() {
    busy = true;
    try {
      await fetch("/auth/logout", { method: "POST" });
      user = null;
    } catch (err) {
      console.error("sign-out failed", err);
    } finally {
      busy = false;
      open = false;
    }
  }

  // ?redirect= brings the visitor back to this page after sign-in. Derived
  // because the layout keeps this component across client-side navigation;
  // prerendering can't read url.search, so it gets the plain link.
  const signInHref = $derived(
    browser
      ? `/auth/login?redirect=${encodeURIComponent(page.url.pathname + page.url.search)}`
      : "/auth/login",
  );

  const menuClass = "absolute right-0 mt-2 w-48 rounded-xl bg-surface-high p-1.5 shadow-elevation-2";
  const itemClass =
    "block w-full rounded-lg px-3 py-2 text-left text-sm text-fg transition-colors hover:bg-surface disabled:opacity-50";
</script>

<div class="relative">
  {#if pending}
    <span class="px-3 py-1.5 text-sm text-muted">…</span>
  {:else if user}
    <button
      type="button"
      class="rounded-full px-3 py-1.5 text-sm text-muted transition-colors hover:bg-surface-high hover:text-heading"
      aria-expanded={open}
      onclick={() => (open = !open)}
    >
      {user.name || user.email}
    </button>
    {#if open}
      <div class={menuClass}>
        <button class={itemClass} disabled={busy} onclick={logout}>Sign out</button>
      </div>
    {/if}
  {:else}
    <a
      href={signInHref}
      rel="nofollow"
      class="rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-accent-fg transition-[background-color,box-shadow] hover:bg-accent-hover hover:shadow-elevation-1"
    >
      Sign in
    </a>
  {/if}
</div>
