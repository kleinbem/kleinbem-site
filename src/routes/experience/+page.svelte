<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import { site } from '$lib/data/site';
	import { experience, skills } from '$lib/data/experience';
</script>

<Seo
	title={`Experience — ${site.name}`}
	description={`A decade of infrastructure and platform engineering experience — roles, highlights, and skills for ${site.name}.`}
/>

<section class="mx-auto max-w-3xl px-6 pt-16 pb-12">
	<h1 class="text-3xl font-semibold tracking-tight text-heading sm:text-4xl">Experience</h1>
	<p class="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted">
		A decade of building and running infrastructure — the highlights below, with a focus on
		measurable outcomes.
	</p>

	<ul class="mt-8 flex flex-wrap gap-2">
		{#each skills as skill}
			<li class="rounded-lg border border-outline px-3 py-1.5 text-xs text-muted">
				{skill}
			</li>
		{/each}
	</ul>

	<ol class="mt-12 space-y-10">
		{#each experience as role}
			<li class="relative border-l border-line pl-6">
				<span class="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-accent" aria-hidden="true"
				></span>
				<div class="flex flex-wrap items-baseline gap-x-3">
					<h2 class="font-medium text-heading">{role.title}</h2>
					<span class="text-sm text-muted">{role.org}</span>
					<span class="ml-auto font-mono text-xs text-muted">{role.period}</span>
				</div>
				<p class="mt-2 text-sm leading-relaxed text-fg">{role.summary}</p>
				<ul class="mt-3 space-y-1.5 text-sm text-muted">
					{#each role.highlights as h}
						<li class="relative pl-4 before:absolute before:left-0 before:text-accent before:content-['—']">
							{h}
						</li>
					{/each}
				</ul>
			</li>
		{/each}
	</ol>
</section>
