const { Router } = require('@senecacdot/satellite');
const { errors } = require('celebrate');

const router = Router();

router.use('/login', require('./login'));
router.use('/logout', require('./logout'));
router.use('/register', require('./register'));
router.use('/sp', require('./saml-metadata'));

// Let Celebrate handle validation errors
router.use(errors());

module.exports = router;
