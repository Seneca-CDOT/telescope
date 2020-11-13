"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _standardAsCallback = _interopRequireDefault(require("standard-as-callback"));

var commands = _interopRequireWildcard(require("./commands"));

var _command = require("./command");

var _promiseContainer = _interopRequireDefault(require("./promise-container"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Pipeline {
  constructor(redis) {
    this.batch = [];
    this.redis = redis;
    this._transactions = 0;
    Object.keys(commands).forEach(command => {
      this[command] = this._createCommand(command);
    });
  }

  _createCommand(commandName) {
    return (...args) => {
      const lastArgIndex = args.length - 1;
      let callback = args[lastArgIndex];

      if (typeof callback !== 'function') {
        callback = undefined;
      } else {
        // eslint-disable-next-line no-param-reassign
        args.length = lastArgIndex;
      }

      const commandEmulator = commands[commandName].bind(this.redis);
      const commandArgs = (0, _command.processArguments)(args, commandName, this.redis);

      this._addTransaction(commandEmulator, commandName, commandArgs, callback);

      return this;
    };
  }

  _addTransaction(commandEmulator, commandName, commandArgs, callback) {
    const Promise = _promiseContainer.default.get();

    this.batch.push(() => (0, _standardAsCallback.default)(new Promise(resolve => resolve((0, _command.safelyExecuteCommand)(commandEmulator, commandName, this.redis, ...commandArgs))), callback));
    this._transactions += 1;
  }

  exec(callback) {
    // eslint-disable-next-line prefer-destructuring
    const batch = this.batch;

    const Promise = _promiseContainer.default.get();

    this.batch = [];
    return (0, _standardAsCallback.default)(Promise.all(batch.map(cmd => cmd())).then(replies => replies.map(reply => [null, reply])), callback);
  }

}

var _default = Pipeline;
exports.default = _default;