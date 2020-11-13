"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lpopBuffer = lpopBuffer;

var _lpop = require("./lpop");

var _buffer = _interopRequireDefault(require("../buffer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function lpopBuffer(key) {
  const val = _lpop.lpop.apply(this, [key]);

  return val ? (0, _buffer.default)(val) : val;
}