import matter from 'gray-matter';
import { marked } from 'marked';

export type BlogPost = {
	slug: string;
	title: string;
	description: string;
	pubDate: Date;
	draft: boolean;
	html: string;
};

// eager + ?raw so parsing happens at module-eval time, synchronously — these
// routes are all prerendered, so this only ever runs at build time.
const modules = import.meta.glob('./posts/*.md', {
	eager: true,
	query: '?raw',
	import: 'default'
}) as Record<string, string>;

function parsePost(slug: string, raw: string): BlogPost {
	const { data, content } = matter(raw);
	if (typeof data.title !== 'string' || typeof data.description !== 'string' || !data.pubDate) {
		throw new Error(`blog post "${slug}" is missing required frontmatter (title/description/pubDate)`);
	}
	return {
		slug,
		title: data.title,
		description: data.description,
		pubDate: new Date(data.pubDate),
		draft: data.draft === true,
		html: marked.parse(content, { async: false }) as string
	};
}

const posts: BlogPost[] = Object.entries(modules).map(([path, raw]) => {
	const slug = path.replace('./posts/', '').replace(/\.md$/, '');
	return parsePost(slug, raw);
});

export function getPosts(): BlogPost[] {
	return posts.filter((p) => !p.draft).sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());
}

export function getPost(slug: string): BlogPost | undefined {
	return posts.find((p) => p.slug === slug && !p.draft);
}
