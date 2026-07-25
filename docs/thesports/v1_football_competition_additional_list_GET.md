# Competition

**Endpoint**: `GET /v1/football/competition/additional/list`

**Plan / Category**: `BASIC INFO`

**Included in Your Plan**: `Yes ✅`

**Description**: Return full competition data，and obtain new or changed data according to the time query increment<br/><br/>1、Full update for the first time，full data is obtained according to the parameter page (Page increases by 1, loop to get the interface, total is 0, and the loop ends)<br/>2、Subsequent incremental update，obtain change data according to the parameter time increment (recommended request frequency：1min/time)

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
- **`results`** (`array of objects`) - Competition list
  - **`id`** (`string`) - Competition id
  - **`category_id`** (`string`) - Category id
  - **`country_id`** (`string`) - Country/Region id
  - **`name`** (`string`) - Competition name
  - **`short_name`** (`string`) - Competition abbreviation
  - **`logo`** (`string`) - Competition logo
  - **`type`** (`integer`) - Competition type，0-unknown，1-league，2-cup，3-friendly
  - **`cur_season_id`** (`string`) - Current season id
  - **`cur_stage_id`** (`string`) - Current stage id
  - **`cur_round`** (`integer`) - Current round
  - **`round_count`** (`integer`) - Total rounds
  - **`title_holder`** (`array of objects`) - defending champion<br/>example：["p3glrw7he0gqdyj", 6]
  - **`most_titles`** (`array of objects`) - most winning team<br/>example：[["p3glrw7he0gqdyj"], 20]
  - **`newcomers`** (`array of objects`) - promoted elimination team<br/>example：[["p3glrw7he0gqdyj"], ["p3glrw7he0gqdyj"]]
  - **`divisions`** (`array of objects`) - competition level<br/>example：[[], ["kp3glrw7hwqdyjv"]]
  - **`host`** (`object`) - Host
    - **`country`** (`string`) - Country/Region
    - **`city`** (`string`) - City，may not exist
  - **`gender`** (`integer`) - Gender 1. Male, 2. Female
  - **`primary_color`** (`string`) - Main color，can be ignored
  - **`secondary_color`** (`string`) - Secondary color，can be ignored
  - **`uid`** (`string`) - Competition id (the corresponding id after the duplicate competitions are merged), if it exists, it will be returned
  - **`updated_at`** (`integer`) - Update time

### 404
Resource does not exist

**Content-Type:** `application/json`

- **`code`** (`integer`) - status code
- **`msg`** (`string`) - Error message

