import { error } from '@sveltejs/kit';
import { getPost, getPosts } from '$lib/blog';
import type { EntryGenerator, PageServerLoad } from './$types';

export const prerender = true;

export const entries: EntryGenerator = () => {
	return getPosts().map((p) => ({ slug: p.slug }));
};

export const load: PageServerLoad = ({ params }) => {
	const post = getPost(params.slug);
	if (!post) error(404, 'Post not found');
	return {
		title: post.title,
		description: post.description,
		pubDate: post.pubDate.toISOString(),
		html: post.html
	};
};
