const express = require('express');
const healthcheck = require('express-healthcheck');

const logger = require('../../lib/logger');
const router = require('./routes');

const app = express();

app.set('logger', logger);

app.use(logger);
app.use('/health', healthcheck());

app.use('/', router);

module.exports = app;
