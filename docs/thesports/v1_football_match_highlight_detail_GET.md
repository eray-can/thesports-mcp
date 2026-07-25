# Match Incident Gif

**Endpoint**: `GET /v1/football/match/highlight/detail`

**Plan / Category**: `EXTENDED DATA`

**Included in Your Plan**: `No ❌`

**Description**: Returns the URL of a GIF of incidents for a single match<br/>Includes：goal, yellow card, red card, card upgrade confirmed, penalty, penalty missed, own goal, penalty(penalty shoot-out), penalty missed(penalty shoot-out)<br/>Request times：120 times/min<br/><br/>PS：Get the changed match id through the ‘data update’ interface

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
- **`results`** (`array of objects`)
  - **`type`** (`integer`) - Type，see status code -> technical statistics
  - **`time`** (`integer`) - Time (minutes)
  - **`position`** (`integer`) - The incident occurred，1- home team，2- away team
  - **`home`** (`integer`) - Home team values
  - **`away`** (`integer`) - Away team values
  - **`gif`** (`string`) - gif url
  - **`cover`** (`string`) - gif cover

### 404
Resource does not exist

**Content-Type:** `application/json`

- **`code`** (`integer`) - status code
- **`msg`** (`string`) - Error message

