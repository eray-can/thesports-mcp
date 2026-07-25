# FIFA Women's Ranking

**Endpoint**: `GET /v1/football/ranking/fifa/women`

**Plan / Category**: `ADVANCED DATA`

**Included in Your Plan**: `Yes ✅`

**Description**: Return FIFA national team women's ranking data，you can query historical ranking data according to the release time of pub_time<br/>Note：The pub_time ranking publication time is returned in the pub_times field of the interface<br/><br/>The data rarely changes，the recommended request frequency：1 day/time<br/>PS：Get the changed pub_time through the ‘data update’ interface

## Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| user | query | True | string | Username，please contact business |
| secret | query | True | string | Key，please contact business |
| pub_time | query | False | integer | Release time，the default is the latest issue (time stamp format) |

## Responses
### 200
Successful

**Content-Type:** `application/json`

- **`code`** (`integer`)
- **`results`** (`object`)
  - **`pub_times`** (`array of objects`) - Ranking release time list<br/>example：[1582128000, 1591804800]
  - **`pub_time`** (`integer`) - Release time of current query ranking data
  - **`items`** (`array of objects`) - Team list
    - **`team`** (`object`) - Team data
      - **`id`** (`string`) - Team id
      - **`name`** (`string`) - Team name
      - **`logo`** (`string`) - Team logo
      - **`country_logo`** (`string`) - National team logo
    - **`region_id`** (`integer`) - Regional id，1-UEFA，2-South American Football Confederation，3 Central and North America and Caribbean Football Confederation，4 African Football Confederation，5 Asian Football Confederation，6 Oceania Football Confederation
    - **`ranking`** (`integer`) - Rank
    - **`points`** (`integer`) - integral
    - **`previous_points`** (`integer`) - Last points
    - **`position_changed`** (`integer`) - Ranking changes

### 404
Resource does not exist

**Content-Type:** `application/json`

- **`code`** (`integer`) - status code
- **`msg`** (`string`) - Error message

