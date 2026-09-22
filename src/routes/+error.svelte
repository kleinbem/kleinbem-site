<script lang="ts">
	import { page } from '$app/state';
	import Seo from '$lib/components/Seo.svelte';
	import { site } from '$lib/data/site';

	const isNotFound = $derived(page.status === 404);
</script>

<Seo
	title={isNotFound ? `Page not found — ${site.name}` : `Error — ${site.name}`}
	description={isNotFound ? "This page doesn't exist." : 'An error occurred.'}
	noindex
/>

<section class="mx-auto max-w-3xl px-6 pt-24 pb-16 text-center">
	<p class="font-mono text-xs uppercase tracking-[0.2em] text-accent">{page.status}</p>
	<h1 class="mt-4 text-3xl font-semibold tracking-tight text-heading sm:text-4xl">
		{isNotFound ? 'Page not found' : 'Something went wrong'}
	</h1>
	<p class="mt-4 text-[15px] leading-relaxed text-muted">
		{isNotFound
			? "The page you're looking for doesn't exist or has moved."
			: (page.error?.message ?? 'An unexpected error occurred.')}
	</p>
	<a
		href="/"
		class="mt-8 inline-flex items-center rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-accent-fg transition-[background-color,box-shadow] hover:bg-accent-hover hover:shadow-elevation-1"
	>
		Back to homepage
	</a>
</section>
