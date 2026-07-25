# Match Goal Line

**Endpoint**: `GET /v1/football/match/goal/line/detail`

**Plan / Category**: `BASIC DATA`

**Included in Your Plan**: `Yes ✅`

**Description**: Returns goal line data for a single match<br/>Request times：120 times/min<br/><br/>PS：Get the changed match id through the ‘data update’ interface

## Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| user | query | True | string | Username，please contact business |
| secret | query | True | string | Key，please contact business |
| uuid | query | True | string | Match id |

## Responses
### 200
Successful

**Content-Type:** `application/json`

- **`code`** (`integer`)
- **`results`** (`array of objects`)
  - **`number`** (`integer`) - Number of goals
  - **`time`** (`integer`) - Time (second)
  - **`goal_x`** (`string`) - Goal x-coordinate（The coordinate origin is in the upper left, and the maximum x is 9.6）
  - **`goal_y`** (`string`) - Goal y-coordinate（The coordinate origin is in the upper left, and the maximum y is 38）
  - **`own_goal`** (`integer`) - Is it an own goal? 1.Yes 0.No
  - **`pass`** (`array of objects`) - Passing Lines
    - **`belong`** (`integer`) - Team 1.Home team 2.Away team
    - **`player_id`** (`string`) - Player id
    - **`shirt_number`** (`string`) - Jersey number
    - **`x`** (`string`) - Full field x-coordinate（The coordinate origin is in the upper left, and the maximum x is 100）
    - **`y`** (`string`) - Full field y-coordinate（The coordinate origin is in the upper left, and the maximum y is 100）
    - **`shooter`** (`integer`) - Is the shooter? 1.Yes 0.No
    - **`assist`** (`integer`) - Is it an assist? 1.Yes 0.No
  - **`goalkeeper`** (`object`) - goalkeeper
    - **`belong`** (`integer`) - Team 1.Home team 2.Away team
    - **`player_id`** (`string`) - Player id
    - **`shirt_number`** (`string`) - Jersey number

### 404
Resource does not exist

**Content-Type:** `application/json`

- **`code`** (`integer`) - status code
- **`msg`** (`string`) - Error message

