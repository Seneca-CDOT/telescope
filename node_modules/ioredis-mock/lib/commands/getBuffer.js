"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBuffer = getBuffer;

var _get = require("./get");

var _buffer = _interopRequireDefault(require("../buffer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getBuffer(key) {
  const val = _get.get.apply(this, [key]);

  return val ? (0, _buffer.default)(val) : val;
}