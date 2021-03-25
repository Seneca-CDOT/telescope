const request = require('supertest');
const firebaseTesting = require('@firebase/rules-unit-testing');

const { app } = require('../../src/index');
const User = require('../../src/models/users');

// Utility functions
const clearData = () => firebaseTesting.clearFirestoreData({ projectId: 'telescope' });

const getUser = (id) => request(app).get(`/${id}`);

const getUsers = () => request(app).get('/');

const getUsersParams = (perPage, page) => request(app).get(`/?per_page=${perPage}&page=${page}`);

const createUser = async (editedUser = {}) => {
  const defaultUser = {
    // Use a unique id number for each user
    id: Date.now(),
    firstName: 'Galileo',
    lastName: 'Galilei',
    displayName: 'Galileo Galilei',
    isAdmin: true,
    isFlagged: true,
    feeds: ['https://dev.to/feed/galileogalilei'],
    github: {
      username: 'galileogalilei',
      avatarUrl:
        'https://avatars.githubusercontent.com/u/7242003?s=460&u=733c50a2f50ba297ed30f6b5921a511c2f43bfee&v=4',
    },
  };

  // If the user sends use any user properties, override the default values.  If not, use default as is.
  const user = new User({ ...defaultUser, ...editedUser });
  const response = await request(app).post('/').set('Content-Type', 'application/json').send(user);

  // Return both the user object and the response, so we can compare the two.
  return { user, response };
};

// Tests
describe('Ensure environment variable(s) are set', () => {
  test('process.env.development === localhost:8088', () => {
    expect(process.env.FIRESTORE_EMULATOR_HOST).toEqual('localhost:8088');
  });
});

describe('GET REQUESTS', () => {
  beforeEach(() => clearData());

  test('Accepted - Get all users', async () => {
    const galileo = await createUser({ id: 10001 });
    const carl = await createUser({
      id: 10002,
      firstName: 'Carl',
      lastName: 'Sagan',
      displayName: 'Carl Sagan',
      isAdmin: true,
      isFlagged: true,
      feeds: ['https://dev.to/feed/carlsagan'],
      github: {
        username: 'carlsagan',
        avatarUrl:
          'https://avatars.githubusercontent.com/u/7242003?s=460&u=733c50a2f50ba297ed30f6b5921a511c2f43bfee&v=4',
      },
    });

    expect(galileo.response.status).toBe(201);
    expect(carl.response.status).toBe(201);

    const response = await getUsers();
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.body).toEqual([
      {
        id: 10001,
        firstName: 'Galileo',
        lastName: 'Galilei',
        displayName: 'Galileo Galilei',
        isAdmin: true,
        isFlagged: true,
        feeds: ['https://dev.to/feed/galileogalilei'],
        github: {
          username: 'galileogalilei',
          avatarUrl:
            'https://avatars.githubusercontent.com/u/7242003?s=460&u=733c50a2f50ba297ed30f6b5921a511c2f43bfee&v=4',
        },
      },
      {
        id: 10002,
        firstName: 'Carl',
        lastName: 'Sagan',
        displayName: 'Carl Sagan',
        isAdmin: true,
        isFlagged: true,
        feeds: ['https://dev.to/feed/carlsagan'],
        github: {
          username: 'carlsagan',
          avatarUrl:
            'https://avatars.githubusercontent.com/u/7242003?s=460&u=733c50a2f50ba297ed30f6b5921a511c2f43bfee&v=4',
        },
      },
    ]);
  });

  test('Accepted - Get all users (using params), only two users should be returned', async () => {
    // create 3 users
    const galileo1 = await createUser({ id: 10001 });
    const galileo2 = await createUser({ id: 10002 });
    const galileo3 = await createUser({ id: 10003 });

    expect(galileo1.response.status).toBe(201);
    expect(galileo2.response.status).toBe(201);
    expect(galileo3.response.status).toBe(201);

    // request 3 users per page on page 1, three users should be returned
    const response = await getUsersParams(3, 1);
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(3);
    expect(response.body).toEqual([
      {
        id: 10001,
        firstName: 'Galileo',
        lastName: 'Galilei',
        displayName: 'Galileo Galilei',
        isAdmin: true,
        isFlagged: true,
        feeds: ['https://dev.to/feed/galileogalilei'],
        github: {
          username: 'galileogalilei',
          avatarUrl:
            'https://avatars.githubusercontent.com/u/7242003?s=460&u=733c50a2f50ba297ed30f6b5921a511c2f43bfee&v=4',
        },
      },
      {
        id: 10002,
        firstName: 'Galileo',
        lastName: 'Galilei',
        displayName: 'Galileo Galilei',
        isAdmin: true,
        isFlagged: true,
        feeds: ['https://dev.to/feed/galileogalilei'],
        github: {
          username: 'galileogalilei',
          avatarUrl:
            'https://avatars.githubusercontent.com/u/7242003?s=460&u=733c50a2f50ba297ed30f6b5921a511c2f43bfee&v=4',
        },
      },
      {
        id: 10003,
        firstName: 'Galileo',
        lastName: 'Galilei',
        displayName: 'Galileo Galilei',
        isAdmin: true,
        isFlagged: true,
        feeds: ['https://dev.to/feed/galileogalilei'],
        github: {
          username: 'galileogalilei',
          avatarUrl:
            'https://avatars.githubusercontent.com/u/7242003?s=460&u=733c50a2f50ba297ed30f6b5921a511c2f43bfee&v=4',
        },
      },
    ]);
  });

  test('Accepted - Get 20 (uncreated) users using params, receive empty array', async () => {
    // create no users, request 20 users
    const response = await getUsersParams(20, 1);
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(0);
    expect(response.body).toEqual([]);
  });

  test('Accepted - Test negative perPage parameter, positive page parameter', async () => {
    const galileo = await createUser({ id: 10001 });
    expect(galileo.response.status).toBe(201);

    const response = await getUsersParams(-20, 1);
    expect(response.status).toBe(400);
    expect(response.body.validation.query.message).toEqual(
      '"per_page" must be greater than or equal to 1'
    );
  });

  test('Accepted - Test negative perPage parameter, negative page parameter', async () => {
    const galileo = await createUser({ id: 10001 });
    expect(galileo.response.status).toBe(201);

    const response = await getUsersParams(-20, -1);
    expect(response.status).toBe(400);
    expect(response.body.validation.query.message).toEqual(
      '"per_page" must be greater than or equal to 1'
    );
  });

  test('Accepted - Test positive perPage parameter, negative page parameter', async () => {
    const galileo = await createUser({ id: 10001 });
    expect(galileo.response.status).toBe(201);

    const response = await getUsersParams(20, -1);
    expect(response.status).toBe(400);
    expect(response.body.validation.query.message).toEqual(
      '"page" must be greater than or equal to 1'
    );
  });

  test('Accepted - Test page and per_page parameters', async () => {
    await createUser({ id: 0 });
    await createUser({ id: 1 });

    // create 2 users, request 1 user per page and page 2
    const response = await getUsersParams(1, 2);
    expect(response.body.length).toBe(1);
    expect(response.body).toEqual([
      {
        id: 1,
        firstName: 'Galileo',
        lastName: 'Galilei',
        displayName: 'Galileo Galilei',
        isAdmin: true,
        isFlagged: true,
        feeds: ['https://dev.to/feed/galileogalilei'],
        github: {
          username: 'galileogalilei',
          avatarUrl:
            'https://avatars.githubusercontent.com/u/7242003?s=460&u=733c50a2f50ba297ed30f6b5921a511c2f43bfee&v=4',
        },
      },
    ]);
  });

  test('Accepted - Test parameterized get, post one user, ask for five, receive one user', async () => {
    const galileo = await createUser({ id: 10001 });

    expect(galileo.response.status).toBe(201);

    // request 5 users per page on page 2
    const response = await getUsersParams(5, 2);
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body).toEqual([
      {
        id: 10001,
        firstName: 'Galileo',
        lastName: 'Galilei',
        displayName: 'Galileo Galilei',
        isAdmin: true,
        isFlagged: true,
        feeds: ['https://dev.to/feed/galileogalilei'],
        github: {
          username: 'galileogalilei',
          avatarUrl:
            'https://avatars.githubusercontent.com/u/7242003?s=460&u=733c50a2f50ba297ed30f6b5921a511c2f43bfee&v=4',
        },
      },
    ]);
  });

  test('Accepted - Get one user', async () => {
    await createUser({ id: 10001 });
    const response = await getUser(10001);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      id: 10001,
      firstName: 'Galileo',
      lastName: 'Galilei',
      displayName: 'Galileo Galilei',
      isAdmin: true,
      isFlagged: true,
      feeds: ['https://dev.to/feed/galileogalilei'],
      github: {
        username: 'galileogalilei',
        avatarUrl:
          'https://avatars.githubusercontent.com/u/7242003?s=460&u=733c50a2f50ba297ed30f6b5921a511c2f43bfee&v=4',
      },
    });
  });

  test('Rejected - Get one user which not exist', async () => {
    const response = await getUser(10001);
    expect(response.statusCode).toBe(404);
    expect(response.body).toStrictEqual({
      msg: 'User data (id: 10001) was requested but could not be found.',
    });
  });
});

describe('PUT REQUESTS', () => {
  beforeEach(() => clearData());

  test('Accepted - Update a user', async () => {
    await createUser({ id: 10001 });
    const body = {
      id: 10001,
      firstName: 'Galileo',
      lastName: 'Galilei',
      displayName: 'Sir Galileo Galilei',
      isAdmin: true,
      isFlagged: true,
      feeds: ['https://dev.to/feed/galileogalilei'],
      github: {
        username: 'galileogalilei',
        avatarUrl:
          'https://avatars.githubusercontent.com/u/7242003?s=460&u=733c50a2f50ba297ed30f6b5921a511c2f43bfee&v=4',
      },
    };

    const response = await request(app)
      .put('/10001')
      .set('Content-Type', 'application/json')
      .send(body);

    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual({
      msg: 'Updated user 10001',
    });
  });

  test('Rejected - Update a nonexistent user', async () => {
    const body = {
      id: 10002,
      firstName: 'Carl',
      lastName: 'Sagan',
      displayName: 'Carl Sagan',
      isAdmin: true,
      isFlagged: true,
      feeds: ['https://dev.to/feed/carlsagan'],
      github: {
        username: 'carlsagan',
        avatarUrl:
          'https://avatars.githubusercontent.com/u/7242003?s=460&u=733c50a2f50ba297ed30f6b5921a511c2f43bfee&v=4',
      },
    };

    const response = await request(app)
      .put('/10002')
      .set('Content-Type', 'application/json')
      .send(body);

    expect(response.statusCode).toBe(404);
    expect(response.body).toStrictEqual({
      msg: 'User with id 10002 was requested to be updated, but does not exist in the db.',
    });
  });
});

describe('POST REQUESTS', () => {
  beforeEach(() => clearData());

  test('Accepted - Create a user', async () => {
    const { response } = await createUser({ id: 10001 });
    expect(response.statusCode).toBe(201);
    expect(response.body).toStrictEqual({ msg: 'Added user with id: 10001' });
  });

  test('Rejected - Create two of the same user', async () => {
    await createUser({ id: 10001 });
    const { response } = await createUser({ id: 10001 });

    expect(response.statusCode).toBe(400);
    expect(response.body).toStrictEqual({
      msg: 'User with id 10001 was requested to be added, but already exists in the db.',
    });
  });

  test('Rejected - Ensure that the feeds array can only contain strings', async () => {
    const body = {
      id: 10002,
      firstName: 'Carl',
      lastName: 'Sagan',
      displayName: 'Carl Sagan',
      isAdmin: true,
      isFlagged: true,
      feeds: [123],
      github: {
        username: 'carlsagan',
        avatarUrl:
          'https://avatars.githubusercontent.com/u/7242003?s=460&u=733c50a2f50ba297ed30f6b5921a511c2f43bfee&v=4',
      },
    };

    const response = await request(app)
      .post('/')
      .set('Content-Type', 'application/json')
      .send(body);

    expect(response.statusCode).toBe(400);
    expect(response.body.validation.body.message).toStrictEqual('"feeds[0]" must be a string');
  });

  test('Rejected - Ensure that a user id is supplied', async () => {
    const body = {
      firstName: 'Carl',
      lastName: 'Sagan',
      displayName: 'Carl Sagan',
      isAdmin: true,
      isFlagged: true,
      feeds: ['https://dev.to/feed/carlsagan'],
      github: {
        username: 'carlsagan',
        avatarUrl:
          'https://avatars.githubusercontent.com/u/7242003?s=460&u=733c50a2f50ba297ed30f6b5921a511c2f43bfee&v=4',
      },
    };

    const response = await request(app)
      .post('/')
      .set('Content-Type', 'application/json')
      .send(body);

    expect(response.statusCode).toBe(400);
    expect(response.body.validation.body.message).toStrictEqual('"id" is required');
  });

  test('Rejected - Ensure that a first name is supplied', async () => {
    const body = {
      id: 10002,
      lastName: 'Sagan',
      displayName: 'Carl Sagan',
      isAdmin: true,
      isFlagged: true,
      feeds: ['https://dev.to/feed/carlsagan'],
      github: {
        username: 'carlsagan',
        avatarUrl:
          'https://avatars.githubusercontent.com/u/7242003?s=460&u=733c50a2f50ba297ed30f6b5921a511c2f43bfee&v=4',
      },
    };

    const response = await request(app)
      .post('/')
      .set('Content-Type', 'application/json')
      .send(body);

    expect(response.statusCode).toBe(400);
    expect(response.body.validation.body.message).toStrictEqual('"firstName" is required');
  });

  test('Rejected - Ensure that a last name is supplied', async () => {
    const body = {
      id: 10002,
      firstName: 'Carl',
      displayName: 'Carl Sagan',
      isAdmin: true,
      isFlagged: true,
      feeds: ['https://dev.to/feed/carlsagan'],
      github: {
        username: 'carlsagan',
        avatarUrl:
          'https://avatars.githubusercontent.com/u/7242003?s=460&u=733c50a2f50ba297ed30f6b5921a511c2f43bfee&v=4',
      },
    };

    const response = await request(app)
      .post('/')
      .set('Content-Type', 'application/json')
      .send(body);

    expect(response.statusCode).toBe(400);
    expect(response.body.validation.body.message).toStrictEqual('"lastName" is required');
  });

  test('Rejected - Ensure that a blog feed url is supplied', async () => {
    const body = {
      id: 10002,
      firstName: 'Carl',
      lastName: 'Sagan',
      displayName: 'Carl Sagan',
      isAdmin: true,
      isFlagged: true,
      github: {
        username: 'carlsagan',
        avatarUrl:
          'https://avatars.githubusercontent.com/u/7242003?s=460&u=733c50a2f50ba297ed30f6b5921a511c2f43bfee&v=4',
      },
    };

    const response = await request(app)
      .post('/')
      .set('Content-Type', 'application/json')
      .send(body);

    expect(response.statusCode).toBe(400);
    expect(response.body.validation.body.message).toStrictEqual('"feeds" is required');
  });
});

describe('DELETE REQUESTS', () => {
  beforeEach(() => clearData());

  test('Accepted - Deleted a user', async () => {
    await createUser({ id: 10001 });

    const response = await request(app).delete('/10001').set('Content-Type', 'application/json');

    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual({
      msg: 'User (id: 10001) was removed.',
    });
  });

  test('Rejected - Deleted a nonexistent user', async () => {
    const response = await request(app).delete('/10001').set('Content-Type', 'application/json');

    expect(response.statusCode).toBe(404);
    expect(response.body).toStrictEqual({
      msg: 'User (id: 10001) was attempted to be removed but could not be found.',
    });
  });
});
