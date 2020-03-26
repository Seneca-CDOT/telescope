require('../../lib/config');
const express = require('express');
const { UI } = require('bull-board');
const fs = require('fs');

const { protect } = require('../authentication');
const { logger } = require('../../utils/logger');

const router = express.Router();

// Only authenticated users can use these routes
router.use('/queues', protect, UI);

router.get('/log', protect, (req, res) => {
  let readStream;
  if (!process.env.LOG_FILE) {
    res.send('LOG_FILE undefined in .env file');
    return;
  }
  try {
    readStream = fs.createReadStream(process.env.LOG_FILE);

    res.append('Content-type', 'text/plain');
    readStream.pipe(res).on('error', error => {
      logger.error({ error });
      readStream.destroy();
    });

    res.on('error', error => {
      logger.error({ error });
      readStream.destroy();
    });
  } catch (error) {
    res.send(error.message);
  }
});

module.exports = router;
