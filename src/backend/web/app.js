const path = require('path');
const express = require('express');
const expressHandlebars = require('express-handlebars');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const healthcheck = require('express-healthcheck');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');

const { typeDefs, resolvers } = require('./graphql');
const logger = require('../utils/logger');
const authentication = require('./authentication');
const router = require('./routes');

const app = express();

// Enable CORS and preflight checks on all routes
app.use(cors());
app.options('*', cors());

// Add the Apollo server to app and define the `/graphql` endpoint
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.applyMiddleware({ app, path: '/graphql' });

// Template rendering for legacy "planet" view of posts
app.engine('handlebars', expressHandlebars());
app.set('views', path.join(__dirname, 'planet/views'));
app.set('view engine', 'handlebars');

// Add our logger to the app
app.set('logger', logger);
app.use(logger);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Setup Passport SAML based Authentication
const secret = authentication.init(passport);
// TODO: decide if we should do resave=false, https://www.npmjs.com/package/express-session#resave
app.use(session({ secret, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Provide a standard `/health` endpoint to check on state of the app
app.use('/health', healthcheck());

// Include our router with all endpoints
app.use('/', router);

module.exports = app;
