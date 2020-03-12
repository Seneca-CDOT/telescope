## Elasticsearch

Telescope uses the [Elasticsearch](https://www.elastic.co/what-is/elasticsearch) search engine for full-text indexing.
We use the [@elastic/elasticsearch](https://www.npmjs.com/package/@elastic/elasticsearch)
JavaScript module to interact with Elasticsearch in our code. In our tests, we use
[Jest Manual Mocks](https://jestjs.io/docs/en/manual-mocks) to provide mocks
for Elasticsearch.

For information about installing Redis, see [our environment setup guide](environment-setup.md).

## Elasticsearch Tips

- Interact with Elasticsearch outside of Telescope using one of the [available clients](https://www.elastic.co/guide/en/elasticsearch/client/index.html).
- You can also interact with Elasticsearch's exposed `REST API` using a browser or [cURL](https://curl.haxx.se/).
- If you want to see the state of the cluster (`cURL`):

```sh
 curl -X GET 'localhost:9200/\_cluster/health?pretty'
```

- For listing all the indexes (`Browser`):

```sh
http://localhost:9200/_cat/indices?v
```

- You can query Elasticsearch using URL parameters (`Browser`):

```sh
http://localhost:9200/posts/_search?q=text:open%20source
```

- For more complex queries, you can use JSON (`cURL`):

```sh
curl -XGET --header 'Content-Type: application/json' http://localhost:9200/posts/_search -d '{
     "query" : {
       "match" : { "text":{ "query": "open source", "operator": "and", "fuzziness": "auto" }}
   }
}'
```

- If you need to delete an index (using `posts` in this `cURL` example):

```sh
curl -X DELETE 'http://localhost:9200/posts'
```

- You can find a list of all available parameters for querying Elasticsearch [here](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-search.html#search-search-api-query-params).
