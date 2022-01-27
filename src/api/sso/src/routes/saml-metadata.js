const { Router } = require('@senecacdot/satellite');

const { samlMetadata } = require('../authentication');

const router = Router();

/**
 * Provide SAML Metadata endpoint for our Service Provider's Entity ID.
 * The naming is {host}/sp, for example: http://localhost/v1/auth/sp
 */
router.get('/', (req, res) => {
  res.type('application/xml');
  res.status(200).send(samlMetadata());
});

module.exports = router;
