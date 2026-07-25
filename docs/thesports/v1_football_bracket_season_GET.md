# Bracket

**Endpoint**: `GET /v1/football/bracket/season`

**Plan / Category**: `ADVANCED DATA`

**Included in Your Plan**: `Yes ✅`

**Description**: Return to the matchup chart of the query season<br/>Request times：120 times/min<br/><br/>PS：Get the changed season id through the ‘data update’ interface

## Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| user | query | True | string | Username，please contact business |
| secret | query | True | string | Key，please contact business |
| uuid | query | True | string | Season id |

## Responses
### 200
Successful

**Content-Type:** `application/json`

- **`code`** (`integer`)
- **`results`** (`object`) - Data details
  - **`brackets`** (`array of objects`) - Bracket data
    - **`id`** (`string`) - Bracket id
    - **`competition_id`** (`string`) - Competition id
    - **`name`** (`string`) - Bracket Name
    - **`abbr`** (`string`) - Competition Name
    - **`start_time`** (`integer`) - Start time
    - **`end_time`** (`integer`) - End Time
  - **`groups`** (`array of objects`) - Group data
    - **`id`** (`string`) - Group id
    - **`bracket_id`** (`string`) - Bracket id
    - **`start_time`** (`integer`) - First match time
    - **`end_time`** (`integer`) - Last match time
    - **`type_id`** (`integer`) - Type, 1-winner's zone, 2-3rd place, 0-unknown
    - **`number`** (`integer`) - Group order
  - **`rounds`** (`array of objects`) - Round data
    - **`id`** (`string`) - Round id
    - **`bracket_id`** (`string`) - Bracket id
    - **`group_id`** (`string`) - Group id
    - **`name`** (`string`) - Name
    - **`abbr`** (`string`) - Abbreviation
    - **`start_time`** (`integer`) - First match time
    - **`end_time`** (`integer`) - Last match time
    - **`number`** (`integer`) - Round order
  - **`match_ups`** (`array of objects`) - Match data
    - **`id`** (`string`) - Match bracket id
    - **`round_id`** (`string`) - Round id
    - **`number`** (`integer`) - Sorting (upper half area first, lower half area behind)
    - **`type_id`** (`integer`) - Rule description (others are unknown)：<br/>1 - Single match<br/>2 - Single match, replay if draw<br/>3 - Single match, (optional replay, add winner manually<br/>4 - Single match, add winner manually<br/>5 - Two matches, away goal rule<br/>6 - Two matches, add winner manually<br/>7 - Manually add winner<br/>11 - Two matches
    - **`state_id`** (`integer`) - State description (others are unknown)：<br/>1 - Not started<br/>2 - empty<br/>6 - on-going<br/>7 - home won<br/>8 - away won<br/>9 - cancelled<br/>10 - bye<br/>11-Waiting for the draw
    - **`home_team_id`** (`string`) - Home team id
    - **`away_team_id`** (`string`) - Away team id
    - **`winner_team_id`** (`string`) - Victory team id
    - **`home_score`** (`integer`) - Home team score
    - **`away_score`** (`integer`) - Away team score
    - **`parent_ids`** (`array of objects`) - Next ID(Not empty)<br/>example：["l7oqdehnn56zr51"]
    - **`children_ids`** (`array of objects`) - Upper ID(Not empty)<br/>example：["1l4rjnh66w1em7v", "k82rekhvv790rep"]
    - **`match_ids`** (`array of objects`) - Associated match id<br/>example：["y0or5jho9k87qwz", "1l4rjnhln0nzm7v"]
    - **`note`** (`string`) - Remarks

### 404
Resource does not exist

**Content-Type:** `application/json`

- **`code`** (`integer`) - status code
- **`msg`** (`string`) - Error message

