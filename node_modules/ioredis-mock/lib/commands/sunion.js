"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sunion = sunion;

var _arrayFrom = _interopRequireDefault(require("array-from"));

var _es6Set = _interopRequireDefault(require("es6-set"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function sunion(...keys) {
  keys.forEach(key => {
    if (this.data.has(key) && !(this.data.get(key) instanceof _es6Set.default)) {
      throw new Error(`Key ${key} does not contain a set`);
    }
  });
  const sets = keys.map(key => this.data.has(key) ? this.data.get(key) : new _es6Set.default());
  const union = new _es6Set.default(sets.reduce((combined, set) => [...combined, ...(0, _arrayFrom.default)(set)], []));
  return (0, _arrayFrom.default)(union);
}