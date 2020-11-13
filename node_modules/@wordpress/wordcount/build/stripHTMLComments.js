"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = stripHTMLComments;

/**
 * Removes items matched in the regex.
 *
 * @param {Object} settings The main settings object containing regular expressions
 * @param {string} text     The string being counted.
 *
 * @return {string} The manipulated text.
 */
function stripHTMLComments(settings, text) {
  if (settings.HTMLcommentRegExp) {
    return text.replace(settings.HTMLcommentRegExp, '');
  }

  return text;
}
//# sourceMappingURL=stripHTMLComments.js.map