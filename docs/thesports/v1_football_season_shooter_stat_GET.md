# Season top scorer(all season)

**Endpoint**: `GET /v1/football/season/shooter/stat`

**Plan / Category**: `DATABASE DATA`

**Included in Your Plan**: `No ❌`

**Description**: Return to the season scorer list details data<br/>Request times：120 times/min<br/><br/>PS：Get the changed season id through the ‘data update’ interface

## Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| user | query | True | string | Username，please contact business |
| secret | query | True | string | Key，please contact business |
| uuid | query | True | string | Season id |

## Responses
### 200
Successful

**Content-Type:** `application/json`

- **`code`** (`integer`)
- **`results`** (`array of objects`) - Player list
  - **`position`** (`integer`) - Rank
  - **`player`** (`object`) - Player data
    - **`id`** (`string`) - Player id
    - **`name`** (`string`) - Player name
    - **`logo`** (`string`) - Player logo
    - **`position`** (`string`) - Player positions，F-forward，M-midfielder，D-guard，G-goalkeeper，others are unknown
    - **`country_id`** (`string`) - Country/Region id
    - **`nationality`** (`string`) - nationality
  - **`team`** (`object`) - Team data
    - **`id`** (`string`) - Team id
    - **`name`** (`string`) - Team name
    - **`logo`** (`string`) - Team logo
  - **`goals`** (`integer`) - Goal
  - **`penalty`** (`integer`) - Penalty kick
  - **`assists`** (`integer`) - Assist
  - **`minutes_played`** (`integer`) - Playing time (minutes)
  - **`updated_at`** (`integer`) - Update time

### 404
Resource does not exist

**Content-Type:** `application/json`

- **`code`** (`integer`) - status code
- **`msg`** (`string`) - Error message

