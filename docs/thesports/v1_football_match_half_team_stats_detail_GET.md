# Team half-time statistics

**Endpoint**: `GET /v1/football/match/half/team_stats/detail`

**Plan / Category**: `BASIC DATA`

**Included in Your Plan**: `Yes ✅`

**Description**: Return team half-time statistics for matches<br/><br/>Request times：120 times/min

## Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| user | query | True | string | Username，please contact business |
| secret | query | True | string | Key，please contact business |
| uuid | query | True | string | Match id |

## Responses
### 200
Successful

**Content-Type:** `application/json`

- **`code`** (`integer`)
- **`results`** (`object`) - Team half-time statistics data list
  - **`Sign`** (`object`) - ft-full time, p1-first half, p2-second half, o1-first half of overtime, o2-second half of overtime
    - **`Statistics ID`** (`array of objects`) - Half-time Statistics，please refer to Status Code -> Half-time Statistics<br/>example：[3, 6]

### 404
Resource does not exist

**Content-Type:** `application/json`

- **`code`** (`integer`) - status code
- **`msg`** (`string`) - Error message

