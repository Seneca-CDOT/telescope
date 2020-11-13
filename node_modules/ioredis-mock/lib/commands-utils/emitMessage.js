"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = emitMessage;

function emitMessage(redisMock, channel, message) {
  process.nextTick(() => {
    redisMock.emit('message', channel, message);
  });
}