#!/usr/bin/env node
const { start } = require('../tools/services');

// Pass the names of services to start, or none to start all
const argv = process.argv.slice(3);
start(argv);
