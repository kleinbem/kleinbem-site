import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { site } from '$lib/data/site';
import { links } from '$lib/data/links';

export const prerender = false;

const CORS_HEADERS = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'GET, OPTIONS',
	'Cache-Control': 'public, max-age=3600'
};

export const GET: RequestHandler = async () => {
	return json(
		{
			name: site.name,
			role: site.role,
			tagline: site.tagline,
			bio: site.bio.replace(/\s+/g, ' ').trim(),
			email: site.email,
			location: site.location,
			url: 'https://www.kleinbem.dev',
			links: links.filter((l) => !l.url.includes('your-handle'))
		},
		{ headers: CORS_HEADERS }
	);
};

export const OPTIONS: RequestHandler = async () => new Response(null, { headers: CORS_HEADERS });
