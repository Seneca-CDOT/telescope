"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.brpoplpushBuffer = brpoplpushBuffer;

var _brpoplpush = require("./brpoplpush");

var _buffer = _interopRequireDefault(require("../buffer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function brpoplpushBuffer(source, destination) {
  const valP = _brpoplpush.brpoplpush.apply(this, [source, destination]);

  return valP.then(val => val ? (0, _buffer.default)(val) : val);
}