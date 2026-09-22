// Replaces @astrojs/sitemap. login-error is deliberately excluded — it's
// noindex (see src/routes/login-error), and listing a noindexed page here
// is a contradictory signal Search Console flags ("Submitted URL marked
// 'noindex'"). auth/* and api/* routes aren't content pages, so they're
// never candidates either.
import type { RequestHandler } from './$types';
import { getPosts } from '$lib/blog';

export const prerender = true;

const SITE_ORIGIN = 'https://www.kleinbem.dev';

const STATIC_PATHS = [
	'/',
	'/services',
	'/courses',
	'/experience',
	'/blog',
	'/impressum',
	'/privacy'
];

export const GET: RequestHandler = async () => {
	const paths = [...STATIC_PATHS, ...getPosts().map((p) => `/blog/${p.slug}`)];

	const urls = paths
		.map((path) => `  <url><loc>${new URL(path, SITE_ORIGIN).href}</loc></url>`)
		.join('\n');

	const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

	return new Response(body, {
		headers: { 'Content-Type': 'application/xml' }
	});
};
