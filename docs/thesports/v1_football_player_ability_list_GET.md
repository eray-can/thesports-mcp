# Player Ability

**Endpoint**: `GET /v1/football/player/ability/list`

**Plan / Category**: `ADVANCED DATA`

**Included in Your Plan**: `Yes ✅`

**Description**: Return full player ability data，and obtain new or changed data according to the time<br/><br/>1、Full update for the first time，full data is obtained according to the parameter page (Page increases by 1, loop to get the interface, total is 0, and the loop ends)<br/>2、Subsequent incremental update，obtain change data according to the parameter time increment (recommended request frequency：1min/time)

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
- **`results`** (`array of objects`) - Player Ability
  - **`id`** (`string`) - Player id
  - **`comprehensive`** (`integer`) - Player comprehensive ability
  - **`ability`** (`array of arrays`) - Ability Type description：<br/>1 - Diving<br/>2 - Anticipation<br/>3 - Control<br/>4 - Aerial<br/>5 - Mentality<br/>6 - Attacking<br/>7 - Defending<br/>8 - Creativity<br/>9 - Habilidad<br/>10 - Pace<br/>11 - Physical<br/>12 - Dribbling<br/>13 - Passing<br/>14 - Shooting<br/>15 - Jumping<br/>16 - gk diving<br/>17 - gk handling<br/>18 - gk kicking<br/>19 - gk positioning<br/>20 - gk reflexes<br/>21 - Goalkeeping<br/>22 - Movement<br/><br/>example:  [[7, 47, 0], [10, 87, 0], [11, 76, 0], [12, 89, 0], [13, 84, 0], [14, 85, 0]]
  - **`ability_detail`** (`array of arrays`) - Ability detail Type description：<br/>5 - Mentality detail: 1. aggression, 2. interceptions, 3. positioning, 4. vision, 5. penalties, 6. compostura<br/>6 - Attacking detail: 1. crossing, 2. finishing, 3. heading accuracy, 4. short passing, 5. volleys<br/>7 - Defending detail: 1. marking, 2. standing tackle, 3. sliding tackle<br/>9 - Habilidad detail: 1. dribbling, 2. curve, 3. fk accuracy, 4. long passing, 5. ball control<br/>11 - Physical detail: 1. shot power, 2. jumping, 3. stamina, 4. strength, 5. long shots<br/>21 - Goalkeeping detail: 1. gk dining, 2. gk handling, 3. gk kicking, 4. gk positioning, 5. gk reflexes<br/>22 - Movement detail: 1. acceleration, 2. sprint speed, 3. agility, 4. reactions, 5. balance<br/><br/>example:  [5, [1, 63, 0], [2, 55, 0], [3, 90, 0], [4, 89, 0], [5, 88, 0], [6, 90, 0]]
  - **`updated_at`** (`integer`) - Update time

### 404
Resource does not exist

**Content-Type:** `application/json`

- **`code`** (`integer`) - status code
- **`msg`** (`string`) - Error message

