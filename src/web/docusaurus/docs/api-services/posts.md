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

### Get a single post

Find a single post that is currently cached in redis. Response can be retrieved as html, json, or plain-text

```
GET /:id
```

#### Parameters

| Name | Type   | In    | Description                         |
| ---- | ------ | ----- | ----------------------------------- |
| id   | string | query | _Required_: The id of the blog post |

#### Code Samples

##### Shell

```bash
curl -X GET \
  http://localhost/v1/posts/64f3152a00
```

##### JavaScript

- With `fetch`

```js
fetch('http://localhost/v1/posts/64f3152a00');
```

#### Responses

##### Successful response

```
Status: 200 OK
```

```json
{
  "post": {
    "id": "64f3152a00",
    "url": "https://dev.api.telescope.cdot.systems/v1/posts/64f3152a00"
  }
}
```

##### Internal Server Error

```
Status: 500 Internal Server Error
```

This could be due to several reasons. For example,

- the service is down and not available
- one of it's dependent service is not available (redis)
