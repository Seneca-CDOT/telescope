"use strict";

var fs = require("fs");

var path = require("path");

var os = require("os");

var didRunAlready = false;

exports.onPreInit = function () {
  if (didRunAlready) {
    throw new Error("You can only have a single instance of gatsby-plugin-material-ui in your gatsby-config.js");
  }

  didRunAlready = true;
}; // Copy and past from https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-plugin-typography


exports.onPreBootstrap = function (_ref, pluginOptions) {
  var store = _ref.store,
      cache = _ref.cache;
  var program = store.getState().program;
  var module;

  if (pluginOptions.pathToStylesProvider) {
    module = "module.exports = require(\"" + (path.isAbsolute(pluginOptions.pathToStylesProvider) ? pluginOptions.pathToStylesProvider : path.join(program.directory, pluginOptions.pathToStylesProvider)) + "\")";

    if (os.platform() === "win32") {
      module = module.split("\\").join("\\\\");
    }
  } else {
    module = "module.exports = null";
  }

  var dir = cache.directory;

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  fs.writeFileSync(path.join(dir, "styles-provider-props.js"), module);
}; // Copy and past from https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-plugin-typography


exports.onCreateWebpackConfig = function (_ref2) {
  var actions = _ref2.actions,
      cache = _ref2.cache;
  var cacheFile = path.join(cache.directory, "styles-provider-props.js");
  var setWebpackConfig = actions.setWebpackConfig;
  setWebpackConfig({
    resolve: {
      alias: {
        "material-ui-plugin-cache-endpoint": cacheFile
      }
    }
  });
};