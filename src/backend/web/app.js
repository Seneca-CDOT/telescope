const path = require('path');
const express = require('express');
const expressHandlebars = require('express-handlebars');
const redis = require('redis');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const healthcheck = require('express-healthcheck');
const cors = require('cors');
const helmet = require('helmet');
const { ApolloServer } = require('apollo-server-express');
const RedisStore = require('connect-redis')(session);

const redisClient = redis.createClient();
const { typeDefs, resolvers } = require('./graphql');
const logger = require('../utils/logger');
const authentication = require('./authentication');
const router = require('./routes');

const secret = authentication.init(passport);
const app = express();

// Using helmet for the app
app.use(helmet());

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

// Setup Passport SAML based Authentication
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// TODO: decide if we should do resave=false, https://www.npmjs.com/package/express-session#resave
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret,
    resave: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Provide a standard `/health` endpoint to check on state of the app
app.use('/health', healthcheck());

// Include our router with all endpoints
app.use('/', router);

module.exports = app;
