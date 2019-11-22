const express = require('express');
const path = require('path');
const admin = require('./admin');

const router = express.Router();

router.use(express.static(path.join(__dirname, '../../../frontend')));

router.use('/admin', admin);

module.exports = router;
