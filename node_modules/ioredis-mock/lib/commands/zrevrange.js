"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.zrevrange = zrevrange;

var _es6Map = _interopRequireDefault(require("es6-map"));

var _arrayFrom = _interopRequireDefault(require("array-from"));

var _lodash = require("lodash");

var _zrangeCommand = require("./zrange-command.common");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function zrevrange(key, s, e, w) {
  const map = this.data.get(key);

  if (!map) {
    return [];
  } // @TODO investigate a more stable way to detect sorted lists


  if (this.data.has(key) && !(this.data.get(key) instanceof _es6Map.default)) {
    return [];
  }

  const start = parseInt(s, 10);
  const end = parseInt(e, 10);
  let val = (0, _lodash.orderBy)((0, _arrayFrom.default)(map.values()), ['score', 'value'], ['desc', 'desc']).map(it => {
    if (w) {
      return [it.value, it.score];
    }

    return [it.value];
  });
  val = (0, _zrangeCommand.slice)(val, start, end);
  return (0, _lodash.flatten)(val);
}