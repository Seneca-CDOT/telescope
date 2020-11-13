<img align="right" width="auto" height="auto" src="https://www.elastic.co/static-res/images/elastic-logo-200.png">

# Elasticsearch Node.js client mock utility

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](http://standardjs.com/)  ![build](https://github.com/elastic/elasticsearch-js-mock/workflows/build/badge.svg)

When testing your application you don't always need to have an Elasticsearch instance up and running, but you might still need to use the client for fetching some data. If you are facing this situation, this library is what you need.

### Features

- Simple and intuitive API
- Mocks only the http layer, leaving the rest of the client working as usual
- Maximum flexibility thanks to "strict" or "loose" mocks

## Install
```
npm install @elastic/elasticsearch-mock --save-dev
```

## Usage

```js
const { Client } = require('@elastic/elasticsearch')
const Mock = require('@elastic/elasticsearch-mock')

const mock = new Mock()
const client = new Client({
  node: 'http://localhost:9200',
  Connection: mock.getConnection()
})

mock.add({
  method: 'GET',
  path: '/'
}, () => {
  return { status: 'ok' }
})

client.info(console.log)
```

## API

#### `Constructor`

Before start using the library you need to create a new instance:
```js
const Mock = require('@elastic/elasticsearch-mock')
const mock = new Mock()
```

#### `add`

Adds a new mock for a given pattern and assigns it to a resolver function.

```js
// every GET request to the `/` path
// will return `{ status: 'ok' }`
mock.add({
  method: 'GET',
  path: '/'
}, () => {
  return { status: 'ok' }
})
```

You can also specify multiple methods and/or paths at the same time:
```js
// This mock will catch every search request against any index
mock.add({
  method: ['GET', 'POST'],
  path: ['/_search', '/:index/_search']
}, () => {
  return { status: 'ok' }
})
```

#### `get`

Returns the matching resolver function for the given pattern, it returns `null` if there is not a matching pattern.

```js
const fn = mock.get({
  method: 'GET',
  path: '/'
})
```

#### `clear`

Clears/removes mocks for specific route(s).

```js
mock.clear({
  method: ['GET'],
  path: ['/_search', '/:index/_search']
})
```

#### `clearAll`

Clears all mocks.

```js
mock.clearAll()
```

#### `getConnection`

Returns a custom `Connection` class that you **must** pass to the Elasticsearch client instance.

```js
const { Client } = require('@elastic/elasticsearch')
const Mock = require('@elastic/elasticsearch-mock')

const mock = new Mock()
const client = new Client({
  node: 'http://localhost:9200',
  Connection: mock.getConnection()
})
```

### Mock patterns

A pattern is an object that describes an http query to Elasticsearch, and it looks like this:
```ts
interface MockPattern {
  method: string
  path: string
  querystring?: Record<string, string>
  body?: Record<string, any>
}
```

The more field you specify, the more the mock will be strict, for example:
```js
mock.add({
  method: 'GET',
  path: '/',
  querystring: { pretty: 'true' }
}, () => {
  return { status: 'ok' }
})

client.info(console.log) // => 404 error
client.info({ pretty: true }, console.log) // => { status: 'ok' }
```

You can craft custom responses for different queries:

```js
mock.add({
  method: 'POST',
  path: '/indexName/_search'
  body: { query: { match_all: {} } }
}, () => {
  return {
    hits: {
      total: { value: 1, relation: 'eq' },
      hits: [{ _source: { baz: 'faz' } }]
    }
  }
})

mock.add({
  method: 'POST',
  path: '/indexName/_search',
  body: { query: { match: { foo: 'bar' } } }
}, () => {
  return {
    hits: {
      total: { value: 0, relation: 'eq' },
      hits: []
    }
  }
})
```

You can also specify dynamic urls:
```js
mock.add({
  method: 'GET',
  path: '/:index/_count'
}, () => {
  return { count: 42 }
})

client.count({ index: 'foo' }, console.log) // => { count: 42 }
client.count({ index: 'bar' }, console.log) // => { count: 42 }
```

Wildcards are supported as well.
```js
mock.add({
  method: 'HEAD',
  path: '*'
}, () => {
  return { status: 'ok' }
})

client.indices.exists({ index: 'foo' }, console.log) // => { status: 'ok' }
client.ping(console.log) // => { status: 'ok' }
```

### Dynamic responses

The resolver function takes a single parameter which represent the API call that has been made by the client.
You can use it to craft dynamic responses.

```js
mock.add({
  method: 'POST',
  path: '/indexName/_search',
}, params => {
  return { query: params.body.query }
})
```

### Errors

This utility uses the same error classes of the Elasticsearch client, if you want to return an error for a specific API call, you should use the `ResponseError` class:

```js
const { errors } = require('@elastic/elasticsearch')
const Mock = require('@elastic/elasticsearch-mock')

const mock = new Mock()
mock.add({
  method: 'GET',
  path: '/'
}, () => {
  return new errors.ResponseError({
    body: { errors: {}, status: 500 },
    statusCode: 500
  })
})
```

## License

This software is licensed under the [Apache 2 license](./LICENSE).
