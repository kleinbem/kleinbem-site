<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import { site } from '$lib/data/site';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const dateFmt = new Intl.DateTimeFormat('en-IE', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
</script>

<Seo
	title={`${data.title} — ${site.name}`}
	description={data.description}
	type="article"
	publishedTime={data.pubDate}
/>

<article class="mx-auto max-w-3xl px-6 pt-16 pb-12">
	<a href="/blog" class="text-sm text-muted transition-colors hover:text-heading">&larr; Blog</a>
	<p class="mt-6 font-mono text-xs text-muted">{dateFmt.format(new Date(data.pubDate))}</p>
	<h1 class="mt-1 text-3xl font-semibold tracking-tight text-heading sm:text-4xl">
		{data.title}
	</h1>
	<div class="prose mt-8 text-[15px] leading-relaxed text-fg">
		{@html data.html}
	</div>
</article>
