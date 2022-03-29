---
sidebar_position: 2
---

# Feed Discovery Service

## Overview

The feed discovery service, as its name states, discovers the feed URL from a blog URL.

## API endpoints

### Get feeds URL from a blog URL

Find any feed URLs accessible from a resource URL. The type of resources that can
have a feed may be:

- YouTube channels,
- Twitch channels,
- Blogs (e.g. dev.to, medium.com, wordpress.org),
- anything that can be listed in a feed, there are no limits!

However, be aware that the purpose of this service in the context of Telescope
is to find feeds for resources that Telescope can currently handle. Those include:

- YouTube channels,
- Twitch channels,
- Blogs.

To be able to use this service, you need to be authenticated. See more on
[Authentication and Authorization](./auth.md) for details.

```
POST /
```

#### Parameters

| Name    | Type   | In   | Description                      |
| ------- | ------ | ---- | -------------------------------- |
| blogUrl | string | body | _Required_. The URL of the blog. |

#### Code Samples

##### Shell

```bash
curl -X POST \
  -H "Authorization: Bearer $JWT_TOKEN_STRING" \
  http://localhost/v1/feed-discovery/ \
  -d '{ "blogUrl": "https://dev.to/jerryhue" }'
```

##### JavaScript

- With `fetch`

```js
fetch('http://localhost/v1/feed-discovery/', {
  method: 'post',
  header: {
    Authorization: `Bearer ${JWT_TOKEN}`,
    'Content-Type': 'application/json',
  }
  body: JSON.stringify({
    blogUrl: 'https://dev.to/jerryhue'
  }),
});
```

#### Responses

##### Successful response

```
Status: 200 OK
```

```json
{
  "feedUrls": ["https://dev.to/feed/jerryhue"]
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
