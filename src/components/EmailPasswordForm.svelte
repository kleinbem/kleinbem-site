<script lang="ts">
  import { authClient } from "../lib/auth-client";

  let email = $state("");
  let password = $state("");
  let rememberMe = $state(true);
  let busy = $state(false);
  let error = $state("");

  async function submit(e: SubmitEvent) {
    e.preventDefault();
    busy = true;
    error = "";
    try {
      const redirectPath = new URLSearchParams(location.search).get("redirect") || "/";
      const callbackURL = new URL(redirectPath, location.origin).toString();
      const res = await authClient.signIn.email({ email, password, rememberMe, callbackURL });
      if (res.error) {
        error = res.error.message ?? "Sign in failed";
        busy = false;
        return;
      }
      location.href = callbackURL;
    } catch (err) {
      console.error("email sign-in failed", err);
      error = "Something went wrong — please try again.";
      busy = false;
    }
  }

  const inputClass =
    "w-full rounded border-2 border-outline bg-bg px-3 py-2 text-sm text-fg outline-none transition-colors focus:border-accent";
</script>

<form class="grid gap-3" onsubmit={submit}>
  <div>
    <label for="email" class="mb-1 block text-xs font-medium text-muted">Email</label>
    <input id="email" type="email" required class={inputClass} bind:value={email} />
  </div>
  <div>
    <label for="password" class="mb-1 block text-xs font-medium text-muted">Password</label>
    <input id="password" type="password" required class={inputClass} bind:value={password} />
  </div>

  <label class="flex items-center gap-2 text-xs text-muted">
    <input type="checkbox" bind:checked={rememberMe} class="h-3.5 w-3.5 rounded border-line accent-accent" />
    Stay signed in for 30 days
  </label>

  {#if error}
    <p class="text-xs text-red-500">{error}</p>
  {/if}

  <button
    type="submit"
    disabled={busy}
    class="rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-accent-fg transition-[background-color,box-shadow] hover:bg-accent-hover hover:shadow-elevation-1 disabled:opacity-50 disabled:hover:shadow-none"
  >
    {busy ? "Signing in…" : "Sign in"}
  </button>

  <a href="/forgot-password" class="text-center text-xs text-muted hover:text-heading">
    Forgot your password?
  </a>
</form>
