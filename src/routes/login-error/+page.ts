import type { PageLoad } from './$types';

// Reads a search param, so this can't be prerendered.
export const prerender = false;

export const load: PageLoad = ({ url }) => {
	return { reason: url.searchParams.get('reason') };
};
