// Minimal remote MCP (Model Context Protocol) server exposing this site's
// public profile data as read-only tools, for AI agents/assistants that
// speak MCP instead of scraping HTML. Deliberately dependency-free (no
// @modelcontextprotocol/sdk) and fully stateless — every tool here is a
// pure read of static data, so there's no need for session management or
// the SSE half of the Streamable HTTP transport; every response is a
// single JSON-RPC object. See https://modelcontextprotocol.io.
import { site } from "../../src/data/site";
import { links } from "../../src/data/links";
import { services, faqs } from "../../src/data/services";
import { experience, skills } from "../../src/data/experience";

const PROTOCOL_VERSION = "2025-06-18";
const SERVER_INFO = { name: "kleinbem-dev", version: "1.0.0" };

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Mcp-Session-Id",
};

type JsonRpcRequest = {
  jsonrpc: "2.0";
  id?: string | number | null;
  method: string;
  params?: Record<string, unknown>;
};

const TOOLS = [
  {
    name: "get_profile",
    description:
      "Get Martin Kleinberger's professional profile: name, role, tagline, bio, contact email, and location/availability.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "get_services",
    description:
      "List the consulting services Martin Kleinberger offers, including key deliverables, target clients, and FAQs.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "get_experience",
    description: "Get Martin Kleinberger's work experience history and skill list.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "get_links",
    description:
      "Get links to Martin Kleinberger's professional profiles and social accounts (GitHub, X, Substack, etc).",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
] as const;

function callTool(name: string): unknown {
  switch (name) {
    case "get_profile":
      return {
        name: site.name,
        role: site.role,
        tagline: site.tagline,
        bio: site.bio.replace(/\s+/g, " ").trim(),
        email: site.email,
        location: site.location,
        url: "https://www.kleinbem.dev",
      };
    case "get_services":
      return { services, faqs };
    case "get_experience":
      return { experience, skills };
    case "get_links":
      return { links: links.filter((l) => !l.url.includes("your-handle")) };
    default:
      return undefined;
  }
}

function jsonRpcResult(id: JsonRpcRequest["id"], result: unknown) {
  return Response.json({ jsonrpc: "2.0", id, result }, { headers: CORS_HEADERS });
}

function jsonRpcError(id: JsonRpcRequest["id"], code: number, message: string) {
  return Response.json({ jsonrpc: "2.0", id: id ?? null, error: { code, message } }, {
    status: code === -32700 || code === -32600 ? 400 : 200,
    headers: CORS_HEADERS,
  });
}

export const onRequestGet: PagesFunction = async () =>
  Response.json(
    {
      name: SERVER_INFO.name,
      description: "Remote MCP server for kleinbem.dev — see https://modelcontextprotocol.io",
      protocol: "MCP (Model Context Protocol)",
      transport: "Streamable HTTP — POST JSON-RPC 2.0 to this URL",
      tools: TOOLS.map((t) => t.name),
    },
    { headers: CORS_HEADERS },
  );

export const onRequestOptions: PagesFunction = async () => new Response(null, { headers: CORS_HEADERS });

export const onRequestPost: PagesFunction = async ({ request }) => {
  let msg: JsonRpcRequest;
  try {
    msg = await request.json();
  } catch {
    return jsonRpcError(null, -32700, "Parse error");
  }

  const { id, method, params } = msg;
  const isNotification = id === undefined;

  switch (method) {
    case "initialize":
      return jsonRpcResult(id, {
        protocolVersion: PROTOCOL_VERSION,
        capabilities: { tools: {} },
        serverInfo: SERVER_INFO,
      });

    case "notifications/initialized":
      // Notifications get no JSON-RPC response, just a bare 202.
      return new Response(null, { status: 202, headers: CORS_HEADERS });

    case "ping":
      return jsonRpcResult(id, {});

    case "tools/list":
      return jsonRpcResult(id, { tools: TOOLS });

    case "tools/call": {
      const toolName = params?.name as string | undefined;
      const tool = TOOLS.find((t) => t.name === toolName);
      if (!tool) {
        return isNotification
          ? new Response(null, { status: 202, headers: CORS_HEADERS })
          : jsonRpcError(id, -32602, `Unknown tool: ${toolName}`);
      }
      const data = callTool(tool.name);
      return jsonRpcResult(id, {
        content: [{ type: "text", text: JSON.stringify(data) }],
        isError: false,
      });
    }

    default:
      return isNotification
        ? new Response(null, { status: 202, headers: CORS_HEADERS })
        : jsonRpcError(id, -32601, `Method not found: ${method}`);
  }
};
