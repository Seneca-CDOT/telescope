# Users Service

The Users micro-service is a replacement for the [CDOT Planet Feed List](https://wiki.cdot.senecacollege.ca/wiki/Planet_CDOT_Feed_List), which previously served as our primary data source for Telescope users.

The Users micro-service is a middleman between Firestore and Telescope, as it provides a means of communication between Telescope's backend and Firestore via HTTP requests. It is intended to receive HTTP requests containing user data (_*validated for consistency*_) which is then persisted to Google's Firestore database.

When a user logs into Telescope, they are first authenticated by Seneca's SSO. The information returned by this handshake is then delegated to this micro-service for further processing and persistence to our Firestore db.

## Info

There are several moving pieces to this micro-service which may deceptively seem confusing upon first glance. The steps from request to persistence are as follows:

1. Express is the 'conductor' of the microservice. It receives HTTP requests from users (_i.e._ the frontend) containing data regarding a Telescope user (_see:_ `src/models/user.js`).
2. This data is validated by [celebrate](https://www.npmjs.com/package/celebrate) (_see:_ `src/models/celebrateSchema.js`) to ensure consistent integrity.
3. Only when all data is accepted is a user object constructed (_see:_ `src/models/user.js`) and persisted to our db (_see:_ `src/routes/user.js`).

Since Firestore requires unique private API keys in order to work with the production (online) version of the database, the Firestore emulator has instead been configured and is ready for dev use. This ensures that code that passes tests locally will function as intended remotely. If (_when_) changes are required, simply create your change (and accompanying unit test), and run the test runner.

Our services contain a native version of the Firestore Emulator for use, but an native version can also be run (see Usage).

### About Firestore

Firestore is a NoSQL database for mobile, web, and server development from Firebase and Google Cloud. Firestore is comprised of collections (which hold documents) and documents (which hold NoSQL data).

More info can be found on the [Firebase documentation page](https://firebase.google.com/docs/firestore), or for the more visually inclined [on the youtube page](https://www.youtube.com/playlist?list=PLl-K7zZEsYLluG5MCVEzXAQ7ACZBCuZgZ).

## Install

from inside /api/src/users:

```
npm install
```

from root:

```
npm install:users-service
```

## Usage

```
# normal mode
npm start

# running firestore emulator and users microservice locally
npm run services:start firebase users

# dev mode with automatic restarts
npm run services:start firebase
cd src/api/users
npm run dev

# test runner (must be used in conjunction with the firebase service)
npm run jest:e2e (or npm run jest:e2e src\api\users\test\e2e)
```

By default the server is running on <http://localhost:7000/>.

### Examples

\- `GET /:id` - returns 200 with the user specified by the id, or 404 if a user does not exist.

\- `GET /?per_page=20&page=1` - returns 200 with the first 20 Telescope users (numerically sorted by `id`) in an array, or 404 if the `users` collection is empty.

\- `POST /` - returns 201 if a Telescope user was successfully validated and added to the db, or 400 if the user already exists. (_An example of the JSON data to send as the POST body can be found in `api/user/test/user.test.js`_)

\- `PUT /:id` - returns 200 if a Telescope user's data was successfully updated, or 400 if the user could not be found in the db. (_An example of the JSON data to send as the POST body can be found in `api/user/test/user.test.js`_)

\- `DELETE /:id` - returns 200 when the user is deleted, or 404 if a user to delete could not be found.

## Docker (section currently incomplete)

\- To build and tag: `docker build . -t telescope_users_svc:latest`

\- To run locally: `docker run -p 7000:7000 telescope_users_svc:latest`
