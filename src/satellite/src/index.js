const { isAuthenticated, isAuthorized } = require('./middleware');
const { createRouter } = require('./app');

module.exports.Satellite = require('./satellite');
module.exports.logger = require('./logger');
module.exports.hash = require('./hash');
module.exports.createError = require('./create-error');
module.exports.createServiceToken = require('./service-token');

module.exports.Router = (options) => createRouter(options);
module.exports.isAuthenticated = isAuthenticated;
module.exports.isAuthorized = isAuthorized;
module.exports.Redis = require('./redis').Redis;
module.exports.Elastic = require('./elastic').Elastic;
module.exports.fetch = require('node-fetch');
