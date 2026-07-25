# Single match odds

**Endpoint**: `GET /v1/football/odds/history`

**Plan / Category**: `ODDS DATA`

**Included in Your Plan**: `No ❌`

**Description**: Return the full odd change data of the match (used as a supplement)<br/>Request limit：Matches within 30 days before today<br/><br/>Range：Initial，Instant，Rolling Ball<br/>The first handicap of each odds of each company is the initial market; the initial market to the kick-off is the instant market; after the kick-off is the in-play market (judging by the state)<br/><br/>Request times：120 times/min<br/><br/>Remarks：<br/>The odds change data are all obtained in the real-time odds interface，and the real-time odds interface returns the odds data of all competitions in the last 60s，which needs to be recorded locally<br/>If the odds data acquisition is missing or not acquired，check the gaps through the single match odds interface

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
  - **`Company id`** (`object`) - The key is the odds company id，see status code -> Odds Company ID for details
    - **`asia`** (`array of arrays`) - Asia compensation
    - **`eu`** (`array of arrays`) - Euro compensation
    - **`bs`** (`array of arrays`) - Size ball
    - **`cr`** (`array of arrays`) - corner

### 404
Resource does not exist

**Content-Type:** `application/json`

- **`code`** (`integer`) - status code
- **`msg`** (`string`) - Error message

