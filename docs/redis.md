## Redis

Telescope uses the [Redis](https://redis.io/) database and cache server to store
all project data. We use the [ioredis](https://www.npmjs.com/package/ioredis)
JavaScript module to interact with Redis in our code. In our tests, we use
[ioredis-mock](https://www.npmjs.com/package/ioredis-mock) to provide mocks
for Redis.

> NOTE: if you need to use an in-memory, mock version of Redis vs. a real
> database, use the environment variable `MOCK_REDIS=1`. Our tests use this.

For information about installing Redis, see [our environment setup guide](environment-setup.md).

### Elasticsearch

Telescope uses [Elasticsearch](elasticsearch.md) as a search engine for full-text indexing. It is used to search posts indexed by Telescope by author or post keyword.

## Redis Tips

1. Use the `redis-cli` command to run commands. Link to the docs for it are at https://redis.io/topics/rediscli.
1. Redis stores key/value pairs, where a key is a string, and a value is one of a number of data types. We mainly use [hashes](https://redis.io/topics/data-types#hashes) (like an Object in JavaScript) and [sets](https://redis.io/topics/data-types#sets), and [sorted sets](https://redis.io/topics/data-types#sorted-sets) (like an array with no duplicates, or a Set in JavaScript).
1. If you need to see a list of all keys in the database, from the CLI use `keys *`
1. Our Telescope keys are namespaced, and use the `t:` prefix. Any keys that start with `bull:` are part of the [Bull feed queue](https://github.com/OptimalBits/bull) (i.e., our jobs for processing feeds into posts).
1. If you need to see what's in the set of all feeds, use `smembers t:feeds` . The values returned are `id`s, which you can use with `hgetall` (see below). A set is a list with no duplicates.
1. If you need to see what's in the sorted set of all posts, use `zrange t:posts 0 -1`, where `0` is the starting position and `-1` the end (e.g., get everything). An ordered set is a set which orders its members by some value (we use the post's publish date, so that they are in chronological order).
1. If you need to see just the post keys, use `keys t:post:*`. Each post key ends with an `id`, for example: `t:post:a501d01b94` is the key for a post with an `id` of `a501d01b94`.
1. If you need to see just the feed keys, use `keys t:feed:*`. Each feed key ends with an `id`, for example `t:feed:f73dcb2226`. As with posts, `t:feed:f73dcb2226` is the key for a feed with an `id` of `f73dcb2226`
1. If you need to see what's stored in a post or feed key, (they are Redis Hashes) use `hgetall t:post:a501d01b94` where `12345` is the `id` of a post, `hgetall t:feed:f73dcb2226` where `12345` is the `id` of a feed.
1. If you need to delete all data in the database (e.g., when a change affects our data layout or keys), use `flushall`. This is generally safe to run, since `npm start` will regenerate all the data.
