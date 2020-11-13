"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.onRenderBody = exports.wrapRootElement = void 0;

var _react = _interopRequireDefault(require("react"));

var _styles = require("@material-ui/styles");

var _cleanCss = _interopRequireDefault(require("clean-css"));

var _materialUiPluginCacheEndpoint = _interopRequireDefault(require("material-ui-plugin-cache-endpoint"));

var _utils = require("./utils");

var _autoprefixer = _interopRequireDefault(require("./autoprefixer"));

// Keep track of sheets for each page
var globalLeak = new Map();
var cleanCSS = new _cleanCss.default();

var wrapRootElement = function wrapRootElement(_ref, pluginOptions) {
  var element = _ref.element,
      pathname = _ref.pathname;

  if ((0, _utils.hasEntries)(_materialUiPluginCacheEndpoint.default) && pluginOptions.stylesProvider) {
    throw new Error("You specified both pathToStylesProvider and stylesProvider in gatsby-config.js. Remove one of them.");
  }

  var stylesProvider = (0, _utils.hasEntries)(_materialUiPluginCacheEndpoint.default) ? _materialUiPluginCacheEndpoint.default : pluginOptions.stylesProvider;
  var sheets = new _styles.ServerStyleSheets(stylesProvider);
  globalLeak.set(pathname, sheets);
  return sheets.collect(element);
};

exports.wrapRootElement = wrapRootElement;

var onRenderBody = function onRenderBody(_ref2, _ref3) {
  var setHeadComponents = _ref2.setHeadComponents,
      pathname = _ref2.pathname;
  var _ref3$disableAutopref = _ref3.disableAutoprefixing,
      disableAutoprefixing = _ref3$disableAutopref === void 0 ? false : _ref3$disableAutopref,
      _ref3$disableMinifica = _ref3.disableMinification,
      disableMinification = _ref3$disableMinifica === void 0 ? false : _ref3$disableMinifica;
  var sheets = globalLeak.get(pathname);

  if (!sheets) {
    return;
  }

  var css = sheets.toString();
  css = disableAutoprefixing ? css : (0, _autoprefixer.default)(css, pathname);
  css = disableMinification ? css : cleanCSS.minify(css).styles;
  setHeadComponents([/*#__PURE__*/_react.default.createElement("style", {
    id: "jss-server-side",
    key: "jss-server-side",
    dangerouslySetInnerHTML: {
      __html: css
    }
  })]);
  globalLeak.delete(pathname);
};

exports.onRenderBody = onRenderBody;