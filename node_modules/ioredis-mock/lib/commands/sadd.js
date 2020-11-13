"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sadd = sadd;

var _es6Set = _interopRequireDefault(require("es6-set"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function sadd(key, ...vals) {
  if (!this.data.has(key)) {
    this.data.set(key, new _es6Set.default());
  }

  let added = 0;
  const set = this.data.get(key);
  vals.forEach(value => {
    if (!set.has(value)) {
      added++;
    }

    set.add(value);
  });
  this.data.set(key, set);
  return added;
}