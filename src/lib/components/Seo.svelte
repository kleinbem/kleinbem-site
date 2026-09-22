<script lang="ts">
	import { page } from '$app/state';
	import { site } from '$lib/data/site';
	import { links } from '$lib/data/links';
	import { skills } from '$lib/data/experience';

	interface Props {
		title?: string;
		description?: string;
		/** "article" for blog posts — switches og:type and adds Article JSON-LD. */
		type?: 'website' | 'article';
		/** ISO 8601 date, required when type="article". */
		publishedTime?: string;
		/** Keep thin utility pages (e.g. login-error) out of search results. */
		noindex?: boolean;
		/** Additional Schema.org structured data (e.g. Service, FAQPage). */
		extraJsonLd?: Record<string, unknown> | Record<string, unknown>[];
	}

	let {
		title = `${site.name} — ${site.role}`,
		description = site.tagline,
		type = 'website',
		publishedTime,
		noindex = false,
		extraJsonLd
	}: Props = $props();

	// www.kleinbem.dev is the domain Pages actually serves (see
	// nix/infra/cloudflare-pages.tf); the apex kleinbem.dev 301s to it.
	// canonical/og:url/sitemap all derive from this — a canonical tag
	// pointing at a redirecting URL is a real Search-Console-flagged issue.
	const SITE_ORIGIN = 'https://www.kleinbem.dev';
	const OG_IMAGE = new URL('/og-image.png', SITE_ORIGIN).href;

	const canonical = $derived(new URL(page.url.pathname, SITE_ORIGIN).href);

	// Only real external profile links qualify as schema.org sameAs identity
	// links — exclude internal pages (Resume/CV → /experience) and any
	// still-placeholder URLs (e.g. LinkedIn/Mastodon before real handles are set).
	const sameAs = links
		.filter((l) => l.url.startsWith('http') && !l.url.includes('your-handle'))
		.map((l) => l.url);

	const personJsonLd = {
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: site.name,
		jobTitle: site.role,
		description: site.tagline,
		url: SITE_ORIGIN,
		image: OG_IMAGE,
		email: site.email,
		sameAs,
		knowsAbout: skills
	};

	const articleJsonLd = $derived(
		type === 'article' && publishedTime
			? {
					'@context': 'https://schema.org',
					'@type': 'BlogPosting',
					headline: title,
					description,
					image: OG_IMAGE,
					url: canonical,
					datePublished: publishedTime,
					author: { '@type': 'Person', name: site.name, url: SITE_ORIGIN }
				}
			: null
	);

	const extraSchemas = $derived(
		extraJsonLd ? (Array.isArray(extraJsonLd) ? extraJsonLd : [extraJsonLd]) : []
	);

	// Matches the old Astro Layout's set:html XSS-escaping of `<` so a
	// data value inside JSON-LD can't close out of the <script> tag early.
	const ldJson = (obj: unknown) => JSON.stringify(obj).replace(/</g, '\\u003c');
</script>

<svelte:head>
	<link rel="canonical" href={canonical} />
	{#if noindex}
		<meta name="robots" content="noindex, nofollow" />
	{/if}

	<title>{title}</title>
	<meta name="description" content={description} />
	<meta name="generator" content="SvelteKit" />

	<meta property="og:type" content={type} />
	<meta property="og:site_name" content={site.name} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content={OG_IMAGE} />
	{#if type === 'article' && publishedTime}
		<meta property="article:published_time" content={publishedTime} />
	{/if}
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={OG_IMAGE} />

	<!--
		schema.org Person structured data — lets search engines and AI
		assistants/agents accurately parse who this site represents rather
		than guessing from prose. See also /llms.txt and the machine-readable
		endpoints under /api/ (profile, services, experience, mcp).
	-->
	<!--
		Svelte parses <script> contents as raw text per the HTML spec, so a
		{@html} or {expression} placed *inside* a literal <script> tag is
		never evaluated — it prints verbatim. The whole tag has to be built
		as one string and injected via a top-level {@html}, mirroring the
		old Astro Layout's set:html approach.
	-->
	{@html `<script type="application/ld+json">${ldJson(personJsonLd)}</script>`}
	{#if articleJsonLd}
		{@html `<script type="application/ld+json">${ldJson(articleJsonLd)}</script>`}
	{/if}
	{#each extraSchemas as schema}
		{@html `<script type="application/ld+json">${ldJson(schema)}</script>`}
	{/each}
</svelte:head>
