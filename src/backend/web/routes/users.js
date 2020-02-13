const express = require('express');

const { logger } = require('../../utils/logger');
const feeds = require('../../data/feeds');
const { getFeeds } = require('../../utils/storage');

const router = express.Router();

router.get('/:id', async (req, res) => {
  // this route will return one user, and there list of feeds, this can be utilized in two places. One our search function, and
  // two for our add feed component to show a list of feeds that have been attached to the user.
  /* this should return
    { id: "some-ud-id, url: "/users/someuserId/ (multiple URLs?)}
  */
});

module.exports = router;
