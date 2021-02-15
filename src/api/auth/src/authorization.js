/**
 * JWT Bearer Token Authorization strategy.
 */
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');

const { SECRET, JWT_ISSUER } = process.env;
const User = require('./user');

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: SECRET,
      JWT_ISSUER,
    },
    function (payload, done) {
      // TODO: check that payload.sub is a user we allow in our system
      // User.findOne({ id: payload.sub }, function (err, user) {
      //   if (err) {
      //     return done(err, false);
      //   }
      //   if (user) {
      //     return done(null, user);
      //   }
      //   return done(null, false);
      const fakeUser = new User('name', payload.sub, 'id', 'nameID', 'nameIDFormat');
      return done(null, fakeUser);
    }
  )
);
