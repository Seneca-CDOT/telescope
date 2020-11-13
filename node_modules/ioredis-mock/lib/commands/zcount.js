"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.zcount = zcount;

var _es6Map = _interopRequireDefault(require("es6-map"));

var _arrayFrom = _interopRequireDefault(require("array-from"));

var _lodash = require("lodash");

var _zrangeCommand = require("./zrange-command.common");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function zcount(key, inputMin, inputMax) {
  const map = this.data.get(key);

  if (!map) {
    return 0;
  }

  if (this.data.has(key) && !(this.data.get(key) instanceof _es6Map.default)) {
    return 0;
  }

  const min = (0, _zrangeCommand.parseLimit)(inputMin);
  const max = (0, _zrangeCommand.parseLimit)(inputMax);
  const filteredArray = (0, _lodash.filter)((0, _arrayFrom.default)(map.values()), (0, _zrangeCommand.filterPredicate)(min, max));
  return filteredArray.length;
}