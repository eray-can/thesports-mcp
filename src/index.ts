#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadEndpoints } from "./docs.js";
import { callRawEndpoint, truncate } from "./client.js";
import { buildTools } from "./tools.js";
import { warmCatalogues } from "./resolver.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// dist/index.js -> package root -> docs/thesports (bundled alongside this package)
const DOCS_DIR = process.env.THESPORTS_DOCS_DIR
  ? path.resolve(process.env.THESPORTS_DOCS_DIR)
  : path.resolve(__dirname, "../docs/thesports");

function asText(value: unknown) {
  const text = typeof value === "string" ? value : JSON.stringify(value, null, 2);
  return { content: [{ type: "text" as const, text: truncate(text) }] };
}

function asError(err: unknown) {
  return {
    content: [{ type: "text" as const, text: err instanceof Error ? err.message : String(err) }],
    isError: true,
  };
}

async function main() {
  const server = new McpServer({ name: "thesports", version: "2.0.0" });

  // Task-shaped tools: these speak in team names, readable event labels and
  // resolved scores, so a caller never has to know a TheSports uuid exists.
  const tools = buildTools(DOCS_DIR);
  for (const tool of tools) {
    server.registerTool(
      tool.name,
      { title: tool.title, description: tool.description, inputSchema: tool.schema },
      async (args) => {
        try {
          return asText(await tool.handler(args));
        } catch (err) {
          return asError(err);
        }
      }
    );
  }

  // Escape hatch: the tools above cover the common questions, but TheSports
  // documents 67 endpoints (odds, transfers, rankings, honours, injuries...).
  // Rather than registering 67 near-identical tools and paying that context
  // cost on every request, the full catalogue stays discoverable through these
  // two and is fetched only when something actually needs it.
  const endpoints = await loadEndpoints(DOCS_DIR);
  const byPath = new Map(endpoints.map((e) => [e.urlPath, e]));

  server.registerTool(
    "list_api_endpoints",
    {
      title: "List every raw TheSports endpoint",
      description:
        "Browse the full TheSports API catalogue when the purpose-built tools don't cover something " +
        "(odds, transfers, FIFA rankings, honours, injuries, brackets, referee/venue data). " +
        "Returns each endpoint's path, purpose and parameters; pass a path to call_api_endpoint. " +
        "Filter with `search` to avoid reading all 67.",
      inputSchema: {
        search: z
          .string()
          .optional()
          .describe("Keyword filter, e.g. 'odds', 'transfer', 'ranking', 'injury'"),
      },
    },
    async ({ search }) => {
      const needle = search?.toLowerCase().trim();
      const rows = endpoints
        .filter(
          (e) =>
            !needle ||
            e.urlPath.toLowerCase().includes(needle) ||
            e.title.toLowerCase().includes(needle) ||
            e.description.toLowerCase().includes(needle)
        )
        .map((e) => ({
          path: e.urlPath,
          title: e.title,
          description: e.description,
          params: e.params
            .filter((p) => p.name !== "user" && p.name !== "secret")
            .map((p) => `${p.name}${p.required ? " (required)" : ""}: ${p.description}`),
        }));
      return asText({ matched: rows.length, of: endpoints.length, endpoints: rows });
    }
  );

  server.registerTool(
    "call_api_endpoint",
    {
      title: "Call a raw TheSports endpoint",
      description:
        "Call any endpoint from list_api_endpoints directly and get the raw JSON back. " +
        "Authentication is handled for you — pass only the endpoint's own parameters. " +
        "Prefer the purpose-built tools (get_fixtures, get_match_events, get_standings, ...) when they " +
        "fit: raw responses use uuids and numeric codes rather than names and labels.",
      inputSchema: {
        path: z
          .string()
          .describe("Endpoint path exactly as listed, e.g. '/v1/football/player/transfer/list'"),
        params: z
          .record(z.union([z.string(), z.number()]))
          .optional()
          .describe("Query parameters for that endpoint, e.g. { uuid: 'abc123' } or { page: 1 }"),
      },
    },
    async ({ path: urlPath, params }) => {
      try {
        if (!byPath.has(urlPath)) {
          const guess = endpoints
            .map((e) => e.urlPath)
            .filter((p) => p.includes(urlPath) || urlPath.includes(p))
            .slice(0, 5);
          throw new Error(
            `Unknown endpoint "${urlPath}". ` +
              (guess.length
                ? `Did you mean: ${guess.join(", ")}?`
                : `Use list_api_endpoints to see valid paths.`)
          );
        }
        return asText(await callRawEndpoint(urlPath, params ?? {}));
      } catch (err) {
        return asError(err);
      }
    }
  );

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(
    `[thesports-mcp] ready — ${tools.length} task tools + raw access to ${endpoints.length} endpoints`
  );

  // Name search needs the full team/competition catalogues. Start downloading
  // them now (in the background, off the critical path) so the first question
  // someone asks isn't the one that waits for them.
  if (process.env.THESPORTS_SKIP_WARMUP !== "1") warmCatalogues();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
