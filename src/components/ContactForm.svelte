<script lang="ts">
  import { createForm } from "@tanstack/svelte-form";

  let { email }: { email: string } = $props();

  let sent = $state(false);

  const form = createForm(() => ({
    defaultValues: { name: "", email: "", message: "" },
    onSubmit: async ({ value }) => {
      // Static site, no backend yet — hand off to the visitor's mail client
      // with the message prefilled. Swap for a real endpoint once one exists.
      const subject = `Website contact from ${value.name}`;
      const body = `${value.message}\n\n— ${value.name} (${value.email})`;
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;
      sent = true;
    },
  }));

  const inputClass =
    "w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm text-fg outline-none transition-colors focus:border-accent";
</script>

<form
  class="grid gap-4"
  onsubmit={(e) => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  }}
>
  <form.Field
    name="name"
    validators={{
      onBlur: ({ value }) => (value.trim().length === 0 ? "Name is required" : undefined),
    }}
  >
    {#snippet children(field)}
      <div>
        <label for={field.name} class="mb-1 block text-xs font-medium text-muted">Name</label>
        <input
          id={field.name}
          name={field.name}
          class={inputClass}
          value={field.state.value}
          onblur={field.handleBlur}
          oninput={(e) => field.handleChange(e.currentTarget.value)}
        />
        {#each field.state.meta.errors as error}
          <p class="mt-1 text-xs text-red-500">{error}</p>
        {/each}
      </div>
    {/snippet}
  </form.Field>

  <form.Field
    name="email"
    validators={{
      onBlur: ({ value }) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? undefined : "Enter a valid email",
    }}
  >
    {#snippet children(field)}
      <div>
        <label for={field.name} class="mb-1 block text-xs font-medium text-muted">Email</label>
        <input
          id={field.name}
          name={field.name}
          type="email"
          class={inputClass}
          value={field.state.value}
          onblur={field.handleBlur}
          oninput={(e) => field.handleChange(e.currentTarget.value)}
        />
        {#each field.state.meta.errors as error}
          <p class="mt-1 text-xs text-red-500">{error}</p>
        {/each}
      </div>
    {/snippet}
  </form.Field>

  <form.Field
    name="message"
    validators={{
      onBlur: ({ value }) => (value.trim().length === 0 ? "Message is required" : undefined),
    }}
  >
    {#snippet children(field)}
      <div>
        <label for={field.name} class="mb-1 block text-xs font-medium text-muted">Message</label>
        <textarea
          id={field.name}
          name={field.name}
          rows="4"
          class={inputClass}
          value={field.state.value}
          onblur={field.handleBlur}
          oninput={(e) => field.handleChange(e.currentTarget.value)}
        ></textarea>
        {#each field.state.meta.errors as error}
          <p class="mt-1 text-xs text-red-500">{error}</p>
        {/each}
      </div>
    {/snippet}
  </form.Field>

  <form.Subscribe selector={(s) => ({ canSubmit: s.canSubmit, submitting: s.isSubmitting })}>
    {#snippet children({ canSubmit, submitting })}
      <button
        type="submit"
        disabled={!canSubmit}
        class="inline-flex w-fit items-center rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-fg transition-colors hover:bg-accent-hover disabled:opacity-50"
      >
        {submitting ? "Opening your mail app…" : "Send"}
      </button>
    {/snippet}
  </form.Subscribe>

  {#if sent}
    <p class="text-xs text-muted">
      Your mail app should have opened with the message ready to send. If it didn't, email
      directly at {email}.
    </p>
  {/if}
</form>
