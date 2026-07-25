# World Clubs Ranking

**Endpoint**: `GET /v1/football/ranking/club`

**Plan / Category**: `ADVANCED DATA`

**Included in Your Plan**: `Yes ✅`

**Description**: Return club ranking data<br/>The data rarely changes，the recommended request frequency：1 day/time<br/><br/>PS：Get changes through the 'data update' interface

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
- **`results`** (`array of objects`) - Team list
  - **`team`** (`object`) - Team data
    - **`id`** (`string`) - Team id
    - **`name`** (`string`) - Team name
    - **`logo`** (`string`) - Team logo
  - **`ranking`** (`integer`) - Rank
  - **`points`** (`integer`) - integral
  - **`previous_points`** (`integer`) - Last points
  - **`position_changed`** (`integer`) - Ranking changes

### 404
Resource does not exist

**Content-Type:** `application/json`

- **`code`** (`integer`) - status code
- **`msg`** (`string`) - Error message

