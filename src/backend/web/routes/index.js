const express = require('express');
const path = require('path');
const admin = require('./admin');
const opml = require('./opml');
const post = require('./post');
const posts = require('./posts');

const router = express.Router();

router.use(express.static(path.join(__dirname, '../../../frontend')));

router.use('/admin', admin);
router.use('/opml', opml);
router.use('/post', post);
router.use('/posts', posts);

module.exports = router;
