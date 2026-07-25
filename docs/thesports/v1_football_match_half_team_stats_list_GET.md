# Match team half-time statistics

**Endpoint**: `GET /v1/football/match/half/team_stats/list`

**Plan / Category**: `BASIC DATA`

**Included in Your Plan**: `Yes ✅`

**Description**: Returns the team half-time statistics of the match where the team half-time statistics have changed in the last 120 seconds(full update)<br/><br/>Suggested request frequency：1min/time

## Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| user | query | True | string | Username，please contact business |
| secret | query | True | string | Key，please contact business |

## Responses
### 200
Successful

**Content-Type:** `application/json`

- **`code`** (`integer`)
- **`results`** (`array of objects`) - Match list
  - **`id`** (`string`) - Match id
  - **`Sign`** (`object`) - ft-full time, p1-first half, p2-second half, o1-first half of overtime, o2-second half of overtime
    - **`Statistics ID`** (`array of objects`) - Half-time Statistics，please refer to Status Code -> Half-time Statistics<br/>example：[3, 6]

### 404
Resource does not exist

**Content-Type:** `application/json`

- **`code`** (`integer`) - status code
- **`msg`** (`string`) - Error message

