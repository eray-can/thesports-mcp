# thesports MCP server

Exposes every TheSports football API endpoint documented in
[`docs/thesports/*.md`](../../docs/thesports) as its own MCP tool (67 tools:
`football_match_list`, `football_match_detail_live`,
`football_season_recent_table_detail`, `football_data_update`, ...).

Tools are generated at startup by parsing the markdown docs — endpoint path,
description, and query parameters (name/required/type) all come straight from
those files. Add a new doc file matching `v1_*_GET.md` and its tool appears on
the next restart; no code changes needed.

## What each tool does

- Tool name = doc filename minus the `v1_` prefix and `_GET` suffix, e.g.
  `v1_football_match_list_GET.md` -> `football_match_list`.
- Input schema = the doc's parameter table, minus `user`/`secret` (those are
  injected server-side from env, never exposed to the model).
- On call: builds `GET {THESPORTS_BASE_URL}{endpoint path}?user=...&secret=...&<args>`,
  and returns the raw JSON response as text (truncated past ~40k chars, since
  list endpoints can return large pages — narrow with `page`/`time`/`uuid`).
- TheSports returns auth/rate-limit errors as HTTP 200 with an error shape in
  the body (`{"err": "..."}` or `{"code": 429}`); the server detects those and
  surfaces them as tool errors instead of silently returning "success".

## Setup

```bash
cd mcp/thesports
npm install
npm run build
```

Requires two env vars (same ones the Go backend uses, see
[`config/config.go`](../../config/config.go)):

- `THESPORTS_USER`
- `THESPORTS_SECRET`

Optional:

- `THESPORTS_BASE_URL` (default `https://api.thesports.com`)
- `THESPORTS_DOCS_DIR` (default `../../docs/thesports` relative to this package)

## Register with Claude Code

From the repo root:

```bash
claude mcp add thesports -e THESPORTS_USER=your_user -e THESPORTS_SECRET=your_secret -- node mcp/thesports/dist/index.js
```

Or add to a project `.mcp.json` to share it with the team (credentials still
come from each person's own shell env — don't hardcode them here):

```json
{
  "mcpServers": {
    "thesports": {
      "command": "node",
      "args": ["mcp/thesports/dist/index.js"],
      "env": {
        "THESPORTS_USER": "${THESPORTS_USER}",
        "THESPORTS_SECRET": "${THESPORTS_SECRET}"
      }
    }
  }
}
```

## Manual smoke test

```bash
npm run build
node dist/index.js
```

It logs `[thesports-mcp] ready — 67 tools registered ...` to stderr and then
blocks, waiting for JSON-RPC messages on stdin — that's normal for a stdio MCP
server, not a hang.
