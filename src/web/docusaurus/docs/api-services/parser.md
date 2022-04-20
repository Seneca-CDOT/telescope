---
sidebar_position: 6
---

# Parser Service:

The current system uses the parser service in order to run the feed parser and feed queue, see [`./data/feed.js`](https://github.com/Seneca-CDOT/telescope/blob/master/src/api/parser/src/data/feed.js). The blog feeds are stored into a supabase database. They are fetched and loaded into a [queue](https://github.com/Seneca-CDOT/telescope/blob/master/src/api/parser/src/lib/queue.js) to create [Feed](https://github.com/Seneca-CDOT/telescope/blob/master/src/api/parser/src/data/feed.js) and [Post](https://github.com/Seneca-CDOT/telescope/blob/master/src/api/parser/src/data/post.js) objects so it can be stored into `Redis` (cache) and `Elasticsearch` (indexing) database. Afterwards, various microservices can use them to request data.

Telescope's data model is built on Feeds and Posts. A feed represents an RSS/Atom feed, and includes metadata about a particular blog (e.g., URL, author, etc) as well as URLs to individual Posts. A Post includes metadata about a particular blog post (e.g., URL, date created, date updated, etc).

To run the service, use command `pnpm services:start parser` or `pnpm services:start` or `pnpm dev` in `src/api/parser`. When it runs, the logs show information about feeds being parsed in real-time, which continues forever.

The parser get all the feed urls and authors from Supabase database, parses them, creates `Feed` objects and puts them into a queue managed by [Bull](https://github.com/OptimalBits/bull) and backed by `Redis`. These are then processed in [`src/api/parser/feed/processor.js`](https://github.com/Seneca-CDOT/telescope/blob/master/src/api/parser/src/feed/processor.js) in order to download the individual Posts, which are also cached in Redis.
