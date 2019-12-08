const express = require('express');

const { getPosts /* getPost */ } = require('../../utils/storage');
const { logger } = require('../../utils/logger');

const router = express.Router();

/**
 *
<div class="daygroup">
<h2>December 08, 2019</h2>

<div class="channelgroup">

<br clear="all"><h3 class="planetauthor"><a href="https://medium.com/@tjmorris56?source=rss-20af8e68efaf------2" title="Stories by Timothy Morris on Medium">Timothy Morris</a></h3>

<div class="entrygroup" id="https://medium.com/p/af8fccf7b7dd">
<h4><a href="https://medium.com/@tjmorris56/dps909-release-4-0-end-of-an-open-source-era-for-now-af8fccf7b7dd?source=rss-20af8e68efaf------2">DPS909: Release 4.0. End of an Open Source Era (for now)</a></h4>
<div class="entry">
<div class="content">...
<p class="date">
<a href="https://medium.com/@tjmorris56/dps909-release-4-0-end-of-an-open-source-era-for-now-af8fccf7b7dd?source=rss-20af8e68efaf------2">by Timothy Morris at December 08, 2019 03:03 AM</a>
</p>
</div>
</div>

class Post {
  constructor(author, title, htmlContent, textContent, datePublished, dateUpdated, postLink, guid) {
    this.author = author;
    this.title = title;
    this.content = htmlContent;
    this.text = textContent;
    this.published = datePublished;
    this.updated = dateUpdated;
    this.postLink = postLink;
    this.guid = guid;
    this.wordCount = 0;
  }
}

 */

/**
 * Get most recent 50 posts, and group them according to
 * day, channel, date.
 */
async function getPostData() {
  return getPosts(0, 50);
  /**
  const posts = await Promise.all(
    guids.map(async guid => {
      const post = await getPost(guid);
      console.log({ post });
      return post;
    })
  );

  const grouped = {};
   */
}

router.get('/', async (req, res) => {
  try {
    const data = await getPostData();
    res.render('planet', data);
  } catch (err) {
    logger.error({ err }, 'Unable to get posts from Redis');
    res.status(503).json({
      message: 'Unable to connect to database',
    });
  }
});

module.exports = router;
