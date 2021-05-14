const { Router, createError, isAuthenticated, isAuthorized } = require('@senecacdot/satellite');
const { errors } = require('celebrate');

const {
  validatePagingParams,
  validateId,
  validateUser,
  validateEmailHash,
} = require('../models/schema');
const { User } = require('../models/user');
const { db, documentId } = require('../services/firestore');
const { addNextLinkHeader } = require('../util');

const router = Router();

// get a user with a supplied id, validated by the schema
// rejected if a user could not be found, otherwise user returned
router.get(
  '/:id',
  isAuthenticated(),
  validateId(),
  isAuthorized((req, user) => {
    // A user can request their own data
    if (user.sub === req.params.id) {
      return true;
    }
    // Or an admin, or another authorized microservice
    return user.roles.includes('admin') || user.roles.includes('service');
  }),
  async (req, res, next) => {
    const { id } = req.params;

    try {
      const userRef = db.doc(id);
      const doc = await userRef.get();

      if (!doc.exists) {
        next(createError(404, `user ${id} not found.`));
      } else {
        res.status(200).json(doc.data());
      }
    } catch (err) {
      next(err);
    }
  }
);

// get all users
// rejected if the users collection is empty
// otherwise perPage (specified via params) users are returned, starting at
// the beginning of the users collection or the provided document path id (if present)
router.get(
  '/',
  isAuthenticated(),
  // Only an admin or another authorized microservice can request this
  isAuthorized((req, user) => user.roles.includes('admin') || user.roles.includes('service')),
  validatePagingParams(),
  async (req, res, next) => {
    /*
     *  schema.js performs data validation via validatePagingParams() middleware
     *  per_page is an integer validated to have a range between 1 and 100
     *  start_after is the id (hashed email) of the user to begin after
     */
    const { per_page: perPage, start_after: startAfter } = req.query;

    try {
      let query = db.orderBy(documentId()).limit(perPage);

      // If we were given a user ID to start after, use that document path to add .startAfter()
      if (startAfter) {
        query = query.startAfter(startAfter);
      }

      const snapshot = await query.get();
      const users = snapshot.docs.map((doc) => doc.data());

      // Add paging link header if necessary, so caller can request next page
      addNextLinkHeader(res, users, perPage);
      res.status(200).json(users);
    } catch (err) {
      next(err);
    }
  }
);

// post a user with supplied info, validated by the schema
// rejected if a user already exists with that id, otherwise user created
router.post(
  '/:id',
  isAuthenticated(),
  validateId(),
  validateUser(),
  validateEmailHash(),
  isAuthorized((req, user) => {
    // A user can add their own data (signup)
    if (user.sub === req.params.id) {
      return true;
    }
    // Or an admin, or another authorized microservice
    return user.roles.includes('admin') || user.roles.includes('service');
  }),
  async (req, res, next) => {
    const { id } = req.params;
    const { body } = req;

    try {
      const userRef = db.doc(id);
      const doc = await userRef.get();

      if (doc.exists) {
        next(createError(409, `user with id ${id} already exists.`));
      } else {
        const user = new User(body);
        // no user can be created as an admin by default
        user.isAdmin = false;
        await db.doc(id).set(user);
        res.status(201).json({ msg: `Added user with id: ${id}` });
      }
    } catch (err) {
      next(err);
    }
  }
);

// put (update) a user with a supplied id, validated by the schema
// rejected if a user could not be found, otherwise user updated
router.put(
  '/:id',
  isAuthenticated(),
  validateId(),
  validateUser(),
  validateEmailHash(),
  isAuthorized((req, user) => {
    // A user can update their own data
    if (user.sub === req.params.id) {
      return true;
    }
    // Or an admin, or another authorized microservice
    return user.roles.includes('admin') || user.roles.includes('service');
  }),
  async (req, res, next) => {
    const { id } = req.params;
    const { body } = req;

    try {
      const userRef = db.doc(id);
      const doc = await userRef.get();

      if (!doc.exists) {
        next(createError(404, `user ${id} not found.`));
      } else {
        const user = new User(body);
        // no user can be created as an admin by default
        user.isAdmin = false;
        // NOTE: doc().update() doesn't use the converter, we have to make a plain object.
        await db.doc(id).update(user.toJSON());
        res.status(200).json({ msg: `Updated user ${id}` });
      }
    } catch (err) {
      next(err);
    }
  }
);

// put (update) a user with a supplied id, validated by the schema
// rejected if a user could not be found, otherwise user updated
// this route is only accessible by administrators
// it allows the modification of the isAdmin property
router.put(
  '/:id/admin',
  isAuthenticated(),
  validateId(),
  validateUser(),
  validateEmailHash(),
  isAuthorized((req, user) => {
    return user.roles.includes('admin');
  }),
  async (req, res, next) => {
    const { id } = req.params;
    const { body } = req;

    try {
      const userRef = db.doc(id);
      const doc = await userRef.get();

      if (!doc.exists) {
        next(createError(404, `user ${id} not found.`));
      } else {
        const user = new User(body);
        // NOTE: doc().update() doesn't use the converter, we have to make a plain object.
        await db.doc(id).update(user.toJSON());
        res.status(200).json({ msg: `Updated user ${id}` });
      }
    } catch (err) {
      next(err);
    }
  }
);

// delete a user with a supplied id, validated by the schema
// rejected if a user could not be found, otherwise user deleted
router.delete(
  '/:id',
  isAuthenticated(),
  validateId(),
  isAuthorized((req, user) => {
    // A user can delete their own data
    if (user.sub === req.params.id) {
      return true;
    }
    // Or an admin, or another authorized microservice
    return user.roles.includes('admin') || user.roles.includes('service');
  }),
  async (req, res, next) => {
    const { id } = req.params;

    try {
      const userRef = db.doc(id);
      const doc = await userRef.get();

      if (!doc.exists) {
        next(createError(404, `user ${id} not found.`));
      } else {
        await db.doc(id).delete();
        res.status(200).json({
          msg: `user ${id} was removed.`,
        });
      }
    } catch (err) {
      next(err);
    }
  }
);

router.use(errors());

module.exports = router;
