const express = require('express');
const path = require('path');

const router = express.Router();

router.use(express.static(path.join(__dirname, '../../../frontend')));

router.use('/admin', require('./admin'));

module.exports = router;
