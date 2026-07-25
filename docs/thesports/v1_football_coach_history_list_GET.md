# Coach coaching resume

**Endpoint**: `GET /v1/football/coach/history/list`

**Plan / Category**: `ADVANCED DATA`

**Included in Your Plan**: `Yes ✅`

**Description**: Return the coaching history data of all coaches，and obtain new or changed data according to the time<br/><br/>1、Full update for the first time，full data is obtained according to the parameter page (Page increases by 1, loop to get the interface, total is 0, and the loop ends)<br/>2、Subsequent incremental update，obtain change data according to the parameter time increment (recommended request frequency：1min/time)

## Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| user | query | True | string | Username，please contact business |
| secret | query | True | string | Key，please contact business |
| page | query | False | integer | page query，return the data of the query page number (starting from 1), the default is 100 |
| time | query | False | integer | time query，return records (timestamp) greater than or equal to the update time，sorted according to the update time |
| uuid | query | False | string | uuid query，return the queried uuid data |

## Responses
### 200
Successful

**Content-Type:** `application/json`

- **`code`** (`integer`)
- **`query`** (`object`) - Inquiry
  - **`total`** (`integer`) - Return the total amount of data
  - **`type`** (`string`) - Query type，uuid query：uuid，page query：page，time query：time，default page
  - **`uuid`** (`string`) - uuid query value (uuid query，field exists)
  - **`page`** (`integer`) - page query value (page query，field exists)
  - **`time`** (`integer`) - time query value，timestamp format (time query，field exists)
  - **`min_time`** (`integer`) - Return the smallest time in the data(updated_at value) (time query，field exists)
  - **`max_time`** (`integer`) - Return the largest time in the data(updated_at value) (time query，field exists)
- **`results`** (`array of objects`) - Coach list
  - **`id`** (`string`) - Coach id
  - **`coach`** (`object`) - Coach data
    - **`id`** (`string`) - Coach id
    - **`name`** (`string`) - Coach name
  - **`history`** (`array of objects`) - Coach coaching resume list
    - **`team`** (`object`) - Team data
      - **`id`** (`string`) - Team id
      - **`name`** (`string`) - Team name
    - **`position`** (`integer`) - Incumbent, 1-Head Coach, 2-Assistant Coach, 3-Interim-head Coach, 0-Unknown
    - **`joined`** (`integer`) - Join time
    - **`contract_until`** (`integer`) - Contract expiration time
    - **`players_used`** (`integer`) - Number of player appointments
    - **`matches`** (`integer`) - Number of coaching matches
    - **`win`** (`integer`) - Wins
    - **`draw`** (`integer`) - Draws
    - **`lose`** (`integer`) - Loss
    - **`goal_ppt`** (`string`) - Average (goals per match：goals scored per match)
    - **`ppm`** (`string`) - Points per game
  - **`updated_at`** (`integer`) - Update time

### 404
Resource does not exist

**Content-Type:** `application/json`

- **`code`** (`integer`) - status code
- **`msg`** (`string`) - Error message

