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

<Seo title={`Blog — ${site.name}`} />

<section class="mx-auto max-w-3xl px-6 pt-16 pb-12">
	<h1 class="text-3xl font-semibold tracking-tight text-heading sm:text-4xl">Blog</h1>
	<p class="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted">
		Notes on infrastructure, platform engineering, and building things that stay up.
	</p>

	<ol class="mt-10 space-y-6">
		{#each data.posts as post}
			<li>
				<a
					href={`/blog/${post.slug}`}
					class="group block rounded-xl bg-surface p-6 shadow-elevation-1 transition-shadow hover:shadow-elevation-2"
				>
					<p class="font-mono text-xs text-muted">{dateFmt.format(new Date(post.pubDate))}</p>
					<h2 class="mt-1 font-medium text-heading group-hover:text-accent">
						{post.title}
					</h2>
					<p class="mt-2 text-sm leading-relaxed text-muted">{post.description}</p>
				</a>
			</li>
		{/each}
	</ol>

	{#if data.posts.length === 0}
		<p class="mt-10 text-sm text-muted">No posts yet — check back soon.</p>
	{/if}
</section>
