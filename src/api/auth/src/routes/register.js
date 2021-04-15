const { Router, isAuthenticated, isAuthorized } = require('@senecacdot/satellite');

const { createTelescopeUser, getTelescopeProfile } = require('../middleware');
const { createToken } = require('../token');
const roles = require('../roles');

const router = Router();

/**
 * /register allows an authenticated Seneca user to create a new Telescope
 * user account with the Users service. We do no validation on the user data,
 * which is up to the Users service. If successful, we return an upgraded
 * JWT token, which includes more user info and upgrade roles.
 */
router.post(
  '/',
  isAuthenticated(),
  isAuthorized(
    // A Seneca user can create a new Telescope user, but an existing Telescope
    // user cannot, since they must already have one.
    (req, user) => user.roles.includes('seneca') && !user.roles.includes('telescope')
  ),
  createTelescopeUser(),
  getTelescopeProfile(),
  (req, res) => {
    const user = res.locals.telescopeProfile;
    const token = createToken(
      user.email,
      user.firstName,
      user.lastName,
      user.displayName,
      user.isAdmin === true ? roles.admin() : roles.telescope(),
      user.github?.avatarUrl
    );
    res.status(201).json({ token });
  }
);

module.exports = router;
