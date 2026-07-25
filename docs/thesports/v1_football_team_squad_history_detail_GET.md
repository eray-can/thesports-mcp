# Team lineup (history)

**Endpoint**: `GET /v1/football/team/squad/history/detail`

**Plan / Category**: `ADVANCED DATA`

**Included in Your Plan**: `Yes ✅`

**Description**: Return queried team historical player lineup data<br/><br/>recommended request frequency：60 times/min

## Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| user | query | True | string | Username，please contact business |
| secret | query | True | string | Key，please contact business |
| uuid | query | False | string | uuid query，return the queried uuid data |

## Responses
### 200
Successful

**Content-Type:** `application/json`

- **`code`** (`integer`)
- **`results`** (`array of objects`) - Team lineup list
  - **`season`** (`string`) - Season year
  - **`players`** (`array of objects`) - Player data
    - **`player_id`** (`string`) - Player id
    - **`position`** (`string`) - Player positions，F-forward，M-midfielder，D-guard，G-goalkeeper，others are unknown
    - **`shirt_number`** (`integer`) - Jersey number

### 404
Resource does not exist

**Content-Type:** `application/json`

- **`code`** (`integer`) - status code
- **`msg`** (`string`) - Error message

