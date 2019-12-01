const express = require('express');
const opml = require('opml-generator');

const router = express.Router();

const header = {
  title: 'OPML Feeds',
  dateCreated: new Date(2020, 2, 9),
  ownerName: 'Jordan',
};

const outlines = [
  {
    text: 'txt',
    title: 'My Open Source Experience',
    type: 'rss',
    xmlUrl: 'https://jrdnlxopensource.blogspot.com/feeds/posts/default/-/open-source',
    htmlUrl: 'https://jrdnlxopensource.blogspot.com/',
  },
];

router.get('/', (req, res) => {
  // call the opml() function here, and return it on res, using the correct content-type of " text/x-opml"
  res.setHeader('Content-type', 'text/x-opml');
  res.send(opml(header, outlines));
});

module.exports = router;
