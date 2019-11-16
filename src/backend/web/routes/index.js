const express = require('express');
const path = require('path');
const admin = require('./admin');
const opml = require('./opml');

const router = express.Router();

router.use(express.static(path.join(__dirname, '../../../frontend')));

router.use('/admin', admin);
router.use('/opml', opml);

module.exports = router;
