"use strict";

exports.__esModule = true;
exports.hasEntries = hasEntries;

function hasEntries(object) {
  if (!object) return false;
  return Object.entries(object).length > 0;
}