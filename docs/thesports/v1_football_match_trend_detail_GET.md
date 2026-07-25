# Match trends

**Endpoint**: `GET /v1/football/match/trend/detail`

**Plan / Category**: `BASIC DATA`

**Included in Your Plan**: `Yes ✅`

**Description**: Return to the match's home and away team trend details<br/><br/>The home team is a positive number and the away team is a negative number，and it changes by the number of minutes (there is overtime，and the change in overtime minutes is added to the second half list)<br/>Request limit：Matches within 30 days before today<br/>Request times：120 times/min<br/><br/>Note：<br/>Real-time match trend data is obtained through the real-time trend interface.<br/>If match trend data is missing or not obtained, you can use this interface to check for any gaps.

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
- **`results`** (`object`)
  - **`count`** (`integer`) - Number of halves
  - **`per`** (`integer`) - Half time
  - **`data`** (`array of objects`) - Trend value change (number of half courts)，change in minutes<br/>example：[[16, 0, -2], [-16, 0, 1]]

### 404
Resource does not exist

**Content-Type:** `application/json`

- **`code`** (`integer`) - status code
- **`msg`** (`string`) - Error message

