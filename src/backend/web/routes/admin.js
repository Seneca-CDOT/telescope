const express = require('express');
const { UI } = require('bull-board');

const { authenticateWithRedirect } = require('../authentication');

const router = express.Router();

// Only authenticated users can use this route
router.use('/queues', authenticateWithRedirect, UI);

module.exports = router;
