const { makeMetroConfig } = require('@rnx-kit/metro-config');
// const MetroSymlinksResolver = require('@rnx-kit/metro-resolver-symlinks');
const blacklist = require('metro-config/src/defaults/exclusionList');

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
  resolver: {
    blacklistRE: blacklist([/.bit\/.*/]),
  },
};
