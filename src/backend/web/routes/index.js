const express = require('express');
const path = require('path');

const admin = require('./admin');
const feeds = require('./feeds');
const opml = require('./opml');
const planet = require('./planet');
const posts = require('./posts');
const login = require('./login');
const stats = require('./stats');

const router = express.Router();

router.use(express.static(path.join(__dirname, '../../../frontend')));

// Legacy CDOT Planet static assets
router.use('/legacy', express.static(path.join(__dirname, '../planet/static')));

router.use('/admin', admin);
router.use('/feeds', feeds);
router.use('/opml', opml);
router.use('/planet', planet);
router.use('/posts', posts);
router.use('/login', login);
router.use('/stats', stats);

module.exports = router;
