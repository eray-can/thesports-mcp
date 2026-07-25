# Player

**Endpoint**: `GET /v1/football/player/with_stat/list`

**Plan / Category**: `BASIC INFO`

**Included in Your Plan**: `Yes ✅`

**Description**: Return full player data，and obtain new or changed data according to the time<br/><br/>1、Full update for the first time，full data is obtained according to the parameter page (Page increases by 1, loop to get the interface, total is 0, and the loop ends)<br/>2、Subsequent incremental update，obtain change data according to the parameter time increment (recommended request frequency：1min/time)

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
- **`results`** (`array of objects`) - Player list
  - **`id`** (`string`) - Player id
  - **`team_id`** (`string`) - Team id，when 1. player retires，2. free agent，3. team unknown，team_id is 0
  - **`name`** (`string`) - Player name
  - **`short_name`** (`string`) - Player abbreviation
  - **`logo`** (`string`) - Player logo
  - **`national_logo`** (`string`) - Player logo(National team lineup logo, used when judging that the team is a national team)
  - **`age`** (`integer`) - age
  - **`birthday`** (`integer`) - birthday
  - **`weight`** (`integer`) - weight
  - **`height`** (`integer`) - height
  - **`country_id`** (`string`) - Country/Region id
  - **`nationality`** (`string`) - nationality
  - **`coach_id`** (`string`) - Coach id (The corresponding coach id if the player is a coach)
  - **`market_value`** (`integer`) - Market value
  - **`market_value_currency`** (`string`) - Market value unit
  - **`contract_until`** (`integer`) - Contract deadline
  - **`preferred_foot`** (`integer`) - Preferred foot，0-unknown，1-left foot，2-right foot，3-left and right foot
  - **`ability`** (`array of arrays`) - Ability score
  - **`characteristics`** (`array of objects`) - Technical Features Field Description：<br/>1-Unloading<br/>2-Penalty Kick<br/>3-Direct Free Kick<br/>4-Long Shot<br/>5-Single Shot<br />6-pass<br/>7-organize the attack<br/>8-dribble<br/>9-interrupt the ball<br/>10-tackle<br/>11-stability<br/> 12-excellent<br/>13-long pass<br/>14-ball control<br/>15-air confrontation<br/>16-ground confrontation<br/>17-error tendency<br/>18- Discipline<br/>19-Punch penalty<br/>20-Reaction<br/>21-Abandon goal to participate in attack<br/>22-High ball interception<br/>23-Handle the ball<br/>24- Long Shots<br/>25-Stance<br/>26-High Pressing<br/>27-Long Shots Save<br/>28-Crossing<br/>29-Offside awareness<br/>30-Close shot saves<br/>31-Concentration<br/>32-Defensive participation<br/>33-Key passing Ball<br/>34-Header<br/>35-Set ball<br/>36-Straight pass<br/>37-Counter attack<br/>38-One kick<br/>39-up High ball<br/>40-fouling<br/>41-inward cut<br/>42-Punches<br/>43-clearance<br/><br/>example：[[[11, 1]], [[7, 1]]]
  - **`position`** (`string`) - Good position，F-forward，M-midfielder，D-guard，G-goalkeeper，others are unknown
  - **`positions`** (`array of objects`) - Detailed position field description：<br/>LW-left forward<br/>RW-right forward<br/>ST-forward<br/>SS-second striker<br/>AM- Attacking type<br/>ML-left midfield<br/>MC-center midfield<br/>MR-right midfield<br/>DM-Defensive center<br/>DL-left back<br/>DC-center back<br/>DR-right back<br/>GK-goalkeeper<br/><br/>example：["RW", ["ST"]]
  - **`uid`** (`string`) - Player id (the corresponding id after the duplicate players are merged), if it exists, it will be returned
  - **`deathday`** (`integer`) - Time of death（if it exists, it will be returned）
  - **`retire_time`** (`integer`) - Retirement time（if it exists, it will be returned）
  - **`updated_at`** (`integer`) - Update time

### 404
Resource does not exist

**Content-Type:** `application/json`

- **`code`** (`integer`) - status code
- **`msg`** (`string`) - Error message

