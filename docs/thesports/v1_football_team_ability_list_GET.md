# Team Ability

**Endpoint**: `GET /v1/football/team/ability/list`

**Plan / Category**: `ADVANCED DATA`

**Included in Your Plan**: `Yes ✅`

**Description**: Return full team ability data，and obtain new or changed data according to the time<br/><br/>1、Full update for the first time，full data is obtained according to the parameter page (Page increases by 1, loop to get the interface, total is 0, and the loop ends)<br/>2、Subsequent incremental update，obtain change data according to the parameter time increment (recommended request frequency：1min/time)

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
- **`results`** (`array of objects`) - Team Ability
  - **`id`** (`string`) - Team id
  - **`comprehensive`** (`integer`) - Team comprehensive ability
  - **`ability`** (`array of arrays`) - Ability Type description：<br/>31 - Attacking<br/>32 - Organization<br/>33 - Defending<br/>34 - Transition<br/>35 - Set piece<br/>36 - System<br/><br/>example:  [[31, 94, 0], [32, 90, 0], [33, 92, 0], [34, 92, 0], [35, 89, 0], [36, 91, 0]]
  - **`ability_detail`** (`array of arrays`) - Ability detail Type description：<br/>31 - Attacking detail: 1. finishing, 2. individual attacking, 3. attacking variety, 4. sustained pressure, 5. long shots, 6. chance conversion<br/>32 - Organization detail: 1. game control, 2. center penetration, 3. settled play creativity, 4. width utilization, 5. playmaking, 6. build-up play<br/>33 - Defending detail: 1. defensive efficiency, 2. chance prevention, 3. high press, 4. defensive shape, 5. individual defending, 6. aerial dominance<br/>34 - Transition detail: 1. defensive transition, 2. offensive transition, 3. transition decision making, 4. transition hub<br/>35 - Set piece detail: 1. set piece attack, 2. set piece defense, 3. penalty, 4. set piece routines<br/>36 - System detail: 1. squad robustness, 2. coaching adaptation, 3. mentality discipline, 4. endurance consistency<br/><br/>example:  [31, [1, 86, 0, 3], [2, 93, 0, 1], [3, 91, 0, 1], [4, 92, 0, 1], [5, 85, 0, 3], [6, 87, 0, 1]]
  - **`updated_at`** (`integer`) - Update time

### 404
Resource does not exist

**Content-Type:** `application/json`

- **`code`** (`integer`) - status code
- **`msg`** (`string`) - Error message

