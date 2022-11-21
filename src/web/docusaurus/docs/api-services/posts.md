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

### Get posts with posts basic information(author, title, and publishDate)

Find any posts that are currently cached in redis with their basic information.

```
GET /
```

#### Code Samples

##### Shell

```bash
curl -X GET \
  http://localhost/v1/posts?expand=1
```

##### JavaScript

- With `fetch`

```js
fetch('http://localhost/v1/posts?expand=1');
```

#### Responses

##### Successful response

```
Status: 200 OK
```

```json
{
  "posts": [
    {
      "id": "8a41a9109e",
      "url": "http://localhost/v1/posts/8a41a9109e",
      "author": "Ray Gervais",
      "title": "What Does \"Cloud Native\" Even Mean?",
      "publishDate": "2022-11-04T00:00:00.000Z"
    }
  ]
}
```

### Get a single post

Find a single post that is currently cached in redis. Response can be retrieved as html, json, or plain-text. Specify as part of the headers what you want the response to look like.

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
  "id": "28867e65b0",
  "title": "First time being a Sheriff",
  "html": "<h1>\n  \n  \n  What is a Sheriff in Telescope:\n</h1>…d only touch that issue just a little bit. </p>\n\n",
  "published": "2022-04-12T08:43:19.000Z",
  "updated": "2022-04-12T08:43:19.000Z",
  "feed": {
    "id": "b0ea6fdde8",
    "author": "Hung Nguyen",
    "url": "https://dev.to/feed/nguyenhung15913",
    "user": "",
    "link": "https://dev.to/nguyenhung15913"
  },
  "guid": "https://dev.to/nguyenhung15913/first-time-being-a-sheriff-3cn3",
  "id": "28867e65b0",
  "published": "2022-04-12T08:43:19.000Z",
  "title": "First time being a Sheriff",
  "type": "blogpost",
  "updated": "2022-04-12T08:43:19.000Z",
  "url": "https://dev.to/nguyenhung15913/first-time-being-a-sheriff-3cn3"
}
```

##### Internal Server Error

```
Status: 500 Internal Server Error
```

This could be due to several reasons. For example,

- the service is down and not available
- one of it's dependent service is not available (redis)
