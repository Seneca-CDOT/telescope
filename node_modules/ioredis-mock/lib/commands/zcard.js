"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.zcard = zcard;

var _es6Map = _interopRequireDefault(require("es6-map"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function zcard(key) {
  const map = this.data.get(key);

  if (!map) {
    return 0;
  }

  if (!(map instanceof _es6Map.default)) {
    throw new Error(`Key ${key} does not contain a sorted set`);
  }

  return this.data.get(key).size;
}