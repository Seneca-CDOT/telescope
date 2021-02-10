/* global describe, test, beforeEach, afterEach, expect */
const fetch = require('node-fetch');
const getPort = require('get-port');

const { Satellite, express, logger, router } = require('.');

describe('Satellite(), router, express', () => {
  let port;
  let port2;
  let url;
  let service;

  beforeEach(async () => {
    port = await getPort();
    port2 = await getPort();
    url = `http://localhost:${port}`;
    service = new Satellite({ name: 'test' });

    // Default route
    router.get('/always-200', (req, res) => {
      res.status(200).end();
    });

    // Silence the logger.  Override if you need it in a test
    logger.level = 'silent';
  });

  afterEach((done) => {
    service.stop(done);
  });

  test('Should throw if Satellite() options missing name', () => {
    expect(() => new Satellite()).toThrow();
  });

  test('Should not throw if Satellite() options has name', () => {
    expect(() => new Satellite({ name: 'test' })).not.toThrow();
  });

  test('start() should throw if port not defined', () => {
    expect(() => service.start()).toThrow();
  });

  test('Satellite() instance should have /healthcheck', (done) => {
    service.start(port, async () => {
      const res = await fetch(`${url}/healthcheck`);
      expect(res.ok).toBe(true);
      done();
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

  test('Satellite() should allow overriding router in constructor', (done) => {
    const customRouter = new express.Router();

    // Add a route that returns 403
    customRouter.get('/always-403', (req, res) => {
      res.status(403).end();
    });

    service = new Satellite({ name: 'test', port, router: customRouter });
    service.start(port, async () => {
      const res = await fetch(`${url}/always-403`);
      expect(res.status).toBe(403);
      done();
    });
  });

  describe('cors', () => {
    test('CORS set by default', (done) => {
      service.start(port, async () => {
        const res = await fetch(`${url}/always-200`, { credentials: 'same-origin' });
        expect(res.ok).toBe(true);
        expect(res.headers.get('access-control-allow-origin')).toBe('*');
        done();
      });
    });

    test('Allow disabling CORS', (done) => {
      service = new Satellite({ name: 'test', port, cors: false });
      service.start(port, async () => {
        const res = await fetch(`${url}/always-200`, { credentials: 'same-origin' });
        expect(res.ok).toBe(true);
        expect(res.headers.get('access-control-allow-origin')).toBe(null);
        done();
      });
    });

    test('Allow passing options to CORS', (done) => {
      const origin = 'http://example.com';
      service = new Satellite({ name: 'test', port, cors: { origin } });
      service.start(port, async () => {
        const res = await fetch(`${url}/always-200`, { credentials: 'same-origin' });
        expect(res.ok).toBe(true);
        expect(res.headers.get('access-control-allow-origin')).toBe('http://example.com');
        done();
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
      service = new Satellite({ name: 'test', port, helmet: false });
      service.start(port, async () => {
        const res = await fetch(`${url}/always-200`);
        expect(res.ok).toBe(true);
        expect(res.headers.get('x-xss-protection')).toBe(null);
        done();
      });
    });

    test('Allow passing options to helmet', (done) => {
      service = new Satellite({ name: 'test', port, helmet: { xssFilter: false } });
      service.start(port, async () => {
        const res = await fetch(`${url}/always-200`);
        expect(res.ok).toBe(true);
        expect(res.headers.get('x-xss-protection')).toBe(null);
        done();
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
