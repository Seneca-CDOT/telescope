// Licensed to Elasticsearch B.V under one or more agreements.
// Elasticsearch B.V licenses this file to you under the Apache 2.0 License.
// See the LICENSE file in the project root for more information

'use strict'

const { gunzip, createGunzip } = require('zlib')
const querystring = require('querystring')
const { Connection, errors } = require('@elastic/elasticsearch')
const Router = require('find-my-way')
const intoStream = require('into-stream')
const equal = require('fast-deep-equal')
const kRouter = Symbol('elasticsearch-mock-router')

/* istanbul ignore next */
const noop = () => {}
const {
  ConfigurationError,
  ConnectionError,
  ResponseError,
  RequestAbortedError,
  ElasticsearchClientError
} = errors

class Mocker {
  constructor () {
    this[kRouter] = Router({ ignoreTrailingSlash: true })
  }

  add (pattern, fn) {
    for (const key of ['method', 'path']) {
      if (Array.isArray(pattern[key])) {
        for (const value of pattern[key]) {
          this.add({ ...pattern, [key]: value }, fn)
        }
        return this
      }
    }

    if (typeof pattern.method !== 'string') throw new ConfigurationError('The method is not defined')
    if (typeof pattern.path !== 'string') throw new ConfigurationError('The path is not defined')
    if (typeof fn !== 'function') throw new ConfigurationError('The resolver function is not defined')

    const handler = this[kRouter].find(pattern.method, pattern.path)
    if (handler) {
      handler.store.push({ ...pattern, fn })
      // order the patterns in descending order, so we will match
      // more precise patterns first and the loose ones
      handler.store.sort((a, b) => Object.keys(b).length - Object.keys(a).length)
    } else {
      this[kRouter].on(pattern.method, pattern.path, noop, [{ ...pattern, fn }])
    }
    return this
  }

  get (params) {
    const handler = this[kRouter].find(params.method, params.path)
    if (!handler) return null
    for (const { body, querystring, fn } of handler.store) {
      if (body !== undefined && querystring !== undefined) {
        if (equal(params.body, body) && equal(params.querystring, querystring)) {
          return fn
        }
      } else if (body !== undefined && querystring === undefined) {
        if (equal(params.body, body)) {
          return fn
        }
      } else if (body === undefined && querystring !== undefined) {
        if (equal(params.querystring, querystring)) {
          return fn
        }
      } else {
        return fn
      }
    }
    return null
  }

  clear (pattern) {
    for (const key of ['method', 'path']) {
      if (Array.isArray(pattern[key])) {
        for (const value of pattern[key]) {
          this.clear({ ...pattern, [key]: value })
        }
        return this
      }
    }

    if (typeof pattern.method !== 'string') throw new ConfigurationError('The method is not defined')
    if (typeof pattern.path !== 'string') throw new ConfigurationError('The path is not defined')

    this[kRouter].off(pattern.method, pattern.path)
    return this
  }

  clearAll () {
    this[kRouter].reset()
    return this
  }

  getConnection () {
    return buildConnectionClass(this)
  }
}

function buildConnectionClass (mocker) {
  class MockConnection extends Connection {
    request (params, callback) {
      var aborted = false
      normalizeParams(params, prepareResponse)

      function prepareResponse (error, params) {
        if (aborted) {
          return callback(new RequestAbortedError(), null)
        }
        /* istanbul ignore next */
        if (error) {
          return callback(new ConnectionError(error.message), null)
        }

        var stream = null
        var payload = ''
        var statusCode = 200

        const resolver = mocker.get(params)
        if (resolver === null) {
          payload = { error: 'Mock not found' }
          stream = intoStream(JSON.stringify(payload))
          statusCode = 404
        } else {
          payload = resolver(params)
          if (payload instanceof ResponseError) {
            statusCode = payload.statusCode
            payload = payload.body
          } else if (payload instanceof ElasticsearchClientError) {
            return callback(payload, null)
          }
          stream = intoStream(
            typeof payload === 'string' ? payload : JSON.stringify(payload)
          )
        }

        stream.statusCode = statusCode
        stream.headers = {
          'content-type': typeof payload === 'string'
            ? 'text/plain;utf=8'
            : 'application/json;utf=8',
          date: new Date().toISOString(),
          connection: 'keep-alive',
          'content-length': Buffer.byteLength(
            typeof payload === 'string' ? payload : JSON.stringify(payload)
          )
        }

        callback(null, stream)
      }

      return {
        abort () {
          aborted = true
        }
      }
    }
  }

  return MockConnection
}

function normalizeParams (params, callback) {
  const normalized = {
    method: params.method,
    path: params.path,
    body: null,
    // querystring.parse returns a null object prototype
    // which break the fast-deep-equal algorithm
    querystring: { ...querystring.parse(params.querystring) }
  }

  const compression = (params.headers['Content-Encoding'] || params.headers['content-encoding']) === 'gzip'
  const type = params.headers['Content-Type'] || params.headers['content-type'] || ''

  if (isStream(params.body)) {
    normalized.body = ''
    const stream = compression ? params.body.pipe(createGunzip()) : params.body
    /* istanbul ignore next */
    stream.on('error', err => callback(err, null))
    stream.on('data', chunk => { normalized.body += chunk })
    stream.on('end', () => {
      normalized.body = type.includes('x-ndjson')
        ? normalized.body.split(/\n|\n\r/).filter(Boolean).map(l => JSON.parse(l))
        : JSON.parse(normalized.body)
      callback(null, normalized)
    })
  } else if (params.body) {
    if (compression) {
      gunzip(params.body, (err, buffer) => {
        /* istanbul ignore next */
        if (err) {
          return callback(err, null)
        }
        buffer = buffer.toString()
        normalized.body = type.includes('x-ndjson')
          ? buffer.split(/\n|\n\r/).filter(Boolean).map(l => JSON.parse(l))
          : JSON.parse(buffer)
        callback(null, normalized)
      })
    } else {
      normalized.body = type.includes('x-ndjson')
        ? params.body.split(/\n|\n\r/).filter(Boolean).map(l => JSON.parse(l))
        : JSON.parse(params.body)
      setImmediate(callback, null, normalized)
    }
  } else {
    setImmediate(callback, null, normalized)
  }
}

function isStream (obj) {
  return obj != null && typeof obj.pipe === 'function'
}

module.exports = Mocker
