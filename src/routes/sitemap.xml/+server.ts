// login-error and courses (until a course exists) are noindex, and Search Console flags noindexed pages in a sitemap
// ("Submitted URL marked 'noindex'"), so it stays out. auth/* and api/* aren't pages.
import type { RequestHandler } from './$types';
import { getPosts } from '#lib/blog/index.js';

export const prerender = true;

const SITE_ORIGIN = 'https://www.kleinbem.dev';

const STATIC_PATHS = [
	'/',
	'/services',
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
