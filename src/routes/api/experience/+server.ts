import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { experience, skills } from '$lib/data/experience';

export const prerender = false;

const CORS_HEADERS = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'GET, OPTIONS',
	'Cache-Control': 'public, max-age=3600'
};

export const GET: RequestHandler = async () =>
	json({ experience, skills }, { headers: CORS_HEADERS });

export const OPTIONS: RequestHandler = async () => new Response(null, { headers: CORS_HEADERS });
