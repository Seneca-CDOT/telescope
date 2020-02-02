const express = require('express');
const { UI } = require('bull-board');
// TODO: add this back in when passport.authenticate() below is working...
// const passport = require('passport');

const router = express.Router();

router.use(
  '/queues',
  /* TODO: this should work, but it's redirecting back to / instead of continuing to UI...

   passport.authenticate('saml'),

  */
  function temporaryHackToTestAuthenticatedRoute(req, res, next) {
    if (!req.user) {
      // Send a 401 Unauthorized
      res.send(401);
      return;
    }
    next();
  },
  UI
);

module.exports = router;
