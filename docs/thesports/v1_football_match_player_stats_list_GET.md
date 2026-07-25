# Match player statistics

**Endpoint**: `GET /v1/football/match/player_stats/list`

**Plan / Category**: `BASIC DATA`

**Included in Your Plan**: `Yes ✅`

**Description**: Returns the player statistics of the match where the player statistics have changed in the last 120 seconds(full update)<br/><br/>Suggested request frequency：1min/time

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
- **`results`** (`array of objects`) - Match list
  - **`id`** (`string`) - Match id
  - **`player_stats`** (`array of objects`) - Player statistics list
    - **`player_id`** (`string`) - Player id
    - **`team_id`** (`string`) - Team id
    - **`first`** (`integer`) - Whether to start，1-Yes，0-No
    - **`goals`** (`integer`) - Goal
    - **`penalty`** (`integer`) - Penalty kick
    - **`assists`** (`integer`) - Assist
    - **`minutes_played`** (`integer`) - Playing time (minutes)
    - **`red_cards`** (`integer`) - Red card
    - **`yellow_cards`** (`integer`) - Yellow card
    - **`shots`** (`integer`) - Shot
    - **`shots_on_target`** (`integer`) - Shoot right
    - **`dribble`** (`integer`) - Dribble
    - **`dribble_succ`** (`integer`) - Dribble success
    - **`clearances`** (`integer`) - Clearances
    - **`blocked_shots`** (`integer`) - Blocked shots
    - **`interceptions`** (`integer`) - Intercept
    - **`tackles`** (`integer`) - Tackles
    - **`tackles_succ`** (`integer`) - Tackles success
    - **`passes`** (`integer`) - Pass
    - **`passes_accuracy`** (`integer`) - Successful pass
    - **`key_passes`** (`integer`) - Key pass
    - **`crosses`** (`integer`) - Cross
    - **`crosses_accuracy`** (`integer`) - Successful cross
    - **`long_balls`** (`integer`) - Long pass
    - **`long_balls_accuracy`** (`integer`) - Successful long pass
    - **`duels`** (`integer`) - 1 to 1 fight
    - **`duels_won`** (`integer`) - 1 to 1 fight successfully
    - **`dispossessed`** (`integer`) - The pass is broken
    - **`fouls`** (`integer`) - foul
    - **`was_fouled`** (`integer`) - Was fouled
    - **`offsides`** (`integer`) - Offside
    - **`yellow2red_cards`** (`integer`) - Card upgrade confirmed
    - **`saves`** (`integer`) - Save
    - **`punches`** (`integer`) - Punches
    - **`runs_out`** (`integer`) - Goalkeeper strikes
    - **`runs_out_succ`** (`integer`) - Goalkeeper strikes successfully
    - **`good_high_claim`** (`integer`) - High altitude attack
    - **`rating`** (`float`) - Score out of 10
    - **`freekicks`** (`integer`) - Free kick
    - **`freekick_goals`** (`integer`) - Free kick goal
    - **`hit_woodwork`** (`integer`) - Hit woodwork
    - **`fastbreaks`** (`integer`) - Fast break
    - **`fastbreak_shots`** (`integer`) - Fast break shot
    - **`fastbreak_goals`** (`integer`) - Fast break goal
    - **`poss_losts`** (`integer`) - Lost the ball
    - **`aerial_won`** (`integer`) - Win the aerial duel
    - **`aerial_lost`** (`integer`) - Lose the aerial duel
    - **`ground_won`** (`integer`) - Win the ground duel (new)
    - **`ground_lost`** (`integer`) - Lose the ground duel (new)
    - **`duel_won`** (`integer`) - Win the ground duel (old)
    - **`duel_lost`** (`integer`) - Lose the ground duel (old)
    - **`big_chance_missed`** (`integer`) - Missed scoring opportunities
    - **`big_chance_created`** (`integer`) - Creating scoring opportunities
    - **`shots_ibox`** (`integer`) - Shot inside the box
    - **`shots_obox`** (`integer`) - Shot from outside the box

### 404
Resource does not exist

**Content-Type:** `application/json`

- **`code`** (`integer`) - status code
- **`msg`** (`string`) - Error message

