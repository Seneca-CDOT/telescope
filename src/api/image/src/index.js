const { Satellite } = require('@senecacdot/satellite');

const image = require('./routes/image');
const gallery = require('./routes/gallery');

const service = new Satellite({
  helmet: {
    // Allow cross-origin image loading, see:
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Embedder-Policy
    // https://stackoverflow.com/questions/70752554/ressources-not-loaded-after-setting-csp-and-corp-headers-using-helmet/70757856#70757856
    crossOriginEmbedderPolicy: false,
  },
});

service.router.use('/gallery', gallery);
service.router.use('/', image);

module.exports = service;
