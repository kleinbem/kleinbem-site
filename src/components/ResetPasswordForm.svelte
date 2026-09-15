<script lang="ts">
  import { authClient } from "../lib/auth-client";

  let password = $state("");
  let confirmPassword = $state("");
  let busy = $state(false);
  let error = $state("");
  let done = $state(false);

  // client:visible components still render once server-side at build time
  // (no `location` global in that Node pass) before hydrating for real in
  // the browser — same pitfall already hit once with AuthNav's callbackURL.
  const token =
    typeof location !== "undefined" ? new URLSearchParams(location.search).get("token") : null;

  async function submit(e: SubmitEvent) {
    e.preventDefault();
    if (password !== confirmPassword) {
      error = "Passwords don't match";
      return;
    }
    if (!token) {
      error = "Missing or invalid reset link — request a new one.";
      return;
    }
    busy = true;
    error = "";
    try {
      const res = await authClient.resetPassword({ newPassword: password, token });
      if (res.error) {
        error = res.error.message ?? "Reset failed — the link may have expired.";
        busy = false;
        return;
      }
      done = true;
    } catch (err) {
      console.error("password reset failed", err);
      error = "Something went wrong — please try again.";
      busy = false;
    }
  }

  const inputClass =
    "w-full rounded border-2 border-outline bg-bg px-3 py-2 text-sm text-fg outline-none transition-colors focus:border-accent";
</script>

{#if done}
  <p class="text-[15px] leading-relaxed text-muted">
    Your password's been reset. <a href="/login" class="text-heading underline">Sign in</a>.
  </p>
{:else if !token}
  <p class="text-[15px] leading-relaxed text-red-500">
    This link is missing or invalid. <a href="/forgot-password" class="text-heading underline"
      >Request a new one</a
    >.
  </p>
{:else}
  <form class="grid gap-3" onsubmit={submit}>
    <div>
      <label for="password" class="mb-1 block text-xs font-medium text-muted">New password</label>
      <input
        id="password"
        type="password"
        required
        minlength="8"
        class={inputClass}
        bind:value={password}
      />
    </div>
    <div>
      <label for="confirmPassword" class="mb-1 block text-xs font-medium text-muted"
        >Confirm password</label
      >
      <input
        id="confirmPassword"
        type="password"
        required
        minlength="8"
        class={inputClass}
        bind:value={confirmPassword}
      />
    </div>

    {#if error}
      <p class="text-xs text-red-500">{error}</p>
    {/if}

    <button
      type="submit"
      disabled={busy}
      class="rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-accent-fg transition-[background-color,box-shadow] hover:bg-accent-hover hover:shadow-elevation-1 disabled:opacity-50 disabled:hover:shadow-none"
    >
      {busy ? "Resetting…" : "Reset password"}
    </button>
  </form>
{/if}
