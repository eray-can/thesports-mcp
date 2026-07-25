# Season standing(newest season)

**Endpoint**: `GET /v1/football/season/recent/table/detail`

**Plan / Category**: `BASIC DATA`

**Included in Your Plan**: `Yes ✅`

**Description**: Return to season rankings data details(Restriction: newest season)<br/>Request times：120 times/min<br/><br/>PS：Get the changed season id through the ‘data update’ interface

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
- **`results`** (`object`)
  - **`promotions`** (`array of objects`) - Relegation competition list
    - **`id`** (`string`) - Up/down id
    - **`name`** (`string`) - Up/down competition name
    - **`color`** (`string`) - Color value
  - **`tables`** (`array of objects`) - Standings list
    - **`id`** (`string`) - Standing table id
    - **`conference`** (`string`) - Zoning information (only available in very few competitions，such as the US League)
    - **`group`** (`integer`) - Not 0 means the group of the group match, 1-A, 2-B and so on
    - **`stage_id`** (`string`) - Stage id
    - **`rows`** (`array of objects`) - Team points list
      - **`team_id`** (`string`) - Team id
      - **`promotion_id`** (`string`) - Up/down id
      - **`points`** (`integer`) - integral
      - **`position`** (`integer`) - Rank
      - **`deduct_points`** (`integer`) - Deduct points
      - **`note`** (`string`) - Description
      - **`total`** (`integer`) - Matches
      - **`won`** (`integer`) - Number of wins
      - **`draw`** (`integer`) - Number of draws
      - **`loss`** (`integer`) - Number of loses
      - **`goals`** (`integer`) - Goal
      - **`goals_against`** (`integer`) - Conceded
      - **`goal_diff`** (`integer`) - Goal difference
      - **`home_points`** (`integer`) - Home score
      - **`home_position`** (`integer`) - Home ranking
      - **`home_total`** (`integer`) - Home matches
      - **`home_won`** (`integer`) - Number of wins at home
      - **`home_draw`** (`integer`) - Number of draws at home
      - **`home_loss`** (`integer`) - Number of loses at home
      - **`home_goals`** (`integer`) - Home goal
      - **`home_goals_against`** (`integer`) - Conceded at home
      - **`home_goal_diff`** (`integer`) - Home goal difference
      - **`away_points`** (`integer`) - Away score
      - **`away_position`** (`integer`) - Away score
      - **`away_total`** (`integer`) - Away ranking
      - **`away_won`** (`integer`) - Number of wins at away
      - **`away_draw`** (`integer`) - Number of draws at away
      - **`away_loss`** (`integer`) - Number of loses at away
      - **`away_goals`** (`integer`) - Away goal
      - **`away_goals_against`** (`integer`) - Conceded at away
      - **`away_goal_diff`** (`integer`) - Away goal difference
      - **`updated_at`** (`integer`) - Update time

### 404
Resource does not exist

**Content-Type:** `application/json`

- **`code`** (`integer`) - status code
- **`msg`** (`string`) - Error message

