const express = require('express');
const path = require('path');

const admin = require('./admin');
const opml = require('./opml');
const planet = require('./planet');
const posts = require('./posts');
const login = require('./login');

const router = express.Router();

router.use(express.static(path.join(__dirname, '../../../frontend')));

router.use('/admin', admin);
router.use('/opml', opml);
router.use('/planet', planet);
router.use('/posts', posts);
router.use('/login', login);

module.exports = router;
