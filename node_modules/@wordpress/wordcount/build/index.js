"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.count = count;

var _lodash = require("lodash");

var _defaultSettings = require("./defaultSettings");

var _stripTags = _interopRequireDefault(require("./stripTags"));

var _transposeAstralsToCountableChar = _interopRequireDefault(require("./transposeAstralsToCountableChar"));

var _stripHTMLEntities = _interopRequireDefault(require("./stripHTMLEntities"));

var _stripConnectors = _interopRequireDefault(require("./stripConnectors"));

var _stripRemovables = _interopRequireDefault(require("./stripRemovables"));

var _stripHTMLComments = _interopRequireDefault(require("./stripHTMLComments"));

var _stripShortcodes = _interopRequireDefault(require("./stripShortcodes"));

var _stripSpaces = _interopRequireDefault(require("./stripSpaces"));

var _transposeHTMLEntitiesToCountableChars = _interopRequireDefault(require("./transposeHTMLEntitiesToCountableChars"));

/**
 * External dependencies
 */

/**
 * Internal dependencies
 */

/**
 * Private function to manage the settings.
 *
 * @param {string} type         The type of count to be done.
 * @param {Object} userSettings Custom settings for the count.
 *
 * @return {void|Object|*} The combined settings object to be used.
 */
function loadSettings(type, userSettings) {
  var settings = (0, _lodash.extend)(_defaultSettings.defaultSettings, userSettings);
  settings.shortcodes = settings.l10n.shortcodes || {};

  if (settings.shortcodes && settings.shortcodes.length) {
    settings.shortcodesRegExp = new RegExp('\\[\\/?(?:' + settings.shortcodes.join('|') + ')[^\\]]*?\\]', 'g');
  }

  settings.type = type || settings.l10n.type;

  if (settings.type !== 'characters_excluding_spaces' && settings.type !== 'characters_including_spaces') {
    settings.type = 'words';
  }

  return settings;
}
/**
 * Match the regex for the type 'words'
 *
 * @param {string} text     The text being processed
 * @param {string} regex    The regular expression pattern being matched
 * @param {Object} settings Settings object containing regular expressions for each strip function
 *
 * @return {Array|{index: number, input: string}} The matched string.
 */


function matchWords(text, regex, settings) {
  text = (0, _lodash.flow)(_stripTags.default.bind(this, settings), _stripHTMLComments.default.bind(this, settings), _stripShortcodes.default.bind(this, settings), _stripSpaces.default.bind(this, settings), _stripHTMLEntities.default.bind(this, settings), _stripConnectors.default.bind(this, settings), _stripRemovables.default.bind(this, settings))(text);
  text = text + '\n';
  return text.match(regex);
}
/**
 * Match the regex for either 'characters_excluding_spaces' or 'characters_including_spaces'
 *
 * @param {string} text     The text being processed
 * @param {string} regex    The regular expression pattern being matched
 * @param {Object} settings Settings object containing regular expressions for each strip function
 *
 * @return {Array|{index: number, input: string}} The matched string.
 */


function matchCharacters(text, regex, settings) {
  text = (0, _lodash.flow)(_stripTags.default.bind(this, settings), _stripHTMLComments.default.bind(this, settings), _stripShortcodes.default.bind(this, settings), _stripSpaces.default.bind(this, settings), _transposeAstralsToCountableChar.default.bind(this, settings), _transposeHTMLEntitiesToCountableChars.default.bind(this, settings))(text);
  text = text + '\n';
  return text.match(regex);
}
/**
 * Count some words.
 *
 * @param {string} text         The text being processed
 * @param {string} type         The type of count. Accepts ;words', 'characters_excluding_spaces', or 'characters_including_spaces'.
 * @param {Object} userSettings Custom settings object.
 *
 * @example
 * ```js
 * import { count } from '@wordpress/wordcount';
 * const numberOfWords = count( 'Words to count', 'words', {} )
 * ```
 *
 * @return {number} The word or character count.
 */


function count(text, type, userSettings) {
  if ('' === text) {
    return 0;
  }

  if (text) {
    var settings = loadSettings(type, userSettings);
    var matchRegExp = settings[type + 'RegExp'];
    var results = 'words' === settings.type ? matchWords(text, matchRegExp, settings) : matchCharacters(text, matchRegExp, settings);
    return results ? results.length : 0;
  }
}
//# sourceMappingURL=index.js.map