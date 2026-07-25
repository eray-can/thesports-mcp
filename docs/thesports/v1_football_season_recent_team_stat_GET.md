# Season team statistics(newest season)

**Endpoint**: `GET /v1/football/season/recent/team/stat`

**Plan / Category**: `ADVANCED DATA`

**Included in Your Plan**: `Yes ✅`

**Description**: Return to the season team statistics details(Restriction: newest season)<br/>Request times：120 times/min<br/><br/>PS：Get the changed season id through the ‘data update’ interface

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
- **`results`** (`array of objects`) - Team list
  - **`team`** (`object`) - Team data
    - **`id`** (`string`) - Team id
    - **`name`** (`string`) - Team name
    - **`logo`** (`string`) - Team logo
  - **`matches`** (`integer`) - Matches
  - **`goals`** (`integer`) - Goal
  - **`penalty`** (`integer`) - Penalty kick
  - **`assists`** (`integer`) - Assist
  - **`red_cards`** (`integer`) - Red card
  - **`yellow_cards`** (`integer`) - Yellow card
  - **`shots`** (`integer`) - Shot
  - **`shots_on_target`** (`integer`) - Shoot right
  - **`dribble`** (`integer`) - Dribble
  - **`dribble_succ`** (`integer`) - Dribble success
  - **`clearances`** (`integer`) - Clearances
  - **`blocked_shots`** (`integer`) - Blocked shots
  - **`tackles`** (`integer`) - Tackles
  - **`passes`** (`integer`) - Pass
  - **`passes_accuracy`** (`integer`) - Successful pass
  - **`key_passes`** (`integer`) - Key pass
  - **`crosses`** (`integer`) - Cross
  - **`crosses_accuracy`** (`integer`) - Successful cross
  - **`long_balls`** (`integer`) - Long pass
  - **`long_balls_accuracy`** (`integer`) - Successful long pass
  - **`duels`** (`integer`) - 1 to 1 fight
  - **`duels_won`** (`integer`) - 1 to 1 fight successfully
  - **`fouls`** (`integer`) - foul
  - **`was_fouled`** (`integer`) - Was fouled
  - **`goals_against`** (`integer`) - Lost the ball
  - **`interceptions`** (`integer`) - Intercept
  - **`offsides`** (`integer`) - Offside
  - **`yellow2red_cards`** (`integer`) - Card upgrade confirmed
  - **`corner_kicks`** (`integer`) - Corner
  - **`ball_possession`** (`integer`) - Ball possession
  - **`freekicks`** (`integer`) - Free kick
  - **`freekick_goals`** (`integer`) - Free kick goal
  - **`hit_woodwork`** (`integer`) - Hit woodwork
  - **`fastbreaks`** (`integer`) - Fast break
  - **`fastbreak_shots`** (`integer`) - Fast break shot
  - **`fastbreak_goals`** (`integer`) - Fast break goal
  - **`poss_losts`** (`integer`) - Lost the ball
  - **`saves`** (`integer`) - Save
  - **`penalty_conceded`** (`integer`) - Penalty conceded
  - **`big_chance_created`** (`integer`) - Creating scoring opportunities
  - **`big_chance_missed`** (`integer`) - Missed scoring opportunities
  - **`aerial_won`** (`integer`) - Win the aerial duel
  - **`aerial_lost`** (`integer`) - Lose the aerial duel
  - **`ground_won`** (`integer`) - Win the ground duel (new)
  - **`ground_lost`** (`integer`) - Lose the ground duel (new)
  - **`shots_ibox`** (`integer`) - Shot inside the box
  - **`shots_obox`** (`integer`) - Shot from outside the box
  - **`updated_at`** (`integer`) - Update time

### 404
Resource does not exist

**Content-Type:** `application/json`

- **`code`** (`integer`) - status code
- **`msg`** (`string`) - Error message

