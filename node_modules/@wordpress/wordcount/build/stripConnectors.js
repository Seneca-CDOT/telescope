"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = stripConnectors;

/**
 * Replaces items matched in the regex with spaces.
 *
 * @param {Object} settings The main settings object containing regular expressions
 * @param {string} text     The string being counted.
 *
 * @return {string} The manipulated text.
 */
function stripConnectors(settings, text) {
  if (settings.connectorRegExp) {
    return text.replace(settings.connectorRegExp, ' ');
  }

  return text;
}
//# sourceMappingURL=stripConnectors.js.map