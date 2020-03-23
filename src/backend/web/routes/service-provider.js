const express = require('express');

const { samlMetadata } = require('../authentication');

const router = express.Router();

/**
 * Provide SAML Metadata endpoint for our Service Provider's Entity ID.
 * The naming is {host}/sp, for example:
 *
 *  production: https://telescope.cdot.systems/sp
 *  staging:    https://dev.telescope.cdot.systems/sp
 */
router.get('/', (req, res) => {
  res.type('application/xml');
  res.status(200).send(samlMetadata());
});

module.exports = router;
