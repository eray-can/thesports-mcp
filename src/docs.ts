import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

export interface ParamDef {
  name: string;
  required: boolean;
  type: "string" | "integer";
  description: string;
}

export interface EndpointDef {
  toolName: string;
  title: string;
  method: string;
  urlPath: string;
  description: string;
  params: ParamDef[];
}

const FILE_PATTERN = /^v1_.+_GET\.md$/;

function toolNameFromFile(fileName: string): string {
  return fileName.replace(/^v1_/, "").replace(/_GET\.md$/, "");
}

function extractDescription(body: string): string {
  const match = body.match(/^\*\*Description\*\*:\s*(.*)$/m);
  if (!match) return "";
  return match[1]
    .replace(/<br\/?>/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractEndpoint(body: string): { method: string; urlPath: string } | null {
  const match = body.match(/\*\*Endpoint\*\*:\s*`(GET|POST|PUT|DELETE)\s+([^`]+)`/);
  if (!match) return null;
  return { method: match[1], urlPath: match[2].trim() };
}

function extractTitle(body: string): string {
  const match = body.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : "";
}

function extractParams(body: string): ParamDef[] {
  const section = body.match(/## Parameters\s*\n([\s\S]*?)(?=\n##\s|\n?$)/);
  if (!section) return [];

  const params: ParamDef[] = [];
  const lines = section[1].split("\n").map((l) => l.trim()).filter((l) => l.startsWith("|"));

  for (const line of lines) {
    const cells = line
      .split("|")
      .slice(1, -1)
      .map((c) => c.trim());
    if (cells.length < 5) continue;
    const [name, , required, type] = cells;
    const description = cells[4];
    if (name === "Name" || /^-+$/.test(name)) continue; // header / separator rows
    params.push({
      name,
      required: required === "True",
      type: type === "integer" ? "integer" : "string",
      description,
    });
  }
  return params;
}

/** Parses every `docs/thesports/v1_*_GET.md` file into an EndpointDef. */
export async function loadEndpoints(docsDir: string): Promise<EndpointDef[]> {
  const files = (await readdir(docsDir)).filter((f) => FILE_PATTERN.test(f));
  const endpoints: EndpointDef[] = [];

  for (const file of files.sort()) {
    const body = await readFile(path.join(docsDir, file), "utf-8");
    const endpoint = extractEndpoint(body);
    if (!endpoint) continue;

    endpoints.push({
      toolName: toolNameFromFile(file),
      title: extractTitle(body),
      method: endpoint.method,
      urlPath: endpoint.urlPath,
      description: extractDescription(body),
      params: extractParams(body),
    });
  }

  return endpoints;
}
