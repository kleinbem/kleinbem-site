import { experience, skills } from "../../src/data/experience";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Cache-Control": "public, max-age=3600",
};

export const onRequestGet: PagesFunction = async () =>
  Response.json({ experience, skills }, { headers: CORS_HEADERS });

export const onRequestOptions: PagesFunction = async () => new Response(null, { headers: CORS_HEADERS });
