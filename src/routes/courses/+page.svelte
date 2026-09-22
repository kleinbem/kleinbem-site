<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import { site } from '$lib/data/site';
	import { courses } from '$lib/data/courses';

	const statusStyle: Record<string, string> = {
		Available: 'bg-accent-soft text-accent-soft-fg',
		'In development': 'border border-outline text-muted',
		'Coming soon': 'border border-outline text-muted'
	};
</script>

<Seo title={`Courses — ${site.name}`} />

<section class="mx-auto max-w-3xl px-6 pt-16 pb-12">
	<h1 class="text-3xl font-semibold tracking-tight text-heading sm:text-4xl">Courses</h1>
	<p class="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted">
		Structured, practical courses on infrastructure automation and platform engineering. Content
		is still being written — the list below is a placeholder for what's coming.
	</p>

	<div class="mt-10 grid gap-4">
		{#each courses as course}
			<article class="rounded-xl bg-surface p-6 shadow-elevation-1 transition-shadow hover:shadow-elevation-2">
				<div class="flex flex-wrap items-center gap-x-3 gap-y-1">
					<h2 class="font-medium text-heading">{course.title}</h2>
					<span class="rounded-lg px-2 py-0.5 font-mono text-[11px] uppercase tracking-wide {statusStyle[course.status]}">
						{course.status}
					</span>
				</div>
				<p class="mt-2 text-sm leading-relaxed text-muted">{course.description}</p>
			</article>
		{/each}
	</div>

	<div class="mt-12 rounded-xl bg-accent-soft p-6">
		<p class="text-[15px] text-accent-soft-fg">Want to know when a course ships?</p>
		<p class="mt-1 text-sm text-accent-soft-fg opacity-80">
			Course announcements go out on the newsletter first.
		</p>
		<a
			href="https://kleinbem.substack.com"
			target="_blank"
			rel="noopener noreferrer"
			class="mt-3 inline-flex items-center rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-accent-fg transition-[background-color,box-shadow] hover:bg-accent-hover hover:shadow-elevation-1"
		>
			Subscribe on Substack
		</a>
	</div>
</section>
