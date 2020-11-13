"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sdiff = sdiff;

var _arrayFrom = _interopRequireDefault(require("array-from"));

var _es6Set = _interopRequireDefault(require("es6-set"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function sdiff(ours, ...theirs) {
  if (this.data.has(ours) && !(this.data.get(ours) instanceof _es6Set.default)) {
    throw new Error(`Key ${ours} does not contain a set`);
  }

  theirs.forEach(key => {
    if (this.data.has(key) && !(this.data.get(key) instanceof _es6Set.default)) {
      throw new Error(`Key ${key} does not contain a set`);
    }
  });
  const ourSet = this.data.has(ours) ? this.data.get(ours) : new _es6Set.default();
  const theirSets = theirs.map(key => this.data.has(key) ? this.data.get(key) : new _es6Set.default());
  const difference = new _es6Set.default((0, _arrayFrom.default)(ourSet).filter(ourValue => theirSets.reduce((isUnique, set) => set.has(ourValue) ? false : isUnique,
  /* isUnique */
  true)));
  return (0, _arrayFrom.default)(difference);
}