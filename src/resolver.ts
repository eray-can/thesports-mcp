import { mkdir, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { callRawEndpoint, fetchAllPages } from "./client.js";

export interface Entity {
  id: string;
  name: string;
  short_name?: string;
  [key: string]: unknown;
}

// TheSports has no name-search endpoint — the only way to go from a name the
// user typed to the uuid every other endpoint requires is to pull the full
// entity list and match locally. The team catalogue alone is ~50k rows across
// ~60 requests, so it is cached on disk as well as in memory: paying that once
// a day is fine, paying it on every process start is not.
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

const CACHE_DIR =
  process.env.THESPORTS_CACHE_DIR || path.join(os.tmpdir(), "thesports-mcp-cache");

interface CacheEntry {
  fetchedAt: number;
  rows: Entity[];
  byId: Map<string, Entity>;
}

const caches = new Map<string, CacheEntry>();
const inflight = new Map<string, Promise<CacheEntry>>();

function index(rows: Entity[], fetchedAt: number): CacheEntry {
  return {
    fetchedAt,
    rows,
    byId: new Map(rows.filter((r) => r?.id).map((r) => [r.id, r])),
  };
}

async function readDiskCache(key: string): Promise<CacheEntry | undefined> {
  try {
    const raw = await readFile(path.join(CACHE_DIR, `${key}.json`), "utf-8");
    const parsed = JSON.parse(raw) as { fetchedAt: number; rows: Entity[] };
    if (!parsed?.fetchedAt || !Array.isArray(parsed.rows)) return undefined;
    if (Date.now() - parsed.fetchedAt >= CACHE_TTL_MS) return undefined;
    return index(parsed.rows, parsed.fetchedAt);
  } catch {
    return undefined; // absent, unreadable or corrupt — just refetch
  }
}

async function writeDiskCache(key: string, entry: CacheEntry): Promise<void> {
  try {
    await mkdir(CACHE_DIR, { recursive: true });
    await writeFile(
      path.join(CACHE_DIR, `${key}.json`),
      JSON.stringify({ fetchedAt: entry.fetchedAt, rows: entry.rows })
    );
  } catch (err) {
    // A read-only or full disk costs us the restart optimisation, nothing more.
    console.error(`[thesports-mcp] could not persist ${key} cache: ${(err as Error).message}`);
  }
}

/** Trims catalogue rows to the fields search and display actually use, so the
 * on-disk cache stays a few MB instead of tens. */
function slim(rows: any[], fields: string[]): Entity[] {
  return rows
    .filter((r) => r?.id && r?.name)
    .map((r) => {
      const out: any = {};
      for (const f of fields) if (r[f] !== undefined) out[f] = r[f];
      return out as Entity;
    });
}

async function loadCache(cat: Catalogue): Promise<CacheEntry> {
  const existing = caches.get(cat.key);
  if (existing && Date.now() - existing.fetchedAt < CACHE_TTL_MS) return existing;

  // Two tools resolving names concurrently must not each pull the full list.
  const pending = inflight.get(cat.key);
  if (pending) return pending;

  const load = (async () => {
    const fromDisk = await readDiskCache(cat.key);
    if (fromDisk) {
      caches.set(cat.key, fromDisk);
      return fromDisk;
    }

    console.error(`[thesports-mcp] building ${cat.key} index...`);
    const rows = cat.fetch
      ? await cat.fetch()
      : slim(await fetchAllPages(cat.path!), cat.fields!);
    const entry = index(rows, Date.now());
    caches.set(cat.key, entry);
    console.error(`[thesports-mcp] ${cat.key} index ready: ${rows.length} rows`);
    await writeDiskCache(cat.key, entry);
    return entry;
  })().finally(() => inflight.delete(cat.key));

  inflight.set(cat.key, load);
  return load;
}

/**
 * The full team catalogue is ~80k rows, but the schedule endpoint returns team
 * names inline for every fixture — so a few weeks of schedule yields an index
 * of every team actually playing (~5k) for a handful of requests. Anyone asking
 * about a team by name is almost always asking about one that plays in this
 * window, so this is tried first and the catalogue is only built if it misses.
 *
 * Window is capped by the endpoint itself: diary serves ±30 days from today.
 */
const ACTIVE_DAYS_BACK = Number(process.env.THESPORTS_ACTIVE_DAYS_BACK ?? 7);
const ACTIVE_DAYS_FORWARD = Number(process.env.THESPORTS_ACTIVE_DAYS_FORWARD ?? 21);

function startOfUtcDay(offsetDays: number): number {
  const d = new Date();
  return Math.floor(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + offsetDays) / 1000
  );
}

async function fetchActiveTeams(): Promise<Entity[]> {
  const offsets: number[] = [];
  for (let o = -ACTIVE_DAYS_BACK; o <= ACTIVE_DAYS_FORWARD; o++) offsets.push(o);

  const teams = new Map<string, Entity>();
  const BATCH = 10;
  for (let i = 0; i < offsets.length; i += BATCH) {
    const days = await Promise.all(
      offsets.slice(i, i + BATCH).map(async (o) => {
        try {
          return await callRawEndpoint("/v1/football/match/diary", { tsp: startOfUtcDay(o) });
        } catch {
          return undefined; // one bad day must not sink the whole index
        }
      })
    );
    for (const day of days) {
      for (const t of day?.results_extra?.team ?? []) {
        if (t?.id && t?.name && !teams.has(t.id)) {
          teams.set(t.id, { id: t.id, name: t.name, logo: t.logo });
        }
      }
    }
  }
  return [...teams.values()];
}

/** Strips diacritics, punctuation and case so "Beşiktaş" matches "besiktas".
 * Turkish dotless/dotted i are mapped first: NFD leaves "ı" (U+0131) intact,
 * so without this "Bandırma" would lose the character instead of matching
 * "Bandirma". */
function normalize(value: string): string {
  return value
    .replace(/[ı]/g, "i")
    .replace(/[İ]/g, "I")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export interface Match extends Entity {
  /** 100 exact, 90 alias/short-name exact, 70 prefix, 50 substring, 30 token overlap. */
  score: number;
}

function scoreName(queryNorm: string, entity: Entity): number {
  const candidates = [entity.name, entity.short_name].filter(
    (v): v is string => typeof v === "string" && v.length > 0
  );

  let best = 0;
  for (const candidate of candidates) {
    const norm = normalize(candidate);
    if (!norm) continue;

    let score = 0;
    if (norm === queryNorm) score = candidate === entity.name ? 100 : 90;
    else if (norm.startsWith(queryNorm)) score = 70;
    else if (norm.includes(queryNorm)) score = 50;
    else {
      // Token overlap catches "man city" -> "Manchester City" and
      // "fenerbahce sk" -> "Fenerbahce".
      const queryTokens = queryNorm.split(" ").filter(Boolean);
      const candTokens = new Set(norm.split(" ").filter(Boolean));
      const hits = queryTokens.filter((t) => candTokens.has(t)).length;
      if (hits > 0 && hits === queryTokens.length) score = 40;
      else if (hits > 0) score = 30;
    }

    if (score > best) best = score;
  }
  return best;
}

interface Catalogue {
  key: string;
  /** List endpoint to page through. Omit when `fetch` is supplied. */
  path?: string;
  /** Fields kept from each row; the rest is dropped before caching. */
  fields?: string[];
  /** Custom loader for indexes not built by paging a list endpoint. */
  fetch?: () => Promise<Entity[]>;
}

/** Teams playing in the current fixture window — cheap, and enough to answer
 * almost any question someone asks by name. Tried before TEAMS. */
const ACTIVE_TEAMS: Catalogue = { key: "active-teams", fetch: fetchActiveTeams };

/** Every team TheSports knows, including historical and youth sides. ~80k rows;
 * only built when ACTIVE_TEAMS has no match. */
const TEAMS: Catalogue = {
  key: "teams",
  path: "/v1/football/team/additional/list",
  fields: ["id", "name", "short_name", "logo", "national", "competition_id", "country_id", "virtual"],
};
const COMPETITIONS: Catalogue = {
  key: "competitions",
  path: "/v1/football/competition/additional/list",
  fields: ["id", "name", "short_name", "logo", "type", "cur_season_id", "cur_round", "country_id"],
};
const PLAYERS: Catalogue = {
  key: "players",
  path: "/v1/football/player/with_stat/list",
  fields: ["id", "name", "team_id", "position", "shirt_number", "nationality", "birthday", "market_value"],
};

/**
 * TheSports names every competition in English ("Turkish Super League"), but
 * people ask using the local name ("Süper Lig"). No amount of string scoring
 * bridges that gap: "super lig" is an equally good partial match for "Moldovan
 * Super Liga" and a dozen others. These are the local names common enough to
 * be worth pinning to their canonical entry. Keys are pre-normalized.
 */
const COMPETITION_ALIASES: Record<string, string> = {
  "super lig": "Turkish Super League",
  "trendyol super lig": "Turkish Super League",
  "turkiye kupasi": "Turkish Cup",
  "la liga": "Spanish La Liga",
  "primera division": "Spanish La Liga",
  "serie a": "Italian Serie A",
  bundesliga: "German Bundesliga",
  "ligue 1": "French Ligue 1",
  "premier lig": "English Premier League",
  "sampiyonlar ligi": "UEFA Champions League",
  "avrupa ligi": "UEFA Europa League",
};

async function search(
  cat: Catalogue,
  query: string,
  limit: number,
  filter?: (e: Entity) => boolean
): Promise<Match[]> {
  const { rows } = await loadCache(cat);
  let queryNorm = normalize(query);
  if (!queryNorm) return [];

  if (cat.key === COMPETITIONS.key) {
    const canonical = COMPETITION_ALIASES[queryNorm];
    if (canonical) queryNorm = normalize(canonical);
  }

  const scored: Match[] = [];
  for (const row of rows) {
    if (filter && !filter(row)) continue;
    const score = scoreName(queryNorm, row);
    if (score > 0) scored.push({ ...row, score });
  }

  // On equal relevance the shorter name is the closer match: for "super lig",
  // "Turkish Super Lig" should beat "Moldovan Super Liga Relegation Round".
  scored.sort(
    (a, b) => b.score - a.score || a.name.length - b.name.length || a.name.localeCompare(b.name)
  );
  return scored.slice(0, limit);
}

/**
 * Searches teams currently in the fixture window first, and only falls back to
 * the 80k-row catalogue if that finds nothing convincing. In practice the fast
 * path answers nearly every real question, so the expensive index is usually
 * never built at all.
 */
export async function searchTeams(query: string, limit = 10): Promise<Match[]> {
  // Placeholder rows exist purely to fill brackets and would otherwise
  // outrank real teams on short queries.
  const notPlaceholder = (e: Entity) => e.virtual !== 1;

  const active = await search(ACTIVE_TEAMS, query, limit, notPlaceholder);
  if (active.length > 0 && active[0].score >= 70) return active;

  const full = await search(TEAMS, query, limit, notPlaceholder);
  if (full.length === 0) return active;

  // Keep the active-window hits that the catalogue also knows about, ranked
  // together, so a weak fast-path match isn't lost behind catalogue noise.
  const seen = new Set(full.map((m) => m.id));
  return [...full, ...active.filter((m) => !seen.has(m.id))]
    .sort((a, b) => b.score - a.score || a.name.length - b.name.length)
    .slice(0, limit);
}

export function searchCompetitions(query: string, limit = 10): Promise<Match[]> {
  return search(COMPETITIONS, query, limit);
}

export function searchPlayers(query: string, limit = 10): Promise<Match[]> {
  return search(PLAYERS, query, limit);
}

/** Builds the two cheap indexes name search starts from (a few seconds each),
 * so the first user question doesn't pay for them. The full 80k team catalogue
 * is deliberately NOT warmed — it is only built if a name misses the active
 * window. Failures are non-fatal: the load simply runs again, and reports
 * properly, when a search actually needs it. */
export function warmCatalogues(): void {
  for (const cat of [ACTIVE_TEAMS, COMPETITIONS]) {
    loadCache(cat).catch((err) =>
      console.error(`[thesports-mcp] ${cat.key} warm-up failed: ${err.message}`)
    );
  }
}

/** TheSports ids are ~15 chars of lowercase alphanumerics with no spaces.
 * Used only to decide whether a direct uuid lookup is worth one request before
 * falling back to name search — a wrong guess costs a request, not a result. */
const ID_SHAPE = /^[a-z0-9]{10,24}$/i;

/** Resolves an id to its full record without pulling a whole catalogue,
 * reusing any index already in memory before falling back to a uuid query. */
async function byId(cats: Catalogue[], id: string): Promise<Entity | undefined> {
  for (const cat of cats) {
    const cached = caches.get(cat.key)?.byId.get(id);
    if (cached) return cached;
  }
  if (!ID_SHAPE.test(id)) return undefined;

  const path = cats.find((c) => c.path)?.path;
  if (!path) return undefined;
  try {
    return await fetchEntityById(path, id);
  } catch {
    return undefined;
  }
}

export const getTeamById = (id: string) => byId([ACTIVE_TEAMS, TEAMS], id);
export const getCompetitionById = (id: string) => byId([COMPETITIONS], id);

// Turning an id you already have into a name does NOT justify pulling the full
// entity list — every list endpoint also accepts `uuid`. These single-entity
// lookups are memoized for the process lifetime and reuse the full list only
// when a name search already populated it.
const nameMemo = new Map<string, string>();

async function nameFor(cats: Catalogue[], urlPath: string, id: string): Promise<string | undefined> {
  if (!id) return undefined;
  const memoized = nameMemo.get(id);
  if (memoized) return memoized;

  for (const cat of cats) {
    const fromIndex = caches.get(cat.key)?.byId.get(id)?.name;
    if (fromIndex) {
      nameMemo.set(id, fromIndex);
      return fromIndex;
    }
  }

  try {
    const entity = await fetchEntityById(urlPath, id);
    const name = typeof entity?.name === "string" ? entity.name : undefined;
    if (name) nameMemo.set(id, name);
    return name;
  } catch {
    return undefined; // a missing label must never fail the whole tool call
  }
}

export const teamName = (id: string) => nameFor([ACTIVE_TEAMS, TEAMS], TEAMS.path!, id);
export const competitionName = (id: string) => nameFor([COMPETITIONS], COMPETITIONS.path!, id);

/** Resolves many team ids at once, de-duplicated, for hydrating a match list. */
export async function teamNames(ids: string[]): Promise<Map<string, string>> {
  const unique = [...new Set(ids.filter(Boolean))];
  const pairs = await Promise.all(unique.map(async (id) => [id, await teamName(id)] as const));
  return new Map(pairs.filter((p): p is [string, string] => Boolean(p[1])));
}

/**
 * Resolves a team name to exactly one id, or throws a message the agent can
 * relay verbatim. Callers get an id or a clear reason — never a silent
 * best-guess, which is how a bot ends up confidently reporting the wrong
 * team's fixtures.
 */
export async function resolveTeamId(nameOrId: string): Promise<{ id: string; name: string }> {
  const direct = await getTeamById(nameOrId);
  if (direct) return { id: direct.id, name: direct.name };

  const matches = await searchTeams(nameOrId, 6);
  if (matches.length === 0) {
    throw new Error(`No team found matching "${nameOrId}". Try the full club name.`);
  }
  // An exact-ish top hit that clearly beats the runner-up is safe to take.
  if (matches[0].score >= 70 && (matches.length === 1 || matches[0].score > matches[1].score)) {
    return { id: matches[0].id, name: matches[0].name };
  }
  const options = matches.map((m) => `${m.name} (id: ${m.id})`).join(", ");
  throw new Error(`"${nameOrId}" is ambiguous. Ask which one is meant: ${options}`);
}

export async function resolveCompetitionId(nameOrId: string): Promise<{ id: string; name: string; cur_season_id?: string }> {
  const direct = await getCompetitionById(nameOrId);
  if (direct) {
    return { id: direct.id, name: direct.name, cur_season_id: direct.cur_season_id as string | undefined };
  }

  const matches = await searchCompetitions(nameOrId, 6);
  if (matches.length === 0) {
    throw new Error(`No competition found matching "${nameOrId}".`);
  }
  if (matches[0].score >= 70 && (matches.length === 1 || matches[0].score > matches[1].score)) {
    return {
      id: matches[0].id,
      name: matches[0].name,
      cur_season_id: matches[0].cur_season_id as string | undefined,
    };
  }
  const options = matches.map((m) => `${m.name} (id: ${m.id})`).join(", ");
  throw new Error(`"${nameOrId}" is ambiguous. Ask which one is meant: ${options}`);
}

/** Warms a single-entity lookup without pulling a whole list, for ids that
 * came from a match payload rather than from a search. */
export async function fetchEntityById(urlPath: string, id: string): Promise<Entity | undefined> {
  const data = await callRawEndpoint(urlPath, { uuid: id });
  const results = Array.isArray(data?.results) ? data.results : [];
  return results[0];
}
