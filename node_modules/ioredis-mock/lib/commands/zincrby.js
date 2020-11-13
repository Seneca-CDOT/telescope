"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.zincrby = zincrby;

var _es6Map = _interopRequireDefault(require("es6-map"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function zincrby(key, increment, value) {
  if (!this.data.has(key)) {
    this.data.set(key, new _es6Map.default());
  }

  const map = this.data.get(key);
  let score = 0;

  if (map.has(value)) {
    ({
      score
    } = map.get(value));
  }

  score += parseFloat(increment);
  map.set(value, {
    value,
    score
  });
  this.data.set(key, map);
  return score.toString();
}