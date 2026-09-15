<script lang="ts">
  import { createForm } from "@tanstack/svelte-form";
  import TurnstileWidget from "./TurnstileWidget.svelte";

  let { email }: { email: string } = $props();

  let sent = $state(false);
  let failed = $state(false);
  let turnstileToken = $state("");

  const form = createForm(() => ({
    defaultValues: { name: "", email: "", message: "", company: "" },
    onSubmit: async ({ value }) => {
      failed = false;
      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...value, turnstileToken }),
        });
        if (!res.ok) throw new Error(`contact endpoint returned ${res.status}`);
        sent = true;
      } catch (err) {
        console.error("contact form submission failed", err);
        failed = true;
      }
    },
  }));

  const inputClass =
    "w-full rounded border-2 border-outline bg-bg px-3 py-2 text-sm text-fg outline-none transition-colors focus:border-accent";
</script>

<form
  class="grid gap-4"
  onsubmit={(e) => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  }}
>
  <form.Field name="company">
    {#snippet children(field)}
      <input
        type="text"
        name={field.name}
        value={field.state.value}
        oninput={(e) => field.handleChange(e.currentTarget.value)}
        tabindex="-1"
        autocomplete="off"
        aria-hidden="true"
        class="absolute h-0 w-0 opacity-0"
      />
    {/snippet}
  </form.Field>

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

  <TurnstileWidget onToken={(t) => (turnstileToken = t)} />

  <form.Subscribe selector={(s) => ({ canSubmit: s.canSubmit, submitting: s.isSubmitting })}>
    {#snippet children({ canSubmit, submitting })}
      <button
        type="submit"
        disabled={!canSubmit || !turnstileToken}
        class="inline-flex w-fit items-center rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-accent-fg transition-[background-color,box-shadow] hover:bg-accent-hover hover:shadow-elevation-1 disabled:opacity-50 disabled:hover:shadow-none"
      >
        {submitting ? "Sending…" : "Send"}
      </button>
    {/snippet}
  </form.Subscribe>

  {#if sent}
    <p class="text-xs text-muted">Thanks — your message is on its way.</p>
  {:else if failed}
    <p class="text-xs text-red-500">
      Something went wrong sending that. Feel free to email me directly at {email} instead.
    </p>
  {/if}
</form>
