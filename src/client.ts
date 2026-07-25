const BASE_URL = (process.env.THESPORTS_BASE_URL || "https://api.thesports.com").replace(/\/$/, "");
const USER = process.env.THESPORTS_USER;
const SECRET = process.env.THESPORTS_SECRET;

// Keep tool responses well inside typical LLM context budgets; list endpoints
// can return thousands of rows and the docs already support page/time/uuid
// narrowing, so truncating (rather than paginating for the caller) is enough.
export const MAX_RESPONSE_CHARS = 40_000;

export function truncate(text: string): string {
  if (text.length <= MAX_RESPONSE_CHARS) return text;
  return (
    text.slice(0, MAX_RESPONSE_CHARS) +
    `\n... [truncated ${text.length - MAX_RESPONSE_CHARS} chars; narrow the query]`
  );
}

/**
 * Calls a raw TheSports endpoint (e.g. "/v1/football/match/list") with the
 * given query params, injects user/secret, and returns the parsed JSON body.
 *
 * TheSports puts gateway auth errors and rate limits inside an HTTP 200 body
 * instead of using HTTP status codes, so those are checked explicitly here
 * rather than left for callers to rediscover.
 */
export async function callRawEndpoint(
  urlPath: string,
  params: Record<string, string | number | undefined> = {}
): Promise<any> {
  if (!USER || !SECRET) {
    throw new Error(
      "THESPORTS_USER / THESPORTS_SECRET are not set. Configure them in this MCP server's env before calling any tool."
    );
  }

  const query = new URLSearchParams();
  query.set("user", USER);
  query.set("secret", SECRET);
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    query.set(key, String(value));
  }

  const url = `${BASE_URL}${urlPath}?${query.toString()}`;
  const res = await fetch(url, { method: "GET" });
  const text = await res.text();

  if (!res.ok) {
    throw new Error(`thesports ${urlPath} returned HTTP ${res.status}: ${text.slice(0, 500)}`);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error(`thesports ${urlPath} returned non-JSON body: ${text.slice(0, 500)}`);
  }

  if (parsed && typeof parsed === "object") {
    const obj = parsed as Record<string, unknown>;
    if (typeof obj.err === "string" && obj.err) {
      throw new Error(`thesports gateway error on ${urlPath}: ${obj.err}`);
    }
    if (obj.code === 429) {
      throw new Error(`thesports rate limited (code 429) on ${urlPath}. Retry after a short delay.`);
    }
  }

  return parsed;
}

/** Safety stop for the full-catalogue fetches behind name search. TheSports
 * returns 1000 rows/page, so this allows ~500k rows before giving up on a
 * feed that never reports a sane total. */
const MAX_PAGES = 500;

/**
 * Fetches every page of a paginated list endpoint (page/time/uuid style).
 *
 * Note on the stop condition: `query.total` is the row count of the CURRENT
 * page, not the size of the whole collection — every full page reports
 * total=1000. Treating it as a grand total stops the loop after page one and
 * silently keeps only the first 1000 rows. The documented contract is to keep
 * incrementing the page until total comes back 0, which is what this does.
 */
export async function fetchAllPages(urlPath: string): Promise<any[]> {
  const all: any[] = [];
  for (let page = 1; page <= MAX_PAGES; page++) {
    const data = await callRawEndpoint(urlPath, { page });
    const results: any[] = Array.isArray(data?.results) ? data.results : [];
    if (results.length === 0 || (data?.query?.total ?? 0) === 0) return all;

    all.push(...results);
    if (page % 25 === 0) {
      console.error(`[thesports-mcp] ${urlPath}: ${all.length} rows so far...`);
    }
  }
  console.error(
    `[thesports-mcp] WARNING: ${urlPath} hit the ${MAX_PAGES}-page cap at ${all.length} rows; ` +
      `name search may be missing entries.`
  );
  return all;
}
