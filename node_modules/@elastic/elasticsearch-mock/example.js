// Licensed to Elasticsearch B.V under one or more agreements.
// Elasticsearch B.V licenses this file to you under the Apache 2.0 License.
// See the LICENSE file in the project root for more information

'use strict'

const { Client } = require('@elastic/elasticsearch')
const Mock = require('./')

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

mock.add({
  method: 'HEAD',
  path: '*'
}, () => {
  return { ping: 'ok' }
})

mock.add({
  method: 'POST',
  path: '/test/_search'
}, () => {
  return {
    hits: {
      total: {
        value: 1,
        relation: 'eq'
      },
      hits: [
        { _source: { foo: 'bar' } }
      ]
    }
  }
})

mock.add({
  method: 'POST',
  path: '/test/_search',
  body: {
    query: {
      match: { foo: 'bar' }
    }
  }
}, () => {
  return {
    hits: {
      total: {
        value: 0,
        relation: 'eq'
      },
      hits: []
    }
  }
})

client.info(console.log)

client.ping(console.log)

client.search({
  index: 'test',
  body: {
    query: { match_all: {} }
  }
}, console.log)

client.search({
  index: 'test',
  body: {
    query: {
      match: { foo: 'bar' }
    }
  }
}, console.log)
