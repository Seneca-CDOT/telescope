const express = require('express');
const queue = require('../../feed/queue');

const router = express.Router();

/**
 * Create a route that handles server sent events.
 * On job completion, it will send updates to the eventSource in index.html.
 */
router.get('/', (req, res) => {
  res.status(200).set({
    connection: 'keep-alive',
    'content-type': 'text/event-stream',
    'cache-control': 'no-cache',
  });

  const completedHandler = job => {
    res.write(`data: ${job.data.url}\n\n`);
  };

  queue.on('completed', completedHandler);

  req.on('close', () => {
    queue.off('completed', completedHandler);
    res.end();
  });
});

module.exports = router;
