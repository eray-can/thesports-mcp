import { readFile } from "node:fs/promises";
import path from "node:path";

export type CodeMap = Record<number, string>;

interface StatusCodes {
  matchStatus: CodeMap;
  incidentType: CodeMap;
  eventReason: CodeMap;
  statType: CodeMap;
}

let cached: StatusCodes | undefined;

/** Pulls one "# Heading" section's `| code | description |` rows out of STATUS_CODE.md. */
function parseSection(body: string, heading: string): CodeMap {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const section = body.match(new RegExp(`^#+\\s*${escaped}\\s*$([\\s\\S]*?)(?=^#\\s|\\Z)`, "mi"));
  if (!section) return {};

  const map: CodeMap = {};
  for (const line of section[1].split("\n")) {
    const cells = line.trim();
    if (!cells.startsWith("|")) continue;
    const parts = cells.split("|").slice(1, -1).map((c) => c.trim());
    if (parts.length < 2) continue;
    const code = Number(parts[0]);
    if (!Number.isInteger(code)) continue; // header + separator rows
    map[code] = parts[1];
  }
  return map;
}

export async function loadStatusCodes(docsDir: string): Promise<StatusCodes> {
  if (cached) return cached;

  let body = "";
  try {
    body = await readFile(path.join(docsDir, "STATUS_CODE.md"), "utf-8");
  } catch {
    // Labels are a readability nicety; raw numeric codes still work without them.
    cached = { matchStatus: {}, incidentType: {}, eventReason: {}, statType: {} };
    return cached;
  }

  cached = {
    matchStatus: parseSection(body, "Match state"),
    incidentType: parseSection(body, "Technical Statistics"),
    eventReason: parseSection(body, "event reason"),
    statType: parseSection(body, "Half-time Statistics ID"),
  };
  return cached;
}

export function label(map: CodeMap, code: unknown): string | undefined {
  if (typeof code !== "number") return undefined;
  return map[code];
}

/**
 * Per-team score tuple layout, documented in WEBSOCKET.md:
 * [regular, halftime, red cards, yellow cards, corners(-1 = no data), overtime, penalties]
 */
export function readScores(scores: unknown): Record<string, number> | undefined {
  if (!Array.isArray(scores)) return undefined;
  const num = (i: number) => (typeof scores[i] === "number" ? (scores[i] as number) : undefined);

  const out: Record<string, number> = {};
  const regular = num(0);
  if (regular !== undefined) out.score = regular;
  const half = num(1);
  if (half !== undefined) out.halftime_score = half;
  const red = num(2);
  if (red) out.red_cards = red;
  const yellow = num(3);
  if (yellow) out.yellow_cards = yellow;
  const corners = num(4);
  if (corners !== undefined && corners >= 0) out.corners = corners;
  const overtime = num(5);
  if (overtime) out.overtime_score = overtime;
  const penalties = num(6);
  if (penalties) out.penalty_score = penalties;
  return out;
}
