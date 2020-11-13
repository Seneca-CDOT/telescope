"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.keys = keys;

var _minimatch = _interopRequireDefault(require("minimatch"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function keys(globString) {
  return this.data.keys().filter(key => (0, _minimatch.default)(key, globString));
}