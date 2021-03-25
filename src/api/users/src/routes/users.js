const { Router, logger } = require('@senecacdot/satellite');
const { errors } = require('celebrate');
const { validatePagingParams, validateId, validateUser } = require('../models/celebrateSchema');
const User = require('../models/users');
const db = require('../services/firestore');

const router = Router();

// get a user with a supplied id, validated by the celebrateSchema
// rejected if a user could not be found, otherwise user returned
router.get('/:id', validateId(), async (req, res, next) => {
  try {
    const userRef = db.collection('users').doc(req.params.id);
    const doc = await userRef.get();

    if (!doc.exists) {
      logger.debug(`User data (id: ${doc.id}) was requested by ${req.ip} but could not be found.`);
      res.status(404).json({
        msg: `User data (id: ${doc.id}) was requested but could not be found.`,
      });
    } else {
      logger.debug(`User data (id: ${doc.id}) was requested by ${req.ip} and served successfully.`);
      res.status(200).json(doc.data());
    }
  } catch (err) {
    next(err);
  }
});

// get all users
// rejected if the users collection is empty
// otherwise n (specified via params) users are returned
router.get('/', validatePagingParams(), async (req, res, next) => {
  /*
   *  celebrateSchema.js performs data validation via validatePagingParams() middleware
   *  per_page is an integer validated to have a range between 1 and 20
   *  page is an integer validated to have a min value of 1
   */
  const { per_page: perPage, page } = req.query;

  // When requesting page 1 the user we start to build the query off of will be user 0
  // when requesting page >= 2 the user we start at is determined by perPage * (page - 1)
  const userToStartAt = page === 1 ? 0 : perPage * (page - 1);
  const users = [];

  try {
    const query = await db
      .collection('users')
      .orderBy('id')
      .startAt(userToStartAt)
      .limit(perPage)
      .get();

    query.forEach((doc) => {
      users.push(doc.data());
    });

    logger.debug(`Users were requested by ${req.ip} and served successfully.`);
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
});

// post a user with supplied info, validated by the celebrateSchema
// rejected if a user already exists with that id, otherwise user created
router.post('/', validateUser(), async (req, res, next) => {
  try {
    const userRef = db.collection('users').doc(`${req.body.id}`);
    const doc = await userRef.get();

    if (doc.exists) {
      logger.debug(`User (id: ${doc.id}) was posted by ${req.ip} but already exists.`);
      res.status(400).json({
        msg: `User with id ${doc.id} was requested to be added, but already exists in the db.`,
      });
    } else {
      const user = new User(req.body);
      await db
        .collection('users')
        .doc(`${req.body.id}`)
        .set(JSON.parse(JSON.stringify(user))); // the user object must be parsed and stringified to be persisted to firestore
      res.status(201).json({ msg: `Added user with id: ${req.body.id}` });
      logger.debug(`User added with id: ${req.body.id}:\n${JSON.stringify(req.body)} by ${req.ip}`);
    }
  } catch (err) {
    next(err);
  }
});

// put (update) a user with a supplied id, validated by the celebrateSchema
// rejected if a user could not be found, otherwise user updated
router.put('/:id', validateUser(), async (req, res, next) => {
  try {
    const userRef = db.collection('users').doc(`${req.body.id}`);
    const doc = await userRef.get();

    if (!doc.exists) {
      logger.debug(`User data (id: ${doc.id}) was requested by ${req.ip} but could not be found.`);
      res.status(404).json({
        msg: `User with id ${doc.id} was requested to be updated, but does not exist in the db.`,
      });
    } else {
      const user = new User(req.body);
      await db
        .collection('users')
        .doc(`${req.body.id}`)
        .update(JSON.parse(JSON.stringify(user))); // the user object must be parsed and stringified to be persisted to firestore
      res.status(200).json({ msg: `Updated user ${req.body.id}` });
      logger.debug(`User added with id: ${req.body.id}:\n${JSON.stringify(req.body)} by ${req.ip}`);
    }
  } catch (err) {
    next(err);
  }
});

// delete a user with a supplied id, validated by the celebrateSchema
// rejected if a user could not be found, otherwise user deleted
router.delete('/:id', validateId(), async (req, res, next) => {
  try {
    const userRef = db.collection('users').doc(req.params.id);
    const doc = await userRef.get();

    if (!doc.exists) {
      logger.debug(
        `User data (id: ${doc.id}) was attempted to be deleted by ${req.ip} but that user could not be found.`
      );
      res.status(404).json({
        msg: `User (id: ${req.params.id}) was attempted to be removed but could not be found.`,
      });
    } else {
      logger.debug(
        `User data (id: ${doc.id}) was requested by ${req.ip} and deleted successfully.`
      );
      await db.collection('users').doc(req.params.id).delete();
      res.status(200).json({
        msg: `User (id: ${req.params.id}) was removed.`,
      });
    }
  } catch (err) {
    next(err);
  }
});

router.use(errors());

module.exports = router;
