# Player transfer

**Endpoint**: `GET /v1/football/player/transfer/list`

**Plan / Category**: `ADVANCED DATA`

**Included in Your Plan**: `Yes ✅`

**Description**: Return full player transfer data，and obtain new or changed data according to the time<br/><br/>1、Full update for the first time，full data is obtained according to the parameter page (Page increases by 1, loop to get the interface, total is 0, and the loop ends)<br/>2、Subsequent incremental update，obtain change data according to the parameter time increment (recommended request frequency：1min/time)

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
- **`results`** (`array of objects`) - Player list
  - **`id`** (`string`) - Player id
  - **`player`** (`object`) - Player data
    - **`id`** (`string`) - Player id
    - **`name`** (`string`) - Player name
  - **`transfer`** (`array of objects`) - Player transfer list
    - **`from_team_id`** (`string`) - Transfer out team id
    - **`from_team_name`** (`string`) - Transfer out team name
    - **`to_team_id`** (`string`) - Transfer team id
    - **`to_team_name`** (`string`) - Transfer team name
    - **`transfer_type`** (`integer`) - Type of transfer，1-rental，2-rental end，3-transfer，4-retirement，5-draft，6-released，7-signed，8-unknown
    - **`transfer_time`** (`integer`) - Transfer time
    - **`transfer_fee`** (`integer`) - Transfer fee
    - **`transfer_desc`** (`string`) - Transfer description (including unit)
  - **`updated_at`** (`integer`) - Update time

### 404
Resource does not exist

**Content-Type:** `application/json`

- **`code`** (`integer`) - status code
- **`msg`** (`string`) - Error message

