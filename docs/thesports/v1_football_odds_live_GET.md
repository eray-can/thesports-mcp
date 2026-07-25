# Real-time odds

**Endpoint**: `GET /v1/football/odds/live`

**Plan / Category**: `ODDS DATA`

**Included in Your Plan**: `No ❌`

**Description**: Returns real-time changing odds data，and matches without odds changing will not return<br/>Only return the odds data changed in the last 60 seconds，and the customer needs to record the change data by himself<br/><br/>Range：Initial，Instant，Rolling Ball<br/>The first handicap of each odds of each company is the initial market; the initial market to the kick-off is the instant market; after the kick-off is the in-play market (judging by the state)<br/><br/>Suggested request frequency：3 seconds/time

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
- **`results`** (`object`) - Odds list
  - **`Company id`** (`array of arrays`) - The key is the odds company id，see status code -> Odds Company ID for details

### 404
Resource does not exist

**Content-Type:** `application/json`

- **`code`** (`integer`) - status code
- **`msg`** (`string`) - Error message

