const { Satellite } = require('@senecacdot/satellite');

const posts = require('./routes/posts');

const service = new Satellite();

service.router.use('/', posts);

module.exports = service;
