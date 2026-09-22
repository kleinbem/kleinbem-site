import { getPosts } from '$lib/blog';
import type { PageServerLoad } from './$types';

export const prerender = true;

export const load: PageServerLoad = () => {
	return {
		posts: getPosts().map((p) => ({
			slug: p.slug,
			title: p.title,
			description: p.description,
			pubDate: p.pubDate.toISOString()
		}))
	};
};
