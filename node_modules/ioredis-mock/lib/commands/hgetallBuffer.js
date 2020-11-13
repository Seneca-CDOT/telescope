"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hgetallBuffer = hgetallBuffer;

var _hgetall = require("./hgetall");

var _buffer = _interopRequireDefault(require("../buffer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function hgetallBuffer(key) {
  const val = _hgetall.hgetall.apply(this, [key]);

  Object.keys(val).forEach(keyInObject => {
    val[keyInObject] = (0, _buffer.default)(val[keyInObject]);
  });
  return val;
}