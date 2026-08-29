<script lang="ts">
  import type { LinkEntry } from "../data/links";
  import { flip } from "svelte/animate";
  import { fade } from "svelte/transition";

  let { links }: { links: LinkEntry[] } = $props();

  const categories = $derived(["All", ...new Set(links.map((l) => l.category))]);
  let active = $state("All");

  const visible = $derived(
    active === "All" ? links : links.filter((l) => l.category === active)
  );

  const isExternal = (url: string) => url.startsWith("http");
</script>

<div>
  <div class="mb-4 flex flex-wrap gap-2">
    {#each categories as cat}
      <button
        type="button"
        aria-pressed={active === cat}
        class="rounded-full border px-3 py-1 text-xs transition-colors {active === cat
          ? 'border-accent-400 bg-accent-500/15 text-accent-300'
          : 'border-ink-700 text-ink-300 hover:border-ink-500 hover:text-ink-100'}"
        onclick={() => (active = cat)}
      >
        {cat}
      </button>
    {/each}
  </div>

  <ul class="grid gap-2 sm:grid-cols-2">
    {#each visible as link (link.label)}
      <li
        animate:flip={{ duration: 200 }}
        in:fade={{ duration: 150 }}
        out:fade={{ duration: 100 }}
      >
        <a
          href={link.url}
          class="group block rounded-lg border border-ink-800 bg-ink-900/50 px-4 py-3 transition-colors hover:border-ink-600 hover:bg-ink-900"
          target={isExternal(link.url) ? "_blank" : undefined}
          rel={isExternal(link.url) ? "noopener noreferrer" : undefined}
        >
          <span class="flex items-center gap-1.5 text-sm font-medium text-ink-100">
            {link.label}
            {#if isExternal(link.url)}
              <svg
                class="h-3 w-3 text-ink-500 transition-colors group-hover:text-accent-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M7 17 17 7M8 7h9v9" />
              </svg>
            {/if}
          </span>
          {#if link.hint}
            <span class="mt-0.5 block text-xs text-ink-400">{link.hint}</span>
          {/if}
        </a>
      </li>
    {/each}
  </ul>
</div>
