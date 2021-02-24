# Satellite

![node-js-ci](https://github.com/Seneca-CDOT/satellite/workflows/node-js-ci/badge.svg)

A Microservice Framework for [Telescope](https://github.com/Seneca-CDOT/telescope).
Because Ray said we should try microservices!

Satellite creates an [Express.js](http://expressjs.com/) based server with
various common pieces already set up. Bring your own router and let us do the rest.

## Install

```
npm install --save @senecacdot/satellite
```

## Configure

You need to set the following environment variables if you want Elastic APM
monitoring for your service:

- `ELASTIC_APM_SERVER_URL`: the URL to the APM server (e.g., http://localhost:8200)
- `ELASTIC_APM_SERVICE_NAME`: the name of the service as it will appear in APM

If you don't provide these values in your environment, APM monitoring will be
disabled.

In addition, the following JWT verification values are required:

- `SECRET`: the secret used for JWT token verification
- `JWT_AUDIENCE`: the audience (aud) claim expected in JWT token verification
- `JWT_ISSUER`: the issuer (iss) claim expected in JWT token verification

## Usage

```js
const {
  Satellite, // the Satellite constructor
  Router, // Router() for creating sub-routers
  ProtectedRouter, // ProtectedRouter() for creating JWT protected sub-routers
  logger, // A pre-configured logger ready to be used
  protectWithJwt, // JWT middleware for specific end-points
} = require("@senecacdot/satellite");

// Define your microservice, providing some options (see below)
const service = new Satellite({
  beforeRouter(app) {
    // Optionally add some middleware before the router is attached
    app.use(myMiddlewareFunction());
  },
});

// Add your routes to the service's router
service.router.get("/my-route", (req, res) => {
  res.json({ message: "hello world" });
});

// You can also add protected routes with the protectWithJwt middleware
service.router.get("/my-protected-route", protectWithJwt(), (req, res) => {
  res.json({ message: "this is protected" });
});

// You can create sub-routers
const apiRouter = Router();
apiRouter.get("/info", (req, res) => {
  res.json({ message: "ok" });
});
service.router.get("/api", apiRouter);

// Or protected sub-routers (all sub routes use protectWithJwt automatically)
const adminRouter = ProtectedRouter();
adminRouter.get("/profile", (req, res) => {
  res.json({ message: "this is protected" });
});
service.router.get("/admin", adminRouter);

// Start the service on the specified port
service.start(8888, () => {
  logger.info("Here we go!");
});
```

### `Satellite(options)`

- `healthCheck`: an optional `function` returning a `Promise`, used to determine if the service is healthy. If no function is defined, a default one will be provided. The `healthCheck` function is what runs at the `/healthcheck` route by default.

```js
const service = new Satellite({
  healthCheck = async () => {
    // Connect to db and return a promise
    const ok = await doSomeAsyncTask();
    return ok;
  },
});
```

- `cors`: the options to pass to the [cors](https://www.npmjs.com/package/cors) middleware. By default all options are turned on. Use `cors: false` to disable cors.

- `helmet`: the options to pass to the [helmet](https://www.npmjs.com/package/helmet) middleware. By default all options are turned on. Use `helmet: false` to disable helmet.

- `beforeParsers`: an optional function that allows access to the `app` during creation prior to adding the body parsers

- `beforeRouter`: an optional function that allows access to the `app` during creation prior to adding the router.

- `router`: an optional router to use in place of the default one created automatically.

- `disableFavicon`: if `true` the default favicon at `/favicon.ico` will not be included.

- `protected`: if `true`, the entire app (all routes) will use JWT validation (defaults to `false`).
