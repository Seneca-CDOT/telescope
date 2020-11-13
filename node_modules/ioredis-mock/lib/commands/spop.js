"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.spop = spop;

var _lodash = _interopRequireDefault(require("lodash"));

var _es6Set = _interopRequireDefault(require("es6-set"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const safeCount = count => {
  const result = count !== undefined ? parseInt(count, 10) : 1;

  if (Number.isNaN(result) || result < 0) {
    throw new Error('ERR value is not an integer or out of range');
  }

  return result;
};

function spop(key, count) {
  if (this.data.has(key) && !(this.data.get(key) instanceof _es6Set.default)) {
    throw new Error(`Key ${key} does not contain a set`);
  }

  const want = safeCount(count);
  const set = this.data.get(key) || new _es6Set.default();
  const total = set.size;
  if (want === 0) return undefined;
  if (total === 0) return null;

  const values = _lodash.default.chain(set).toArray();

  let result;

  if (want === 1) {
    result = values.sample().value();
    set.delete(result);
  } else if (total <= want) {
    result = values.value();
    set.clear();
  } else {
    values.shuffle(); // Randomize take

    result = values.take(want).value();
    result.map(item => set.delete(item));
  }

  this.data.set(key, set);
  return result;
}