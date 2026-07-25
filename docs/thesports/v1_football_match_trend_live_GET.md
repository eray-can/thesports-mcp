# Real-time match trends

**Endpoint**: `GET /v1/football/match/trend/live`

**Plan / Category**: `BASIC DATA`

**Included in Your Plan**: `Yes ✅`

**Description**: Returns home and away team trend details for real-time matches<br/><br/>The home team is a positive number and the away team is a negative number，and it changes by the number of minutes (there is overtime，and the change in overtime minutes is added to the second half list)<br/>Recommended request frequency：1 minute/time

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
- **`results`** (`array of objects`)
  - **`match_id`** (`string`) - Match id
  - **`trend`** (`object`)
    - **`count`** (`integer`) - Number of halves
    - **`per`** (`integer`) - Half time
    - **`data`** (`array of objects`) - Trend value change (number of half courts)，change in minutes<br/>example：[[16, 0, -2], [-16, 0, 1]]

### 404
Resource does not exist

**Content-Type:** `application/json`

- **`code`** (`integer`) - status code
- **`msg`** (`string`) - Error message

