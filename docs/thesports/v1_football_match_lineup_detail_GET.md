# Single match lineup

**Endpoint**: `GET /v1/football/match/lineup/detail`

**Plan / Category**: `BASIC DATA`

**Included in Your Plan**: `Yes ✅`

**Description**: Return the lineup data of a single match (judge whether to call this interface according to the "Is there a lineup" field in the "Schedule and Results Interface")，including player incidents<br/>Request times：120 times/min<br/>Request limit：Matches within 30 days before today<br/><br/>Coordinate description：<br/>Home team coordinate origin：Upper left；That is：the x-axis direction is right，the y-axis direction is down；<br/>Away team coordinate origin：Lower right；That is：the x-axis direction is left，the y-axis direction is up。<br/><br/>PS：Get the changed match id through the ‘data update’ interface

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
- **`results`** (`object`)
  - **`confirmed`** (`integer`) - Official lineup，1-yes，0-no
  - **`home_formation`** (`string`) - Home team formation
  - **`away_formation`** (`string`) - Away team formation
  - **`coach_id`** (`object`) - Coach
    - **`home`** (`string`) - Home team coach id
    - **`away`** (`string`) - Away team coach id
  - **`lineup`** (`object`) - Lineup data
    - **`home`** (`array of objects`) - Home team lineup data list
      - **`id`** (`string`) - Player id
      - **`first`** (`integer`) - Whether to start，1-Yes，0-No
      - **`captain`** (`integer`) - Whether the captain，1-Yes，0-No
      - **`name`** (`string`) - Player name
      - **`logo`** (`string`) - Player logo
      - **`shirt_number`** (`integer`) - Jersey number
      - **`position`** (`string`) - Player positions，F-forward，M-midfielder，D-guard，G-goalkeeper，others are unknown
      - **`x`** (`integer`) - x coordinate value，a total of 100
      - **`y`** (`integer`) - y coordinate value，a total of 100
      - **`rating`** (`string`) - Score value，full score 10
      - **`incidents`** (`array of objects`) - Player incident list，if there are competitions，it does not exist by default
        - **`type`** (`integer`) - Type，see status code -> technical statistics
        - **`time`** (`string`) - Incident occurrence time (including extra time)
        - **`minute`** (`integer`) - Minutes of the match at the time of the incident
        - **`addtime`** (`integer`) - Overtime (eg：two minutes of injury during halftime，time：“45+2”，minute：45，addtime：2)
        - **`belong`** (`integer`) - The incident occurred，0-neutral，1- home team，2- away team
        - **`home_score`** (`integer`) - Home team score
        - **`away_score`** (`integer`) - Away team score
        - **`player`** (`object`) - Incident related players，may not exist
          - **`id`** (`string`) - Player id
          - **`name`** (`string`) - Player name
        - **`assist1`** (`object`) - Assist player 1，related to the goal incident，may not exist
          - **`id`** (`string`) - Player id
          - **`name`** (`string`) - Player name
        - **`assist2`** (`object`) - Assist player 2，related to the goal incident，may not exist
          - **`id`** (`string`) - Player id
          - **`name`** (`string`) - Player name
        - **`in_player`** (`object`) - Replace the player id(Put on)，which is related to the substitution incident and may not exist
          - **`id`** (`string`) - Player id
          - **`name`** (`string`) - Player name
        - **`out_player`** (`object`) - Replace the player id(Replace)，which is related to the substitution incident and may not exist
          - **`id`** (`string`) - Player id
          - **`name`** (`string`) - Player name
    - **`away`** (`array of objects`) - Away team lineup data list
      - **`id`** (`string`) - Player id
      - **`first`** (`integer`) - Whether to start，1-Yes，0-No
      - **`captain`** (`integer`) - Whether the captain，1-Yes，0-No
      - **`name`** (`string`) - Player name
      - **`logo`** (`string`) - Player logo
      - **`shirt_number`** (`integer`) - Jersey number
      - **`position`** (`string`) - Player positions，F-forward，M-midfielder，D-guard，G-goalkeeper，others are unknown
      - **`x`** (`integer`) - x coordinate value，a total of 100
      - **`y`** (`integer`) - y coordinate value，a total of 100
      - **`rating`** (`string`) - Score value，full score 10
      - **`incidents`** (`array of objects`) - Player incident list，if there are competitions，it does not exist by default
        - **`type`** (`integer`) - Type，see status code -> technical statistics
        - **`time`** (`string`) - Incident occurrence time (including extra time)
        - **`minute`** (`integer`) - Minutes of the match at the time of the incident
        - **`addtime`** (`integer`) - Overtime (eg：two minutes of injury during halftime，time：“45+2”，minute：45，addtime：2)
        - **`belong`** (`integer`) - The incident occurred，0-neutral，1- home team，2- away team
        - **`home_score`** (`integer`) - Home team score
        - **`away_score`** (`integer`) - Away team score
        - **`player`** (`object`) - Incident related players，may not exist
          - **`id`** (`string`) - Player id
          - **`name`** (`string`) - Player name
        - **`assist1`** (`object`) - Assist player 1，related to the goal incident，may not exist
          - **`id`** (`string`) - Player id
          - **`name`** (`string`) - Player name
        - **`assist2`** (`object`) - Assist player 2，related to the goal incident，may not exist
          - **`id`** (`string`) - Player id
          - **`name`** (`string`) - Player name
        - **`in_player`** (`object`) - Replace the player id(Put on)，which is related to the substitution incident and may not exist
          - **`id`** (`string`) - Player id
          - **`name`** (`string`) - Player name
        - **`out_player`** (`object`) - Replace the player id(Replace)，which is related to the substitution incident and may not exist
          - **`id`** (`string`) - Player id
          - **`name`** (`string`) - Player name
  - **`injury`** (`object`) - Injury data
    - **`home`** (`array of objects`) - Home team injury data list
      - **`id`** (`string`) - Player id
      - **`name`** (`string`) - Player name
      - **`position`** (`string`) - Player positions，F-forward，M-midfielder，D-guard，G-goalkeeper，others are unknown
      - **`logo`** (`string`) - Player logo
      - **`type`** (`integer`) - Type，0-unknown，1-injured，2-suspended，3-Questionable
      - **`reason`** (`string`) - Cause of injury
      - **`start_time`** (`integer`) - Starting time
      - **`end_time`** (`integer`) - End Time
      - **`missed_matches`** (`integer`) - Affect the session
    - **`away`** (`array of objects`) - Away team injury data list
      - **`id`** (`string`) - Player id
      - **`name`** (`string`) - Player name
      - **`position`** (`string`) - Player positions，F-forward，M-midfielder，D-guard，G-goalkeeper，others are unknown
      - **`logo`** (`string`) - Player logo
      - **`type`** (`integer`) - Type，0-unknown，1-injured，2-suspended，3-Questionable
      - **`reason`** (`string`) - Cause of injury
      - **`start_time`** (`integer`) - Starting time
      - **`end_time`** (`integer`) - End Time
      - **`missed_matches`** (`integer`) - Affect the session

### 404
Resource does not exist

**Content-Type:** `application/json`

- **`code`** (`integer`) - status code
- **`msg`** (`string`) - Error message

