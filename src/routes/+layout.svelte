<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import { site } from '$lib/data/site';
	import AuthNav from '$lib/components/AuthNav.svelte';

	let { children } = $props();

	const nav = [
		{ href: '/', label: 'About' },
		{ href: '/services', label: 'Services' },
		{ href: '/courses', label: 'Courses' },
		{ href: '/blog', label: 'Blog' },
		{ href: '/experience', label: 'Experience' },
		{ href: '/#contact', label: 'Contact' }
	];

	const path = $derived(page.url.pathname.replace(/\/$/, '') || '/');
	const isActive = (href: string) =>
		href.includes('#') ? false : href === '/' ? path === '/' : path === href;
</script>

<svelte:head>
	<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
	<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
	<meta name="theme-color" content="#ffffff" />
	<meta name="color-scheme" content="light" />

	<!--
		Cloudflare Web Analytics (privacy-preserving, cookieless — see
		nix/infra/cloudflare-analytics.tf for the Terraform-managed site
		record). auto_install=true is supposed to inject this at the edge
		with zero code changes, but Cloudflare Pages doesn't reliably honor
		that zone-level mechanism — verified live: the beacon never appeared
		in production responses. Adding it directly here is the documented
		workaround and the more robust choice regardless. The token below
		just names the site; it's not a secret, and it's designed to ship
		in page source.
	-->
	<script
		defer
		src="https://static.cloudflareinsights.com/beacon.min.js"
		data-cf-beacon={JSON.stringify({ token: '5d8eac4b56b745be97210a1ec11a7ebd' })}
	></script>
</svelte:head>

<a
	href="#main"
	class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-surface-high focus:px-3 focus:py-2 focus:text-sm focus:text-heading focus:shadow-elevation-2"
>
	Skip to content
</a>

<div class="flex min-h-screen flex-col bg-bg text-fg antialiased">
	<header class="sticky top-0 z-40 bg-surface shadow-elevation-1">
		<div class="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
			<a href="/" class="flex items-center gap-2 font-medium tracking-tight text-heading">
				<span
					class="grid h-8 w-8 place-items-center rounded-lg bg-accent-soft font-mono text-[13px] text-accent-soft-fg"
					aria-hidden="true"
				>
					MK
				</span>
				<span class="hidden sm:inline">{site.name}</span>
			</a>
			<div class="flex items-center gap-2">
				<!-- >=640px: full horizontal nav. Below that it doesn't fit and
				     was overflowing the viewport (real mobile bug, found by
				     testing at a real narrow width). Active-item pill mirrors
				     M3's NavigationBar/Rail "active indicator" pattern. -->
				<nav class="hidden items-center gap-1 text-sm sm:flex">
					{#each nav as item}
						<a
							href={item.href}
							aria-current={isActive(item.href) ? 'page' : undefined}
							class="rounded-full px-3 py-1.5 transition-colors {isActive(item.href)
								? 'bg-accent-soft font-medium text-accent-soft-fg'
								: 'text-muted hover:bg-surface-high hover:text-heading'}"
						>
							{item.label}
						</a>
					{/each}
				</nav>

				<!-- <640px: collapse into a native <details> disclosure — no JS
				     needed for the toggle itself. -->
				<details class="relative sm:hidden">
					<summary
						class="grid h-10 w-10 list-none place-items-center rounded-full text-muted transition-colors hover:bg-surface-high hover:text-heading [&::-webkit-details-marker]:hidden"
						aria-label="Menu"
					>
						<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
							<path
								d="M2 4.5h14M2 9h14M2 13.5h14"
								stroke="currentColor"
								stroke-width="1.5"
								stroke-linecap="round"
							/>
						</svg>
					</summary>
					<div class="absolute right-0 top-full z-50 mt-2 w-52 rounded-xl bg-surface-high p-1.5 shadow-elevation-2">
						{#each nav as item}
							<a
								href={item.href}
								aria-current={isActive(item.href) ? 'page' : undefined}
								class="block rounded-lg px-3 py-2 text-sm transition-colors {isActive(item.href)
									? 'bg-accent-soft font-medium text-accent-soft-fg'
									: 'text-muted hover:bg-surface hover:text-heading'}"
							>
								{item.label}
							</a>
						{/each}
					</div>
				</details>

				<span class="mx-1 hidden h-4 w-px bg-line sm:block" aria-hidden="true"></span>
				<AuthNav />
			</div>
		</div>
	</header>

	<main id="main" class="flex-1">
		{@render children()}
	</main>

	<footer class="mt-24 border-t border-line">
		<div
			class="mx-auto flex max-w-3xl flex-col gap-3 px-6 py-8 text-xs text-muted sm:flex-row sm:items-center sm:justify-between"
		>
			<p>&copy; {new Date().getFullYear()} {site.name}. All rights reserved.</p>
			<nav class="flex gap-4">
				<a href="/services" class="hover:text-heading">Services</a>
				<a href="/courses" class="hover:text-heading">Courses</a>
				<a href="/blog" class="hover:text-heading">Blog</a>
				<a href="/experience" class="hover:text-heading">Experience</a>
				<a href="/privacy" class="hover:text-heading">Privacy</a>
				<a href="/impressum" class="hover:text-heading">Impressum</a>
				<a href={`mailto:${site.email}`} class="hover:text-heading">Email</a>
			</nav>
		</div>
	</footer>
</div>
