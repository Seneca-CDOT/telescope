"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.publish = publish;

var _minimatch = _interopRequireDefault(require("minimatch"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function publish(channel, message) {
  this.channels.emit(channel, message);
  const matchingPatterns = this.patternChannels.eventNames().filter(pattern => (0, _minimatch.default)(channel, pattern));
  matchingPatterns.forEach(matchingChannel => this.patternChannels.emit(matchingChannel, message, channel));
  const numberOfSubscribers = matchingPatterns.length + this.channels.listenerCount(channel);
  return numberOfSubscribers;
}