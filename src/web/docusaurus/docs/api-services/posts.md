---
sidebar_position: 3
---

# Posts Service

## Overview

The posts service is responsible for retrieving posts that are cached in redis.

## API endpoints

### Get posts

Find any posts that are currently cached in redis.

```
GET /
```

#### Parameters

| Name  | Type   | In   | Description                        |
| ----- | ------ | ---- | ---------------------------------- |
| posts | string | body | _Required_. The URL for all posts. |

#### Code Samples

##### Shell

```bash
curl -X GET \
  http://localhost/v1/posts/
```

##### JavaScript

- With `fetch`

```js
fetch('http://localhost/v1/posts/');
```

#### Responses

##### Successful response

```
Status: 200 OK
```

```json
{
  "posts": [
    { "id": "64f3152a00", "url": "https://dev.api.telescope.cdot.systems/v1/posts/64f3152a00" }
  ]
}
```

##### Bad Request

```
Status: 400 Bad Request
```

This could be due to several reasons. For example,

- the `blogUrl` provided is invalid (cannot be used as a proper URL).
- the blog itself cannot be retrieved (the blog itself was deleted or the
  server is restricting access to the blog).
- the service could not find any feed URL associated to the blog.
