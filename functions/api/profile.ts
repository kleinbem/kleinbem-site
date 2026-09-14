import { site } from "../../src/data/site";
import { links } from "../../src/data/links";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Cache-Control": "public, max-age=3600",
};

export const onRequestGet: PagesFunction = async () => {
  return Response.json(
    {
      name: site.name,
      role: site.role,
      tagline: site.tagline,
      bio: site.bio.replace(/\s+/g, " ").trim(),
      email: site.email,
      location: site.location,
      url: "https://kleinbem.dev",
      links: links.filter((l) => !l.url.includes("your-handle")),
    },
    { headers: CORS_HEADERS },
  );
};

export const onRequestOptions: PagesFunction = async () => new Response(null, { headers: CORS_HEADERS });
