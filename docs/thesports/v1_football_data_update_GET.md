# Data update

**Endpoint**: `GET /v1/football/data/update`

**Plan / Category**: `BASIC INFO`

**Included in Your Plan**: `Yes ✅`

**Description**: Returns the data changed in the last 120 seconds, which can be updated on the corresponding interface, and needs to be synchronized regularly<br/><br/>Recommended request frequency：20 seconds/time

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
- **`results`** (`object`)
  - **`type id`** (`array of objects`) - Data type id, see Status Code->Data Update Type ID for details
    - **`match_id`** (`string`) - Match id（single match lineup、match incident gif field exists）
    - **`season_id`** (`string`) - Season id（bracket、season standing、season team statistics、season player statistics、season top scorer field exists）
    - **`pub_time`** (`integer`) - Ranking release time（fifa men、fifa women field exists）
    - **`team_id`** (`string`) - Team id（team historical lineup field exists）
    - **`update_time`** (`integer`) - update time

### 404
Resource does not exist

**Content-Type:** `application/json`

- **`code`** (`integer`) - status code
- **`msg`** (`string`) - Error message

