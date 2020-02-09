/**
 * Allow switching between real login/logout authentication routes
 * and a mock strategy via the MOCK_SSO environment variable.
 *
 * Set MOCK_SSO=1 to use the mock routes.
 */

const { logger } = require('../../../utils/logger');
const saml2Router = require('./auth-saml2');
const mockRouter = require('./auth-mock');

if (process.env.MOCK_SSO) {
  logger.warn('Using Mock SSO authentication routes in development');
  module.exports = mockRouter;
} else {
  module.exports = saml2Router;
}
