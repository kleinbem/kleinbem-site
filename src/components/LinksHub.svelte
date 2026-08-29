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
</script>

<div>
  <div class="flex gap-2 mb-4 flex-wrap">
    {#each categories as cat}
      <button
        type="button"
        aria-pressed={active === cat}
        class="px-3 py-1 rounded-full text-xs border transition-colors {active === cat
          ? 'bg-slate-100 text-slate-900 border-slate-100'
          : 'border-slate-700 text-slate-300 hover:border-slate-500'}"
        onclick={() => (active = cat)}
      >
        {cat}
      </button>
    {/each}
  </div>

  <ul class="grid gap-2 sm:grid-cols-2">
    {#each visible as link (link.label)}
      <li animate:flip={{ duration: 200 }} in:fade={{ duration: 150 }} out:fade={{ duration: 100 }}>
        <a
          href={link.url}
          class="block rounded-lg border border-slate-800 bg-slate-900/50 px-4 py-3 hover:border-slate-600 hover:bg-slate-900 transition-colors"
          target={link.url.startsWith("http") ? "_blank" : undefined}
          rel={link.url.startsWith("http") ? "noopener noreferrer" : undefined}
        >
          <span class="block text-sm font-medium text-slate-100">{link.label}</span>
          {#if link.hint}
            <span class="block text-xs text-slate-400 mt-0.5">{link.hint}</span>
          {/if}
        </a>
      </li>
    {/each}
  </ul>
</div>
