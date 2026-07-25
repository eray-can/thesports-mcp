# Schedule and Results - date query

**Endpoint**: `GET /v1/football/match/diary`

**Plan / Category**: `BASIC DATA`

**Included in Your Plan**: `Yes ✅`

**Description**: This interface returns the full schedule results data within 24 hours after the request timestamp (request limit：from 30 days before today to 30 days after)<br/>Note：Real-time data is obtained through the real-time data interface.<br/><br/>The recommended frequency of the day’s schedule：10 Minutes/time（Full update）<br/>Suggest request frequency for the schedule tomorrow and beyond：30 minutes/time（Full update）<br/>Note：Get the full data of the match interface, this interface does not need to be obtained again

## Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| user | query | True | string | Username，please contact business |
| secret | query | True | string | Key，please contact business |
| tsp | query | True | integer | Query date time stamp |

## Responses
### 200
Successful

**Content-Type:** `application/json`

- **`code`** (`integer`)
- **`query`** (`object`) - Inquiry
  - **`total`** (`integer`) - Return the total amount of data
  - **`type`** (`string`) - Query type，season query：season，date query：diary
- **`results`** (`array of objects`) - Match list
  - **`id`** (`string`) - Match id
  - **`season_id`** (`string`) - Season id
  - **`competition_id`** (`string`) - Competition id
  - **`home_team_id`** (`string`) - Home team id
  - **`away_team_id`** (`string`) - Away team id
  - **`status_id`** (`integer`) - Match status，please refer to Status Code -> Match Status
  - **`match_time`** (`integer`) - Match time
  - **`venue_id`** (`string`) - Venue id
  - **`referee_id`** (`string`) - Referee id
  - **`neutral`** (`integer`) - Is it neutral，1-Yes，0-No
  - **`note`** (`string`) - Remarks
  - **`home_scores`** (`array of objects`) - Home team score field description<br/>example：[1, 0, 0, 0, -1, 0, 0]
  - **`away_scores`** (`array of objects`) - Away team score field description<br/>example：[1, 0, 0, 0, -1, 0, 0]
  - **`home_position`** (`string`) - Home Team Ranking
  - **`away_position`** (`string`) - Away Team Ranking
  - **`coverage`** (`object`) - Animation，lineup, gif
    - **`mlive`** (`integer`) - Is there any animation，1-yes，0-no
    - **`lineup`** (`integer`) - Is there a lineup，1-yes，0-no
    - **`gif`** (`integer`) - Is there a gif，1-yes，0-no
  - **`round`** (`object`) - Stage
    - **`stage_id`** (`string`) - Stage id
    - **`group_num`** (`integer`) - Which group，1-A，2-B and so on
    - **`round_num`** (`integer`) - Which round
  - **`related_id`** (`string`) - The match id of the other round in the double round (No data field does not exist)
  - **`agg_score`** (`array of objects`) - The total score of two rounds in regular time (including extra time) (No data field does not exist)<br/>example：[3, 6]
  - **`environment`** (`object`) - Match environment，this segment is only available if there is data
    - **`weather`** (`integer`) - Weather id<br/>1-Partially cloudy<br/>2-Cloudy<br/>3-Partially cloudy/rain<br/>4-Snow<br/>5-Sunny<br/>6-Overcast Rain/partial thunderstorm<br/>7-overcast<br/>8-mist<br/>9-Overcast with rain<br/>10-cloudy with rain<br/>11-cloudy with rain/partial Thunderstorms<br/>12-Clouds/rains and thunderstorms locally<br/>13-Fog
    - **`pressure`** (`string`) - Air pressure
    - **`temperature`** (`string`) - temperature
    - **`wind`** (`string`) - Wind speed
    - **`humidity`** (`string`) - humidity
  - **`tbd`** (`integer`) - Is the match time to be determined? 1. Yes（if it exists, it will be returned）
  - **`has_ot`** (`integer`) - Is there overtime? 1. Yes（if it exists, it will be returned）
  - **`ended`** (`integer`) - End time（if it exists, it will be returned）
  - **`team_reverse`** (`integer`) - Are the host and away positions opposite? 1. Yes（if it exists, it will be returned eg：Opposite - official website A vs B, thesports B vs A）
  - **`loss`** (`integer`) - The match is directly ruled as lost? 1. Yes（if it exists, it will be returned）
  - **`updated_at`** (`integer`) - Update time
- **`results_extra`** (`object`) - Linked data
  - **`competition`** (`array of objects`) - Competition data
    - **`id`** (`string`) - Competition id
    - **`name`** (`string`) - Competition name
    - **`logo`** (`string`) - Competition logo
  - **`team`** (`array of objects`) - Team data
    - **`id`** (`string`) - Team id
    - **`name`** (`string`) - Team name
    - **`logo`** (`string`) - Team logo
    - **`country_logo`** (`string`) - National team logo（Exist for the national team）
  - **`referee`** (`array of objects`) - Referee data
    - **`id`** (`string`) - Referee id
    - **`name`** (`string`) - Referee name
    - **`logo`** (`string`) - Referee logo
  - **`venue`** (`array of objects`) - Venue data
    - **`id`** (`string`) - Venue id
    - **`name`** (`string`) - Venue name
  - **`season`** (`array of objects`) - Season data
    - **`id`** (`string`) - Season id
    - **`competition_id`** (`string`) - Competition id
    - **`year`** (`string`) - Season year
  - **`stage`** (`array of objects`) - Stage data
    - **`id`** (`string`) - Stage id
    - **`season_id`** (`string`) - Season id
    - **`name`** (`string`) - Stage name
    - **`mode`** (`integer`) - Match mode，1-points，2-elimination
    - **`group_count`** (`integer`) - Total groups
    - **`round_count`** (`integer`) - Total rounds
    - **`order`** (`integer`) - Sorting，the order of stages

### 404
Resource does not exist

**Content-Type:** `application/json`

- **`code`** (`integer`) - status code
- **`msg`** (`string`) - Error message

