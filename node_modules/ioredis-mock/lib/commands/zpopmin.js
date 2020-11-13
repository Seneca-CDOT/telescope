"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.zpopmin = zpopmin;

var _es6Map = _interopRequireDefault(require("es6-map"));

var _arrayFrom = _interopRequireDefault(require("array-from"));

var _lodash = require("lodash");

var _zrangeCommand = require("./zrange-command.common");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function zpopmin(key, count = 1) {
  const map = this.data.get(key);

  if (map == null || !(map instanceof _es6Map.default)) {
    return [];
  }

  const ordered = (0, _zrangeCommand.slice)((0, _lodash.orderBy)((0, _arrayFrom.default)(map.values()), ['score', 'value']), 0, count - 1);
  (0, _lodash.forEach)(ordered, it => {
    map.delete(it.value);
  });
  this.data.set(key, map);
  return (0, _lodash.flatMap)(ordered, it => [it.value, it.score]);
}