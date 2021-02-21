#!/usr/bin/env node
const { logs } = require('../tools/services');

// Pass the names of services to show logs. At least one is required
const argv = process.argv.slice(3);
logs(argv);
