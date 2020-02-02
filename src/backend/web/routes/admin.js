const express = require('express');
const { UI } = require('bull-board');

const { authenticateUser } = require('../authentication');

const router = express.Router();

// Only authenticated users can use this route
router.use('/queues', authenticateUser(), UI);

module.exports = router;
