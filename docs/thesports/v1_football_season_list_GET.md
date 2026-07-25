# Season

**Endpoint**: `GET /v1/football/season/list`

**Plan / Category**: `BASIC INFO`

**Included in Your Plan**: `Yes ✅`

**Description**: Return full season data，and obtain new or changed data according to the time<br/><br/>1、Full update for the first time，full data is obtained according to the parameter page (Page increases by 1, loop to get the interface, total is 0, and the loop ends)<br/>2、Subsequent incremental update，obtain change data according to the parameter time increment (recommended request frequency：1min/time)

## Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| user | query | True | string | Username，please contact business |
| secret | query | True | string | Key，please contact business |
| page | query | False | integer | page query，return the data of the query page number (starting from 1), the default is 1000 |
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
- **`results`** (`array of objects`) - Season list
  - **`id`** (`string`) - Season id
  - **`competition_id`** (`string`) - Competition id
  - **`year`** (`string`) - Season year
  - **`has_player_stats`** (`integer`) - Is there any player statistics，1-Yes，0-No
  - **`has_team_stats`** (`integer`) - Are there team statistics，1-Yes，0-No
  - **`has_table`** (`integer`) - Is there a standings，1-Yes，0-No
  - **`is_current`** (`integer`) - Whether the latest season，1-Yes，0-No
  - **`start_time`** (`integer`) - Start time
  - **`end_time`** (`integer`) - End Time
  - **`updated_at`** (`integer`) - Update time

### 404
Resource does not exist

**Content-Type:** `application/json`

- **`code`** (`integer`) - status code
- **`msg`** (`string`) - Error message

