"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.wrapRootElement = exports.onInitialClientRender = void 0;

var _react = _interopRequireDefault(require("react"));

var _styles = require("@material-ui/styles");

var _materialUiPluginCacheEndpoint = _interopRequireDefault(require("material-ui-plugin-cache-endpoint"));

var _utils = require("./utils");

var onInitialClientRender = function onInitialClientRender() {
  if (process.env.BUILD_STAGE === "develop") {
    return;
  } // Remove the server-side injected CSS.


  var jssStyles = document.querySelector("#jss-server-side");

  if (jssStyles) {
    jssStyles.parentNode.removeChild(jssStyles);
  }
};

exports.onInitialClientRender = onInitialClientRender;

var wrapRootElement = function wrapRootElement(_ref, pluginOptions) {
  var element = _ref.element;

  if ((0, _utils.hasEntries)(_materialUiPluginCacheEndpoint.default) && pluginOptions.stylesProvider) {
    throw new Error("You specified both pathToStylesProvider and stylesProvider in gatsby-config.js. Remove one of them.");
  }

  var stylesProvider = (0, _utils.hasEntries)(_materialUiPluginCacheEndpoint.default) ? _materialUiPluginCacheEndpoint.default : pluginOptions.stylesProvider;

  if (!stylesProvider) {
    return element;
  }

  return /*#__PURE__*/_react.default.createElement(_styles.StylesProvider, stylesProvider, element);
};

exports.wrapRootElement = wrapRootElement;