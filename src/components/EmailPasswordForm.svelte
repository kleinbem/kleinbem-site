<script lang="ts">
  import { authClient } from "../lib/auth-client";

  let email = $state("");
  let password = $state("");
  let busy = $state(false);
  let error = $state("");

  async function submit(e: SubmitEvent) {
    e.preventDefault();
    busy = true;
    error = "";
    try {
      const redirectPath = new URLSearchParams(location.search).get("redirect") || "/";
      const callbackURL = new URL(redirectPath, location.origin).toString();
      const res = await authClient.signIn.email({ email, password, callbackURL });
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
    "w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm text-fg outline-none transition-colors focus:border-accent";
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

  {#if error}
    <p class="text-xs text-red-500">{error}</p>
  {/if}

  <button
    type="submit"
    disabled={busy}
    class="rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-accent-fg transition-colors hover:bg-accent-hover disabled:opacity-50"
  >
    {busy ? "Signing in…" : "Sign in"}
  </button>

  <a href="/forgot-password" class="text-center text-xs text-muted hover:text-heading">
    Forgot your password?
  </a>
</form>
