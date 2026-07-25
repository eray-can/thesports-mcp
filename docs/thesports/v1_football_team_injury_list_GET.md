# Team injury

**Endpoint**: `GET /v1/football/team/injury/list`

**Plan / Category**: `ADVANCED DATA`

**Included in Your Plan**: `Yes ✅`

**Description**: Return full team player injury data，and obtain new or changed data according to the time<br/><br/>1、Full update for the first time，full data is obtained according to the parameter page (Page increases by 1, loop to get the interface, total is 0, and the loop ends)<br/>2、Subsequent incremental update，obtain change data according to the parameter time increment (recommended request frequency：1min/time)

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
- **`results`** (`array of objects`) - Team list
  - **`id`** (`string`) - Team id
  - **`team`** (`object`) - Team data
    - **`id`** (`string`) - Team id
    - **`name`** (`string`) - Team name
  - **`injury`** (`array of objects`) - Team injury list
    - **`player_id`** (`string`) - Player id
    - **`competition_id`** (`string`) - Affecting competition id
    - **`type`** (`integer`) - Type，0-unknown，1-injured，2-suspended，3-Questionable
    - **`injury_id`** (`string`) - Injury id
    - **`reason`** (`string`) - Cause of injury
    - **`start_time`** (`integer`) - Starting time
    - **`end_time`** (`integer`) - End Time
    - **`missed_matches`** (`integer`) - Affect the session
  - **`updated_at`** (`integer`) - Update time

### 404
Resource does not exist

**Content-Type:** `application/json`

- **`code`** (`integer`) - status code
- **`msg`** (`string`) - Error message

