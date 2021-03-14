// NOTE: you need to run the auth and login services in docker for these to work
const { chromium } = require('playwright');
const { decode } = require('jsonwebtoken');

// We need to get the URL to the auth service running in docker, and the list
// of allowed origins, to compare with assumptions in the tests below.
const { AUTH_URL, ALLOWED_APP_ORIGINS } = process.env;

let browser;
let context;
let page;

beforeAll(async () => {
  // Use { headless: false, slowMo: 500 } as options to launch() to debug
  browser = await chromium.launch();
});
afterAll(async () => {
  await browser.close();
});

beforeEach(async () => {
  context = await browser.newContext();
  page = await browser.newPage();
  await page.goto(`http://localhost:8888/`);
});
afterEach(async () => {
  await context.close();
  await page.close();
});

// Get the access_token and state from the URL, and parse the token as JWT if present
const getTokenAndState = () => {
  const params = new URL(page.url()).searchParams;
  const accessToken = params.get('access_token');
  const state = params.get('state');

  return { accessToken, state, jwt: accessToken ? decode(accessToken) : null };
};

// Do a complete login flow with the username/password and return token and state
const login = async (username, password) => {
  // Click login button and then wait for the login page to load
  await Promise.all([
    page.waitForNavigation({
      url: /simplesaml\/module\.php\/core\/loginuserpass\.php/,
      waitUtil: 'networkidle',
    }),
    page.click('#login'),
  ]);

  // Fill the login form, star with username
  await page.click('input[name="username"]');
  await page.fill('input[name="username"]', username);
  // Now enter the password
  await page.click('input[name="password"]');
  await page.fill('input[name="password"]', password);

  // Click login button and then wait for the new page to load
  await Promise.all([
    page.waitForNavigation({
      url: /^http:\/\/localhost:\d+\/\?access_token=[^&]+&state=/,
      waitUtil: 'load',
    }),
    page.click('text=/.*Login.*/'),
  ]);

  // The token and state will get returned on the query string
  return getTokenAndState();
};

// Logout flow, assumes user is logged in already
const logout = async () => {
  // Click logout and we should get navigated back to this page right away
  await Promise.all([
    page.waitForNavigation({
      url: /^http:\/\/localhost:\d+\/\?state=/,
      waitUtil: 'load',
    }),
    page.click('#logout'),
  ]);

  // The token and state will get returned on the query string
  return getTokenAndState();
};

it('should use the same origin in .env for ALLOWED_APP_ORIGINS that test cases use', () => {
  const origins = ALLOWED_APP_ORIGINS.split(' ');
  expect(origins).toContain('http://localhost:8888');
});

it('should use the same AUTH_URL as we have hard-coded in the test HTML', () => {
  // NOTE: if this fails, make sure your src/api/.env has the same info as ./index.html
  expect(AUTH_URL).toEqual('http://localhost/v1/auth');
});

describe('Login', () => {
  it('Login flow preserves state param', async () => {
    const { state } = await login('user2', 'user2pass');
    // Expect the state to match what we sent originally (see index.html <a>)
    expect(state).toEqual('abc123');
  });

  it('Login flow issues JWT access token with with expected sub claim', async () => {
    const { jwt } = await login('user2', 'user2pass');
    // The sub claim should match our user's email
    expect(typeof jwt === 'object').toBe(true);
    expect(jwt.sub).toEqual('user2@example.com');
  });

  it('Admin user can login', async () => {
    const { jwt } = await login('user1', 'user1pass');
    // The sub claim should match our user's email
    expect(typeof jwt === 'object').toBe(true);
    expect(jwt.sub).toEqual('user1@example.com');
  });

  it("Logging in twice doesn't require username and password again", async () => {
    const firstLogin = await login('user1', 'user1pass');
    expect(typeof firstLogin.jwt === 'object').toBe(true);
    expect(firstLogin.jwt.sub).toEqual('user1@example.com');

    // Click login again, but we should get navigated back to this page right away
    await Promise.all([
      page.waitForNavigation({
        url: /^http:\/\/localhost:\d+\/\?access_token=[^&]+&state=/,
        waitUtil: 'load',
      }),
      page.click('#login'),
    ]);

    // The sub claim should be the same as before (we're still logged in)
    const secondLogin = getTokenAndState();
    expect(typeof secondLogin.jwt === 'object').toBe(true);
    expect(secondLogin.jwt.sub).toEqual(firstLogin.jwt.sub);
  });
});

describe('Logout', () => {
  it('Logout works after logging in', async () => {
    const firstLogin = await login('user1', 'user1pass');
    expect(typeof firstLogin.jwt === 'object').toBe(true);
    expect(firstLogin.jwt.sub).toEqual('user1@example.com');

    // The sub claim should be the same as before (we're still logged in)
    const logoutResult = await logout();
    expect(logoutResult.state).toEqual('abc123');
    expect(logoutResult.token).toEqual(undefined);
  });

  it('Logging in works after logout', async () => {
    const firstLogin = await login('user1', 'user1pass');
    expect(typeof firstLogin.jwt === 'object').toBe(true);
    expect(firstLogin.jwt.sub).toEqual('user1@example.com');

    // The sub claim should be the same as before (we're still logged in)
    const logoutResult = await logout();
    expect(logoutResult.state).toEqual('abc123');
    expect(logoutResult.token).toEqual(undefined);

    const secondLogin = await login('user2', 'user2pass');
    expect(typeof secondLogin.jwt === 'object').toBe(true);
    expect(secondLogin.jwt.sub).toEqual('user2@example.com');
  });
});

describe('Authorization', () => {
  it('Should return 401 if missing Authorization header', async () => {
    const res = await page.goto(`${AUTH_URL}/authorize`);
    expect(res.status()).toEqual(401);
  });

  it('Should return 401 if Authorization header invalid', async () => {
    page.setExtraHTTPHeaders({ Authorization: 'invalid-token' });
    const res = await page.goto(`${AUTH_URL}/authorize`);
    expect(res.status()).toEqual(401);
  });

  it('Should return 401 if Authorization header uses bogus bearer token', async () => {
    // Use a real JWT, but not one we created.
    const jwt =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    page.setExtraHTTPHeaders({ Authorization: `bearer ${jwt}` });
    const res = await page.goto(`${AUTH_URL}/authorize`);
    expect(res.status()).toEqual(401);
  });

  it('Should return 200 if passed correct bearer token for logged in user', async () => {
    const { accessToken } = await login('user1', 'user1pass');
    expect(typeof accessToken === 'string').toBe(true);

    page.setExtraHTTPHeaders({ Authorization: `bearer ${accessToken}` });
    const res = await page.goto(`${AUTH_URL}/authorize`);
    expect(res.status()).toEqual(200);
  });
});
