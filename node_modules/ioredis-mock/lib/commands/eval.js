"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.evaluate = evaluate;

var _command = _interopRequireDefault(require("../command"));

var _defineCommand = require("./defineCommand");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function evaluate(script, numberOfKeys, ...args) {
  return (0, _command.default)((0, _defineCommand.customCommand)(numberOfKeys, script).bind(this), '', this)(...args);
}