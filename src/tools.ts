import { z } from "zod";
import { callRawEndpoint } from "./client.js";
import { loadStatusCodes, label, readScores } from "./codes.js";
import {
  competitionName,
  resolveCompetitionId,
  resolveTeamId,
  searchCompetitions,
  searchPlayers,
  searchTeams,
  teamName,
  teamNames,
} from "./resolver.js";

export interface ToolDef {
  name: string;
  title: string;
  description: string;
  schema: z.ZodRawShape;
  handler: (args: any) => Promise<unknown>;
}

const iso = (ts: unknown) =>
  typeof ts === "number" && ts > 0 ? new Date(ts * 1000).toISOString() : undefined;

/** foundation_time is a unix timestamp, so clubs founded before 1970 carry a
 * negative value — and rows with no real date carry 0 or a near-epoch value
 * that would otherwise be reported as "founded 1970". Only years in a
 * plausible range for a football club are trusted. */
function foundingYear(timestamp: unknown): number | undefined {
  if (typeof timestamp !== "number" || timestamp === 0) return undefined;
  const year = new Date(timestamp * 1000).getUTCFullYear();
  if (!Number.isFinite(year) || year < 1850 || year > new Date().getUTCFullYear()) return undefined;
  // A genuine 1970 founding is indistinguishable from an empty timestamp here,
  // so it is dropped rather than risk stating a wrong year as fact.
  return year === 1970 ? undefined : year;
}

const POSITIONS: Record<string, string> = {
  F: "Forward",
  M: "Midfielder",
  D: "Defender",
  G: "Goalkeeper",
};

/** Accepts "today", "tomorrow", "yesterday", "2026-07-25", or a unix timestamp,
 * and returns the UTC start-of-day timestamp that match/diary expects. */
function toDayTimestamp(date: string): number {
  const trimmed = date.trim().toLowerCase();
  const now = new Date();
  const startOfUtcDay = (d: Date) =>
    Math.floor(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) / 1000);

  if (trimmed === "today") return startOfUtcDay(now);
  if (trimmed === "tomorrow") return startOfUtcDay(new Date(now.getTime() + 86400_000));
  if (trimmed === "yesterday") return startOfUtcDay(new Date(now.getTime() - 86400_000));

  if (/^\d{9,11}$/.test(trimmed)) return Number(trimmed);

  const parsed = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (parsed) {
    return Math.floor(Date.UTC(+parsed[1], +parsed[2] - 1, +parsed[3]) / 1000);
  }
  throw new Error(`Unrecognised date "${date}". Use YYYY-MM-DD, or today/tomorrow/yesterday.`);
}

/** Builds an id->name index from the `results_extra` block that the schedule
 * endpoints return, so those need no extra lookups at all. */
function extraIndex(extra: any, key: string): Map<string, string> {
  const rows = Array.isArray(extra?.[key]) ? extra[key] : [];
  return new Map(
    rows.filter((r: any) => r?.id && r?.name).map((r: any) => [r.id as string, r.name as string])
  );
}

/** Looks up which teams played a match. The live/history feeds identify sides
 * only as "home"/"away", so this is what lets events carry real club names. */
async function matchTeams(
  matchId: string
): Promise<{ home?: string; away?: string; homeId?: string; awayId?: string }> {
  try {
    const data = await callRawEndpoint("/v1/football/match/recent/list", { uuid: matchId });
    const row = data?.results?.[0];
    if (!row) return {};
    const [home, away] = await Promise.all([
      row.home_team_id ? teamName(row.home_team_id) : undefined,
      row.away_team_id ? teamName(row.away_team_id) : undefined,
    ]);
    return { home, away, homeId: row.home_team_id, awayId: row.away_team_id };
  } catch {
    return {}; // names are a nicety; never fail the call over them
  }
}

/** TheSports packs two meanings into one reason string, "<card sense>/<sub sense>",
 * because the same code is reused for both. Pick the half that fits the event. */
function pickReason(reason: string | undefined, isSubstitution: boolean): string | undefined {
  if (!reason) return undefined;
  const parts = reason.split("/");
  if (parts.length !== 2) return reason;
  const chosen = isSubstitution ? parts[1] : parts[0];
  return chosen.replace(/\s*\((Card|Substitution)\)\s*/gi, "").trim() || reason;
}

async function shapeMatch(
  match: any,
  names: { teams: Map<string, string>; competitions: Map<string, string> },
  matchStatus: Record<number, string>
) {
  const home = match.home_team_id as string;
  const away = match.away_team_id as string;
  return {
    match_id: match.id,
    home_team: names.teams.get(home) ?? home,
    away_team: names.teams.get(away) ?? away,
    competition: names.competitions.get(match.competition_id) ?? match.competition_id,
    status: label(matchStatus, match.status_id) ?? `status_${match.status_id}`,
    kickoff: iso(match.match_time),
    home: readScores(match.home_scores),
    away: readScores(match.away_scores),
    round: match.round?.round_num,
    home_team_id: home,
    away_team_id: away,
  };
}

export function buildTools(docsDir: string): ToolDef[] {
  return [
    {
      name: "search_team",
      title: "Search teams by name",
      description:
        "Find a team's id from a name a person typed (e.g. 'Galatasaray', 'Man City'). " +
        "Handles accents and abbreviations. Every other team tool accepts either a name or an id, " +
        "so call this first only when you need to disambiguate or show the user a list of options. " +
        "The first call downloads the full team catalogue and can take a while; later calls are instant.",
      schema: {
        query: z.string().describe("Team name or part of it, as the user said it"),
        limit: z.number().int().min(1).max(50).optional().describe("Max results (default 10)"),
      },
      handler: async ({ query, limit }) => {
        const matches = await searchTeams(query, limit ?? 10);
        return matches.map((m) => ({
          id: m.id,
          name: m.name,
          short_name: m.short_name,
          national_team: m.national === 1,
          logo: m.logo,
        }));
      },
    },

    {
      name: "search_competition",
      title: "Search competitions by name",
      description:
        "Find a league or cup id from a name (e.g. 'Süper Lig', 'Premier League', 'Champions League'). " +
        "Returns the current season id too, which standings and season fixtures need.",
      schema: {
        query: z.string().describe("Competition name or part of it"),
        limit: z.number().int().min(1).max(50).optional().describe("Max results (default 10)"),
      },
      handler: async ({ query, limit }) => {
        const matches = await searchCompetitions(query, limit ?? 10);
        return matches.map((m) => ({
          id: m.id,
          name: m.name,
          short_name: m.short_name,
          type: ["unknown", "league", "cup", "friendly"][(m.type as number) ?? 0],
          current_season_id: m.cur_season_id,
          current_round: m.cur_round,
          logo: m.logo,
        }));
      },
    },

    {
      name: "search_player",
      title: "Search players by name",
      description: "Find a player's id and profile from a name (e.g. 'Mauro Icardi').",
      schema: {
        query: z.string().describe("Player name or part of it"),
        limit: z.number().int().min(1).max(50).optional().describe("Max results (default 10)"),
      },
      handler: async ({ query, limit }) => {
        const matches = await searchPlayers(query, limit ?? 10);
        return Promise.all(
          matches.map(async (m) => ({
            id: m.id,
            name: m.name,
            team: m.team_id ? await teamName(m.team_id as string) : undefined,
            position: m.position,
            shirt_number: m.shirt_number,
            nationality: m.nationality,
            birthday: iso(m.birthday),
            market_value: m.market_value,
          }))
        );
      },
    },

    {
      name: "get_team",
      title: "Get a team's profile",
      description:
        "Full profile for one team: founding year, market value, squad size, website, current league. " +
        "Accepts a team name or id.",
      schema: { team: z.string().describe("Team name or team id") },
      handler: async ({ team }) => {
        const { id } = await resolveTeamId(team);
        const data = await callRawEndpoint("/v1/football/team/additional/list", { uuid: id });
        const row = data?.results?.[0];
        if (!row) throw new Error(`No team data returned for id ${id}`);
        return {
          id: row.id,
          name: row.name,
          short_name: row.short_name,
          competition: row.competition_id ? await competitionName(row.competition_id) : undefined,
          national_team: row.national === 1,
          founded: foundingYear(row.foundation_time),
          website: row.website,
          market_value:
            row.market_value > 0 ? `${row.market_value} ${row.market_value_currency ?? ""}`.trim() : undefined,
          total_players: row.total_players >= 0 ? row.total_players : undefined,
          foreign_players: row.foreign_players >= 0 ? row.foreign_players : undefined,
          logo: row.logo,
        };
      },
    },

    {
      name: "get_team_squad",
      title: "Get a team's current squad",
      description: "Current player list for a team, with positions and shirt numbers. Accepts a name or id.",
      schema: { team: z.string().describe("Team name or team id") },
      handler: async ({ team }) => {
        const { id, name } = await resolveTeamId(team);
        const data = await callRawEndpoint("/v1/football/team/squad/list", { uuid: id });
        const entry = data?.results?.[0];
        const squad = Array.isArray(entry?.squad) ? entry.squad : [];
        return {
          team: entry?.team?.name ?? name,
          player_count: squad.length,
          players: squad.map((p: any) => ({
            id: p.player?.id,
            name: p.player?.name,
            position: POSITIONS[p.position] ?? p.position,
            shirt_number: p.shirt_number,
          })),
        };
      },
    },

    {
      name: "get_fixtures",
      title: "Get match schedule and results",
      description:
        "The schedule tool. Use `date` for everything happening on a given day ('today', 'tomorrow', " +
        "'2026-07-25'), optionally narrowed to one team or competition. Use `team` or `competition` " +
        "without a date to get that side's whole current-season fixture list, split into played and upcoming. " +
        "Returns team and competition names, scores and kickoff times — no id lookups needed afterwards.",
      schema: {
        date: z.string().optional().describe("'today', 'tomorrow', 'yesterday', or YYYY-MM-DD"),
        team: z.string().optional().describe("Team name or id to filter/list fixtures for"),
        competition: z.string().optional().describe("Competition name or id to filter/list fixtures for"),
        limit: z.number().int().min(1).max(200).optional().describe("Max matches to return (default 50)"),
      },
      handler: async ({ date, team, competition, limit }) => {
        const { matchStatus } = await loadStatusCodes(docsDir);
        const cap = limit ?? 50;

        const teamFilter = team ? await resolveTeamId(team) : undefined;
        const compFilter = competition ? await resolveCompetitionId(competition) : undefined;

        if (date) {
          const data = await callRawEndpoint("/v1/football/match/diary", { tsp: toDayTimestamp(date) });
          let rows: any[] = Array.isArray(data?.results) ? data.results : [];
          if (teamFilter) {
            rows = rows.filter(
              (m) => m.home_team_id === teamFilter.id || m.away_team_id === teamFilter.id
            );
          }
          if (compFilter) rows = rows.filter((m) => m.competition_id === compFilter.id);

          const names = {
            teams: extraIndex(data?.results_extra, "team"),
            competitions: extraIndex(data?.results_extra, "competition"),
          };
          const shown = rows.slice(0, cap);
          return {
            date,
            total_matches: rows.length,
            returned: shown.length,
            matches: await Promise.all(shown.map((m) => shapeMatch(m, names, matchStatus))),
          };
        }

        // No date: list the current season for the requested team or competition.
        const seasonId = compFilter
          ? compFilter.cur_season_id
          : await (async () => {
              const data = await callRawEndpoint("/v1/football/team/additional/list", {
                uuid: teamFilter!.id,
              });
              const compId = data?.results?.[0]?.competition_id;
              if (!compId) {
                throw new Error(
                  `${teamFilter!.name} has no league competition on record (cup-only or national team). ` +
                    `Pass a date instead.`
                );
              }
              return (await resolveCompetitionId(compId)).cur_season_id;
            })();

        if (!seasonId) {
          throw new Error("No current season found for that competition; pass a date instead.");
        }

        const data = await callRawEndpoint("/v1/football/match/season/recent", { uuid: seasonId });
        let rows: any[] = Array.isArray(data?.results) ? data.results : [];
        if (teamFilter) {
          rows = rows.filter((m) => m.home_team_id === teamFilter.id || m.away_team_id === teamFilter.id);
        }
        rows.sort((a, b) => (a.match_time ?? 0) - (b.match_time ?? 0));

        const ids = rows.flatMap((m) => [m.home_team_id, m.away_team_id]);
        const names = {
          teams: await teamNames(ids),
          competitions: new Map<string, string>(),
        };
        const compId = rows[0]?.competition_id;
        if (compId) {
          const cName = compFilter?.name ?? (await competitionName(compId));
          if (cName) names.competitions.set(compId, cName);
        }

        const shaped = await Promise.all(rows.map((m) => shapeMatch(m, names, matchStatus)));
        const finished = shaped.filter((m) => m.status === "End");
        const upcoming = shaped.filter((m) => m.status !== "End");
        return {
          subject: teamFilter?.name ?? compFilter?.name,
          total_matches: shaped.length,
          upcoming: upcoming.slice(0, cap),
          recent_results: finished.slice(-cap).reverse(),
        };
      },
    },

    {
      name: "get_live_scores",
      title: "Get matches happening right now",
      description:
        "Every match currently in play, with live score, minute-by-minute events and technical stats. " +
        "Optionally narrowed to one team or competition. Use this for 'what's the score right now'.",
      schema: {
        team: z.string().optional().describe("Only matches involving this team (name or id)"),
        competition: z.string().optional().describe("Only matches in this competition (name or id)"),
        limit: z.number().int().min(1).max(100).optional().describe("Max matches (default 20)"),
      },
      handler: async ({ team, competition, limit }) => {
        const { matchStatus } = await loadStatusCodes(docsDir);
        const live = await callRawEndpoint("/v1/football/match/detail_live");
        const allLive: any[] = Array.isArray(live?.results) ? live.results : [];

        const inPlayStatus = (r: any) => {
          const status = Array.isArray(r.score) ? r.score[1] : undefined;
          return typeof status === "number" && status >= 2 && status <= 7;
        };
        let rows = allLive.filter(inPlayStatus);

        // detail_live carries ids only — no team, competition or fixture context.
        // The day's schedule supplies all three, so it is always joined in:
        // a live score without team names is useless to a person.
        const loadDay = async (day: string, into: Map<string, any>, names: Map<string, string>) => {
          const diary = await callRawEndpoint("/v1/football/match/diary", { tsp: toDayTimestamp(day) });
          for (const m of Array.isArray(diary?.results) ? diary.results : []) into.set(m.id, m);
          for (const [id, name] of extraIndex(diary?.results_extra, "team")) names.set(id, name);
          for (const [id, name] of extraIndex(diary?.results_extra, "competition")) names.set(id, name);
        };

        const scheduleById = new Map<string, any>();
        const names = new Map<string, string>();
        await loadDay("today", scheduleById, names);
        // Matches that kicked off before UTC midnight are still in play but live
        // in yesterday's schedule.
        if (rows.some((r) => !scheduleById.has(r.id))) {
          await loadDay("yesterday", scheduleById, names);
        }

        if (team || competition) {
          const teamFilter = team ? await resolveTeamId(team) : undefined;
          const compFilter = competition ? await resolveCompetitionId(competition) : undefined;
          rows = rows.filter((r) => {
            const m = scheduleById.get(r.id);
            if (!m) return false;
            if (teamFilter && m.home_team_id !== teamFilter.id && m.away_team_id !== teamFilter.id) {
              return false;
            }
            if (compFilter && m.competition_id !== compFilter.id) return false;
            return true;
          });
        }

        const shown = rows.slice(0, limit ?? 20);
        const missing = shown
          .flatMap((r) => {
            const m = scheduleById.get(r.id);
            return m ? [m.home_team_id, m.away_team_id] : [];
          })
          .filter((id: string) => id && !names.has(id));
        for (const [id, name] of await teamNames(missing)) names.set(id, name);

        return {
          live_match_count: rows.length,
          matches: shown.map((r) => {
            const m = scheduleById.get(r.id);
            return {
              match_id: r.id,
              home_team: m ? names.get(m.home_team_id) ?? m.home_team_id : undefined,
              away_team: m ? names.get(m.away_team_id) ?? m.away_team_id : undefined,
              competition: m ? names.get(m.competition_id) ?? m.competition_id : undefined,
              status: label(matchStatus, r.score?.[1]) ?? `status_${r.score?.[1]}`,
              home: readScores(r.score?.[2]),
              away: readScores(r.score?.[3]),
              kickoff: iso(r.score?.[4]),
            };
          }),
        };
      },
    },

    {
      name: "get_match_events",
      title: "Get goals, cards and substitutions for a match",
      description:
        "Timeline of everything that happened in a match — goals with scorer and assist, cards, " +
        "substitutions, VAR decisions — plus the technical stats (possession, shots, corners). " +
        "Event types come back as readable labels, not numeric codes. Works for live and finished " +
        "matches within the last 30 days. Needs a match_id (get one from get_fixtures or get_live_scores).",
      schema: {
        match_id: z.string().describe("Match id, from get_fixtures or get_live_scores"),
        include_commentary: z
          .boolean()
          .optional()
          .describe("Include the running text commentary feed (verbose; default false)"),
      },
      handler: async ({ match_id, include_commentary }) => {
        const { matchStatus, incidentType, eventReason, statType } = await loadStatusCodes(docsDir);

        // Finished matches live on history; in-play ones only appear in the
        // live feed, so fall back to it when history has nothing.
        let payload: any;
        try {
          const history = await callRawEndpoint("/v1/football/match/live/history", { uuid: match_id });
          payload = history?.results;
        } catch {
          payload = undefined;
        }
        if (!payload || (!payload.incidents && !payload.stats)) {
          const live = await callRawEndpoint("/v1/football/match/detail_live");
          payload = (Array.isArray(live?.results) ? live.results : []).find((r: any) => r.id === match_id);
        }
        if (!payload) {
          throw new Error(
            `No event data for match ${match_id}. TheSports only serves this for matches within the last 30 days.`
          );
        }

        const teams = await matchTeams(match_id);
        const side = (position: unknown) =>
          position === 1 ? teams.home ?? "home" : position === 2 ? teams.away ?? "away" : "neutral";

        const events = (Array.isArray(payload.incidents) ? payload.incidents : []).map((i: any) => {
          const minute = i.add_time ? `${i.time}+${i.add_time}'` : i.time != null ? `${i.time}'` : undefined;
          const name = label(incidentType, i.type) ?? `type_${i.type}`;
          return {
            minute,
            event: name,
            team: side(i.position),
            player: i.player_name,
            assist: i.assist1_name,
            player_in: i.in_player_name,
            player_out: i.out_player_name,
            score: i.home_score != null ? `${i.home_score}-${i.away_score}` : undefined,
            reason: pickReason(label(eventReason, i.reason_type), name === "Substitution"),
          };
        });

        const stats = (Array.isArray(payload.stats) ? payload.stats : []).map((s: any) => ({
          stat: label(incidentType, s.type) ?? label(statType, s.type) ?? `type_${s.type}`,
          home: s.home,
          away: s.away,
        }));

        return {
          match_id,
          status: label(matchStatus, payload.score?.[1]),
          home: readScores(payload.score?.[2]),
          away: readScores(payload.score?.[3]),
          event_count: events.length,
          events,
          stats,
          commentary: include_commentary ? payload.tlive : undefined,
        };
      },
    },

    {
      name: "get_match_lineup",
      title: "Get starting lineups and formations for a match",
      description:
        "Starting XI, substitutes, formations, player ratings and injury/suspension list for one match. " +
        "Needs a match_id. Only available for matches within the last 30 days that have lineup coverage.",
      schema: { match_id: z.string().describe("Match id, from get_fixtures or get_live_scores") },
      handler: async ({ match_id }) => {
        const data = await callRawEndpoint("/v1/football/match/lineup/detail", { uuid: match_id });
        const r = data?.results;
        if (!r) throw new Error(`No lineup available for match ${match_id}.`);

        const shapeSide = (players: any[]) => ({
          starting: players
            .filter((p) => p.first === 1)
            .map((p) => ({
              name: p.name,
              number: p.shirt_number,
              position: POSITIONS[p.position] ?? p.position,
              captain: p.captain === 1 || undefined,
              rating: p.rating || undefined,
            })),
          substitutes: players
            .filter((p) => p.first !== 1)
            .map((p) => ({
              name: p.name,
              number: p.shirt_number,
              position: POSITIONS[p.position] ?? p.position,
            })),
        });

        const injuryTypes = ["unknown", "injured", "suspended", "questionable"];
        const shapeInjuries = (rows: any[]) =>
          (rows ?? []).map((p) => ({
            name: p.name,
            status: injuryTypes[p.type] ?? "unknown",
            reason: p.reason,
          }));

        return {
          match_id,
          confirmed: r.confirmed === 1,
          home: {
            formation: r.home_formation,
            ...shapeSide(Array.isArray(r.lineup?.home) ? r.lineup.home : []),
            unavailable: shapeInjuries(r.injury?.home),
          },
          away: {
            formation: r.away_formation,
            ...shapeSide(Array.isArray(r.lineup?.away) ? r.lineup.away : []),
            unavailable: shapeInjuries(r.injury?.away),
          },
        };
      },
    },

    {
      name: "get_standings",
      title: "Get a league table",
      description:
        "Current league table for a competition, with team names, points, played/won/drawn/lost, " +
        "goals for and against. Accepts a competition name or id. Also accepts a team name — it will " +
        "return the table of the league that team plays in, with that team highlighted.",
      schema: {
        competition: z.string().optional().describe("Competition name or id"),
        team: z.string().optional().describe("Team name or id — returns that team's league table"),
      },
      handler: async ({ competition, team }) => {
        if (!competition && !team) {
          throw new Error("Pass either a competition or a team.");
        }

        let seasonId: string | undefined;
        let compLabel: string | undefined;
        let highlightId: string | undefined;

        if (competition) {
          const comp = await resolveCompetitionId(competition);
          seasonId = comp.cur_season_id;
          compLabel = comp.name;
        } else {
          const resolved = await resolveTeamId(team!);
          highlightId = resolved.id;
          const data = await callRawEndpoint("/v1/football/team/additional/list", { uuid: resolved.id });
          const compId = data?.results?.[0]?.competition_id;
          if (!compId) throw new Error(`${resolved.name} is not tied to a league competition.`);
          const comp = await resolveCompetitionId(compId);
          seasonId = comp.cur_season_id;
          compLabel = comp.name;
        }

        if (!seasonId) throw new Error(`No current season on record for ${compLabel}.`);

        const data = await callRawEndpoint("/v1/football/season/recent/table/detail", { uuid: seasonId });
        const tables = Array.isArray(data?.results?.tables) ? data.results.tables : [];
        if (tables.length === 0) throw new Error(`No standings published for ${compLabel} yet.`);

        const allTeamIds = tables.flatMap((t: any) =>
          (Array.isArray(t.rows) ? t.rows : []).map((row: any) => row.team_id)
        );
        const names = await teamNames(allTeamIds);

        return {
          competition: compLabel,
          tables: tables.map((t: any) => ({
            group: t.group ? String.fromCharCode(64 + t.group) : undefined,
            conference: t.conference || undefined,
            rows: (Array.isArray(t.rows) ? t.rows : [])
              .sort((a: any, b: any) => (a.position ?? 0) - (b.position ?? 0))
              .map((row: any) => ({
                position: row.position,
                team: names.get(row.team_id) ?? row.team_id,
                played: row.total,
                won: row.won,
                drawn: row.draw,
                lost: row.loss,
                goals_for: row.goals,
                goals_against: row.goals_against,
                goal_difference: row.goal_diff,
                points: row.points,
                note: row.note || undefined,
                highlighted: row.team_id === highlightId || undefined,
              })),
          })),
        };
      },
    },

    {
      name: "get_head_to_head",
      title: "Get pre-match analysis and head-to-head history",
      description:
        "Historical meetings between the two sides, each team's recent form, and goal distribution " +
        "for an upcoming or recent match. Needs a match_id.",
      schema: { match_id: z.string().describe("Match id, from get_fixtures") },
      handler: async ({ match_id }) => {
        const data = await callRawEndpoint("/v1/football/match/analysis", { uuid: match_id });
        if (!data?.results) throw new Error(`No analysis available for match ${match_id}.`);
        return data.results;
      },
    },
  ];
}
