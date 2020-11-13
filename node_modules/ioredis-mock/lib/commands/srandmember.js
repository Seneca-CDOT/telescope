"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.srandmember = srandmember;

var _lodash = require("lodash");

var _es6Set = _interopRequireDefault(require("es6-set"));

var _arrayFrom = _interopRequireDefault(require("array-from"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function srandmember(key, count) {
  if (this.data.has(key) && !(this.data.get(key) instanceof _es6Set.default)) {
    throw new Error(`Key ${key} does not contain a set`);
  }

  const set = this.data.get(key) || new _es6Set.default();
  const list = (0, _arrayFrom.default)(set);
  const total = list.length;

  if (total === 0) {
    return null;
  }

  const shouldReturnArray = count !== undefined;
  const max = shouldReturnArray ? Math.abs(count) : 1;
  const skipDuplicates = shouldReturnArray && count > -1;

  if (skipDuplicates) {
    return (0, _lodash.shuffle)(list.splice(0, max));
  }

  const items = [];
  let results = 0;

  while (results < max) {
    const item = list[(0, _lodash.random)(0, total - 1)];
    items.push(item);
    results += 1;
  }

  return shouldReturnArray ? items : items[0];
}