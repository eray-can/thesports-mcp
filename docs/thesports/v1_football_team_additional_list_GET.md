# Team

**Endpoint**: `GET /v1/football/team/additional/list`

**Plan / Category**: `BASIC INFO`

**Included in Your Plan**: `Yes ✅`

**Description**: Return full team data，and obtain new or changed data according to the time<br/><br/>1、Full update for the first time，full data is obtained according to the parameter page (Page increases by 1, loop to get the interface, total is 0, and the loop ends)<br/>2、Subsequent incremental update，obtain change data according to the parameter time increment (recommended request frequency：1min/time)

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
- **`results`** (`array of objects`) - Team list
  - **`id`** (`string`) - Team id
  - **`competition_id`** (`string`) - Competition id（The team belongs to the league，the cup is not related）
  - **`country_id`** (`string`) - Country/Region id
  - **`name`** (`string`) - Team name
  - **`short_name`** (`string`) - Team abbreviation
  - **`logo`** (`string`) - Team logo
  - **`national`** (`integer`) - Whether the national team，1-Yes，0-No
  - **`country_logo`** (`string`) - National team logo（Exist for the national team）
  - **`foundation_time`** (`integer`) - Foundation time
  - **`website`** (`string`) - Team official website
  - **`coach_id`** (`string`) - Coach id
  - **`venue_id`** (`string`) - Venue id
  - **`market_value`** (`integer`) - Market value
  - **`market_value_currency`** (`string`) - Market value unit
  - **`total_players`** (`integer`) - Total players，-1 means there is no data in this field
  - **`foreign_players`** (`integer`) - Non-local players，-1 means there is no data in this field
  - **`national_players`** (`integer`) - National team players，-1 means there is no data in this field
  - **`uid`** (`string`) - Team id (the corresponding id after the duplicate teams are merged), if it exists, it will be returned
  - **`virtual`** (`integer`) - Whether the placeholder team，1-Yes，0-No
  - **`gender`** (`integer`) - Gender 1. Male, 2. Female
  - **`updated_at`** (`integer`) - Update time

### 404
Resource does not exist

**Content-Type:** `application/json`

- **`code`** (`integer`) - status code
- **`msg`** (`string`) - Error message

