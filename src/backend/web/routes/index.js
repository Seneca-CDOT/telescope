const express = require('express');
const path = require('path');

const router = express.Router();

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../../frontend/index.html'));
});

router.use('/admin', require('./admin'));

module.exports = router;
