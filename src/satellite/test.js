// ESLint override to prevent errors for callback vars, e.g. (req, user) => {...}

const nock = require('nock');
const getPort = require('get-port');
const jwt = require('jsonwebtoken');

// Tests cause terminus to leak warning on too many listeners, increase a bit
require('events').EventEmitter.defaultMaxListeners = 32;

const { errors } = require('@elastic/elasticsearch');
const {
  Satellite,
  Router,
  isAuthenticated,
  isAuthorized,
  logger,
  hash,
  createError,
  createServiceToken,
  Redis,
  Elastic,
  fetch,
} = require('./src');

const { JWT_EXPIRES_IN, JWT_ISSUER, JWT_AUDIENCE, JWT_SECRET } = process.env;

const createSatelliteInstance = (options) => {
  const service = new Satellite(options || { name: 'test' });

  // Default route
  service.router.get('/always-200', (req, res) => {
    res.status(200).end();
  });

  return service;
};

const createToken = ({ sub, roles }) => {
  let payload = {
    // The token is issued by us (e.g., this server)
    iss: JWT_ISSUER,
    // It is intended for the services running at this api origin
    aud: JWT_AUDIENCE,
    // The subject of this token, the user
    sub,
    // TODO: role info (e.g., admin)
  };

  if (roles) {
    payload = { ...payload, roles };
  }

  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

describe('Satellite()', () => {
  let port;
  let port2;
  let url;
  let service;
  let token;

  beforeEach(async () => {
    port = await getPort();
    port2 = await getPort();
    url = `http://localhost:${port}`;
    service = createSatelliteInstance();

    // Silence the logger.  Override if you need it in a test
    logger.level = 'silent';

    // Create a JWT bearer token we can use if necessary
    token = createToken({ sub: 'test-user@email.com' });
  });

  afterEach((done) => {
    service.stop(done);
    service = null;
  });

  test('start() should throw if port not defined', () => {
    expect(() => service.start()).toThrow();
  });

  describe('/healthcheck', () => {
    test('Satellite() instance should have /healthcheck', (done) => {
      service.start(port, async () => {
        const res = await fetch(`${url}/healthcheck`);
        expect(res.ok).toBe(true);
        done();
      });
    });

    test('Satellite() should use provided healthCheck function, and fail if rejected', (done) => {
      const service = createSatelliteInstance({
        name: 'test',
        healthCheck() {
          return Promise.reject(new Error('sorry, service unavailable'));
        },
      });
      service.start(port, async () => {
        const res = await fetch(`${url}/healthcheck`);
        expect(res.ok).toBe(false);
        service.stop(done);
      });
    });

    test('Satellite() should use provided healthCheck function, and pass if resolved', (done) => {
      const service = createSatelliteInstance({
        name: 'test',
        healthCheck() {
          return Promise.resolve('ok');
        },
      });
      service.start(port, async () => {
        const res = await fetch(`${url}/healthcheck`);
        expect(res.ok).toBe(true);
        service.stop(done);
      });
    });
  });

  describe('auto-oup-out FLoC', () => {
    test('Satellite() instance should include the { Permission-Policy: interest-cohort } header when the option is enabled', (done) => {
      const service = createSatelliteInstance({
        name: 'test',
        optOutFloc: true,
      });
      service.start(port, async () => {
        const res = await fetch(`${url}/always-200`);
        expect(res.ok).toBe(true);
        expect(res.headers.get('permissions-policy')).toBe('interest-cohort=()');
        service.stop(done);
      });
    });

    test('Satellite() instance should not include the { Permission-Policy: interest-cohort } header when the option is disabled', (done) => {
      const service = createSatelliteInstance({
        name: 'test',
      });
      service.start(port, async () => {
        const res = await fetch(`${url}/always-200`);
        expect(res.ok).toBe(true);
        expect(res.headers.get('permissions-policy')).toBe(null);
        service.stop(done);
      });
    });
  });

  test('start() should throw if called twice', (done) => {
    service.start(port, () => {
      expect(() => service.start(port2, async () => {})).toThrow();
      done();
    });
  });

  test('Satellite() should allow adding routes to the default router', (done) => {
    service.start(port, async () => {
      const res = await fetch(`${url}/always-200`);
      expect(res.status).toBe(200);
      done();
    });
  });

  test('Satellite() should respond with 404 if route not found', (done) => {
    service.start(port, async () => {
      const res = await fetch(`${url}/always-404`);
      expect(res.status).toBe(404);
      done();
    });
  });

  test('Satellite() should allow adding middleware with beforeRouter', (done) => {
    const service = createSatelliteInstance({
      name: 'test',
      beforeRouter(app) {
        app.use((req, res, next) => {
          req.testValue = 'test';
          next();
        });
      },
    });
    service.router.get('/test-value', (req, res) => res.json({ testValue: req.testValue }));
    service.start(port, async () => {
      const res = await fetch(`${url}/test-value`);
      expect(res.ok).toBe(true);
      const body = await res.json();
      expect(body).toEqual({ testValue: 'test' });
      service.stop(done);
    });
  });

  test('Satellite() should allow passing a router to the constructor', (done) => {
    const router = Router();
    router.get('/test-value', (req, res) => res.json({ hello: 'world' }));

    const service = createSatelliteInstance({
      name: 'test',
      router,
    });

    expect(service.router).toEqual(router);

    service.start(port, async () => {
      const res = await fetch(`${url}/test-value`);
      expect(res.ok).toBe(true);
      const body = await res.json();
      expect(body).toEqual({ hello: 'world' });
      service.stop(done);
    });
  });

  test('Satellite() should allow adding middleware with beforeParsers', (done) => {
    const service = createSatelliteInstance({
      name: 'test',
      beforeParsers(app) {
        app.use((req, res, next) => {
          req.testValue = 'test';
          next();
        });
      },
    });
    service.router.get('/test-value', (req, res) => res.json({ testValue: req.testValue }));
    service.start(port, async () => {
      const res = await fetch(`${url}/test-value`);
      expect(res.ok).toBe(true);
      const body = await res.json();
      expect(body).toEqual({ testValue: 'test' });
      service.stop(done);
    });
  });

  test('Satellite() should allow adding middleware with beforeParsers and beforeRouter together', (done) => {
    const service = createSatelliteInstance({
      name: 'test',
      beforeParsers(app) {
        app.use((req, res, next) => {
          req.testValue = 'parsers';
          next();
        });
      },
      beforeRouter(app) {
        app.use((req, res, next) => {
          req.testValue += '-router';
          next();
        });
      },
    });
    service.router.get('/test-value', (req, res) => res.json({ testValue: req.testValue }));
    service.start(port, async () => {
      const res = await fetch(`${url}/test-value`);
      expect(res.ok).toBe(true);
      const body = await res.json();
      expect(body).toEqual({ testValue: 'parsers-router' });
      service.stop(done);
    });
  });

  describe('Router()', () => {
    test('should be able to create sub-routers using Router()', (done) => {
      const customRouter = Router();
      customRouter.get('/sub-router', (req, res) => {
        res.status(200).end();
      });

      service.router.use('/router', customRouter);

      const testRoute = async () => {
        const res = await fetch(`${url}/router/sub-router`);
        expect(res.ok).toBe(true);
        service.stop(done);
      };

      service.start(port, () => {
        logger.info('Here we go!');
        testRoute();
      });
    });
  });

  test('isAuthenticated() should work on a specific route', (done) => {
    const service = createSatelliteInstance({
      name: 'test',
    });

    const { router } = service;
    router.get('/public', (req, res) => res.json({ hello: 'public' }));
    router.get('/protected', isAuthenticated(), (req, res) => {
      // Make sure the user payload was added to req
      expect(req.user.sub).toEqual('test-user@email.com');
      res.json({ hello: 'protected' });
    });

    service.start(port, async () => {
      // Public should need no bearer token
      let res = await fetch(`${url}/public`);
      expect(res.ok).toBe(true);
      let body = await res.json();
      expect(body).toEqual({ hello: 'public' });

      // Protected should fail without authorization header
      res = await fetch(`${url}/protected`);
      expect(res.ok).toBe(false);
      expect(res.status).toEqual(401);

      // Protected should work with authorization header
      res = await fetch(`${url}/protected`, {
        headers: {
          Authorization: `bearer ${token}`,
        },
      });
      expect(res.ok).toBe(true);
      body = await res.json();
      expect(body).toEqual({ hello: 'protected' });

      service.stop(done);
    });
  });

  test('isAuthorized() without providing a proper authorizeUser function should throw', () => {
    // No options passed
    expect(() => isAuthorized()).toThrow();
    expect(() => isAuthorized({})).toThrow();

    // authorizeUser
    expect(() => isAuthorized({ authorizeUser: true })).toThrow();
  });

  test('isAuthorized() without isAuthenticated() fails with 401', (done) => {
    const service = createSatelliteInstance({
      name: 'test',
    });
    const token = createToken({ sub: 'user@email.com', roles: ['user'] });
    const adminToken = createToken({
      sub: 'admin-user@email.com',
      roles: ['user', 'admin'],
    });

    const { router } = service;
    router.get('/public', (req, res) => res.json({ hello: 'public' }));
    router.get(
      '/protected',
      /* isAuthenticated() is required here, but we aren't calling it */
      isAuthorized((req, user) => true),
      (req, res) => {
        // Make sure an admin user payload was added to req
        expect(req.user.sub).toEqual('admin-user@email.com');
        expect(Array.isArray(req.user.roles)).toBe(true);
        expect(req.user.roles).toContain('admin');
        res.json({ hello: 'protected' });
      }
    );

    service.start(port, async () => {
      // Public should need no bearer token
      let res = await fetch(`${url}/public`);
      expect(res.ok).toBe(true);
      const body = await res.json();
      expect(body).toEqual({ hello: 'public' });

      // Protected should fail without authorization header
      res = await fetch(`${url}/protected`);
      expect(res.ok).toBe(false);
      expect(res.status).toEqual(401);

      // Protected should work with authorization header
      res = await fetch(`${url}/protected`, {
        headers: {
          Authorization: `bearer ${token}`,
        },
      });
      expect(res.ok).toBe(false);
      expect(res.status).toEqual(401);

      // Protected should work with correct authorization token
      res = await fetch(`${url}/protected`, {
        headers: {
          Authorization: `bearer ${adminToken}`,
        },
      });
      expect(res.ok).toBe(false);
      expect(res.status).toEqual(401);

      service.stop(done);
    });
  });

  test('isAuthenticated() + isAuthorized() without required role should fail', (done) => {
    const service = createSatelliteInstance({
      name: 'test',
    });
    const token = createToken({ sub: 'user@email.com', roles: ['user'] });
    const adminToken = createToken({
      sub: 'admin-user@email.com',
      roles: ['user', 'admin'],
    });

    const { router } = service;
    router.get('/public', (req, res) => res.json({ hello: 'public' }));
    router.get(
      '/protected',
      isAuthenticated(),
      isAuthorized((req, user) => user.roles.includes('admin')),
      (req, res) => {
        // Make sure an admin user payload was added to req
        expect(req.user.sub).toEqual('admin-user@email.com');
        expect(Array.isArray(req.user.roles)).toBe(true);
        expect(req.user.roles).toContain('admin');
        res.json({ hello: 'protected' });
      }
    );

    service.start(port, async () => {
      // Public should need no bearer token
      let res = await fetch(`${url}/public`);
      expect(res.ok).toBe(true);
      let body = await res.json();
      expect(body).toEqual({ hello: 'public' });

      // Protected should fail without authorization header
      res = await fetch(`${url}/protected`);
      expect(res.ok).toBe(false);
      expect(res.status).toEqual(401);

      // Protected should work with authorization header
      res = await fetch(`${url}/protected`, {
        headers: {
          Authorization: `bearer ${token}`,
        },
      });
      expect(res.ok).toBe(false);
      expect(res.status).toEqual(403);

      // Protected should work with correct authorization token
      res = await fetch(`${url}/protected`, {
        headers: {
          Authorization: `bearer ${adminToken}`,
        },
      });
      expect(res.ok).toBe(true);
      body = await res.json();
      expect(body).toEqual({ hello: 'protected' });

      service.stop(done);
    });
  });

  test('isAuthenticated() + isAuthorized() with authorizeUser() should get full user payload', (done) => {
    const service = createSatelliteInstance({
      name: 'test',
    });
    const token = createToken({ sub: 'admin@email.com' });
    const decoded = jwt.verify(token, JWT_SECRET);

    const { router } = service;
    router.get('/public', (req, res) => res.json({ hello: 'public' }));
    router.get(
      '/protected',
      isAuthenticated(),
      isAuthorized((req, user) => {
        expect(user).toEqual(decoded);
        return user.sub === 'admin@email.com';
      }),
      (req, res) => {
        // Should get here...
        expect(true).toBe(true);
        res.json({ hello: 'protected' });
      }
    );

    service.start(port, async () => {
      // Public should need no bearer token
      let res = await fetch(`${url}/public`);
      expect(res.ok).toBe(true);
      const body = await res.json();
      expect(body).toEqual({ hello: 'public' });

      // Protected should fail
      res = await fetch(`${url}/protected`, {
        headers: {
          Authorization: `bearer ${token}`,
        },
      });
      expect(res.ok).toBe(true);

      service.stop(done);
    });
  });

  test('isAuthenticated() + isAuthorized() for service token and role should work on a specific route', (done) => {
    const service = createSatelliteInstance({
      name: 'test',
    });
    const token = createServiceToken();

    const { router } = service;
    router.get('/public', (req, res) => res.json({ hello: 'public' }));
    router.get(
      '/protected',
      isAuthenticated(),
      isAuthorized((req, user) => user.roles.includes('service')),
      (req, res) => {
        // Make sure an admin user payload was added to req
        expect(req.user.sub).toEqual('telescope-service');
        expect(Array.isArray(req.user.roles)).toBe(true);
        expect(req.user.roles).toContain('service');
        res.json({ hello: 'protected' });
      }
    );

    service.start(port, async () => {
      // Public should need no bearer token
      let res = await fetch(`${url}/public`);
      expect(res.ok).toBe(true);
      let body = await res.json();
      expect(body).toEqual({ hello: 'public' });

      // Protected should fail without authorization header
      res = await fetch(`${url}/protected`);
      expect(res.ok).toBe(false);
      expect(res.status).toEqual(401);

      // Protected should work with authorization header
      res = await fetch(`${url}/protected`, {
        headers: {
          Authorization: `bearer ${token}`,
        },
      });
      expect(res.ok).toBe(true);
      body = await res.json();
      expect(body).toEqual({ hello: 'protected' });

      service.stop(done);
    });
  });

  test('isAuthenticated() + isAuthorized() for admin role should work on a specific route', (done) => {
    const service = createSatelliteInstance({
      name: 'test',
    });
    const token = createToken({ sub: 'admin@email.com', roles: ['admin'] });

    const { router } = service;
    router.get('/public', (req, res) => res.json({ hello: 'public' }));
    router.get(
      '/protected',
      isAuthenticated(),
      isAuthorized((req, user) => user.roles.includes('admin')),
      (req, res) => {
        // Make sure an admin user payload was added to req
        expect(req.user.sub).toEqual('admin@email.com');
        expect(Array.isArray(req.user.roles)).toBe(true);
        expect(req.user.roles).toContain('admin');
        res.json({ hello: 'protected' });
      }
    );

    service.start(port, async () => {
      // Public should need no bearer token
      let res = await fetch(`${url}/public`);
      expect(res.ok).toBe(true);
      let body = await res.json();
      expect(body).toEqual({ hello: 'public' });

      // Protected should fail without authorization header
      res = await fetch(`${url}/protected`);
      expect(res.ok).toBe(false);
      expect(res.status).toEqual(401);

      // Protected should work with authorization header
      res = await fetch(`${url}/protected`, {
        headers: {
          Authorization: `bearer ${token}`,
        },
      });
      expect(res.ok).toBe(true);
      body = await res.json();
      expect(body).toEqual({ hello: 'protected' });

      service.stop(done);
    });
  });

  test('isAuthenticated() + isAuthorized() with authorizeUser() should work on a specific route', (done) => {
    const service = createSatelliteInstance({
      name: 'test',
    });
    const token = createToken({ sub: 'admin@email.com' });

    const { router } = service;
    router.get('/public', (req, res) => res.json({ hello: 'public' }));
    router.get(
      '/protected',
      isAuthenticated(),
      isAuthorized((req, user) => user.sub === 'admin@email.com'),
      (req, res) => {
        // Make sure an admin user payload was added to req
        expect(req.user.sub).toEqual('admin@email.com');
        res.json({ hello: 'protected' });
      }
    );

    service.start(port, async () => {
      // Public should need no bearer token
      let res = await fetch(`${url}/public`);
      expect(res.ok).toBe(true);
      let body = await res.json();
      expect(body).toEqual({ hello: 'public' });

      // Protected should fail without authorization header
      res = await fetch(`${url}/protected`);
      expect(res.ok).toBe(false);
      expect(res.status).toEqual(401);

      // Protected should work with authorization header
      res = await fetch(`${url}/protected`, {
        headers: {
          Authorization: `bearer ${token}`,
        },
      });
      expect(res.ok).toBe(true);
      body = await res.json();
      expect(body).toEqual({ hello: 'protected' });

      service.stop(done);
    });
  });

  test('isAuthenticated() + isAuthorized() with authorizeUser() should fail as expected', (done) => {
    const service = createSatelliteInstance({
      name: 'test',
    });
    const token = createToken({ sub: 'admin@email.com' });

    const { router } = service;
    router.get('/public', (req, res) => res.json({ hello: 'public' }));
    router.get(
      '/protected',
      isAuthenticated(),
      isAuthorized((req, user) => user.sub === 'not-the-same-user'),
      (req, res) => {
        // Should never get here...
        expect(false).toBe(true);
        res.json({ hello: 'protected' });
      }
    );

    service.start(port, async () => {
      // Public should need no bearer token
      let res = await fetch(`${url}/public`);
      expect(res.ok).toBe(true);
      const body = await res.json();
      expect(body).toEqual({ hello: 'public' });

      // Protected should fail without authorization header
      res = await fetch(`${url}/protected`);
      expect(res.ok).toBe(false);
      expect(res.status).toEqual(401);

      // Protected should work with authorization header
      res = await fetch(`${url}/protected`, {
        headers: {
          Authorization: `bearer ${token}`,
        },
      });
      expect(res.ok).toBe(false);
      expect(res.status).toEqual(403);

      service.stop(done);
    });
  });

  test('isAuthenticated() + isAuthorized() should never throw, send 403 instead', (done) => {
    const service = createSatelliteInstance({
      name: 'test',
    });
    const token = createToken({ sub: 'admin@email.com' });

    const { router } = service;
    router.get('/public', (req, res) => res.json({ hello: 'public' }));
    router.get(
      '/protected',
      isAuthenticated(),
      isAuthorized((req, user) => {
        throw new Error('whoops!');
      }),
      (req, res) => {
        // Should never get here...
        expect(false).toBe(true);
        res.json({ hello: 'protected' });
      }
    );

    service.start(port, async () => {
      // Public should need no bearer token
      let res = await fetch(`${url}/public`);
      expect(res.ok).toBe(true);
      const body = await res.json();
      expect(body).toEqual({ hello: 'public' });

      // Protected should fail without authorization header
      res = await fetch(`${url}/protected`);
      expect(res.ok).toBe(false);
      expect(res.status).toEqual(401);

      // Protected should work with authorization header
      res = await fetch(`${url}/protected`, {
        headers: {
          Authorization: `bearer ${token}`,
        },
      });
      expect(res.ok).toBe(false);
      expect(res.status).toEqual(403);

      service.stop(done);
    });
  });

  describe('Default body parsers', () => {
    test('should support JSON body', (done) => {
      service.router.post('/json', (req, res) => {
        // echo back the json body
        res.json(req.body);
      });
      service.start(port, async () => {
        const res = await fetch(`${url}/json`, {
          method: 'post',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ json: 'rocks' }),
        });
        expect(res.ok).toBe(true);
        const data = await res.json();
        expect(data).toEqual({ json: 'rocks' });
        done();
      });
    });

    test('should support x-www-form-urlencoded body', (done) => {
      service.router.post('/form', (req, res) => {
        // echo back the body
        res.json(req.body);
      });
      service.start(port, async () => {
        const res = await fetch(`${url}/form`, {
          method: 'post',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          },
          body: 'json=rocks',
        });
        expect(res.ok).toBe(true);
        const data = await res.json();
        expect(data).toEqual({ json: 'rocks' });
        done();
      });
    });
  });

  test('the default README example code should work', (done) => {
    // Add your routes to the service's router
    service.router.get('/my-route', (req, res) => {
      res.json({ message: 'hello world' });
    });

    const testRoute = async () => {
      const res = await fetch(`${url}/my-route`);
      expect(res.ok).toBe(true);
      const body = await res.json();
      expect(body).toEqual({ message: 'hello world' });

      service.stop(done);
    };

    service.start(port, () => {
      logger.info('Here we go!');
      testRoute();
    });
  });

  describe('cors', () => {
    test('CORS set by default', (done) => {
      service.start(port, async () => {
        const res = await fetch(`${url}/always-200`, {
          credentials: 'same-origin',
        });
        expect(res.ok).toBe(true);
        expect(res.headers.get('access-control-allow-origin')).toBe('*');
        done();
      });
    });

    test('Allow disabling CORS', (done) => {
      const corsService = createSatelliteInstance({
        name: 'test',
        port,
        cors: false,
      });
      corsService.start(port, async () => {
        const res = await fetch(`${url}/always-200`, {
          credentials: 'same-origin',
        });
        expect(res.ok).toBe(true);
        expect(res.headers.get('access-control-allow-origin')).toBe(null);
        corsService.stop(done);
      });
    });

    test('Allow passing options to CORS', (done) => {
      const origin = 'http://example.com';
      const corsService = createSatelliteInstance({
        name: 'test',
        port,
        cors: { origin },
      });
      corsService.start(port, async () => {
        const res = await fetch(`${url}/always-200`, {
          credentials: 'same-origin',
        });
        expect(res.ok).toBe(true);
        expect(res.headers.get('access-control-allow-origin')).toBe('http://example.com');
        corsService.stop(done);
      });
    });
  });

  describe('helmet', () => {
    test('helmet on by default', (done) => {
      service.start(port, async () => {
        const res = await fetch(`${url}/always-200`);
        expect(res.ok).toBe(true);
        expect(res.headers.get('x-xss-protection')).toBe('0');
        done();
      });
    });

    test('Allow disabling helmet', (done) => {
      const helmetService = createSatelliteInstance({
        name: 'test',
        port,
        helmet: false,
      });
      helmetService.start(port, async () => {
        const res = await fetch(`${url}/always-200`);
        expect(res.ok).toBe(true);
        expect(res.headers.get('x-xss-protection')).toBe(null);
        helmetService.stop(done);
      });
    });

    test('Allow passing options to helmet', (done) => {
      const helmetService = createSatelliteInstance({
        name: 'test',
        port,
        helmet: { xssFilter: false },
      });
      helmetService.start(port, async () => {
        const res = await fetch(`${url}/always-200`);
        expect(res.ok).toBe(true);
        expect(res.headers.get('x-xss-protection')).toBe(null);
        helmetService.stop(done);
      });
    });
  });
});

describe('logger', () => {
  test('logger should have expected methods()', () => {
    ['trace', 'debug', 'info', 'warn', 'error', 'fatal'].forEach((level) => {
      expect(typeof logger[level] === 'function').toBe(true);
      expect(() => logger[level]('test')).not.toThrow();
    });
  });
});

describe('hash', () => {
  it('should return a 10 character hash value', () => {
    expect(hash('satellite').length).toBe(10);
  });

  it('should hash a string correctly', () => {
    expect(hash('satellite')).toBe('dc4b4e203f');
  });

  it('should return a different hash if anything changes', () => {
    expect(hash('satellite2')).toBe('6288d4ca65');
  });
});

describe('Create Error tests for Satellite', () => {
  test('should be an instance of type Error', () => {
    expect(createError(404, 'testing') instanceof Error).toBe(true);

    const testError = createError(404, 'Test for Errors');
    const nestedError = createError(testError);
    expect(nestedError instanceof Error).toBe(true);
  });

  test('errors created without a status code should return a status of 500', () => {
    expect(createError('testing').status).toBe(500);
  });

  test("should have it's value, and message accessible through it's members", () => {
    const testError = createError(404, 'Satellite Test for Errors');
    expect(testError.status).toBe(404);
    expect(testError.message).toBe('Satellite Test for Errors');

    const prop = { key1: 'testing object', key2: 'for createError' };
    const nestedError = createError(503, testError, prop);
    // error status of an Error instance will not be overwritten
    expect(nestedError.status).toBe(404);
    expect(nestedError.message).toBe('Satellite Test for Errors');
    expect(testError.key1).toBe('testing object');
    expect(testError.key2).toBe('for createError');
  });

  test('should create an Error from a non Error object', () => {
    const testObj = { key1: 'testing object', key2: 'for createError' };
    const testError = createError(404, testObj);

    expect(testError instanceof Error).toBe(true);
    expect(testError.key1).toBe('testing object');
    expect(testError.key2).toBe('for createError');
  });

  test('should create Error from ElasticSearch error object', () => {
    // { errors } is imported from ElasticSearch
    const elasticError = new errors.ResponseError({
      body: { error: 'testing ElasticSearch Error' },
      statusCode: 404,
    });

    const testESError = createError(503, elasticError);
    expect(testESError.status).toBe(404);
    expect(testESError.message).toBe('ElasticSearch Error:ResponseError');
    expect(testESError.body).toStrictEqual({ error: 'testing ElasticSearch Error' });
  });
});

describe('createServiceToken()', () => {
  test('should create a service token', () => {
    const token = createServiceToken();
    const decoded = jwt.verify(token, JWT_SECRET);

    expect(decoded.sub).toEqual('telescope-service');
    expect(Array.isArray(decoded.roles)).toBe(true);
    expect(decoded.roles).toContain('service');

    const currentDateSeconds = Date.now() / 1000;
    expect(decoded.exp).toBeGreaterThan(currentDateSeconds);
  });
});

describe('Redis()', () => {
  let redis;

  beforeEach(() => {
    redis = Redis();
  });

  afterEach(() => {
    redis.quit();
  });

  test('Redis ping command should return pong', (done) => {
    redis.ping((err, result) => {
      expect(err).toBe(null);
      expect(result).toEqual('PONG');
      done();
    });
  });
});

describe('Elastic()', () => {
  describe('Tests for regular Elastic()', () => {
    test('Testing the name property which should be a string', async () => {
      const client = Elastic();

      const clientInfo = await client.info();

      expect(clientInfo.statusCode).toBe(200);
    });
  });

  describe('Tests for mock Elastic()', () => {
    const client = Elastic();
    const { mock } = client;

    beforeEach(() => mock.clearAll());

    afterAll(() => {
      mock.clearAll();
    });

    test('Should mock an API', async () => {
      mock.add(
        {
          method: 'GET',
          path: '/_cat/indices',
        },
        () => {
          return { status: 'ok' };
        }
      );

      const response = await client.cat.indices();
      expect(response.body).toStrictEqual({ status: 'ok' });
      expect(response.statusCode).toBe(200);
    });

    test('If an API is not mocked correctly, it should return a 404', async () => {
      let response;

      mock.add(
        {
          method: 'GET',
          path: '/_cat/health',
          querystring: { pretty: 'true' },
        },
        () => {
          return { status: 'ok' };
        }
      );

      try {
        response = await client.cat.health();
      } catch (err) {
        expect(err instanceof errors.ResponseError).toBe(true);
        expect(err.body).toStrictEqual({ error: 'Mock not found' });
        expect(err.statusCode).toBe(404);
      }

      response = await client.cat.health({ pretty: true });
      expect(response.body).toStrictEqual({ status: 'ok' });
      expect(response.statusCode).toBe(200);
    });
  });
});

describe('fetch()', () => {
  test('fetch(url) should return 200 on success with a GET request', async () => {
    const url = 'https://www.google.ca';
    nock(url).get('/').reply(200);

    const response = await fetch(url);
    expect(response.ok).toBe(true);
    expect(response.status).toBe(200);
    expect(response.url).toEqual(`${url}/`);
  });

  test('fetch(url) should return 404', async () => {
    const url = 'https://dev.api.telescope.cdot.systems';
    const api = '/v1/status/21';
    nock(url).get(api).reply(404);

    const response = await fetch(`${url}${api}`);

    expect(response.ok).toBe(false);
    expect(response.status).toEqual(404);
    expect(response.statusText).toBe('Not Found');
    expect(response.url).toEqual(`${url}${api}`);
  });

  test('fetch(url, options) should return 201 on a successful POST request', async () => {
    const url = 'https://jsonplaceholder.typicode.com';
    const api = '/posts';
    const data = {
      userId: 11,
      title: 'Test post',
      body: 'A simple post where we can talk about activities that we enjoy in life without any fears',
    };
    const options = {
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    };

    nock(url).post(api, data).reply(201, data);

    const response = await fetch(`${url}${api}`, {
      method: 'POST',
      ...options,
    });
    const values = await response.json();
    expect(response.status).toEqual(201);
    expect(values.title).toEqual('Test post');
    expect(values.body).toEqual(
      'A simple post where we can talk about activities that we enjoy in life without any fears'
    );
  });
});
