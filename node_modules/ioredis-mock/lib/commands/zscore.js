"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.zscore = zscore;

var _es6Map = _interopRequireDefault(require("es6-map"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function zscore(key, member) {
  const map = this.data.get(key); // @TODO investigate a more stable way to detect sorted lists

  if (!map || !(map instanceof _es6Map.default)) {
    return null;
  }

  const entry = map.get(member);

  if (!entry) {
    return null;
  }

  return entry.score.toString();
}