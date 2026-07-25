#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadEndpoints, type EndpointDef, type ParamDef } from "./docs.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// dist/index.js -> package root -> docs/thesports (bundled alongside this package)
const DOCS_DIR = process.env.THESPORTS_DOCS_DIR
  ? path.resolve(process.env.THESPORTS_DOCS_DIR)
  : path.resolve(__dirname, "../docs/thesports");

const BASE_URL = (process.env.THESPORTS_BASE_URL || "https://api.thesports.com").replace(/\/$/, "");
const USER = process.env.THESPORTS_USER;
const SECRET = process.env.THESPORTS_SECRET;

// Keep tool responses well inside typical LLM context budgets; list endpoints
// can return thousands of rows and the docs already support page/time/uuid
// narrowing, so truncating (rather than paginating for the caller) is enough.
const MAX_RESPONSE_CHARS = 40_000;

function buildInputShape(params: ParamDef[]): z.ZodRawShape {
  const shape: z.ZodRawShape = {};
  for (const p of params) {
    if (p.name === "user" || p.name === "secret") continue; // injected server-side
    const base: z.ZodTypeAny = p.type === "integer" ? z.number().int() : z.string();
    const described = base.describe(p.description || p.name);
    shape[p.name] = p.required ? described : described.optional();
  }
  return shape;
}

async function callEndpoint(endpoint: EndpointDef, args: Record<string, unknown>): Promise<string> {
  if (!USER || !SECRET) {
    throw new Error(
      "THESPORTS_USER / THESPORTS_SECRET are not set. Configure them in this MCP server's env before calling any tool."
    );
  }

  const query = new URLSearchParams();
  query.set("user", USER);
  query.set("secret", SECRET);
  for (const [key, value] of Object.entries(args)) {
    if (value === undefined || value === null) continue;
    query.set(key, String(value));
  }

  const url = `${BASE_URL}${endpoint.urlPath}?${query.toString()}`;
  const res = await fetch(url, { method: endpoint.method });
  const text = await res.text();

  if (!res.ok) {
    throw new Error(`thesports ${endpoint.toolName} returned HTTP ${res.status}: ${text.slice(0, 500)}`);
  }

  // TheSports puts gateway auth errors and rate limits inside an HTTP 200 body
  // instead of using HTTP status codes, so they must be checked explicitly.
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    parsed = undefined;
  }
  if (parsed && typeof parsed === "object") {
    const obj = parsed as Record<string, unknown>;
    if (typeof obj.err === "string" && obj.err) {
      throw new Error(`thesports gateway error on ${endpoint.urlPath}: ${obj.err}`);
    }
    if (obj.code === 429) {
      throw new Error(`thesports rate limited (code 429) on ${endpoint.urlPath}. Retry after a short delay.`);
    }
  }

  if (text.length > MAX_RESPONSE_CHARS) {
    return (
      text.slice(0, MAX_RESPONSE_CHARS) +
      `\n... [truncated ${text.length - MAX_RESPONSE_CHARS} chars; narrow the query with page/uuid/time params]`
    );
  }
  return text;
}

async function main() {
  const endpoints = await loadEndpoints(DOCS_DIR);
  if (endpoints.length === 0) {
    console.error(`[thesports-mcp] No endpoint docs found in ${DOCS_DIR}`);
  }

  const server = new McpServer({ name: "thesports", version: "1.0.0" });

  for (const endpoint of endpoints) {
    server.registerTool(
      endpoint.toolName,
      {
        title: endpoint.title,
        description: `${endpoint.description} (${endpoint.method} ${endpoint.urlPath})`.trim(),
        inputSchema: buildInputShape(endpoint.params),
      },
      async (args) => {
        try {
          const body = await callEndpoint(endpoint, args as Record<string, unknown>);
          return { content: [{ type: "text" as const, text: body }] };
        } catch (err) {
          return {
            content: [{ type: "text" as const, text: err instanceof Error ? err.message : String(err) }],
            isError: true,
          };
        }
      }
    );
  }

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`[thesports-mcp] ready — ${endpoints.length} tools registered from ${DOCS_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
