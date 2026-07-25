# Historical compensation

**Endpoint**: `GET /v1/football/compensation/list`

**Plan / Category**: `BASIC DATA`

**Included in Your Plan**: `Yes ✅`

**Description**: This interface returns the statistics (historical confrontation，recent record，and historical same compensation) for the match not started within 30 days，and obtain new or changed data according to the time<br/><br/>1、Full update for the first time，full data is obtained according to the parameter page (Page increases by 1, loop to get the interface, total is 0, and the loop ends)<br/>2、Subsequent incremental update，obtain change data according to the parameter time increment (recommended request frequency：1min/time)

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
- **`results`** (`array of objects`) - Match list
  - **`id`** (`string`) - Match id
  - **`history`** (`object`) - Historical confrontation
    - **`home`** (`object`) - Home team
      - **`won_count`** (`integer`) - Number of wins
      - **`drawn_count`** (`integer`) - Number of draws
      - **`lost_count`** (`integer`) - Number of loses
      - **`rate`** (`float`) - Win rate
    - **`away`** (`object`) - Away team
      - **`won_count`** (`integer`) - Number of wins
      - **`drawn_count`** (`integer`) - Number of draws
      - **`lost_count`** (`integer`) - Number of loses
      - **`rate`** (`float`) - Win rate
  - **`recent`** (`object`) - Recent record
    - **`home`** (`object`) - Home team
      - **`won_count`** (`integer`) - Number of wins
      - **`drawn_count`** (`integer`) - Number of draws
      - **`lost_count`** (`integer`) - Number of loses
      - **`rate`** (`float`) - Win rate
    - **`away`** (`object`) - Away team
      - **`won_count`** (`integer`) - Number of wins
      - **`drawn_count`** (`integer`) - Number of draws
      - **`lost_count`** (`integer`) - Number of loses
      - **`rate`** (`float`) - Win rate
  - **`similar`** (`object`) - Historical compensation
    - **`teams`** (`array of objects`) - Team list（Same compensation schedule involves teams）
      - **`id`** (`string`) - Team id
      - **`name`** (`string`) - Team name
    - **`competitions`** (`array of objects`) - Competition list（Same compensation schedule involves competitions）
      - **`id`** (`string`) - Competition id
      - **`name`** (`string`) - Competition name
    - **`companies`** (`array of objects`) - Odds company list（Same compensation schedule involves companies）
      - **`id`** (`integer`) - Company id
      - **`name`** (`string`) - Company name
    - **`europe`** (`array of objects`) - Same compensation schedule list (European compensation)
      - **`id`** (`integer`) - Odds company id
      - **`total`** (`integer`) - Total number of matches
      - **`won`** (`integer`) - Number of wins
      - **`draw`** (`integer`) - Number of draws
      - **`loss`** (`integer`) - Number of loses
      - **`odds`** (`array of objects`) - Euro Compensation，Initial Odds<br/>example：[2.1, 3.4, 3.1]
      - **`matches`** (`array of objects`) - Match list
        - **`id`** (`string`) - Match id
        - **`competition_id`** (`string`) - Competition id
        - **`home_team_id`** (`string`) - Home team id
        - **`away_team_id`** (`string`) - Away team id
        - **`match_time`** (`integer`) - Match time
        - **`home_score`** (`integer`) - Home team goal
        - **`away_score`** (`integer`) - Away team goal
        - **`begin_odds`** (`array of objects`) - Euro Compensation，Initial Odds<br/>example：[2.1, 3.4, 3.1]
        - **`immediate_odds`** (`array of objects`) - Euro compensation，The final real-time odds<br/>example：[2.1, 3.4, 3.1]
    - **`analysis`** (`array of objects`) - Probability of winning or losing
      - **`id`** (`integer`) - Odds company id
      - **`win_rate`** (`float`) - Win rate
      - **`draw_rate`** (`float`) - Draw rate
      - **`loss_rate`** (`float`) - Lose rate
  - **`updated_at`** (`integer`) - Update time

### 404
Resource does not exist

**Content-Type:** `application/json`

- **`code`** (`integer`) - status code
- **`msg`** (`string`) - Error message

