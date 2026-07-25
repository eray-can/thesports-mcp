# Odds update

**Endpoint**: `GET /v1/football/odds/update`

**Plan / Category**: `ODDS DATA`

**Included in Your Plan**: `No ❌`

**Description**: Returns the full number of matches with updates and fixes to the odds in the last 60 seconds, as well as the associated odds companies and update time (in reverse order)<br/>Suggested request frequency：3 seconds/time<br/><br/>Note：<br/>According to the match id and odds company obtained through this interface, obtain and repair the corresponding company odds data through the 'single match odds' interface

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
- **`results`** (`array of objects`)
  - **`id`** (`string`) - Match id
  - **`company_id`** (`integer`) - Company id，see status code -> Odds Company ID for details
  - **`update_time`** (`integer`) - Update repair time

### 404
Resource does not exist

**Content-Type:** `application/json`

- **`code`** (`integer`) - status code
- **`msg`** (`string`) - Error message

