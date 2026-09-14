<script lang="ts">
  import { authClient } from "../lib/auth-client";
  import TurnstileWidget from "./TurnstileWidget.svelte";

  let name = $state("");
  let email = $state("");
  let password = $state("");
  let confirmPassword = $state("");
  let website = $state(""); // honeypot — hidden below, checked server-side (auth.ts hook)
  let turnstileToken = $state("");
  let busy = $state(false);
  let error = $state("");

  async function submit(e: SubmitEvent) {
    e.preventDefault();
    if (password !== confirmPassword) {
      error = "Passwords don't match";
      return;
    }
    busy = true;
    error = "";
    try {
      const res = await authClient.signUp.email({
        name,
        email,
        password,
        website,
        turnstileToken,
        callbackURL: location.origin,
      });
      if (res.error) {
        error = res.error.message ?? "Registration failed";
        busy = false;
        return;
      }
      location.href = "/";
    } catch (err) {
      console.error("registration failed", err);
      error = "Something went wrong — please try again.";
      busy = false;
    }
  }

  const inputClass =
    "w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm text-fg outline-none transition-colors focus:border-accent";
</script>

<form class="grid gap-3" onsubmit={submit}>
  <input
    type="text"
    name="website"
    bind:value={website}
    tabindex="-1"
    autocomplete="off"
    aria-hidden="true"
    class="absolute h-0 w-0 opacity-0"
  />

  <div>
    <label for="name" class="mb-1 block text-xs font-medium text-muted">Name</label>
    <input id="name" type="text" required class={inputClass} bind:value={name} />
  </div>
  <div>
    <label for="email" class="mb-1 block text-xs font-medium text-muted">Email</label>
    <input id="email" type="email" required class={inputClass} bind:value={email} />
  </div>
  <div>
    <label for="password" class="mb-1 block text-xs font-medium text-muted">Password</label>
    <input
      id="password"
      type="password"
      required
      minlength="8"
      class={inputClass}
      bind:value={password}
    />
    <p class="mt-1 text-xs text-muted">At least 8 characters.</p>
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

  <TurnstileWidget onToken={(t) => (turnstileToken = t)} />

  {#if error}
    <p class="text-xs text-red-500">{error}</p>
  {/if}

  <button
    type="submit"
    disabled={busy || !turnstileToken}
    class="rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-accent-fg transition-colors hover:bg-accent-hover disabled:opacity-50"
  >
    {busy ? "Creating account…" : "Create account"}
  </button>

  <p class="text-center text-xs text-muted">
    By creating an account you agree to the <a href="/privacy" class="text-heading underline"
      >Privacy Policy</a
    >.
  </p>
</form>
