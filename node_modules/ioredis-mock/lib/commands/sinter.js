"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sinter = sinter;

var _arrayFrom = _interopRequireDefault(require("array-from"));

var _es6Set = _interopRequireDefault(require("es6-set"));

var _index = require("./index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function sinter(...keys) {
  const values = _index.sunion.apply(this, keys);

  const sets = keys.map(key => this.data.has(key) ? this.data.get(key) : new _es6Set.default());
  const intersection = new _es6Set.default(values.filter(value => sets.reduce((isShared, set) => set.has(value) ? isShared : false,
  /* isShared */
  true)));
  return (0, _arrayFrom.default)(intersection);
}