const path = require('path');
const express = require('express');
const expressHandlebars = require('express-handlebars');
const healthcheck = require('express-healthcheck');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');

const logger = require('../utils/logger');
const router = require('./routes');

// Required for GraphQL
const { typeDefs, resolvers } = require('./graphql');

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const app = express();
app.use(cors());
app.options('*', cors());

// Add the Apollo server to app and define GraphQL's endpoint
server.applyMiddleware({ app, path: '/graphql' });

// Template rendering for legacy "planet" view of posts
app.engine('handlebars', expressHandlebars());
app.set('views', path.join(__dirname, 'planet/views'));
app.set('view engine', 'handlebars');

app.set('logger', logger);
app.use(logger);

app.use('/health', healthcheck());

app.use('/', router);

module.exports = app;
