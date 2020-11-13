"use strict";

var _events = require("events");

var _ioredis = require("ioredis");

var commands = _interopRequireWildcard(require("./commands"));

var commandsStream = _interopRequireWildcard(require("./commands-stream"));

var _command = _interopRequireDefault(require("./command"));

var _data = _interopRequireDefault(require("./data"));

var _expires = _interopRequireDefault(require("./expires"));

var _emitConnectEvent = _interopRequireDefault(require("./commands-utils/emitConnectEvent"));

var _pipeline = _interopRequireDefault(require("./pipeline"));

var _promiseContainer = _interopRequireDefault(require("./promise-container"));

var _keyspaceNotifications = _interopRequireDefault(require("./keyspace-notifications"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const defaultOptions = {
  data: {},
  keyPrefix: '',
  lazyConnect: false,
  notifyKeyspaceEvents: '' // string pattern as specified in https://redis.io/topics/notifications#configuration e.g. 'gxK'

};

class RedisMock extends _events.EventEmitter {
  static get Promise() {
    return _promiseContainer.default.get();
  }

  static set Promise(lib) {
    return _promiseContainer.default.set(lib);
  }

  constructor(options = {}) {
    super();
    this.channels = new _events.EventEmitter();
    this.patternChannels = new _events.EventEmitter();
    this.batch = undefined;
    this.connected = false;
    this.subscriberMode = false; // eslint-disable-next-line prefer-object-spread

    const optionsWithDefault = Object.assign({}, defaultOptions, options);
    this.expires = (0, _expires.default)(optionsWithDefault.keyPrefix);
    this.data = (0, _data.default)(this.expires, optionsWithDefault.data, optionsWithDefault.keyPrefix);

    this._initCommands();

    this.keyspaceEvents = (0, _keyspaceNotifications.default)(optionsWithDefault.notifyKeyspaceEvents);

    if (optionsWithDefault.lazyConnect === false) {
      this.connected = true;
      (0, _emitConnectEvent.default)(this);
    }
  }

  multi(batch = []) {
    this.batch = new _pipeline.default(this); // eslint-disable-next-line no-underscore-dangle

    this.batch._transactions += 1;
    batch.forEach(([command, ...options]) => this.batch[command](...options));
    return this.batch;
  }

  pipeline(batch = []) {
    this.batch = new _pipeline.default(this);
    batch.forEach(([command, ...options]) => this.batch[command](...options));
    return this.batch;
  }

  exec(callback) {
    const Promise = _promiseContainer.default.get();

    if (!this.batch) {
      return Promise.reject(new Error('ERR EXEC without MULTI'));
    }

    const pipeline = this.batch;
    this.batch = undefined;
    return pipeline.exec(callback);
  }

  createConnectedClient(options = {}) {
    const mock = new RedisMock(options);
    mock.expires = typeof options.keyPrefix === 'string' ? this.expires.withKeyPrefix(options.keyPrefix) : this.expires;
    mock.data = typeof options.keyPrefix === 'string' ? this.data.withKeyPrefix(options.keyPrefix) : this.data;
    mock.channels = this.channels;
    mock.patternChannels = this.patternChannels;
    return mock;
  } // eslint-disable-next-line class-methods-use-this


  disconnect() {// no-op
  }

  _initCommands() {
    Object.keys(commands).forEach(command => {
      const commandName = command === 'evaluate' ? 'eval' : command;
      this[commandName] = (0, _command.default)(commands[command].bind(this), commandName, this);
    });
    Object.keys(commandsStream).forEach(command => {
      this[command] = commandsStream[command].bind(this);
    });
  }

}

RedisMock.prototype.Command = {
  // eslint-disable-next-line no-underscore-dangle
  transformers: _ioredis.Command._transformer,
  setArgumentTransformer: (name, func) => {
    RedisMock.prototype.Command.transformers.argument[name] = func;
  },
  setReplyTransformer: (name, func) => {
    RedisMock.prototype.Command.transformers.reply[name] = func;
  }
};
module.exports = RedisMock;