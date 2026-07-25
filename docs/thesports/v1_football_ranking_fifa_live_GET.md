# FIFA Live Ranking

**Endpoint**: `GET /v1/football/ranking/fifa/live`

**Plan / Category**: `ADVANCED DATA`

**Included in Your Plan**: `Yes ✅`

**Description**: Return FIFA national team men's and women's real-time ranking data<br/><br/>recommended request frequency：1~5 minutes/time

## Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| user | query | True | string | Username，please contact business |
| secret | query | True | string | Key，please contact business |
| type | query | True | integer | List type, 1-men, 2-women |

## Responses
### 200
Successful

**Content-Type:** `application/json`

- **`code`** (`integer`)
- **`results`** (`object`) - Data details
  - **`ranking`** (`integer`) - Ranking
  - **`team_id`** (`string`) - Team id
  - **`region_id`** (`integer`) - Regional id，1-UEFA，2-South American Football Confederation，3 Central and North America and Caribbean Football Confederation，4 African Football Confederation，5 Asian Football Confederation，6 Oceania Football Confederation
  - **`points`** (`integer`) - integral
  - **`previous_points`** (`integer`) - Last points
  - **`position_changed`** (`integer`) - Position changed

### 404
Resource does not exist

**Content-Type:** `application/json`

- **`code`** (`integer`) - status code
- **`msg`** (`string`) - Error message

