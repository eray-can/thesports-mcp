# Delete

**Endpoint**: `GET /v1/football/deleted`

**Plan / Category**: `BASIC DATA`

**Included in Your Plan**: `Yes ✅`

**Description**: Return data id (match，team，player，competition，season，stage) deleted within 24 hours，need to be synchronized regularly<br/><br/>Suggested request frequency：1~5min/time

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
  - **`match`** (`array of objects`) - Match id（No data, the field does not exist）<br/>example：["1l4rjnh22p2wm7v"]
  - **`team`** (`array of objects`) - Team id（No data, the field does not exist）<br/>example：["p3glrw7he0gqdyj"]
  - **`player`** (`array of objects`) - Player id（No data, the field does not exist）<br/>example：["p3glrw7he0gqdyj"]
  - **`competition`** (`array of objects`) - Competition id（No data, the field does not exist）<br/>example：["kp3glrw7hwqdyjv"]
  - **`season`** (`array of objects`) - Season id（No data, the field does not exist）<br/>example：["kp3glrw7hwqdyjv"]
  - **`stage`** (`array of objects`) - Stage id（No data, the field does not exist）<br/>example：["kp3glrw7hwqdyjv"]

### 404
Resource does not exist

**Content-Type:** `application/json`

- **`code`** (`integer`) - status code
- **`msg`** (`string`) - Error message

