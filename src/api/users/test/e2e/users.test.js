const request = require('supertest');
const firebaseTesting = require('@firebase/rules-unit-testing');
const { hash, createServiceToken } = require('@senecacdot/satellite');

const { app } = require('../../src/index');
const { User } = require('../../src/models/user');

const { USERS_URL } = process.env;

// Utility functions
const clearData = () => firebaseTesting.clearFirestoreData({ projectId: 'telescope' });

const getUser = (id) =>
  request(app)
    .get(`/${id}`)
    .set('Content-Type', 'application/json')
    .set('Authorization', `bearer ${createServiceToken()}`);
const getUsers = (query = '') =>
  request(app)
    .get(`/${query}`)
    .set('Content-Type', 'application/json')
    .set('Authorization', `bearer ${createServiceToken()}`);
const createUserHash = (email = 'galileo@email.com') => hash(email);

const defaultUsers = {
  galileo() {
    return {
      firstName: 'Galileo',
      lastName: 'Galilei',
      email: 'galileo@email.com',
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
  },

  carl() {
    return {
      firstName: 'Carl',
      lastName: 'Sagan',
      email: 'carl@email.com',
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
  },
};

const createUser = async (editedUser = {}, ignoreDefaults = false) => {
  const defaultUser = defaultUsers.galileo();

  // If the user sends use any user properties, override the default values.
  // unless explicitly told not to. If not, use default as is.
  const user = ignoreDefaults ? new User(editedUser) : new User({ ...defaultUser, ...editedUser });
  const response = await request(app)
    .post(`/${user.id}`)
    .set('Content-Type', 'application/json')
    .set('Authorization', `bearer ${createServiceToken()}`)
    .send(user);

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
  beforeEach(clearData);

  test('Accepted - Get all users', async () => {
    const galileo = await createUser();
    const carl = await createUser(defaultUsers.carl());

    expect(galileo.response.status).toBe(201);
    expect(carl.response.status).toBe(201);

    const response = await getUsers();
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.body).toEqual([defaultUsers.galileo(), defaultUsers.carl()]);
  });

  test('Accepted - Get all users (using params), only two users should be returned', async () => {
    // create 3 users
    const galileo1 = await createUser({ email: 'user1@email.com' });
    const galileo2 = await createUser({ email: 'user2@email.com' });
    const galileo3 = await createUser({ email: 'user3@email.com' });

    expect(galileo1.response.status).toBe(201);
    expect(galileo2.response.status).toBe(201);
    expect(galileo3.response.status).toBe(201);

    // request 2 users per page (less than the total available)
    const response = await getUsers('?per_page=2');
    expect(response.status).toBe(200);
    expect(response.headers.link).toEqual(
      `<${USERS_URL}?start_after=${galileo2.user.id}&per_page=2>; rel=next`
    );
    expect(response.body.length).toBe(2);
    expect(response.body).toEqual([
      {
        ...defaultUsers.galileo(),
        email: 'user1@email.com',
      },
      {
        ...defaultUsers.galileo(),
        email: 'user2@email.com',
      },
    ]);
  });

  // test.skip('Accepted - Get 20 (uncreated) users using params, receive empty array', async () => {
  //   // create no users, request 20 users
  //   const response = await getUsersParams(20, 1);
  //   expect(response.status).toBe(200);
  //   expect(response.body.length).toBe(0);
  //   expect(response.body).toEqual([]);
  // });

  // test.skip('Accepted - Test negative perPage parameter, positive page parameter', async () => {
  //   const galileo = await createUser();
  //   expect(galileo.response.status).toBe(201);

  //   const response = await getUsersParams(-20, 1);
  //   expect(response.status).toBe(400);
  // });

  // test.skip('Accepted - Test negative perPage parameter, negative page parameter', async () => {
  //   const galileo = await createUser();
  //   expect(galileo.response.status).toBe(201);

  //   const response = await getUsersParams(-20, -1);
  //   expect(response.status).toBe(400);
  // });

  // test.skip('Accepted - Test positive perPage parameter, negative page parameter', async () => {
  //   const galileo = await createUser();
  //   expect(galileo.response.status).toBe(201);

  //   const response = await getUsersParams(20, -1);
  //   expect(response.status).toBe(400);
  // });

  // test.skip('Accepted - Test page and per_page parameters', async () => {
  //   await createUser(defaultUsers.galileo());
  //   await createUser(defaultUsers.carl());

  //   // create 2 users, request 1 user per page and page 2
  //   const response = await getUsersParams(1, 2);
  //   expect(response.body.length).toBe(1);
  //   expect(response.body).toEqual([defaultUsers.galileo()]);
  // });

  // test('Accepted - Test parameterized get, post one user, ask for five, receive one user', async () => {
  //   const galileo = await createUser();
  //   expect(galileo.response.status).toBe(201);

  //   // request 5 users per page on page 2
  //   const response = await getUsersParams(5, 2);
  //   expect(response.status).toBe(200);
  //   expect(response.body.length).toBe(1);
  //   expect(response.body).toEqual([defaultUsers.galileo()]);
  // });

  test('Accepted - Get one user', async () => {
    const { user } = await createUser();
    const response = await getUser(user.id);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(defaultUsers.galileo());
  });

  test('Rejected - Get a user which does not exist', async () => {
    const response = await getUser(createUserHash('no-such-user@nowhere.com'));
    expect(response.statusCode).toBe(404);
  });
});

describe('PUT REQUESTS', () => {
  beforeEach(clearData);

  test('Accepted - Update a user', async () => {
    const { user } = await createUser();
    const updated = {
      firstName: 'Galileo',
      lastName: 'Galilei',
      email: 'galileo@email.com',
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
      .put(`/${user.id}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `bearer ${createServiceToken()}`)
      .send(updated);

    expect(response.statusCode).toBe(200);
  });

  test('Rejected - Ensure that the id param has to match the hashed email of the body', async () => {
    const { user } = await createUser();
    // Get the original id (based on current email)
    const { id } = user;
    // Change the email
    user.email = 'modified@email.com';

    const response = await request(app)
      // Use the original id
      .put(`/${id}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `bearer ${createServiceToken()}`)
      // But the newly updated data, with modified email
      .send(user);

    expect(response.statusCode).toBe(400);
  });

  test('Rejected - Update a nonexistent user', async () => {
    const user = new User(defaultUsers.carl());

    const response = await request(app)
      .put(`/${user.id}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `bearer ${createServiceToken()}`)
      .send(user);

    expect(response.statusCode).toBe(404);
  });
});

describe('POST REQUESTS', () => {
  beforeEach(clearData);

  test('Accepted - Create a user', async () => {
    const { response } = await createUser();
    expect(response.statusCode).toBe(201);
  });

  test('Rejected - Create two of the same user', async () => {
    const { response: response1 } = await createUser();
    expect(response1.statusCode).toBe(201);

    const { response: response2 } = await createUser();
    expect(response2.statusCode).toBe(400);
  });

  test('Rejected - Ensure that the id param has to match the hashed email of the body', async () => {
    const user1 = new User({ ...defaultUsers.carl() });
    const user2 = new User({ ...defaultUsers.galileo() });

    const response = await request(app)
      // Use user1's id
      .post(`/${user1.id}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `bearer ${createServiceToken()}`)
      // But user2's data
      .send(user2);

    expect(response.statusCode).toBe(400);
  });

  test('Rejected - Ensure that the feeds array can only contain URI strings', async () => {
    const user = new User({ ...defaultUsers.carl(), feeds: ['123'] });

    const response = await request(app)
      .post(`/${user.id}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `bearer ${createServiceToken()}`)
      .send(user);

    expect(response.statusCode).toBe(400);
  });

  test('Accepted - Ensure users without GitHub data can be created correctly', async () => {
    const user = {
      firstName: 'Galileo',
      lastName: 'Galilei',
      email: 'galileo@email.com',
      displayName: 'Galileo Galilei',
      isAdmin: true,
      isFlagged: true,
      feeds: ['https://dev.to/feed/galileogalilei'],
    };

    const { response } = await createUser(user, true);
    expect(response.statusCode).toBe(201);
  });

  test('Rejected - Ensure users with GitHub username but without avatarUrl are not allowed', async () => {
    const user = {
      firstName: 'Galileo',
      lastName: 'Galilei',
      email: 'galileo@email.com',
      displayName: 'Galileo Galilei',
      isAdmin: true,
      isFlagged: true,
      feeds: ['https://dev.to/feed/galileogalilei'],
      github: {
        username: 'galileogalilei',
      },
    };

    const { response } = await createUser(user, true);
    expect(response.statusCode).toBe(400);
  });

  test('Rejected - Ensure users without GitHub username but with avatarUrl are not allowed', async () => {
    const user = {
      firstName: 'Galileo',
      lastName: 'Galilei',
      email: 'galileo@email.com',
      displayName: 'Galileo Galilei',
      isAdmin: true,
      isFlagged: true,
      feeds: ['https://dev.to/feed/galileogalilei'],
      github: {
        avatarUrl:
          'https://avatars.githubusercontent.com/u/7242003?s=460&u=733c50a2f50ba297ed30f6b5921a511c2f43bfee&v=4',
      },
    };

    const { response } = await createUser(user, true);
    expect(response.statusCode).toBe(400);
  });

  test('Rejected - Ensure that user objects fail validation if properties are not valid or missing', async () => {
    const required = ['firstName', 'lastName', 'displayName', 'isAdmin', 'isFlagged', 'feeds'];

    // Loop through all the required fields and try removing them and sending.  We expect 400s
    await Promise.all(
      required.map(async (property) => {
        const user = new User(defaultUsers.carl());

        // Delete this property from the data we send
        const invalidData = user;
        invalidData[property] = null;

        const response = await request(app)
          .post(`/${user.id}`)
          .set('Content-Type', 'application/json')
          .set('Authorization', `bearer ${createServiceToken()}`)
          .send(invalidData);

        // Make sure we get back a 400
        expect(response.statusCode).toBe(400);
      })
    );
  });
});

describe('DELETE REQUESTS', () => {
  beforeEach(clearData);

  test('Accepted - Deleted a user', async () => {
    const { user } = await createUser();

    const response = await request(app)
      .delete(`/${user.id}`)
      .set('Authorization', `bearer ${createServiceToken()}`)
      .set('Content-Type', 'application/json');

    expect(response.statusCode).toBe(200);
  });

  test('Rejected - Deleted a nonexistent user', async () => {
    const id = createUserHash('no-such-user@email.com');
    const response = await request(app)
      .delete(`/${id}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `bearer ${createServiceToken()}`);
    expect(response.statusCode).toBe(404);
  });
});
