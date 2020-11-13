"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.smembers = smembers;

var _arrayFrom = _interopRequireDefault(require("array-from"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function smembers(key) {
  if (!this.data.has(key)) {
    return [];
  }

  return (0, _arrayFrom.default)(this.data.get(key));
}