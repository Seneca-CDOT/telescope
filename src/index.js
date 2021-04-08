require('./apm');

const { isAuthenticated, isAuthorized } = require('./middleware');
const { createRouter } = require('./app');

module.exports.Satellite = require('./satellite');
module.exports.logger = require('./logger');
module.exports.hash = require('./hash');
module.exports.createError = require('http-errors');
module.exports.createServiceToken = require('./service-token');
module.exports.Router = (options) => createRouter(options);
module.exports.isAuthenticated = isAuthenticated;
module.exports.isAuthorized = isAuthorized;
module.exports.Redis = require('./redis');
