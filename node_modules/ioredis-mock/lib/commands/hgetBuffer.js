"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hgetBuffer = hgetBuffer;

var _hget = require("./hget");

var _buffer = _interopRequireDefault(require("../buffer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function hgetBuffer(key, hashKey) {
  const val = _hget.hget.apply(this, [key, hashKey]);

  return val ? (0, _buffer.default)(val) : val;
}