const express = require('express');
const healthcheck = require('express-healthcheck');

const router = require('./routes');

const app = express();

app.use('/health', healthcheck());

app.use('/', router);

module.exports = app;
