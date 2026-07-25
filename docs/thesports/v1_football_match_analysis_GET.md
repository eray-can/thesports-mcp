# H2H

**Endpoint**: `GET /v1/football/match/analysis`

**Plan / Category**: `BASIC DATA`

**Included in Your Plan**: `Yes ✅`

**Description**: Return to match analysis statistics (historical confrontation/recent results，future matches，goal distribution)<br/><br/>This interface is used to request data such as historical matchups of matches that have not started before the match. Most of them are historical data and change infrequently<br/>Request limit：Matches within 30 days before today<br/><br/>Request times：60 times/min

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
  - **`info`** (`array of objects`) - Match information field description<br/>example：["kp3glrw7hwqdyjv","kp3glrw7hwqdyjv",8,1516125600,0,["kp3glrw7hwqdyjv", "4", 1, 0, 0, 0, -1, 0, 0],["kp3glrw7hwqdyjv", "19", 1, 0, 0, 0, -1, 0, 0],["0.86,-0.5,1.04,0","3.8,3.6,2.05,0","0.9,2.75,1.0,0",""],["",0,21],["kp3glrw7hwqdyjv","2017"]]
  - **`history`** (`object`) - historical confrontation/recent results
    - **`vs`** (`array of arrays`) - Historical confrontation (the format is the same as the "info" field)，no data is empty
    - **`home`** (`array of arrays`) - Home team recent record (the format is the same as the "info" field)，no data is empty
    - **`away`** (`array of arrays`) - Away team recent record (the format is the same as the "info" field)，no data is empty
  - **`future`** (`object`) - future matches
    - **`home`** (`array of arrays`) - Home team future matches (the format is the same as the "info" field)，no data is empty
    - **`away`** (`array of arrays`) - Away team future matches (the format is the same as the "info" field)，no data is empty
  - **`goal_distribution`** (`object`) - goal distribution
    - **`home`** (`object`) - Home team goal distribution，no data is empty
      - **`all`** (`object`) - All matches
        - **`matches`** (`integer`) - Matches
        - **`scored`** (`array of arrays`) - Home team goal distribution
        - **`conceded`** (`array of arrays`) - Home team conceded distribution
      - **`home`** (`object`) - Home matches
        - **`matches`** (`integer`) - Matches
        - **`scored`** (`array of arrays`) - Home team home goal distribution
        - **`conceded`** (`array of arrays`) - Home team home conceded distribution
      - **`away`** (`object`) - Away matches
        - **`matches`** (`integer`) - Matches
        - **`scored`** (`array of arrays`) - Home team away goal distribution
        - **`conceded`** (`array of arrays`) - Home team away conceded distribution
    - **`away`** (`object`) - Away team goal distribution，no data is empty
      - **`all`** (`object`) - All matches
        - **`matches`** (`integer`) - Matches
        - **`scored`** (`array of arrays`) - Away team goal distribution
        - **`conceded`** (`array of arrays`) - Away team conceded distribution
      - **`home`** (`object`) - Home matches
        - **`matches`** (`integer`) - Matches
        - **`scored`** (`array of arrays`) - Away team home goal distribution
        - **`conceded`** (`array of arrays`) - Away team home conceded distribution
      - **`away`** (`object`) - Away matches
        - **`matches`** (`integer`) - Matches
        - **`scored`** (`array of arrays`) - Away team away goal distribution
        - **`conceded`** (`array of arrays`) - Away team away conceded distribution

### 404
Resource does not exist

**Content-Type:** `application/json`

- **`code`** (`integer`) - status code
- **`msg`** (`string`) - Error message

