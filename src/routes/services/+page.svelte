<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import { site } from '$lib/data/site';
	import { services, faqs } from '$lib/data/services';

	const SITE_ORIGIN = 'https://www.kleinbem.dev';

	const serviceSchemas = services.map((service) => ({
		'@context': 'https://schema.org',
		'@type': 'Service',
		name: service.title,
		serviceType: service.title,
		description: service.description,
		provider: {
			'@type': 'Person',
			name: site.name,
			url: SITE_ORIGIN
		},
		areaServed: 'Worldwide',
		hasOfferCatalog: {
			'@type': 'OfferCatalog',
			name: `${service.title} Deliverables`,
			itemListElement: service.deliverables.map((item, idx) => ({
				'@type': 'Offer',
				itemOffered: {
					'@type': 'Service',
					name: item
				},
				position: idx + 1
			}))
		}
	}));

	const faqSchema = {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: faqs.map((faq) => ({
			'@type': 'Question',
			name: faq.question,
			acceptedAnswer: {
				'@type': 'Answer',
				text: faq.answer
			}
		}))
	};

	const extraJsonLd = [...serviceSchemas, faqSchema];
</script>

<Seo
	title={`Services — ${site.name}`}
	description="Infrastructure automation, platform & DevOps consulting, and migration & modernization services by Martin Kleinberger."
	{extraJsonLd}
/>

<section class="mx-auto max-w-3xl px-6 pt-16 pb-12">
	<header>
		<h1 class="text-3xl font-semibold tracking-tight text-heading sm:text-4xl">Services</h1>
		<p class="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted">
			I work with engineering teams to build reproducible, low-toil infrastructure platforms.
			Engagements are scoped as advisory retainers, fixed-scope modernization projects, or
			targeted architecture audits.
		</p>
	</header>

	<!-- Service Offerings -->
	<div class="mt-10 grid gap-6">
		{#each services as service}
			<article
				id={service.id}
				class="rounded-xl bg-surface p-6 shadow-elevation-1 transition-shadow hover:shadow-elevation-2"
			>
				<div class="flex flex-col gap-1">
					<h2 class="text-lg font-semibold tracking-tight text-heading sm:text-xl">
						{service.title}
					</h2>
					<p class="mt-2 text-[15px] leading-relaxed text-muted">
						{service.description}
					</p>
				</div>

				<div class="mt-4 rounded-lg bg-bg/60 p-3 text-xs leading-relaxed text-muted">
					<span class="font-medium text-heading">Ideal for:</span>
					{service.target}
				</div>

				<div class="mt-5 border-t border-outline/40 pt-4">
					<h3 class="text-xs font-mono uppercase tracking-wider text-muted">Key Deliverables</h3>
					<ul class="mt-3 grid gap-2.5 sm:grid-cols-2">
						{#each service.deliverables as item}
							<li class="flex items-start gap-2 text-sm text-fg">
								<svg
									class="mt-0.5 h-4 w-4 shrink-0 text-accent"
									viewBox="0 0 20 20"
									fill="currentColor"
									aria-hidden="true"
								>
									<path
										fill-rule="evenodd"
										d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
										clip-rule="evenodd"
									/>
								</svg>
								<span class="leading-snug">{item}</span>
							</li>
						{/each}
					</ul>
				</div>
			</article>
		{/each}
	</div>

	<!-- FAQ / Answer Engine Optimization -->
	<div class="mt-16">
		<h2 class="text-2xl font-semibold tracking-tight text-heading">Frequently Asked Questions</h2>
		<p class="mt-2 text-sm text-muted">
			Direct answers to common questions about tools, engagement structure, and project scopes.
		</p>

		<div class="mt-6 grid gap-3">
			{#each faqs as faq}
				<details
					class="group rounded-xl bg-surface p-5 shadow-elevation-1 transition-shadow hover:shadow-elevation-2 [&_summary::-webkit-details-marker]:hidden"
				>
					<summary class="flex cursor-pointer items-center justify-between gap-4 font-medium text-heading">
						<span class="text-[15px]">{faq.question}</span>
						<svg
							class="h-5 w-5 shrink-0 text-muted transition-transform duration-200 group-open:rotate-180"
							viewBox="0 0 20 20"
							fill="currentColor"
							aria-hidden="true"
						>
							<path
								fill-rule="evenodd"
								d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
								clip-rule="evenodd"
							/>
						</svg>
					</summary>
					<p class="mt-3 text-sm leading-relaxed text-muted">
						{faq.answer}
					</p>
				</details>
			{/each}
		</div>
	</div>

	<!-- Contact CTA -->
	<div class="mt-14 rounded-xl bg-accent-soft p-6">
		<h2 class="text-lg font-medium text-accent-soft-fg">Have a project in mind?</h2>
		<p class="mt-1 text-sm text-accent-soft-fg opacity-85">
			Whether you need an architecture review, a fleet migration, or guidance on declarative
			infrastructure, let's discuss your timeline and goals.
		</p>
		<a
			href={`mailto:${site.email}`}
			class="mt-4 inline-flex items-center rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-accent-fg transition-[background-color,box-shadow] hover:bg-accent-hover hover:shadow-elevation-1"
		>
			Get in touch
		</a>
	</div>
</section>
