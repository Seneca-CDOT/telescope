const path = require('path');
const express = require('express');
const expressHandlebars = require('express-handlebars');
const healthcheck = require('express-healthcheck');

const logger = require('../utils/logger');
const router = require('./routes');

const app = express();

// Template rendering for legacy "planet" view of posts
app.engine('handlebars', expressHandlebars());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

app.set('logger', logger);
app.use(logger);

app.use('/health', healthcheck());

app.use('/', router);

module.exports = app;
