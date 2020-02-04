const express = require('express');
const path = require('path');

const admin = require('./admin');
// The /feeds router allows access to Telescope's Feed Objects.
const feeds = require('./feeds');
// The /feed router allows access to generated feeds (RSS, ATOM, etc)
const feed = require('./feed');
const planet = require('./planet');
const posts = require('./posts');
const login = require('./login');

const router = express.Router();

router.use(express.static(path.join(__dirname, '../../../frontend')));

// Legacy CDOT Planet static assets
router.use('/legacy', express.static(path.join(__dirname, '../planet/static')));

router.use('/admin', admin);
router.use('/feeds', feeds);
router.use('/feed', feed);
router.use('/planet', planet);
router.use('/posts', posts);
router.use('/login', login);

module.exports = router;
