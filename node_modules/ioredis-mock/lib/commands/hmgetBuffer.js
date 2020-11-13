"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hmgetBuffer = hmgetBuffer;

var _hmget = require("./hmget");

var _buffer = _interopRequireDefault(require("../buffer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function hmgetBuffer(key, ...fields) {
  const val = _hmget.hmget.apply(this, [key, ...fields]);

  return val.map(payload => payload ? (0, _buffer.default)(payload) : payload);
}