# thesports-mcp

An MCP server for the [TheSports](https://www.thesports.com/) football data API,
built so an assistant can answer questions the way people actually ask them —
*"how did Galatasaray do?"*, *"who scored in that match?"*, *"what's live right
now?"* — without anyone needing to know a TheSports uuid exists.

## Why it looks like this

TheSports documents 67 endpoints. The obvious design is one MCP tool per
endpoint, but that makes for a poor assistant: every tool description is loaded
into context on every request, the names are near-identical
(`match_team_stats_detail` vs `match_team_stats_list` vs `season_team_stat`),
and every response comes back as uuids and numeric codes that mean nothing to a
reader.

So the endpoints are wrapped in **11 task-shaped tools** that take names and
return names, plus **2 tools that keep the raw API fully reachable** for
anything the wrappers don't cover. Concretely, the wrappers:

- **take names, not ids** — `get_standings({team: "Galatasaray"})` works; so does
  passing an id if you have one
- **resolve ids to names in the response** — team, competition and player names
  instead of `z318q66hp66qo9j`
- **translate codes to labels** — `"Yellow card"`, `"Substitution"`,
  `"First half"` instead of `type: 3`, `9`, `status_id: 2`
- **decode the score tuples** — `{score: 2, halftime_score: 1, corners: 7}`
  instead of `[2,1,0,2,7,0,0]`
- **refuse to guess** — an ambiguous name comes back as "did you mean X, Y or
  Z?" rather than a confident answer about the wrong club

## Tools

| Tool | Answers |
|------|---------|
| `search_team` | "which team is this name?" |
| `search_competition` | "which league is this?" (also returns current season id) |
| `search_player` | "which player is this?" |
| `get_team` | club profile: market value, squad size, website, league |
| `get_team_squad` | current squad with positions and shirt numbers |
| `get_fixtures` | schedule/results by date, or a team's or league's full season |
| `get_live_scores` | everything in play right now, with names and scores |
| `get_match_events` | goals, cards, subs, VAR + technical stats for one match |
| `get_match_lineup` | starting XI, formations, ratings, unavailable players |
| `get_standings` | league table, by competition or by "a team in it" |
| `get_head_to_head` | historical meetings and recent form before a match |
| `list_api_endpoints` | browse all 67 raw endpoints (filterable) |
| `call_api_endpoint` | call any of them directly — odds, transfers, rankings, honours |

The last two matter: the wrappers cover the common questions, but odds,
transfers, FIFA rankings, injuries, brackets and referee data are all still one
call away without paying context cost for 67 tool schemas up front.

## Name search and the catalogue cache

TheSports has no search-by-name endpoint, so mapping *"Beşiktaş"* to an id means
holding the entity list locally. The team catalogue is ~80,000 rows over ~80
requests, so it is cached **on disk** (24h TTL) and warmed in the background at
startup. First ever run takes about a minute; after that, searches are instant
and survive restarts.

Names are matched with accents and Turkish dotless-i folded (`Beşiktaş` ≈
`besiktas`). Competitions carry a small alias table for local-language names,
because the API stores everything in English — `"Süper Lig"` would otherwise be
an equally good match for *Moldovan Super Liga* as for *Turkish Super League*.

Cache location defaults to your temp dir; override with `THESPORTS_CACHE_DIR`.
Set `THESPORTS_SKIP_WARMUP=1` to disable the startup prefetch.

## Setup

```bash
npm install
npm run build
```

Requires TheSports API credentials (contact TheSports for these):

- `THESPORTS_USER`
- `THESPORTS_SECRET`

Optional: `THESPORTS_BASE_URL` (default `https://api.thesports.com`),
`THESPORTS_DOCS_DIR`, `THESPORTS_CACHE_DIR`, `THESPORTS_SKIP_WARMUP`.

## Register with an MCP client

```bash
claude mcp add thesports -e THESPORTS_USER=your_user -e THESPORTS_SECRET=your_secret -- node /path/to/thesports-mcp/dist/index.js
```

Or via a JSON config:

```json
{
  "mcpServers": {
    "thesports": {
      "command": "node",
      "args": ["/path/to/thesports-mcp/dist/index.js"],
      "env": {
        "THESPORTS_USER": "your_user",
        "THESPORTS_SECRET": "your_secret"
      }
    }
  }
}
```

## Notes on the upstream API

Two behaviours worth knowing, both handled here:

- **Errors arrive as HTTP 200.** Plan/authorization failures come back as
  `{"err": "..."}` and rate limits as `{"code": 429}`, both with a 200 status.
  Treating status codes as the source of truth silently turns an auth failure
  into "0 results, success".
- **`query.total` is the current page's row count, not the collection size.**
  Every full page reports `total: 1000`. Stopping when
  `rows_fetched >= total` therefore ends the loop after page one; the documented
  contract is to keep paging until `total` comes back `0`.

Endpoint definitions are parsed at startup from the bundled
[`docs/thesports/`](docs/thesports) markdown, so `list_api_endpoints` and the
event/status labels stay in sync with the reference docs rather than drifting in
hardcoded tables.
