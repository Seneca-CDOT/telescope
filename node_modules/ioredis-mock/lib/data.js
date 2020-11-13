"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createData;

var _es6Set = _interopRequireDefault(require("es6-set"));

var _es6Map = _interopRequireDefault(require("es6-map"));

var _lodash = require("lodash");

var _buffer = _interopRequireDefault(require("./buffer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createData(expiresInstance, initial = {}, keyPrefix = '') {
  let raw = {};

  function createInstance(prefix, expires) {
    return Object.freeze({
      clear() {
        raw = {};
      },

      delete(key) {
        if (expires.has(key)) {
          expires.delete(key);
        }

        delete raw[`${prefix}${key}`];
      },

      get(key) {
        if (expires.has(key) && expires.isExpired(key)) {
          this.delete(key);
        }

        const value = raw[`${prefix}${key}`];

        if (Array.isArray(value)) {
          return value.slice();
        }

        if (Buffer.isBuffer(value)) {
          return (0, _buffer.default)(value);
        }

        if (value instanceof _es6Set.default) {
          return new _es6Set.default(value);
        }

        if (value instanceof _es6Map.default) {
          return new _es6Map.default(value);
        }

        if (typeof value === 'object' && value) {
          return (0, _lodash.assign)({}, value);
        }

        return value;
      },

      has(key) {
        if (expires.has(key) && expires.isExpired(key)) {
          this.delete(key);
        }

        return {}.hasOwnProperty.call(raw, `${prefix}${key}`);
      },

      keys() {
        return Object.keys(raw);
      },

      set(key, val) {
        let item = val;

        if (Array.isArray(val)) {
          item = val.slice();
        } else if (Buffer.isBuffer(val)) {
          item = (0, _buffer.default)(val);
        } else if (val instanceof _es6Set.default) {
          item = new _es6Set.default(val);
        } else if (val instanceof _es6Map.default) {
          item = new _es6Map.default(val);
        } else if (typeof val === 'object' && val) {
          item = (0, _lodash.assign)({}, val);
        }

        raw[`${prefix}${key}`] = item;
      },

      withKeyPrefix(newKeyPrefix) {
        if (newKeyPrefix === prefix) return this;
        return createInstance(newKeyPrefix, expires.withKeyPrefix(newKeyPrefix));
      }

    });
  }

  const data = createInstance(keyPrefix, expiresInstance);
  Object.keys(initial).forEach(key => data.set(key, initial[key]));
  return data;
}