<script lang="ts">
  import { authClient } from "../lib/auth-client";

  let email = $state("");
  let busy = $state(false);
  let sent = $state(false);

  async function submit(e: SubmitEvent) {
    e.preventDefault();
    busy = true;
    try {
      await authClient.requestPasswordReset({
        email,
        redirectTo: `${location.origin}/reset-password`,
      });
    } catch (err) {
      // Deliberately still shows the generic success message below — don't
      // reveal via a different UI state whether an account exists for this
      // email (standard practice for reset-password flows).
      console.error("password reset request failed", err);
    } finally {
      busy = false;
      sent = true;
    }
  }

  const inputClass =
    "w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm text-fg outline-none transition-colors focus:border-accent";
</script>

{#if sent}
  <p class="text-[15px] leading-relaxed text-muted">
    If an account exists for that email, a reset link is on its way. Check your inbox.
  </p>
{:else}
  <form class="grid gap-3" onsubmit={submit}>
    <div>
      <label for="email" class="mb-1 block text-xs font-medium text-muted">Email</label>
      <input id="email" type="email" required class={inputClass} bind:value={email} />
    </div>

    <button
      type="submit"
      disabled={busy}
      class="rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-accent-fg transition-colors hover:bg-accent-hover disabled:opacity-50"
    >
      {busy ? "Sending…" : "Send reset link"}
    </button>
  </form>
{/if}
