# Best lineup details

**Endpoint**: `GET /v1/football/competition/best_lineup/detail`

**Plan / Category**: `ADVANCED DATA`

**Included in Your Plan**: `Yes ✅`

**Description**: Return to the details of the best lineup data of the season round (the best lineup id，obtained from the best lineup list)<br/>Request times：120 times/min

## Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| user | query | True | string | Username，please contact business |
| secret | query | True | string | Key，please contact business |
| uuid | query | True | string | Best lineup id |

## Responses
### 200
Successful

**Content-Type:** `application/json`

- **`code`** (`integer`)
- **`results`** (`object`)
  - **`info`** (`object`) - Data details
    - **`id`** (`string`) - Best lineup id
    - **`competition_id`** (`string`) - Competition id
    - **`season_id`** (`string`) - Season id
    - **`stage_id`** (`string`) - Stage id
    - **`name`** (`string`) - name
    - **`formation`** (`string`) - Formation
    - **`update_time`** (`integer`) - Data release time
    - **`updated_at`** (`integer`) - Update time
  - **`detail`** (`array of objects`) - Player list
    - **`team_id`** (`string`) - Team id
    - **`player_id`** (`string`) - Player id
    - **`rating`** (`integer`) - Score，10 is the full score，in order to avoid the impact of floating point numbers，x100 times are stored as integers; eg：the calculated score is (760/100=7.60)
    - **`location_x`** (`integer`) - x coordinate value，a total of 100
    - **`location_y`** (`integer`) - y coordinate value，a total of 100
    - **`position`** (`string`) - Player positions，F-forward，M-midfielder，D-guard，G-goalkeeper，others are unknown

### 404
Resource does not exist

**Content-Type:** `application/json`

- **`code`** (`integer`) - status code
- **`msg`** (`string`) - Error message

