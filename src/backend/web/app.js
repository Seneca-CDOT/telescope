const express = require('express');
const healthcheck = require('express-healthcheck');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const logger = require('../utils/logger');
const router = require('./routes');
const { samlStrategy } = require('../login/usingPassport');

const app = express();

app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));

passport.use('samlStrategy', samlStrategy);
app.use(passport.initialize({}));
app.use(passport.session({}));

app.set('logger', logger);

app.use(logger);
app.use('/health', healthcheck());

app.use('/', router);

app.get(
  '/login',
  function(req, res, next) {
    console.log('-----------------------------');
    console.log('/Start login handler');
    next();
  },
  passport.authenticate('samlStrategy')
);

app.post(
  '/login/callback',
  function(req, res, next) {
    console.log('-----------------------------');
    console.log('/Start login callback ');
    next();
  },
  passport.authenticate('samlStrategy'),
  function(req, res) {
    console.log('-----------------------------');
    console.log('login call back dumps');
    console.log(req.user);
    console.log('-----------------------------');
    res.send('Log in Callback Success');
  }
);

passport.serializeUser(function(user, done) {
  console.log('-----------------------------');
  console.log('serialize user');
  console.log(user);
  console.log('-----------------------------');
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  console.log('-----------------------------');
  console.log('deserialize user');
  console.log(user);
  console.log('-----------------------------');
  done(null, user);
});

module.exports = app;
