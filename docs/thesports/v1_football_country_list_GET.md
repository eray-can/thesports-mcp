# Country/Region

**Endpoint**: `GET /v1/football/country/list`

**Plan / Category**: `BASIC INFO`

**Included in Your Plan**: `Yes ✅`

**Description**: Return to all countries/regions<br/><br/>The data rarely changes，the recommended request frequency：1 day/time

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
- **`results`** (`array of objects`) - Country/Region list
  - **`id`** (`string`) - Country/Region id
  - **`category_id`** (`string`) - Category id
  - **`name`** (`string`) - Country/Region Name
  - **`logo`** (`string`) - Country/Region logo
  - **`updated_at`** (`integer`) - Update time

### 404
Resource does not exist

**Content-Type:** `application/json`

- **`code`** (`integer`) - status code
- **`msg`** (`string`) - Error message

