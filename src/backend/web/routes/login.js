const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const { samlStrategy, handleLogin } = require('../../login/usingPassport');
const logger = require('../../utils/logger');

const router = express.Router();

router.use(cookieParser());

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

const { SAML2_CLIENT_SECRET } = process.env;
router.use(session({ secret: SAML2_CLIENT_SECRET, resave: false, saveUninitialized: true }));

passport.use('samlStrategy', samlStrategy);
router.use(passport.initialize({}));
router.use(passport.session({}));

/* this route is used to login and will redirect you to the external service that takes care of authentication */
router.get('/login', handleLogin, passport.authenticate('samlStrategy'));

/* this route is where you get directed from the external service. This is your redirect url found in the .env */
router.post('/login/callback', handleLogin, passport.authenticate('samlStrategy'), function(
  req,
  res
) {
  logger.info({ user: req.user }, 'SSO login callback');
  res.send('Log in Callback Success');
});

passport.serializeUser(function(user, done) {
  logger.info({ user }, 'Serialize user');
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  logger.info({ user }, 'Deserialize user');
  done(null, user);
});

module.exports = router;
