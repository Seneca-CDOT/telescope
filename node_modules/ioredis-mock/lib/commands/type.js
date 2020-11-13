"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.type = type;

var _es6Set = _interopRequireDefault(require("es6-set"));

var _lodash = require("lodash");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// eslint-disable-next-line consistent-return
function type(key) {
  if (!this.data.has(key)) {
    return 'none';
  }

  const val = this.data.get(key);

  if (val instanceof _es6Set.default) {
    return 'set';
  }

  if ((0, _lodash.isArray)(val)) {
    return 'list';
  }

  if ((0, _lodash.isString)(val)) {
    return 'string';
  }

  if ((0, _lodash.isPlainObject)(val)) {
    return 'hash';
  }
}