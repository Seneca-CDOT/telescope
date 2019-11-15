const express = require('express');
const { UI } = require('bull-board');

const router = express.Router();

router.use('/queues', UI);

module.exports = router;
