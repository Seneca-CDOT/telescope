const express = require('express');
const path = require('path');
const admin = require('./admin');
const opml = require('./opml');
const post = require('./post');
const posts = require('./posts');
const sse = require('./server-sent-events');
const login = require('./login');

const router = express.Router();

router.use(express.static(path.join(__dirname, '../../../frontend')));

router.use('/admin', admin);
router.use('/opml', opml);
router.use('/post', post);
router.use('/posts', posts);
router.use('/feed-updates', sse);
router.use('/login', login);

module.exports = router;
