const blacklist = require('metro-config/src/defaults/exclusionList');

module.exports = {
  transformer: {
    // eslint-disable-next-line require-await
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
