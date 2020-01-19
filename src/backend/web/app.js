const path = require('path');
const express = require('express');
const expressHandlebars = require('express-handlebars');
const healthcheck = require('express-healthcheck');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');

// Required for GraphQL
const { typeDefs, resolvers } = require('./graphql');

const logger = require('../utils/logger');
const router = require('./routes');

const app = express();

// Template rendering for legacy "planet" view of posts
app.engine('handlebars', expressHandlebars());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

app.set('logger', logger);
app.use(logger);

app.use(cors());

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Add the Apollo server to app and define GraphQL's endpoint
server.applyMiddleware({ app, path: '/graphql' });

app.use('/health', healthcheck());

app.use('/', router);

module.exports = app;
