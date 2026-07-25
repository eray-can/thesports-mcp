# Real-time data

**Endpoint**: `GET /v1/football/match/detail_live`

**Plan / Category**: `BASIC DATA`

**Included in Your Plan**: `Yes ✅`

**Description**: Return the score，match incidents，and technical statistics data in the last 120 minutes(full update)<br/>ps：The match data beyond 120 minutes is updated and will be returned synchronously<br/>Suggest the request frequency：2 seconds/time<br/><br/>The formula for obtaining the minutes of the match<br/>First half：match minutes = (current timestamp-first half kick-off timestamp) / 60 + 1<br/>Second half：match minutes = (current timestamp-second half kick-off timestamp) / 60 + 45 + 1<br/>Overtime：match minutes = (current timestamp-overtime kick-off timestamp) / 60 + 90 + 1<br/>Note：If the overtime kick-off timestamp returns 0, it means we don't have this data for this competition so that the time can not be calculated.<br /><br/>Stats：match event field description<br/>Includes：corner，yellow card，red card，penalty，shots on target，shots off target，blocked shots，attacks，dangerous attack，ball possession<br /><br/>Incidents：match event field description<br/>Includes：yellow card，card upgrade confirmed，red card，goal (assist)，substitution，penalty，penalty missed，own goal，VAR，midfield，injury time，end，overtime is end，penalty kick ended

## Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| user | query | True | string | Username，please contact business |
| secret | query | True | string | Key，please contact business |

## Responses
### 200
Successful

**Content-Type:** `application/json`

- **`code`** (`integer`)
- **`results`** (`array of objects`) - Real-time data list
  - **`id`** (`string`) - Match id
  - **`score`** (`array of objects`) - Score field description<br/>example：["1l4rjnh22p2wm7v", 8, [1, 0, 0, 0, -1, 0, 0], [1, 0, 0, 0, -1, 0, 0], 0, ""]
  - **`stats`** (`array of objects`) - Match statistics
    - **`type`** (`integer`) - Type，see status code -> technical statistics
    - **`home`** (`integer`) - Home team value
    - **`away`** (`integer`) - Away team value
  - **`incidents`** (`array of objects`) - Match incidents
    - **`type`** (`integer`) - Type，see status code -> technical statistics
    - **`position`** (`integer`) - The incident occurred，0-neutral，1- home team，2- away team
    - **`time`** (`integer`) - Time (minutes)
    - **`second`** (`integer`) - Time (seconds)
    - **`add_time`** (`integer`) - Add time (minutes), which is related to injury time or stoppage time and may not exist
    - **`player_id`** (`string`) - Player id related to the incident，may not exist
    - **`player_name`** (`string`) - Player name related to the incident，may not exist
    - **`assist1_id`** (`string`) - Assist player 1 id，related to the goal incident，may not exist
    - **`assist1_name`** (`string`) - Assist player 1 name，related to the goal incident，may not exist
    - **`assist2_id`** (`string`) - Assist player 2 id，related to the goal incident，may not exist
    - **`assist2_name`** (`string`) - Assist player 2 name，related to the goal incident，may not exist
    - **`home_score`** (`integer`) - Home team score，related to the goal incident，may not exist
    - **`away_score`** (`integer`) - Away team score，related to the goal incident，may not exist
    - **`in_player_id`** (`string`) - Replace the player id(Put on)，which is related to the substitution incident and may not exist
    - **`in_player_name`** (`string`) - Replace the player name(Put on)，which is related to the substitution incident and may not exist
    - **`out_player_id`** (`string`) - Replace the player id(Replace)，which is related to the substitution incident and may not exist
    - **`out_player_name`** (`string`) - Replace the player name(Replace)，which is related to the substitution incident and may not exist
    - **`var_reason`** (`integer`) - VAR reason，related to var incident<br/>1-Goal awarded<br/>2-Goal not awarded<br/>3-Penalty awarded<br/>4-Penalty not awarded<br/>5 -Red card given<br/>6-Card upgrade<br/>7-Mistaken identity<br/>8-Corner awarded<br/>9-Corner not awarded<br/>0-Other
    - **`var_result`** (`integer`) - VAR result，related to var incident<br/>1-Goal confirmed<br/>2-Goal cancelled<br/>3-Penalty confirmed<br/>4-Penalty cancelled<br/>5-Red card confirmed<br/>6-Red card cancelled<br/>7-Card upgrade confirmed<br/>8-Card upgrade cancelled<br/>9-Original decision<br/>10-Original decision changed<br/>11-Corner confirmed<br/>12-Corner cancelled<br/>0-Unknown
    - **`reason_type`** (`integer`) - The reason for the red and yellow cards and substitution events, please refer to the status code -> event reason (the red and yellow cards and substitution events related field)
  - **`tlive`** (`array of objects`) - Match text
    - **`time`** (`string`) - Time (minutes)
    - **`data`** (`string`) - Contents
    - **`position`** (`integer`) - The incident occurred，0-neutral，1- home team，2- away team

### 404
Resource does not exist

**Content-Type:** `application/json`

- **`code`** (`integer`) - status code
- **`msg`** (`string`) - Error message

